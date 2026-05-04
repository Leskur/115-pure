# 115 网盘客户端开发计划

使用 **Tauri (Rust + React)** 构建跨平台桌面客户端，基于 115 开放平台 API 实现文件浏览、上传、下载功能，采用手机扫码 PKCE 授权。

## 技术栈

- **框架**: Tauri 2.x (Rust 后端 + React 前端)
- **UI**: React 18 + TypeScript + Tailwind CSS
- **状态管理**: Zustand / React Query
- **路由**: React Router
- **HTTP 客户端**: axios (前端) + reqwest (Rust 后端)
- **存储**: 本地 SQLite (Tauri SQL 插件) 存储文件索引

## 核心功能模块

### 1. 认证模块 (OAuth2 + PKCE)
- 生成 PKCE code_verifier 和 code_challenge
- 打开系统浏览器进行扫码授权
- 本地 HTTP 回调监听获取授权码
- 用授权码换取 access_token 和 refresh_token
- Token 持久化存储与自动刷新

### 2. 文件管理模块
- **文件列表**: 支持分页、排序、视图切换（列表/网格）
- **面包屑导航**: 文件夹层级快速跳转
- **文件搜索**: 按名称搜索文件/文件夹
- **文件详情**: 显示大小、修改时间、类型等信息

### 3. 上传下载模块
- **上传**: 支持拖拽上传、断点续传、分片上传、进度显示
- **下载**: 多线程下载、断点续传、下载队列管理
- **传输管理**: 上传/下载任务列表，支持暂停/恢复/取消

### 4. 本地数据层
- 文件元数据本地缓存
- 最近访问记录
- 用户配置存储

## 项目结构

```
115-pure/
├── src/                    # React 前端源码
│   ├── components/         # 通用组件
│   ├── pages/              # 页面组件
│   ├── stores/             # Zustand 状态管理
│   ├── hooks/              # 自定义 Hooks
│   ├── api/                # 115 API 封装
│   └── utils/              # 工具函数
├── src-tauri/              # Rust 后端源码
│   ├── src/
│   │   ├── auth/           # OAuth2/PKCE 实现
│   │   ├── api/            # 115 API 调用
│   │   ├── download/       # 下载管理器
│   │   ├── upload/         # 上传管理器
│   │   └── db/             # 本地数据库操作
│   └── Cargo.toml
├── package.json
├── tailwind.config.js
└── README.md
```

## 开发里程碑

### Phase 1: 项目搭建与认证 (1-2 天)
- [ ] 初始化 Tauri + React + TypeScript 项目
- [ ] 配置 Tailwind CSS 和基础 UI 组件
- [ ] 实现 PKCE 授权流程
- [ ] 完成登录页面

### Phase 2: 文件浏览 (2-3 天)
- [ ] 获取文件列表 API 封装
- [ ] 文件列表页面（列表/网格视图）
- [ ] 面包屑导航
- [ ] 文件夹进入/返回
- [ ] 文件搜索功能

### Phase 3: 上传下载 (3-4 天)
- [ ] 获取上传/下载凭证
- [ ] 单文件上传 + 进度显示
- [ ] 分片上传实现
- [ ] 断点续传功能
- [ ] 多线程下载
- [ ] 传输任务管理器

### Phase 4: 优化与扩展 (2-3 天)
- [ ] 本地数据缓存
- [ ] 错误处理与重试机制
- [ ] 文件预览（图片/文本）
- [ ] 回收站功能
- [ ] 应用打包与发布

## 关键技术要点

### 115 API 集成
- **Base URL**: `https://proapi.115.com`
- **认证**: OAuth2 + PKCE 模式
- **主要端点**:
  - `GET /open/files` - 获取文件列表
  - `POST /open/upload` - 文件上传
  - `GET /open/download` - 获取下载地址
  - `GET /open/user/info` - 用户信息

### Tauri 后端职责
- 处理 OAuth2 回调监听 (localhost 服务器)
- 大文件分片上传/下载管理
- 本地数据库操作
- 系统通知推送

### 前端职责
- UI 渲染与交互
- 文件列表展示与虚拟滚动
- 拖拽上传处理
- 传输进度可视化

## 后续可扩展功能
- 视频在线播放（调用 115 转码接口）
- 离线下载（磁力/BT 链接提交）
- 文件分享管理
- 多账号切换
- 自动同步备份
