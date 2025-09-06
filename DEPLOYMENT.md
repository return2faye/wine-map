# 部署指南

## 自动部署设置

### 1. GitHub Actions 配置

项目已经配置了 GitHub Actions 自动部署。每次 push 到 main 分支都会自动部署到你的 Linux 服务器。

### 2. 服务器端配置

#### 在服务器上设置项目目录

```bash
# 在服务器上创建项目目录
sudo mkdir -p /var/www/wine-map
sudo chown $USER:$USER /var/www/wine-map
cd /var/www/wine-map

# 克隆项目
git clone https://github.com/你的用户名/winemap.git .

# 安装依赖
npm install
```

#### 配置 Nginx

创建 Nginx 配置文件 `/etc/nginx/sites-available/wine-map`:

```nginx
server {
    listen 80;
    server_name 你的域名.com;  # 替换为你的域名
    
    root /var/www/wine-map/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

启用站点：

```bash
sudo ln -s /etc/nginx/sites-available/wine-map /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. GitHub Secrets 配置

在 GitHub 仓库设置中添加以下 Secrets：

- `HOST`: 你的服务器IP地址
- `USERNAME`: 服务器用户名
- `SSH_KEY`: 你的SSH私钥内容
- `PORT`: SSH端口（通常是22）

### 4. SSL 证书（可选但推荐）

使用 Let's Encrypt 获取免费SSL证书：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d 你的域名.com
```

## 手动部署

如果需要手动部署：

```bash
# 构建项目
npm run build

# 将 dist 目录上传到服务器
scp -r dist/* user@your-server:/var/www/wine-map/dist/

# 在服务器上重新加载 Nginx
ssh user@your-server "sudo systemctl reload nginx"
```

## 更新葡萄酒数据

要添加新的葡萄酒，编辑 `src/data/wines.ts` 文件：

```typescript
{
  id: 'unique-id',
  name: '葡萄酒名称',
  region: '产区',
  country: '国家',
  coordinates: {
    lat: 纬度,  // 使用 Google Maps 或类似工具获取精确坐标
    lng: 经度
  },
  vintage: 年份,
  grapeVariety: '葡萄品种',
  price: 价格,
  rating: 评分, // 1-5
  tastingNotes: '品酒笔记',
  personalComment: '个人评价',
  dateConsumed: '2024-01-01', // YYYY-MM-DD 格式
  winery: '酒庄',
  alcoholContent: 酒精度,
  color: 'red' | 'white' | 'rose' | 'sparkling'
}
```

## 故障排除

### 常见问题

1. **地图不显示**: 检查网络连接，确保可以访问 OpenStreetMap
2. **标记不显示**: 检查坐标是否正确
3. **样式问题**: 清除浏览器缓存
4. **部署失败**: 检查 GitHub Secrets 配置

### 日志查看

```bash
# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# 查看 GitHub Actions 日志
# 在 GitHub 仓库的 Actions 标签页查看
```

## 性能优化

1. **图片优化**: 压缩葡萄酒图片，建议使用 WebP 格式
2. **CDN**: 考虑使用 CDN 加速静态资源
3. **缓存**: 配置适当的缓存策略
4. **压缩**: 启用 Gzip 压缩

## 备份

定期备份项目数据：

```bash
# 备份项目文件
tar -czf wine-map-backup-$(date +%Y%m%d).tar.gz /var/www/wine-map

# 备份 Nginx 配置
sudo cp /etc/nginx/sites-available/wine-map ~/nginx-wine-map-backup.conf
```
