#!/bin/bash

# 红酒地图服务器一键部署脚本
# 使用方法: curl -sSL https://raw.githubusercontent.com/return2faye/wine-map/main/server-setup.sh | bash

set -e  # 遇到错误立即退出

echo "🍷 红酒地图服务器一键部署脚本"
echo "=================================="

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

# 检查是否为root用户
if [ "$EUID" -eq 0 ]; then
    log_error "请不要使用root用户运行此脚本"
    exit 1
fi

# 设置GitHub仓库信息
GITHUB_USERNAME="return2faye"
REPO_NAME="wine-map"
GITHUB_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

log_info "GitHub仓库: $GITHUB_URL"

# 获取域名或IP
read -p "请输入你的域名或IP地址: " DOMAIN_OR_IP

# 1. 更新系统
log_info "更新系统包..."
sudo apt update && sudo apt upgrade -y

# 2. 安装必要软件
log_info "安装必要软件..."
sudo apt install -y curl wget git nginx ufw

# 3. 安装Node.js 18
log_info "安装Node.js 18..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    log_success "Node.js 安装完成"
else
    log_info "Node.js 已安装，版本: $(node --version)"
fi

# 4. 创建项目目录
log_info "创建项目目录..."
sudo mkdir -p /var/www/wine-map
sudo chown $USER:$USER /var/www/wine-map
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
sudo tee /etc/nginx/sites-available/wine-map > /dev/null <<EOF
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
sudo ln -sf /etc/nginx/sites-available/wine-map /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 测试Nginx配置
sudo nginx -t

# 启动Nginx
sudo systemctl enable nginx
sudo systemctl restart nginx

# 8. 配置防火墙
log_info "配置防火墙..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# 9. 创建自动更新脚本
log_info "创建自动更新脚本..."
sudo tee /usr/local/bin/update-wine-map > /dev/null <<'EOF'
#!/bin/bash
cd /var/www/wine-map
git pull origin main
npm install
npm run build
sudo systemctl reload nginx
echo "$(date): Wine map updated" >> /var/log/wine-map-update.log
EOF

sudo chmod +x /usr/local/bin/update-wine-map

# 10. 创建systemd服务（用于自动更新）
log_info "创建自动更新服务..."
sudo tee /etc/systemd/system/wine-map-update.service > /dev/null <<EOF
[Unit]
Description=Wine Map Auto Update
After=network.target

[Service]
Type=oneshot
User=$USER
WorkingDirectory=/var/www/wine-map
ExecStart=/usr/local/bin/update-wine-map
EOF

# 11. 创建定时器（每天凌晨2点检查更新）
sudo tee /etc/systemd/system/wine-map-update.timer > /dev/null <<EOF
[Unit]
Description=Run Wine Map Update Daily
Requires=wine-map-update.service

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable wine-map-update.timer
sudo systemctl start wine-map-update.timer

# 12. 安装SSL证书（可选）
read -p "是否安装SSL证书？(y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "安装SSL证书..."
    sudo apt install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d $DOMAIN_OR_IP --non-interactive --agree-tos --email admin@$DOMAIN_OR_IP
fi

# 13. 创建备份脚本
log_info "创建备份脚本..."
sudo tee /usr/local/bin/backup-wine-map > /dev/null <<EOF
#!/bin/bash
DATE=\$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/wine-map"
PROJECT_DIR="/var/www/wine-map"

mkdir -p \$BACKUP_DIR
tar -czf \$BACKUP_DIR/wine-map-backup-\$DATE.tar.gz -C \$PROJECT_DIR .

# 保留最近7天的备份
find \$BACKUP_DIR -name "wine-map-backup-*.tar.gz" -mtime +7 -delete
EOF

sudo chmod +x /usr/local/bin/backup-wine-map

# 添加备份到定时任务
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-wine-map") | crontab -

# 14. 完成部署
log_success "🎉 部署完成！"
echo ""
echo "📋 部署信息："
echo "  🌐 访问地址: http://$DOMAIN_OR_IP"
echo "  📁 项目目录: /var/www/wine-map"
echo "  🔄 自动更新: 每天凌晨2点"
echo "  💾 自动备份: 每天凌晨2点"
echo ""
echo "📋 管理命令："
echo "  🔄 手动更新: /usr/local/bin/update-wine-map"
echo "  💾 手动备份: /usr/local/bin/backup-wine-map"
echo "  📊 查看日志: tail -f /var/log/wine-map-update.log"
echo "  🔧 重启Nginx: sudo systemctl restart nginx"
echo ""
echo "📖 详细文档: /var/www/wine-map/README.md"

# 测试部署
log_info "测试部署..."
if curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN_OR_IP | grep -q "200"; then
    log_success "✅ 网站运行正常！"
else
    log_warning "⚠️  网站可能还在启动中，请稍等片刻"
fi
