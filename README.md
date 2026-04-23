# Inkwell

> 一个面向在线阅读场景的全栈项目，提供图书浏览、分类检索、章节阅读、书架收藏、阅读记录与 AI 阅读助手能力。

## 项目简介

Inkwell 是一个前后端分离的阅读平台 Demo，围绕“找书 - 读书 - 记录 - 辅助推荐”构建完整阅读流程。项目包含 Web 前端、NestJS 后端、PostgreSQL 数据层，以及 AI 对话和语义搜索能力，适合作为阅读类产品原型、全栈课程项目或 AI + 内容检索场景实践。

## 功能亮点

- 图书首页推荐与分类浏览
- 图书搜索与语义搜索
- 图书详情与章节阅读
- 用户注册、登录与 JWT 鉴权
- 书架收藏与阅读历史记录
- AI 阅读助手流式对话
- Prisma 驱动的数据建模与数据库迁移

## 技术栈

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Zustand
- Tailwind CSS
- Radix UI / shadcn 风格组件

### Backend

- NestJS
- Prisma
- PostgreSQL
- JWT
- LangChain
- DeepSeek / OpenAI 兼容接口

## 项目预览

### 首页

![Inkwell 首页预览](./docs/screenshots/home.png)

### 图书详情

![Inkwell 图书详情预览](./docs/screenshots/book-detail.png)

### AI 阅读助手

![Inkwell AI 阅读助手预览](./docs/screenshots/ai.png)

## 项目结构

```text
inkwell/
├─ frontend/          # React + Vite 前端
├─ backend/           # NestJS + Prisma 后端
├─ docs/
│  └─ screenshots/    # README 预览图
├─ LICENSE
├─ package.json
└─ README.md
```

## 快速开始

### 1. 安装依赖

分别安装前后端依赖：

```bash
cd frontend
npm install

cd ../backend
npm install
```

### 2. 配置环境变量

后端需要数据库连接和 AI 服务密钥。可先复制示例配置：

```bash
cd backend
copy .env.example .env
```

推荐重点检查以下变量：

```env
DATABASE_URL=postgresql://username:password@localhost:5432/inkwell?schema=public
TOKEN_SECRET=your-jwt-secret
PORT=3000
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
OPENAI_API_KEY=your_openai_api_key
OPENAI_BASE_URL=https://api.302.ai/v1
DASHSCOPE_API_KEY=your_dashscope_api_key
```

说明：

- `DATABASE_URL`：Prisma 连接 PostgreSQL
- `TOKEN_SECRET`：JWT 签名密钥
- `DEEPSEEK_API_KEY`：AI 阅读助手对话
- `DASHSCOPE_API_KEY`：语义搜索查询向量生成

### 3. 初始化数据库

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

### 4. 启动后端

```bash
cd backend
npm run start:dev
```

默认地址：

```text
http://localhost:3000
```

接口前缀：

```text
/api
```

### 5. 启动前端

```bash
cd frontend
npm run dev
```

默认地址：

```text
http://localhost:5173
```

前端默认请求后端：

```text
http://localhost:3000/api
```

相关配置位于 `frontend/src/api/config.ts`，可通过 `VITE_API_BASE_URL` 或 `VITE_USE_MOCK` 调整。

## AI 与语义搜索

项目后端包含两类智能能力：

- AI 对话：`POST /api/ai/chat`
- 语义搜索：`GET /api/search?keyword=...&mode=semantic`

语义搜索依赖本地向量数据文件：

```text
backend/data/book-vectors.json
```

更新向量数据后，可通过以下接口重新加载：

```text
POST /api/search/reload-vectors
```

仓库中还提供了向量生成脚本：

```text
backend/scripts/generate-embeddings.ts
```

## 适用场景

- 在线阅读平台课程项目
- 全栈开发练习
- 阅读产品原型验证
- AI + 内容检索 Demo

## License

授权信息见 [LICENSE](./LICENSE)。
