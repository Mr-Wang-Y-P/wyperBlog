# wyperBlog

wyperBlog 是一个基于 React 的赛博朋克风格技术博客平台，集成了炫酷的 GSAP 动画、Markdown 渲染与编辑、以及模拟的实时聊天功能。

## 📂 目录结构

- `src/`: 前端源代码（React组件、页面、样式）
- `server/`: Node.js 后端源代码（简单的 API 服务）
- `public/`: 静态资源目录

## 🚀 本地启动指南

由于本项目主要包含源代码逻辑，在本地运行时推荐使用 **Vite** 进行构建和热更新。请按照以下步骤操作：

### 1. 环境准备
确保您的电脑已安装 [Node.js](https://nodejs.org/) (推荐 v16 或更高版本)。

### 2. 初始化构建环境
在项目根目录下，安装 Vite 和 React 插件作为开发依赖：

```bash
npm install -D vite @vitejs/plugin-react
```

然后，在根目录创建 `vite.config.js` 文件：

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
```

接着，在根目录创建 `index.html` 文件（Vite 的入口）：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>wyperBlog</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.jsx"></script>
  </body>
</html>
```

### 3. 安装项目依赖
安装 `package.json` 中列出的运行时依赖：

```bash
npm install
```

### 4. 启动前端
运行以下命令启动开发服务器：

```bash
npm run dev
```
或者直接运行 `npx vite`。访问 `http://localhost:5173` 即可看到炫酷的博客首页。

---

## 🛠️ 启动后端 (可选)

本项目包含一个简单的 Node.js 后端，用于演示真实的数据持久化（文章读写）。

### 1. 开启后端服务
在新的终端窗口中运行：

```bash
npm run server
```
或者 `node server/server.js`。后端服务将在 `http://localhost:7894` 启动。

### 2. 连接前端与后端
默认情况下，前端使用 `localStorage` 模拟数据，以便在无后端环境下预览。
若要连接真实后端，请修改 `src/services/postService.js` 文件：

```javascript
// 将此行改为 true
const USE_REAL_API = true;
```

保存后，前端将自动切换为从本地后端 API 获取数据。

## ✨ 主要特性

- **炫酷视觉**: 首页集成 GSAP 动画、WebGL 粒子背景、磁吸按钮与 3D 卡片交互。
- **Markdown 生态**:
  - **阅读**: 支持代码高亮、GFM 语法、Frontmatter 解析。
  - **编辑**: 全屏双栏编辑器，支持实时预览与发布。
- **沉浸体验**: 顶部阅读进度条、平滑入场动画、自定义光标（非触屏设备）。
- **实时互动**: 模拟/真实的聊天室轮询机制。
