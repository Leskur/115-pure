# 115 Pure

一个简洁、纯净的 115 网盘桌面客户端，使用 Tauri + React + TypeScript 构建。

## 特性

- **安全登录**：通过 115 开放平台 OAuth2 授权，无需输入账号密码
- **桌面体验**：原生桌面应用，比网页更流畅
- **开源免费**：完全开源，隐私可控

## 技术栈

- **前端**：React 19 + TypeScript + Vite
- **桌面**：Tauri v2 (Rust)
- **状态管理**：Zustand
- **数据获取**：TanStack Query
- **样式**：Tailwind CSS

## 开发环境

### 前置要求

- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://rustup.rs/) (最新稳定版)

### 安装依赖

```bash
npm install
```

### 配置环境变量

1. 复制环境变量模板：
   ```bash
   cp .env.example .env
   ```

2. 到 [115 开放平台](https://open.115.com) 注册应用，获取 `CLIENT_ID` 并填入 `.env`：
   ```
   VITE_115_CLIENT_ID=your_client_id_here
   ```

### 运行开发服务器

```bash
npm run tauri-dev
```

### 构建应用

```bash
npm run tauri build
```

## 项目结构

```
115-pure/
├── src/              # 前端源码
│   ├── api/          # API 请求
│   ├── components/   # UI 组件
│   ├── hooks/        # React Hooks
│   ├── pages/        # 页面组件
│   ├── stores/       # 状态管理
│   └── types/        # TypeScript 类型
├── src-tauri/        # Tauri (Rust) 源码
└── public/           # 静态资源
```

## 贡献

欢迎提交 Issue 和 Pull Request。

## 许可证

MIT License
