# 红酒地图部署指南

## 1. 推送到GitHub

### 创建GitHub仓库
1. 登录GitHub，创建新仓库
2. 仓库名建议：`wine-map` 或 `my-wine-map`
3. 设置为公开或私有（根据你的需要）

### 推送代码
```bash
# 添加远程仓库（替换为你的GitHub用户名和仓库名）
git remote add origin https://github.com/你的用户名/wine-map.git

# 推送到GitHub
git push -u origin main
```

## 2. 服务器部署配置

### 服务器环境要求
- Ubuntu/Debian Linux
- Node.js 18+
- Nginx
- Git

### 服务器端设置

#### 1. 安装必要软件
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装Nginx
sudo apt install nginx -y

# 安装Git
sudo apt install git -y
```

#### 2. 创建项目目录
```bash
# 创建项目目录
sudo mkdir -p /var/www/wine-map
sudo chown $USER:$USER /var/www/wine-map
cd /var/www/wine-map

# 克隆项目
git clone https://github.com/你的用户名/wine-map.git .

# 安装依赖
npm install

# 构建项目
npm run build
```

#### 3. 配置Nginx
创建Nginx配置文件：
```bash
sudo nano /etc/nginx/sites-available/wine-map
```

添加以下内容：
```nginx
server {
    listen 80;
    server_name 你的域名.com;  # 替换为你的域名或IP
    
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
    
    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

启用站点：
```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/wine-map /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

## 3. 配置GitHub Actions自动部署

### 设置GitHub Secrets
在GitHub仓库设置中添加以下Secrets：

1. **HOST**: 你的服务器IP地址
2. **USERNAME**: 服务器用户名
3. **SSH_KEY**: 你的SSH私钥内容
4. **PORT**: SSH端口（默认22）

### 生成SSH密钥（如果还没有）
```bash
# 在本地生成SSH密钥
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 将公钥添加到服务器
ssh-copy-id username@your-server-ip

# 将私钥内容复制到GitHub Secrets的SSH_KEY中
cat ~/.ssh/id_rsa
```

### 测试自动部署
```bash
# 在本地做一个小改动
echo "// 测试部署" >> src/App.tsx

# 提交并推送
git add .
git commit -m "Test deployment"
git push origin main
```

## 4. SSL证书配置（可选但推荐）

### 使用Let's Encrypt
```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取SSL证书
sudo certbot --nginx -d 你的域名.com

# 自动续期
sudo crontab -e
# 添加以下行：
0 12 * * * /usr/bin/certbot renew --quiet
```

## 5. 域名配置

### 如果使用域名
1. 在域名注册商处设置A记录指向你的服务器IP
2. 等待DNS传播（通常几分钟到几小时）

### 如果使用IP地址
直接使用服务器IP访问：`http://你的服务器IP`

## 6. 故障排除

### 常见问题

#### 1. 网站无法访问
```bash
# 检查Nginx状态
sudo systemctl status nginx

# 检查端口是否开放
sudo ufw status
sudo ufw allow 80
sudo ufw allow 443
```

#### 2. 自动部署失败
- 检查GitHub Secrets配置
- 检查SSH密钥权限
- 查看GitHub Actions日志

#### 3. 图片不显示
```bash
# 检查图片文件权限
sudo chown -R www-data:www-data /var/www/wine-map/dist
sudo chmod -R 755 /var/www/wine-map/dist
```

### 日志查看
```bash
# Nginx错误日志
sudo tail -f /var/log/nginx/error.log

# Nginx访问日志
sudo tail -f /var/log/nginx/access.log

# GitHub Actions日志
# 在GitHub仓库的Actions标签页查看
```

## 7. 性能优化

### 1. 启用HTTP/2
在Nginx配置中添加：
```nginx
listen 443 ssl http2;
```

### 2. 配置缓存
```nginx
# 静态资源缓存
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. 启用压缩
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

## 8. 备份策略

### 自动备份脚本
```bash
#!/bin/bash
# 创建备份脚本
sudo nano /usr/local/bin/backup-wine-map.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/wine-map"
PROJECT_DIR="/var/www/wine-map"

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/wine-map-backup-$DATE.tar.gz -C $PROJECT_DIR .

# 保留最近7天的备份
find $BACKUP_DIR -name "wine-map-backup-*.tar.gz" -mtime +7 -delete
```

```bash
# 设置执行权限
sudo chmod +x /usr/local/bin/backup-wine-map.sh

# 添加到定时任务
sudo crontab -e
# 添加：0 2 * * * /usr/local/bin/backup-wine-map.sh
```

## 9. 监控和维护

### 系统监控
```bash
# 安装htop监控系统资源
sudo apt install htop -y

# 监控磁盘空间
df -h

# 监控内存使用
free -h
```

### 定期维护
- 定期更新系统：`sudo apt update && sudo apt upgrade`
- 清理日志文件
- 监控磁盘空间
- 检查SSL证书有效期

## 10. 完成检查清单

- [ ] GitHub仓库创建并推送代码
- [ ] 服务器环境配置完成
- [ ] Nginx配置并启动
- [ ] GitHub Actions Secrets配置
- [ ] 自动部署测试成功
- [ ] 域名解析配置（如果使用域名）
- [ ] SSL证书配置（可选）
- [ ] 备份策略设置
- [ ] 监控系统配置

完成以上步骤后，你的红酒地图应用就可以通过互联网访问了！🍷✨
