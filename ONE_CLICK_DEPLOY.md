# 🚀 一键部署指南

## 服务器一键部署

在你的Linux服务器上运行以下命令，即可完成所有环境配置和部署：

```bash
curl -sSL https://raw.githubusercontent.com/return2faye/wine-map/main/server-setup.sh | bash
```

### 部署脚本会自动完成：

✅ **系统环境配置**
- 更新系统包
- 安装Node.js 18
- 安装Nginx
- 配置防火墙

✅ **项目部署**
- 克隆代码仓库
- 安装依赖
- 构建项目
- 配置Nginx

✅ **自动化功能**
- 每天自动更新代码
- 每天自动备份
- SSL证书配置（可选）

✅ **管理工具**
- 手动更新脚本
- 手动备份脚本
- 日志监控

## 部署后访问

部署完成后，通过以下地址访问你的红酒地图：
- **HTTP**: `http://你的服务器IP`
- **HTTPS**: `https://你的域名`（如果配置了SSL）

## 管理命令

```bash
# 手动更新
/usr/local/bin/update-wine-map

# 手动备份
/usr/local/bin/backup-wine-map

# 查看更新日志
tail -f /var/log/wine-map-update.log

# 重启Nginx
sudo systemctl restart nginx
```

## 项目信息

- **GitHub仓库**: https://github.com/return2faye/wine-map.git
- **项目目录**: `/var/www/wine-map`
- **自动更新**: 每天凌晨2点
- **自动备份**: 每天凌晨2点

## 故障排除

### 如果部署失败
1. 检查网络连接
2. 确保服务器有sudo权限
3. 检查端口80和443是否开放

### 如果网站无法访问
1. 检查Nginx状态：`sudo systemctl status nginx`
2. 检查防火墙：`sudo ufw status`
3. 查看Nginx日志：`sudo tail -f /var/log/nginx/error.log`

### 如果需要重新部署
```bash
cd /var/www/wine-map
git pull origin main
npm install
npm run build
sudo systemctl reload nginx
```

## 支持

如果遇到问题，请检查：
1. [GitHub仓库](https://github.com/return2faye/wine-map.git) 的Issues
2. 服务器日志文件
3. Nginx配置是否正确

---

**就是这么简单！一条命令完成所有部署！** 🎉
