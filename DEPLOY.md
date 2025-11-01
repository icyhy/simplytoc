# 部署指南

## 🚀 快速部署到 GitHub Pages

### 第一步：创建 GitHub 仓库

1. 访问 [GitHub](https://github.com) 并登录
2. 点击右上角的 "+" 号，选择 "New repository"
3. 仓库名称填写：`simplytoc`（或你喜欢的名称）
4. 选择 Public（公开）或 Private（私有）
5. **不要**勾选 "Add a README file"
6. 点击 "Create repository"

### 第二步：上传项目文件

#### 方法 A：使用 Git 命令（推荐）

```bash
# 1. 初始化 Git 仓库
git init
git add .
git commit -m "Initial commit: Simply TOC personal website"

# 2. 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/simplytoc.git
git branch -M main
git push -u origin main
```

#### 方法 B：直接拖拽上传

1. 在你的 GitHub 仓库页面，点击 "uploading an existing file"
2. 将所有项目文件拖拽到页面上
3. 填写提交信息："Initial commit"
4. 点击 "Commit changes"

### 第三步：启用 GitHub Pages

1. 进入你的 GitHub 仓库页面
2. 点击 "Settings" 标签
3. 在左侧菜单中找到 "Pages"
4. 在 "Source" 部分选择：
   - Branch: `main`
   - Folder: `/ (root)`
5. 点击 "Save"

### 第四步：等待部署完成

- GitHub 会自动构建和部署你的网站
- 通常需要 2-5 分钟完成
- 在 Pages 设置页面会显示你的网站 URL

### 第五步：访问你的网站

你的网站现在可以通过以下地址访问：
```
https://YOUR_USERNAME.github.io/simplytoc/
```

## 🎨 自定义你的网站

### 更新个人信息

编辑 `about.html` 文件，找到并修改：

```html
<div class="profile-info">
    <h1 class="profile-name">你的名字</h1>
    <p class="profile-title">你的职位</p>
    <p class="profile-bio">你的个人介绍</p>
</div>
```

### 添加你的项目

编辑 `data/projects.json`，添加你的真实项目信息：

```json
{
    "id": 1,
    "title": "你的项目名称",
    "description": "项目描述",
    "image": "assets/images/your-project.jpg",
    "tags": ["JavaScript", "React", "Node.js"],
    "category": "Web应用",
    "github": "https://github.com/YOUR_USERNAME/REPO_NAME",
    "demo": "https://your-demo-url.com",
    "featured": true,
    "date": "2025-01-15"
}
```

### 添加博客文章

编辑 `data/blog-posts.json`，添加你的技术文章：

```json
{
    "id": 1,
    "title": "你的文章标题",
    "excerpt": "文章摘要",
    "date": "2025-01-20",
    "tags": ["JavaScript", "Tutorial"],
    "category": "前端开发",
    "readTime": 8,
    "featured": true
}
```

### 更新联系方式

编辑 `contact.html`，更新你的联系信息：

```html
<div class="contact-method">
    <div class="contact-icon">📧</div>
    <div class="contact-details">
        <h3>邮箱</h3>
        <p>your-email@example.com</p>
    </div>
</div>
```

### 添加图片资源

1. 将你的头像图片命名为 `avatar.jpg`，放入 `assets/images/` 目录
2. 为每个项目添加预览图，命名为 `project1.jpg`, `project2.jpg` 等
3. 建议图片尺寸：
   - 头像：400x400px
   - 项目预览图：800x400px

## 🌐 自定义域名（可选）

### 使用 GitHub 提供的域名

你的网站默认使用：`https://YOUR_USERNAME.github.io/simplytoc/`

### 使用自定义域名

1. 购买域名（如 from Namecheap、GoDaddy 等）
2. 在 GitHub 仓库的 Settings > Pages 中添加自定义域名
3. 根据提示配置 DNS 记录

## 🔄 更新网站

### 修改内容后更新

```bash
# 1. 添加修改
git add .
git commit -m "Update website content"

# 2. 推送到 GitHub
git push origin main
```

GitHub Pages 会自动检测更改并重新部署，通常 1-2 分钟生效。

## 📱 移动端优化

网站已经完全响应式，在手机、平板和桌面设备上都能完美显示。

## 🔍 SEO 优化

网站已包含：
- 语义化 HTML 标签
- Meta 标签优化
- Sitemap.xml
- Robots.txt
- 开放图表标签

## 🆘 常见问题

### Q: 网站显示 404 错误
A: 确保在 GitHub Pages 设置中选择了正确的分支和文件夹

### Q: 图片不显示
A: 检查图片路径是否正确，确保图片文件已上传到 `assets/images/` 目录

### Q: 样式显示异常
A: 确保所有 CSS 文件都已上传，检查文件路径是否正确

### Q: 如何联系我们？
A: 查看 README.md 文件中的联系方式部分

## 🎉 完成！

现在你拥有了一个专业的个人品牌网站！记得定期更新你的项目和博客内容，保持网站的活跃度。

如果这个项目对你有帮助，请给 GitHub 仓库一个 ⭐ Star！