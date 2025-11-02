# Jekyll 一键发布脚本使用指南

## 🎉 问题已修复！

### ✅ Jekyll 依赖检查问题
之前遇到的 "jekyll 命令未找到" 错误已经解决。脚本现在会正确检查 Jekyll 是否通过 Bundler 安装。

### ✅ Git 版本兼容性问题
修复了 `git branch --show-current` 在旧版本 Git（< 2.22.0）中不支持的问题，现在使用 `git rev-parse --abbrev-ref HEAD` 来获取当前分支名。

## 快速使用

### 基本命令
```bash
./deploy.sh          # 一键构建和发布
./deploy.sh -h       # 查看帮助
```

### 依赖要求
- ✅ Ruby 和 Bundler（已安装）
- ✅ Git（已安装，兼容 2.15.0+ 版本）
- ✅ Jekyll（通过 `bundle exec jekyll` 可用）

### 典型工作流程
1. 编辑或创建文章
2. 运行 `./deploy.sh`
3. 输入提交信息
4. 脚本自动完成构建和发布

## 修复说明

### Jekyll 依赖检查修复
**问题**: 脚本直接检查 `jekyll` 命令，但项目中 Jekyll 是通过 Bundler 管理的。

**解决方案**: 修改脚本使用 `bundle exec jekyll -v` 来检查 Jekyll 是否可用。

### Git 版本兼容性修复
**问题**: `git branch --show-current` 命令在 Git 2.22.0 之前的版本中不存在。

**解决方案**: 使用 `git rev-parse --abbrev-ref HEAD` 替代，这个命令在更早的 Git 版本中就已支持。

现在脚本会：
- 检查 `bundle` 命令是否存在
- 检查 `bundle exec jekyll` 是否可用
- 检查 `git` 命令是否存在
- 兼容 Git 2.15.0+ 版本

如果遇到任何问题，请确保运行过 `bundle install` 来安装所有依赖。

## 🚀 开始使用吧！

现在你可以放心使用 `./deploy.sh` 来快速发布你的文章了！