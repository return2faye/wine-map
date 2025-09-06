# 我的红酒地图 🍷

一个记录和展示你品尝过的葡萄酒的交互式世界地图应用。

## 功能特点

- 🗺️ 交互式世界地图，显示你品尝过的葡萄酒位置
- 🍷 不同颜色的标记代表不同类型的葡萄酒（红、白、桃红、起泡）
- 📱 响应式设计，支持移动端和桌面端
- ✨ 流畅的动画过渡效果
- 📝 详细的葡萄酒信息展示（产区、年份、评分、品酒笔记等）
- 💾 本地数据存储，易于管理和更新

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **地图库**: Leaflet + React-Leaflet
- **动画**: Framer Motion
- **图标**: Lucide React
- **样式**: CSS3 + 响应式设计

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动

### 构建生产版本

```bash
npm run build
```

构建文件将输出到 `dist` 目录

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
src/
├── components/          # React 组件
│   ├── WineDetail.tsx   # 葡萄酒详情页面
│   └── CustomMarker.tsx # 自定义地图标记
├── data/               # 数据文件
│   └── wines.ts        # 葡萄酒数据
├── types/              # TypeScript 类型定义
│   └── wine.ts         # 葡萄酒相关类型
├── styles/             # 样式文件
│   └── index.css       # 全局样式
├── App.tsx             # 主应用组件
└── main.tsx            # 应用入口
```

## 添加新的葡萄酒

在 `src/data/wines.ts` 文件中添加新的葡萄酒数据：

```typescript
{
  id: 'unique-id',
  name: '葡萄酒名称',
  region: '产区',
  country: '国家',
  coordinates: {
    lat: 纬度,
    lng: 经度
  },
  vintage: 年份,
  grapeVariety: '葡萄品种',
  price: 价格,
  rating: 评分,
  tastingNotes: '品酒笔记',
  personalComment: '个人评价',
  dateConsumed: '品尝日期',
  winery: '酒庄',
  alcoholContent: 酒精度,
  color: 'red' | 'white' | 'rose' | 'sparkling'
}
```

## 快速部署

### 使用部署脚本（推荐）
```bash
./deploy.sh
```

### 手动部署

1. 推送到GitHub：
```bash
git remote add origin https://github.com/你的用户名/wine-map.git
git push -u origin main
```

2. 在服务器上设置：
```bash
sudo mkdir -p /var/www/wine-map
sudo chown $USER:$USER /var/www/wine-map
cd /var/www/wine-map
git clone https://github.com/你的用户名/wine-map.git .
npm install && npm run build
```

3. 配置Nginx（参考 `DEPLOYMENT_GUIDE.md`）

### 自动部署

项目配置了 GitHub Actions 自动部署，每次 push 到 main 分支都会自动部署到你的 Linux 服务器。

**配置GitHub Secrets：**
- `HOST`: 服务器IP地址
- `USERNAME`: 服务器用户名  
- `SSH_KEY`: SSH私钥内容
- `PORT`: SSH端口（默认22）

## 自定义配置

- 修改 `vite.config.ts` 调整构建配置
- 更新 `src/styles/index.css` 自定义样式
- 在 `src/data/wines.ts` 中添加你的葡萄酒数据

## 许可证

MIT License
