#!/bin/bash

# Jekyll 一键构建和发布脚本
# 用于快速更新文章并发布到 GitHub

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_message $RED "错误: $1 命令未找到，请确保已安装相关工具"
        exit 1
    fi
}

# 检查 Jekyll 是否通过 bundle 可用
check_jekyll() {
    if ! bundle exec jekyll -v &> /dev/null; then
        print_message $RED "错误: Jekyll 未正确安装，请运行 'bundle install'"
        exit 1
    fi
}

# 检查是否在 Git 仓库中
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_message $RED "错误: 当前目录不是 Git 仓库"
        exit 1
    fi
}

# 检查是否有未提交的更改
check_git_status() {
    if [[ -n $(git status --porcelain) ]]; then
        print_message $YELLOW "检测到未提交的更改:"
        git status --short
        echo
        read -p "是否继续? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_message $YELLOW "操作已取消"
            exit 0
        fi
    fi
}

# 主函数
main() {
    print_message $BLUE "=== Jekyll 一键构建和发布脚本 ==="
    echo
    
    # 检查必要的命令
    print_message $YELLOW "检查依赖..."
    check_command "bundle"
    check_jekyll
    check_command "git"
    
    # 检查 Git 仓库
    check_git_repo
    
    # 检查 Git 状态
    check_git_status
    
    # 获取提交信息
    echo
    read -p "请输入提交信息 (默认: Update posts): " commit_message
    if [[ -z "$commit_message" ]]; then
        commit_message="Update posts"
    fi
    
    echo
    print_message $YELLOW "开始构建 Jekyll 站点..."
    
    # 清理之前的构建
    if [[ -d "_site" ]]; then
        rm -rf _site
        print_message $GREEN "清理旧的构建文件"
    fi
    
    # 执行 Jekyll 构建
    if bundle exec jekyll build; then
        print_message $GREEN "Jekyll 构建成功!"
    else
        print_message $RED "Jekyll 构建失败!"
        exit 1
    fi
    
    echo
    print_message $YELLOW "准备提交到 Git..."
    
    # 添加所有更改到暂存区
    git add .
    
    # 检查是否有文件被添加
    if git diff --cached --quiet; then
        print_message $YELLOW "没有检测到新的更改，跳过提交"
    else
        # 提交更改
        if git commit -m "$commit_message"; then
            print_message $GREEN "Git 提交成功!"
        else
            print_message $RED "Git 提交失败!"
            exit 1
        fi
    fi
    
    echo
    print_message $YELLOW "推送到 GitHub..."
    
    # 获取当前分支名 (兼容旧版本 Git)
    current_branch=$(git rev-parse --abbrev-ref HEAD)
    
    # 推送到远程仓库
    if git push origin "$current_branch"; then
        print_message $GREEN "推送到 GitHub 成功!"
    else
        print_message $RED "推送到 GitHub 失败!"
        exit 1
    fi
    
    echo
    print_message $GREEN "=== 发布完成! ==="
    print_message $BLUE "你的更改已成功发布到 GitHub"
    
    # 显示最新提交信息
    echo
    print_message $YELLOW "最新提交信息:"
    git log --oneline -1
}

# 脚本帮助信息
show_help() {
    echo "Jekyll 一键构建和发布脚本"
    echo
    echo "用法:"
    echo "  ./deploy.sh          - 执行完整的构建和发布流程"
    echo "  ./deploy.sh -h       - 显示此帮助信息"
    echo
    echo "功能:"
    echo "  1. 检查依赖工具 (bundle, jekyll, git)"
    echo "  2. 清理旧的构建文件"
    echo "  3. 执行 Jekyll 构建"
    echo "  4. 提交更改到 Git"
    echo "  5. 推送到 GitHub"
    echo
    echo "注意事项:"
    echo "  - 请确保在 Jekyll 项目根目录下运行此脚本"
    echo "  - 请确保已配置 Git 远程仓库"
    echo "  - 脚本会自动检测未提交的更改并询问是否继续"
}

# 处理命令行参数
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac