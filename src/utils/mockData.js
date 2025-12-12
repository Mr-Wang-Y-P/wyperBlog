// Initial data as specified in PRD
export const INITIAL_POSTS = [
  {
    slug: 'welcome',
    content: `---
title: "Welcome to wyperBlog"
date: 2024-06-11
tags: ["meta", "welcome"]
cover: "/assets/cover1.jpg"
---

# 欢迎来到 wyperBlog

这是第一篇示例文章，展示了炫酷的首页与 Markdown 渲染能力。

## 特性

- 支持 **粗体** 与 *斜体*
- 支持代码块：

\`\`\`js
console.log('hello wyperBlog');
\`\`\`

> 期待你的第一篇投稿！`
  },
  {
    slug: 'react-hooks-deep-dive',
    content: `---
title: "React Hooks 深度解析"
date: 2024-06-10
tags: ["react", "frontend"]
cover: "/assets/cover2.jpg"
---

# React Hooks 深度解析

本文深入 useEffect、useMemo、useCallback 的原理与最佳实践。

## useEffect 清理机制

当依赖数组为空时，组件卸载触发清理函数。

\`\`\`js
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);
\`\`\``
  },
  {
    slug: 'rust-for-web',
    content: `---
title: "用 Rust 写 WebAssembly"
date: 2024-06-09
tags: ["rust", "webassembly"]
cover: "/assets/cover3.jpg"
---

# 用 Rust 写 WebAssembly

通过 wasm-bindgen 快速将 Rust 编译到前端。

## 步骤

1. 安装 \`wasm-pack\`
2. \`wasm-pack build --target web\`
3. 在 JS 中 \`import('./pkg').then(wasm => wasm.greet('wyper'))\``
  },
  {
    slug: 'css-grid-layout',
    content: `---
title: "CSS Grid 布局实战"
date: 2024-06-08
tags: ["css", "layout"]
cover: "/assets/cover4.jpg"
---

# CSS Grid 布局实战

用 Grid 实现自适应瀑布流文章列表。

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
\`\`\``
  },
  {
    slug: 'socketio-chat',
    content: `---
title: "Socket.IO 聊天栏实现"
date: 2024-06-07
tags: ["socketio", "chat"]
cover: "/assets/cover5.jpg"
---

# Socket.IO 聊天栏实现

简述如何在 wyperBlog 中集成实时聊天。

## 轮询方案

当本地无 Socket.IO 服务时，使用轮询读取 \`/chat.json\` 实现伪实时。`
  }
];

export const INITIAL_CHAT = [
  {
    id: 1,
    user: "alice",
    avatar: "https://www.weavefox.cn/api/bolt/unsplash_image?keyword=woman,portrait&width=100&height=100&random=alice",
    content: "首页太炫酷了！",
    time: "2024-06-11T10:00:00Z"
  },
  {
    id: 2,
    user: "bob",
    avatar: "https://www.weavefox.cn/api/bolt/unsplash_image?keyword=man,portrait&width=100&height=100&random=bob",
    content: "Markdown 渲染很顺滑，爱了！",
    time: "2024-06-11T10:01:00Z"
  },
  {
    id: 3,
    user: "wyper",
    avatar: "https://www.weavefox.cn/api/bolt/unsplash_image?keyword=robot,avatar&width=100&height=100&random=wyper",
    content: "欢迎体验 wyperBlog，有问题随时留言。",
    time: "2024-06-11T10:02:00Z"
  }
];
