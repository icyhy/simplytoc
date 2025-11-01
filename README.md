# Simply TOC - 个人品牌网站

一个简约极简风格的程序员个人品牌网站，通过 GitHub Pages 托管，用于展示个人项目、分享技术博客和编程心得。

## 🚀 特性

- **简约极简设计** - 干净的界面，注重内容展示
- **响应式布局** - 完美适配桌面和移动设备
- **纯前端实现** - HTML/CSS/JavaScript，无需构建工具
- **GitHub Pages 部署** - 零配置部署到 GitHub Pages
- **SEO 优化** - 良好的搜索引擎优化配置
- **无障碍支持** - 支持屏幕阅读器和键盘导航

## 📁 项目结构

```
simplytoc/
├── index.html              # 主页
├── about.html              # 个人简介页
├── projects.html           # 项目展示页
├── blog.html              # 博客文章页
├── contact.html           # 联系方式页
├── css/
│   ├── main.css           # 主样式文件
│   └── responsive.css     # 响应式样式
├── js/
│   ├── main.js            # 主 JavaScript 文件
│   ├── projects.js        # 项目相关功能
│   └── blog.js            # 博客相关功能
├── data/
│   ├── projects.json      # 项目数据
│   └── blog-posts.json    # 博客文章数据
├── assets/
│   ├── images/            # 图片资源
│   └── icons/             # 图标资源
├── README.md              # 项目说明
└── .gitignore            # Git 忽略文件
```

## 🛠 技术栈

- **HTML5** - 语义化标记
- **CSS3** - 现代 CSS 特性，CSS Grid 和 Flexbox
- **JavaScript ES6+** - 现代 JavaScript 语法
- **Web APIs** - Fetch API、Intersection Observer 等
- **GitHub Pages** - 静态网站托管

## 📦 部署到 GitHub Pages

### 方法一：通过 GitHub 仓库设置

1. Fork 或创建这个仓库到你的 GitHub 账户
2. 进入仓库的 Settings 页面
3. 在 "Pages" 部分中，选择源为 "Deploy from a branch"
4. 选择分支为 `main` 或 `master`，文件夹为 `/root`
5. 点击 Save，等待几分钟部署完成

### 方法二：通过 GitHub CLI

```bash
# 克隆仓库
git clone https://github.com/yourusername/simplytoc.git
cd simplytoc

# 提交所有文件
git add .
git commit -m "Initial commit"
git push origin main

# 启用 GitHub Pages
gh pages create --source main --path /
```

### 方法三：手动 gh-pages 分支

```bash
# 创建 gh-pages 分支
git checkout --orphan gh-pages
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

## 🎨 自定义配置

### 修改个人信息

编辑 `about.html` 文件中的个人信息：

```html
<div class="profile-info">
    <h1 class="profile-name">你的名字</h1>
    <p class="profile-title">你的职位</p>
    <p class="profile-bio">你的个人介绍</p>
</div>
```

### 修改项目数据

编辑 `data/projects.json` 文件来更新你的项目信息：

```json
{
    "id": 1,
    "title": "项目名称",
    "description": "项目描述",
    "image": "assets/images/project.jpg",
    "tags": ["JavaScript", "React"],
    "category": "Web应用",
    "github": "https://github.com/username/repo",
    "demo": "https://demo.example.com",
    "featured": true,
    "date": "2025-01-15"
}
```

### 修改博客文章

编辑 `data/blog-posts.json` 文件来添加或修改博客文章：

```json
{
    "id": 1,
    "title": "文章标题",
    "excerpt": "文章摘要",
    "date": "2025-01-20",
    "tags": ["JavaScript", "Tutorial"],
    "category": "前端开发",
    "readTime": 8,
    "featured": true
}
```

### 自定义样式

在 `css/main.css` 文件中修改 CSS 变量来自定义主题：

```css
:root {
    --color-primary: #000000;     /* 主色调 */
    --color-accent: #0066cc;      /* 强调色 */
    --font-family: 'Inter', sans-serif;  /* 字体 */
    /* 更多变量... */
}
```

## 🌐 SEO 优化

网站已包含基本的 SEO 优化：

- 语义化 HTML5 标签
- Meta 描述和标题
- 开放图表 (Open Graph) 标签
- 结构化数据
- Sitemap 和 robots.txt
- 友好的 URL 结构

## 📱 响应式设计

网站支持以下设备尺寸：

- **桌面端**：1024px 及以上
- **平板端**：768px - 1023px
- **手机端**：767px 及以下
- **小屏幕手机**：480px 及以下

## 🚀 性能优化

- 图片懒加载
- CSS 和 JavaScript 压缩
- 字体预加载
- 缓存策略
- 关键资源内联

## 🔧 开发指南

### 本地开发

由于是纯静态网站，你可以使用任何本地服务器来开发：

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js (需要安装 http-server)
npx http-server

# 使用 PHP
php -S localhost:8000
```

然后访问 `http://localhost:8000`

### 添加新功能

1. 在相应的 HTML 文件中添加结构
2. 在 CSS 文件中添加样式
3. 在 JavaScript 文件中添加交互逻辑
4. 更新数据文件（如需要）

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 这个仓库
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📞 联系方式

如果你有任何问题或建议，欢迎通过以下方式联系：

- 邮箱：hello@example.com
- GitHub：https://github.com/username
- LinkedIn：https://linkedin.com/in/username

---

⭐ 如果这个项目对你有帮助，请给它一个星标！