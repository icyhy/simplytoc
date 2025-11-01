#!/usr/bin/env python3
"""
扫描 _posts 目录下的 Markdown/HTML 内容，下载远程图片到 img/in-post，并将引用替换为 {{ site.baseurl }}/img/in-post/<文件名>

支持：
- Markdown 图片：![alt](http|https://... "title")
- HTML img：<img src="http|https://...">
- CSS 背景图：background-image: url(http|https://...)

文件名策略：
- 以帖子文件名（不含扩展名）作为前缀，避免不同文章间同名文件冲突。
- 若远程 URL 不包含扩展名，则依据 Content-Type 推断扩展名。

注意：
- 本脚本使用标准库 urllib 以避免额外依赖。
- 对下载失败的 URL 会保留原链接并给出提示。
"""

import os
import re
import sys
import pathlib
import urllib.request
import urllib.error
import mimetypes
from urllib.parse import urlparse

ROOT = pathlib.Path(__file__).resolve().parents[1]
POSTS_DIR = ROOT / "_posts"
TARGET_DIR = ROOT / "img" / "in-post"

# 识别远程图片引用的正则
MD_IMAGE_PATTERN = re.compile(r"(!\[[^\]]*\]\()(?P<url>https?://[^\s\)]+)(?P<after>[^\)]*)\)")
HTML_IMG_PATTERN = re.compile(r"(src=[\'\"])(?P<url>https?://[^\'\"]+)([\'\"])", re.IGNORECASE)
CSS_BG_PATTERN = re.compile(r"(url\()(?P<url>https?://[^\)]+)(\))", re.IGNORECASE)

# 支持的图片类型与扩展名映射
CONTENT_TYPE_EXT = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "image/webp": ".webp",
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0 Safari/537.36",
    "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
}

def ensure_dir(path: pathlib.Path):
    if not path.exists():
        path.mkdir(parents=True, exist_ok=True)

def guess_ext_from_url(url_path: str) -> str:
    # 从 URL 路径猜测扩展名
    name = os.path.basename(url_path)
    _, ext = os.path.splitext(name)
    return ext.lower()

def guess_ext_from_content_type(content_type: str) -> str:
    if not content_type:
        return ""
    content_type = content_type.split(";")[0].strip().lower()
    return CONTENT_TYPE_EXT.get(content_type, mimetypes.guess_extension(content_type) or "")

def make_local_filename(post_slug: str, url: str) -> str:
    parsed = urlparse(url)
    base = os.path.basename(parsed.path)
    if not base:
        base = "image"
    ext = os.path.splitext(base)[1].lower()
    filename = f"{post_slug}-{base}" if post_slug else base
    return filename, ext

def download_image(url: str, dest_path: pathlib.Path) -> str:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
        content_type = resp.headers.get("Content-Type", "")
        return data, content_type

def process_file(md_path: pathlib.Path, url_to_local: dict) -> int:
    text = md_path.read_text(encoding="utf-8")
    post_slug = md_path.stem  # 例如 2017-11-18-hello-2017
    changed = 0

    def replace_md(m: re.Match) -> str:
        url = m.group("url")
        after = m.group("after")
        local = url_to_local.get(url)
        if not local:
            local = create_local_file(post_slug, url)
            if local:
                url_to_local[url] = local
        if local:
            return f"{m.group(1)}{{{{ site.baseurl }}}}/img/in-post/{local}{after})"
        return m.group(0)

    def replace_html(m: re.Match) -> str:
        pre = m.group(1)
        url = m.group("url")
        post = m.group(3)
        local = url_to_local.get(url)
        if not local:
            local = create_local_file(post_slug, url)
            if local:
                url_to_local[url] = local
        if local:
            return f"{pre}{{{{ site.baseurl }}}}/img/in-post/{local}{post}"
        return m.group(0)

    def replace_css(m: re.Match) -> str:
        pre = m.group(1)
        url = m.group("url")
        post = m.group(3)
        local = url_to_local.get(url)
        if not local:
            local = create_local_file(post_slug, url)
            if local:
                url_to_local[url] = local
        if local:
            return f"{pre}{{{{ site.baseurl }}}}/img/in-post/{local}{post}"
        return m.group(0)

    new_text = MD_IMAGE_PATTERN.sub(replace_md, text)
    if new_text != text:
        changed += 1
        text = new_text

    new_text = HTML_IMG_PATTERN.sub(replace_html, text)
    if new_text != text:
        changed += 1
        text = new_text

    new_text = CSS_BG_PATTERN.sub(replace_css, text)
    if new_text != text:
        changed += 1
        text = new_text

    if changed:
        md_path.write_text(text, encoding="utf-8")
    return changed

def create_local_file(post_slug: str, url: str) -> str:
    ensure_dir(TARGET_DIR)
    filename, ext = make_local_filename(post_slug, url)
    # 先尝试下载
    try:
        data, content_type = download_image(url, TARGET_DIR / filename)
    except urllib.error.HTTPError as e:
        print(f"[HTTPError] {url} -> {e}")
        return None
    except urllib.error.URLError as e:
        print(f"[URLError] {url} -> {e}")
        return None
    except Exception as e:
        print(f"[Error] {url} -> {e}")
        return None

    # 根据 Content-Type 纠正扩展名
    if not ext:
        ext_guess = guess_ext_from_content_type(content_type)
        if not ext_guess:
            ext_guess = ".jpg"  # 默认兜底
        ext = ext_guess
        filename = f"{filename}{ext}"

    # 若下载时没有扩展名但存在，确保最终文件名包含扩展名
    final_path = TARGET_DIR / filename
    # 写入文件（覆盖式）
    try:
        with open(final_path, "wb") as f:
            f.write(data)
        print(f"[saved] {url} -> img/in-post/{filename}")
        return filename
    except Exception as e:
        print(f"[write-failed] {final_path}: {e}")
        return None

def main():
    if not POSTS_DIR.exists():
        print(f"_posts 目录不存在: {POSTS_DIR}")
        sys.exit(1)

    url_to_local = {}
    changed_files = 0
    scanned = 0

    for md_path in sorted(POSTS_DIR.glob("*.markdown")):
        scanned += 1
        try:
            c = process_file(md_path, url_to_local)
            if c:
                changed_files += 1
                print(f"[updated] {md_path.relative_to(ROOT)}")
        except Exception as e:
            print(f"[process-failed] {md_path}: {e}")

    print("\n==== Summary ====")
    print(f"Scanned posts: {scanned}")
    print(f"Updated files: {changed_files}")
    print(f"Downloaded images: {len(set(url_to_local.values()))}")

if __name__ == "__main__":
    main()