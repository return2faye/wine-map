#!/bin/bash

# 红酒地图数据更新脚本
# 用法: ./update-wine-data.sh

set -e

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

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    log_error "请在项目根目录运行此脚本"
    exit 1
fi

log_info "🍷 开始更新红酒地图数据..."

# 1. 拉取最新代码
log_info "拉取最新代码..."
git pull

# 2. 安装依赖（如果需要）
log_info "检查依赖..."
npm ci

# 3. 重新构建
log_info "重新构建项目..."
npm run build

# 4. 重载Nginx
log_info "重载Nginx..."
systemctl reload nginx

# 5. 测试部署
log_info "测试部署..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200"; then
    log_success "✅ 网站更新成功！"
    echo "  🌐 访问地址: http://你的服务器IP"
else
    log_warning "⚠️  网站可能还在启动中，请稍等片刻"
fi

log_success "🎉 数据更新完成！"
