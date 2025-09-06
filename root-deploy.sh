#!/bin/bash

# 红酒地图服务器一键部署脚本 (支持root用户)
# 使用方法: curl -sSL https://raw.githubusercontent.com/return2faye/wine-map/main/root-deploy.sh | bash

set -e  # 遇到错误立即退出

echo "🍷 红酒地图服务器一键部署脚本 (Root版本)"
echo "=============================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 设置GitHub仓库信息
GITHUB_USERNAME="return2faye"
REPO_NAME="wine-map"
GITHUB_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

log_info "GitHub仓库: $GITHUB_URL"

# 获取域名或IP
read -p "请输入你的域名或IP地址: " DOMAIN_OR_IP

# 1. 更新系统
log_info "更新系统包..."
apt update && apt upgrade -y

# 2. 安装必要软件
log_info "安装必要软件..."
apt install -y curl wget git nginx ufw

# 3. 安装Node.js 18
log_info "安装Node.js 18..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
    log_success "Node.js 安装完成"
else
    log_info "Node.js 已安装，版本: $(node --version)"
fi

# 4. 创建项目目录
log_info "创建项目目录..."
mkdir -p /var/www/wine-map
cd /var/www/wine-map

# 5. 克隆项目
log_info "克隆项目代码..."
if [ -d ".git" ]; then
    log_info "项目已存在，更新代码..."
    git pull origin main
else
    git clone $GITHUB_URL .
fi

# 6. 安装依赖并构建
log_info "安装依赖..."
npm install

log_info "构建项目..."
npm run build

# 7. 配置Nginx
log_info "配置Nginx..."
tee /etc/nginx/sites-available/wine-map > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN_OR_IP;
    
    root /var/www/wine-map/dist;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF

# 启用站点
ln -sf /etc/nginx/sites-available/wine-map /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试Nginx配置
nginx -t

# 启动Nginx
systemctl enable nginx
systemctl restart nginx

# 8. 配置防火墙
log_info "配置防火墙..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 9. 完成部署
log_success "🎉 部署完成！"
echo ""
echo "📋 部署信息："
echo "  🌐 访问地址: http://$DOMAIN_OR_IP"
echo "  📁 项目目录: /var/www/wine-map"
echo ""
echo "📋 管理命令："
echo "  🔄 手动更新: cd /var/www/wine-map && git pull && npm run build"
echo "  🔧 重启Nginx: systemctl restart nginx"
echo "  📊 查看日志: tail -f /var/log/nginx/error.log"
echo ""

# 测试部署
log_info "测试部署..."
if curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN_OR_IP | grep -q "200"; then
    log_success "✅ 网站运行正常！"
else
    log_warning "⚠️  网站可能还在启动中，请稍等片刻"
fi
