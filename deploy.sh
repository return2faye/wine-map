#!/bin/bash

# 红酒地图快速部署脚本
# 使用方法: ./deploy.sh

echo "🍷 红酒地图部署脚本"
echo "===================="

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 检查Git状态
echo "📋 检查Git状态..."
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  有未提交的更改，请先提交："
    git status --short
    read -p "是否继续？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 构建项目
echo "🔨 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建成功"

# 检查是否有远程仓库
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "📡 设置GitHub远程仓库..."
    read -p "请输入你的GitHub用户名: " github_username
    read -p "请输入仓库名 (默认: wine-map): " repo_name
    repo_name=${repo_name:-wine-map}
    
    git remote add origin "https://github.com/$github_username/$repo_name.git"
    echo "✅ 远程仓库已设置: https://github.com/$github_username/$repo_name.git"
fi

# 推送到GitHub
echo "🚀 推送到GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ 代码已推送到GitHub"
    echo ""
    echo "🎉 部署完成！"
    echo ""
    echo "📋 下一步："
    echo "1. 在GitHub仓库设置中配置Secrets："
    echo "   - HOST: 你的服务器IP"
    echo "   - USERNAME: 服务器用户名"
    echo "   - SSH_KEY: 你的SSH私钥"
    echo "   - PORT: SSH端口（默认22）"
    echo ""
    echo "2. 在服务器上运行："
    echo "   sudo mkdir -p /var/www/wine-map"
    echo "   sudo chown \$USER:\$USER /var/www/wine-map"
    echo "   cd /var/www/wine-map"
    echo "   git clone https://github.com/$github_username/$repo_name.git ."
    echo "   npm install && npm run build"
    echo ""
    echo "3. 配置Nginx（参考 DEPLOYMENT_GUIDE.md）"
    echo ""
    echo "📖 详细部署指南: DEPLOYMENT_GUIDE.md"
else
    echo "❌ 推送到GitHub失败"
    exit 1
fi
