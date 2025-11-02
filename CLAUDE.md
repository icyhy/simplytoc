# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jekyll-based personal blog called "简谈" (Simply Talk), built with the Hux theme and hosted on GitHub Pages. The site features responsive design, blog post pagination, tag cloud functionality, and social media integration.

## Development Environment Setup

1. **Ruby Dependencies**:
   - Install Ruby 2.7+ (required for GitHub Pages compatibility)
   - Run `bundle install` to install required gems (github-pages, jekyll-paginate, webrick)

2. **Node.js Dependencies**:
   - Install Node.js and npm
   - Run `npm install` to install Grunt build tools

3. **Local Development Server**:
   - Use `bundle exec jekyll serve` to start the development server
   - Use `npm run watch` for development with live reload (Grunt watch + Jekyll serve)

## Build Process

### Asset Optimization
- **CSS**: LESS files in `less/` are compiled to CSS using Grunt (`grunt less`)
- **JavaScript**: Files are minified using Grunt (`grunt uglify`)
- **Full Build**: Run `grunt` to compile LESS, minify JS, and add banners

### Jekyll Build
- Run `bundle exec jekyll build` to generate the static site in `_site/`
- Use `bundle exec jekyll serve` for local development with auto-regeneration

## Project Structure

```
├── _config.yml          # Jekyll configuration
├── _posts/              # Blog posts in Markdown
├── _layouts/            # Page templates (default, post, page)
├── _includes/           # Reusable components (head, nav, footer)
├── css/                 # Compiled CSS files
├── js/                  # JavaScript files
├── less/                # Source LESS files
├── img/                 # Images (in-post images in img/in-post/)
├── index.html           # Main page with pagination
├── tags.html            # Tag cloud page
└── package.json         # Node.js dependencies and scripts
```

## Key Features

### Navigation Filtering
The navigation bar (`_includes/nav.html`) automatically excludes pages with:
- Paths containing 'readme' (case-insensitive)
- Titles equal to '一个程序员的个人博客'

### Image Handling
Blog posts can reference remote images which are automatically downloaded and localized to `img/in-post/` during build. Reference images using `{{ site.baseurl }}/img/in-post/` paths.

### Social Media & Analytics
- Integrated with Weibo, Zhihu, GitHub, Facebook, and Twitter
- Google Analytics and Baidu Tongji support
- Duoshuo comment system integration

## Common Development Tasks

### Adding New Blog Posts
1. Create a new Markdown file in `_posts/` with format: `YYYY-MM-DD-title.markdown`
2. Add YAML frontmatter with title, date, and optional subtitle
3. Write content in Markdown format
4. Test locally with `bundle exec jekyll serve`

### Customizing Site Appearance
1. Modify LESS files in `less/` for styling changes
2. Run `grunt` to compile and minify CSS
3. Update `_config.yml` for site settings and social links

### Testing and Deployment
1. Test changes locally with `bundle exec jekyll serve`
2. Push to GitHub to deploy (GitHub Pages automatically builds the site)