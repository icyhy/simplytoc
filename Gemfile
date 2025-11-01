source "https://rubygems.org"

# Ruby 3 不再内置 webrick，本地启动 Jekyll 需要显式依赖
gem "webrick", "~> 1.8"

# 使用 GitHub Pages 的依赖组合，避免本地与线上环境不一致
group :jekyll_plugins do
  gem "github-pages"
  # 站点使用分页（index.html 中有 paginator.posts），确保本地也能加载该插件
  gem "jekyll-paginate"
end