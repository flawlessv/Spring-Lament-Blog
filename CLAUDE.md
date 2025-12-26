# Spring Broken AI Blog - Claude AI 开发指南

这是一个基于 Next.js 15 + TypeScript + shadcn/ui + NextAuth.js 构建的现代化全栈博客系统。

## 🚀 项目概览

Spring Broken AI Blog 是一个功能完整的博客系统，专注于**高效创作**和**优雅展示**。系统采用最新的 Web 技术栈，提供完整的内容管理功能和用户友好的管理界面。

### 核心特性

- ✅ **现代化前端**: Next.js 15 + App Router + React 18
- ✅ **类型安全**: 全栈 TypeScript 支持，端到端类型检查
- ✅ **无头组件**: shadcn/ui + Radix UI + Tailwind CSS
- ✅ **身份认证**: NextAuth.js v4 + JWT 策略 + 角色权限控制
- ✅ **数据库**: Prisma ORM + SQLite (开发) / PostgreSQL (生产)
- ✅ **代码质量**: ESLint + Prettier + Husky + lint-staged
- ✅ **响应式设计**: 移动端优先，支持暗色模式
- ✅ **富文本编辑**: Markdown 编辑器 + 代码高亮 + Mermaid 图表
- ✅ **内容管理**: 文章、分类、标签的完整 CRUD 操作
- ✅ **SEO 优化**: 元数据管理、结构化数据、URL slug
- ✅ **部署友好**: 支持 PM2 部署，生产环境配置

## 📁 项目结构详解

```
Spring-Broken-AI-Blog/
├── prisma/                          # 数据库配置和迁移
│   ├── schema.prisma                # 数据库模型定义（User, Post, Category, Tag, Profile）
│   ├── seed.ts                      # 数据库种子文件（创建初始管理员账户）
│   ├── clear.ts                     # 清除数据库脚本
│   └── dev.db                       # SQLite 数据库文件（开发环境）
│
├── public/                          # 静态资源目录
│   └── uploads/                     # 用户上传的图片文件
│
├── src/                             # 源代码目录
│   ├── app/                         # Next.js App Router 页面
│   │   ├── admin/                   # 管理后台（受保护路由）
│   │   │   ├── page.tsx            # 管理后台首页 - 仪表盘
│   │   │   ├── layout.tsx          # 管理后台布局
│   │   │   ├── posts/              # 文章管理
│   │   │   │   ├── page.tsx        # 文章列表页
│   │   │   │   ├── new/page.tsx    # 新建文章页
│   │   │   │   └── [id]/edit/page.tsx  # 编辑文章页
│   │   │   ├── categories/         # 分类管理
│   │   │   │   ├── page.tsx        # 分类列表页
│   │   │   │   └── new/page.tsx    # 新建分类页
│   │   │   ├── tags/               # 标签管理
│   │   │   │   ├── page.tsx        # 标签列表页
│   │   │   │   └── new/page.tsx    # 新建标签页
│   │   │   ├── profile/            # 个人资料管理
│   │   │   │   └── page.tsx        # 资料编辑页
│   │   │   └── settings/           # 系统设置
│   │   │       └── page.tsx        # 设置页面
│   │   │
│   │   ├── api/                    # API 路由
│   │   │   ├── auth/               # NextAuth.js 认证 API
│   │   │   │   └── [...nextauth]/route.ts
│   │   │   ├── admin/              # 管理员 API（受保护）
│   │   │   │   ├── posts/          # 文章 CRUD API
│   │   │   │   │   ├── route.ts    # GET (列表), POST (创建)
│   │   │   │   │   ├── [id]/route.ts  # GET, PATCH, DELETE
│   │   │   │   │   ├── export/route.ts  # 导出文章
│   │   │   │   │   └── import/route.ts  # 导入文章
│   │   │   │   ├── categories/     # 分类 CRUD API
│   │   │   │   │   ├── route.ts    # GET, POST
│   │   │   │   │   └── [id]/route.ts  # GET, PATCH, DELETE
│   │   │   │   ├── tags/           # 标签 CRUD API
│   │   │   │   │   ├── route.ts    # GET, POST
│   │   │   │   │   └── [id]/route.ts  # GET, PATCH, DELETE
│   │   │   │   ├── profile/        # 用户资料 API
│   │   │   │   │   └── route.ts    # GET, PATCH
│   │   │   │   └── init/           # 初始化 API
│   │   │   │       └── route.ts    # POST (初始化管理员)
│   │   │   ├── posts/              # 公开文章 API
│   │   │   │   ├── route.ts        # GET (已发布文章列表)
│   │   │   │   └── [slug]/route.ts # GET (单篇文章详情)
│   │   │   ├── categories/         # 公开分类 API
│   │   │   │   └── route.ts        # GET (所有分类)
│   │   │   └── profile/            # 公开资料 API
│   │   │       └── route.ts        # GET (用户公开资料)
│   │   │
│   │   ├── login/                  # 登录页面
│   │   │   └── page.tsx
│   │   ├── posts/                  # 文章详情页（前台）
│   │   │   └── [slug]/page.tsx
│   │   ├── category/               # 分类页面（前台）
│   │   │   └── [slug]/page.tsx
│   │   ├── page.tsx                # 首页（文章列表）
│   │   ├── layout.tsx              # 根布局
│   │   └── globals.css             # 全局样式（CSS 变量、Tailwind 基础）
│   │
│   ├── components/                 # React 组件
│   │   ├── ui/                     # shadcn/ui 基础组件
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...（其他 UI 组件）
│   │   ├── admin/                  # 管理后台组件
│   │   │   ├── post-editor.tsx     # 文章编辑器（Markdown）
│   │   │   ├── new-post-editor.tsx # 新建文章编辑器
│   │   │   ├── fullscreen-editor.tsx # 全屏编辑器
│   │   │   ├── unified-posts-table.tsx    # 文章列表表格
│   │   │   ├── unified-categories-table.tsx  # 分类列表表格
│   │   │   ├── unified-tags-table.tsx       # 标签列表表格
│   │   │   ├── category-dialog.tsx  # 分类编辑对话框
│   │   │   ├── tag-dialog.tsx      # 标签编辑对话框
│   │   │   ├── publish-dialog.tsx  # 发布设置对话框
│   │   │   ├── profile-form.tsx    # 资料表单
│   │   │   ├── clean-admin-layout.tsx     # 简洁的管理布局
│   │   │   ├── clean-dashboard-stats.tsx   # 仪表盘统计卡片
│   │   │   └── admin-init.tsx      # 管理员初始化组件
│   │   ├── markdown/               # Markdown 相关组件
│   │   │   ├── markdown-renderer.tsx  # Markdown 渲染器（含 TOC）
│   │   │   ├── code-block.tsx      # 代码块组件（语法高亮）
│   │   │   └── mermaid.tsx         # Mermaid 图表组件
│   │   ├── posts/                  # 文章展示组件
│   │   │   └── post-list.tsx       # 文章列表组件
│   │   ├── profile/                # 用户资料组件
│   │   │   └── admin-profile-card.tsx  # 管理员资料卡片
│   │   ├── layout/                 # 布局组件
│   │   │   └── public-layout.tsx   # 前台公共布局
│   │   ├── providers/              # React Context 提供器
│   │   │   ├── auth-provider.tsx   # 认证上下文
│   │   │   └── theme-provider.tsx  # 主题上下文
│   │   ├── optimized/              # 性能优化组件
│   │   │   └── image-with-fallback.tsx  # 带降级的图片组件
│   │   └── immersive-reader.tsx    # 沉浸式阅读组件
│   │
│   ├── lib/                        # 工具库和配置
│   │   ├── auth.ts                 # NextAuth.js 配置（认证逻辑）
│   │   ├── prisma.ts               # Prisma 客户端单例
│   │   └── utils.ts                # 工具函数（cn, 格式化等）
│   │
│   ├── hooks/                      # React Hooks
│   │   └── use-toast.ts            # Toast 通知 Hook
│   │
│   └── types/                      # TypeScript 类型定义
│       └── next-auth.d.ts          # NextAuth 类型扩展
│
├── components.json                 # shadcn/ui 配置文件
├── tailwind.config.ts              # Tailwind CSS 配置
├── tsconfig.json                   # TypeScript 配置
├── next.config.js                  # Next.js 配置
├── middleware.ts                   # Next.js 中间件（路由保护）
├── ecosystem.config.js             # PM2 配置（生产部署）
├── package.json                    # 项目依赖和脚本
├── README.md                       # 项目说明文档
└── CLAUDE.md                       # Claude AI 开发指南（本文件）
```

## 🛠️ 技术栈详解

### 核心框架

| 技术 | 版本 | 用途 | 说明 |
|------|------|------|------|
| **Next.js** | 15.0 | React 全栈框架 | 使用 App Router，支持 RSC、Server Actions |
| **React** | 18 | UI 库 | 用户界面构建，支持 Suspense、并发特性 |
| **TypeScript** | 5.x | 类型系统 | 全栈类型安全，端到端类型检查 |

### UI 系统

| 技术 | 版本 | 用途 | 说明 |
|------|------|------|------|
| **shadcn/ui** | latest | 无头组件库 | 基于 Radix UI 的可复制组件系统 |
| **Radix UI** | latest | 无头 UI 原语 | 无障碍、可定制的 UI 组件基础 |
| **Tailwind CSS** | 3.4 | CSS 框架 | 实用优先的原子化 CSS |
| **Lucide React** | latest | 图标库 | 现代化、一致的图标系统 |
| **@tailwindcss/typography** | latest | 排版插件 | Markdown 内容样式美化 |
| **@tailwindcss/line-clamp** | latest | 文本截断 | 多行文本截断工具 |

### 数据层

| 技术 | 版本 | 用途 | 说明 |
|------|------|------|------|
| **Prisma** | 6.16.1 | ORM | 类型安全的数据库访问 |
| **Prisma Client** | 6.16.1 | 数据库客户端 | 自动生成的类型安全查询构建器 |
| **SQLite** | builtin | 开发数据库 | 轻量级文件数据库 |
| **PostgreSQL** | optional | 生产数据库 | 企业级关系数据库（需手动配置） |

### 身份认证

| 技术 | 版本 | 用途 | 说明 |
|------|------|------|------|
| **NextAuth.js** | 4.24.11 | 认证库 | 完整的身份认证解决方案 |
| **bcryptjs** | 3.0.2 | 密码哈希 | 密码加密和验证 |
| **JWT** | builtin | 会话策略 | 无状态的令牌认证 |

### 内容管理

| 技术 | 版本 | 用途 | 说明 |
|------|------|------|------|
| **@uiw/react-md-editor** | 4.0.8 | Markdown 编辑器 | 实时预览的富文本编辑 |
| **react-markdown** | 10.1.0 | Markdown 渲染 | Markdown 转 HTML |
| **remark-gfm** | 4.0.1 | GFM 支持 | GitHub Flavored Markdown |
| **remark-slug** | 7.0.1 | 标题锚点 | 自动生成标题 ID |
| **remark-toc** | 9.0.0 | 目录生成 | Table of Contents |
| **rehype-highlight** | 7.0.2 | 代码高亮 | 基于 highlight.js |
| **rehype-raw** | 7.0.0 | HTML 支持 | 在 Markdown 中嵌入 HTML |
| **highlight.js** | 11.11.1 | 语法高亮 | 代码高亮引擎 |
| **mermaid** | 11.11.0 | 图表渲染 | 流程图、序列图等 |

### 表单处理

| 技术 | 版本 | 用途 | 说明 |
|------|------|------|------|
| **react-hook-form** | 7.62.0 | 表单管理 | 高性能表单状态管理 |
| **@hookform/resolvers** | 5.2.1 | 验证适配器 | 与 Zod 集成 |
| **zod** | 4.1.8 | Schema 验证 | TypeScript 优先的验证库 |

### 拖拽交互

| 技术 | 版本 | 用途 | 说明 |
|------|------|------|------|
| **@dnd-kit/core** | 6.3.1 | 拖拽核心 | 现代化拖拽库 |
| **@dnd-kit/sortable** | 10.0.0 | 列表排序 | 可排序列表 |
| **@dnd-kit/utilities** | 3.2.2 | 工具函数 | 拖拽相关工具 |

### 工具库

| 技术 | 版本 | 用途 | 说明 |
|------|------|------|------|
| **date-fns** | 4.1.0 | 日期处理 | 现代化日期工具 |
| **clsx** | 2.1.1 | 类名合并 | 条件类名工具 |
| **tailwind-merge** | 3.3.1 | Tailwind 合并 | 智能合并 Tailwind 类 |
| **class-variance-authority** | 0.7.1 | 组件变体 | 管理组件变体 |
| **gray-matter** | 4.0.3 | Front Matter | Markdown 元数据解析 |
| **archiver** | 7.0.1 | 文件打包 | ZIP 压缩（导出功能） |

### 开发工具

| 技术 | 版本 | 用途 | 说明 |
|------|------|------|------|
| **ESLint** | 8 | 代码检查 | 代码质量检查 |
| **Prettier** | 3.6.2 | 代码格式化 | 自动代码格式化 |
| **Husky** | 9.1.7 | Git Hooks | Git 钩子管理 |
| **lint-staged** | 15.5.2 | 暂存区检查 | 仅检查暂存文件 |
| **tsx** | 4.20.5 | TypeScript 执行 | 直接执行 TS 文件 |
| **dotenv-cli** | 7.4.2 | 环境变量 | 生产环境变量管理 |
| **PM2** | optional | 进程管理 | 生产环境进程守护 |

### 部署相关

| 技术 | 用途 | 说明 |
|------|------|------|
| **npm scripts** | 任务自动化 | 开发、构建、部署脚本 |
| **ecosystem.config.js** | PM2 配置 | 生产环境进程配置 |
| **next.config.js** | Next.js 配置 | 图片优化、构建配置 |
| **tailwind.config.ts** | Tailwind 配置 | 主题、插件配置 |

## 🔧 快速开始

### 环境要求

```bash
Node.js >= 18.0.0
npm >= 8.0.0
```

### 安装步骤

#### 1. 克隆项目

```bash
git clone https://github.com/flawlessv/Spring-Broken-AI-Blog.git
cd Spring-Broken-AI-Blog
```

#### 2. 安装依赖

```bash
npm install
```

#### 3. 配置环境变量

创建 `.env` 文件：

```bash
# 数据库连接
DATABASE_URL="file:./dev.db"

# NextAuth.js 配置
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:7777"

# 管理员账户（可选，默认为 admin/0919）
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="0919"
```

**重要提示**：
- `NEXTAUTH_SECRET` 可以使用 `openssl rand -base64 32` 生成
- 生产环境必须使用强密码

#### 4. 初始化数据库

```bash
# 生成 Prisma Client
npm run db:generate

# 推送数据库架构（开发环境）
npm run db:push

# 填充初始数据（创建管理员账户）
npm run db:seed
```

**可选数据库命令**：

```bash
# 打开 Prisma Studio（可视化数据库管理）
npm run db:studio

# 重置数据库（谨慎使用！会删除所有数据）
npm run db:reset

# 清除数据库（删除所有数据）
npm run db:clear
```

#### 5. 启动开发服务器

```bash
# 启动开发服务器（端口 7777）
npm run dev
```

访问应用：
- **前台**: http://localhost:7777
- **登录**: http://localhost:7777/login
- **后台**: http://localhost:7777/admin

### 默认管理员账户

```
用户名: admin
密码: 0919
```

⚠️ **安全提醒**: 生产环境请立即修改默认密码！

### 环境变量说明

| 变量名 | 说明 | 默认值 | 必填 |
|--------|------|--------|------|
| `DATABASE_URL` | 数据库连接字符串 | `file:./dev.db` | 是 |
| `NEXTAUTH_SECRET` | NextAuth.js 密钥 | - | 是 |
| `NEXTAUTH_URL` | 应用 URL | `http://localhost:7777` | 是 |
| `ADMIN_USERNAME` | 管理员用户名 | `admin` | 否 |
| `ADMIN_PASSWORD` | 管理员密码 | `0919` | 否 |

### 生产环境配置

创建 `.env.production` 文件：

```bash
# 生产数据库（PostgreSQL 示例）
DATABASE_URL="postgresql://username:password@localhost:5432/blog_db"

# NextAuth.js 配置
NEXTAUTH_SECRET="your-production-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# 管理员账户
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-secure-password"
```

## 📝 开发指南

### 可用脚本

```bash
# 开发
npm run dev              # 启动开发服务器 (端口 7777)
npm run build           # 构建生产版本
npm start              # 启动生产服务器 (端口 3000)

# 数据库
npm run db:generate     # 生成 Prisma Client
npm run db:push         # 推送数据库架构
npm run db:migrate      # 运行数据库迁移
npm run db:seed         # 填充种子数据
npm run db:studio       # 打开 Prisma Studio
npm run db:reset        # 重置数据库（⚠️ 会删除所有数据）

# 生产环境数据库
npm run db:generate:prod    # 生成生产环境 Prisma Client
npm run db:push:prod        # 推送生产环境数据库架构
npm run db:seed:prod        # 填充生产环境种子数据
npm run db:clear:prod       # 清除生产环境数据库
npm run db:reset:prod       # 重置生产环境数据库（⚠️ 危险操作）

# 部署
npm run deploy:build    # 构建生产版本（包含 db:generate）
npm run deploy:setup    # 设置生产数据库（包含 db:push 和 db:seed）
npm run deploy:setup:prod  # 完整生产环境设置

# PM2 进程管理
npm run pm2:start       # 使用 PM2 启动应用
npm run pm2:restart     # 重启 PM2 应用
npm run pm2:stop        # 停止 PM2 应用
npm run pm2:delete      # 删除 PM2 应用

# 代码质量
npm run lint            # 运行 ESLint 检查
npm run type-check      # TypeScript 类型检查
npm run format          # Prettier 代码格式化
```

### 代码规范

项目使用严格的代码规范来保证代码质量：

```bash
# 代码检查
npm run lint

# 类型检查
npm run type-check

# 代码格式化
npm run format

# 构建项目
npm run build
```

### Git Hooks

项目配置了自动化的代码质量检查：

- **pre-commit**: 自动格式化代码，运行 ESLint
- **commit-msg**: 检查提交信息格式

配置文件：`.husky/pre-commit` 和 `.husky/commit-msg`

## 💾 数据库设计

### 数据库模型

项目使用 Prisma ORM 进行数据库操作，数据库模型定义在 `prisma/schema.prisma`。

#### 核心模型

**1. User（用户）**

```prisma
model User {
  id        String   @id @default(cuid())
  username  String   @unique
  email     String?  @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  profile Profile?
  posts   Post[]
}
```

**字段说明**：
- `id`: 用户唯一标识（CUID）
- `username`: 用户名（唯一）
- `email`: 邮箱（可选，唯一）
- `password`: 密码哈希值（bcrypt 加密）
- `role`: 用户角色（ADMIN/USER）
- `profile`: 关联的用户资料
- `posts`: 用户发布的文章

**2. Profile（用户资料）**

```prisma
model Profile {
  id          String  @id @default(cuid())
  displayName String?
  bio         String?
  avatar      String?

  // 社交链接
  website     String?
  github      String?
  twitter     String?
  weibo       String?

  // 联系信息
  email       String?
  phone       String?
  wechat      String?
  qq          String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**3. Post（文章）**

```prisma
model Post {
  id          String      @id @default(cuid())
  title       String
  slug        String      @unique
  content     String
  excerpt     String?
  coverImage  String?

  published   Boolean     @default(false)
  featured    Boolean     @default(false)

  views       Int         @default(0)
  readingTime Int?

  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  publishedAt DateTime?

  authorId   String
  author     User       @relation(fields: [authorId], references: [id], onDelete: Cascade)

  categoryId String?
  category   Category?  @relation(fields: [categoryId], references: [id])

  tags       PostTag[]
}
```

**字段说明**：
- `slug`: URL 友好的唯一标识符（用于 SEO）
- `published`: 发布状态（false=草稿，true=已发布）
- `featured`: 是否为精选文章
- `views`: 浏览次数
- `readingTime`: 预计阅读时间（分钟）
- `publishedAt`: 发布时间（仅在发布时设置）

**4. Category（分类）**

```prisma
model Category {
  id          String  @id @default(cuid())
  name        String  @unique
  slug        String  @unique
  description String?
  color       String?
  icon        String?
  sortOrder   Int     @default(0)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  posts Post[]
}
```

**5. Tag（标签）**

```prisma
model Tag {
  id        String    @id @default(cuid())
  name      String    @unique
  slug      String    @unique
  color     String?

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  posts PostTag[]
}
```

**6. PostTag（文章标签关联）**

```prisma
model PostTag {
  id     String @id @default(cuid())
  postId String
  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)

  tagId String
  tag   Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@unique([postId, tagId])
}
```

#### ER 关系图

```
User 1 ←→ 1 Profile
User 1 ←→ N Post
Post N ←→ 1 Category
Post N ←→ M Tag (通过 PostTag)
```

### 数据库操作示例

#### 基础 CRUD 操作

```typescript
import { prisma } from "@/lib/prisma";

// 1. 创建文章
const post = await prisma.post.create({
  data: {
    title: "我的第一篇文章",
    slug: "my-first-post",
    content: "# Hello World\n\n这是我的第一篇文章。",
    excerpt: "文章摘要...",
    published: true,
    authorId: "user-id",
    categoryId: "category-id",
    tags: {
      create: [
        { tag: { connect: { id: "tag-id-1" } } },
        { tag: { connect: { id: "tag-id-2" } } },
      ],
    },
  },
});

// 2. 查询文章（包含关联数据）
const posts = await prisma.post.findMany({
  where: {
    published: true,
  },
  include: {
    author: {
      include: {
        profile: true,
      },
    },
    category: true,
    tags: {
      include: {
        tag: true,
      },
    },
  },
  orderBy: {
    createdAt: "desc",
  },
});

// 3. 更新文章
const updatedPost = await prisma.post.update({
  where: {
    id: "post-id",
  },
  data: {
    title: "新的标题",
    content: "更新后的内容...",
    updatedAt: new Date(),
  },
});

// 4. 删除文章
await prisma.post.delete({
  where: {
    id: "post-id",
  },
});

// 5. 复杂查询（搜索、筛选、分页）
const [posts, total] = await Promise.all([
  prisma.post.findMany({
    where: {
      AND: [
        { published: true },
        {
          OR: [
            { title: { contains: "搜索关键词", mode: "insensitive" } },
            { content: { contains: "搜索关键词", mode: "insensitive" } },
          ],
        },
        {
          categoryId: {
            not: null,
          },
        },
      ],
    },
    include: {
      author: true,
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: 0,
    take: 10,
  }),
  prisma.post.count({
    where: {
      published: true,
    },
  }),
]);
```

### 数据库迁移

```bash
# 开发环境：推送架构到数据库（快速但不可逆）
npm run db:push

# 生产环境：创建迁移文件（推荐）
npm run db:migrate

# 重置数据库（⚠️ 删除所有数据）
npm run db:reset

# 查看数据库（可视化界面）
npm run db:studio
```

## 🔌 API 路由详解

### API 结构

项目使用 Next.js App Router 的 Route Handlers 实现 RESTful API。

#### 公开 API

**1. 文章 API**

```
GET  /api/posts               # 获取已发布文章列表
GET  /api/posts/[slug]        # 获取单篇文章详情（通过 slug）
```

**2. 分类 API**

```
GET  /api/categories          # 获取所有分类
```

**3. 用户资料 API**

```
GET  /api/profile             # 获取用户公开资料
```

#### 管理员 API（受保护）

所有管理员 API 都需要认证和 ADMIN 角色。

**1. 文章管理 API**

```
GET    /api/admin/posts       # 获取文章列表（支持搜索、筛选、分页）
POST   /api/admin/posts       # 创建新文章
GET    /api/admin/posts/[id]  # 获取单篇文章
PATCH  /api/admin/posts/[id]  # 更新文章
DELETE /api/admin/posts/[id]  # 删除文章
POST   /api/admin/posts/export  # 导出文章（ZIP 格式）
POST   /api/admin/posts/import  # 导入文章
```

**查询参数示例**：
```
GET /api/admin/posts?page=1&limit=10&search=关键词&status=published&categoryId=xxx&sortBy=createdAt&sortOrder=desc
```

**2. 分类管理 API**

```
GET    /api/admin/categories     # 获取分类列表
POST   /api/admin/categories     # 创建分类
GET    /api/admin/categories/[id]  # 获取单个分类
PATCH  /api/admin/categories/[id]  # 更新分类
DELETE /api/admin/categories/[id]  # 删除分类
```

**3. 标签管理 API**

```
GET    /api/admin/tags          # 获取标签列表
POST   /api/admin/tags          # 创建标签
GET    /api/admin/tags/[id]     # 获取单个标签
PATCH  /api/admin/tags/[id]     # 更新标签
DELETE /api/admin/tags/[id]     # 删除标签
```

**4. 用户资料 API**

```
GET    /api/admin/profile       # 获取管理员资料
PATCH  /api/admin/profile       # 更新管理员资料
```

**5. 初始化 API**

```
POST   /api/admin/init          # 初始化管理员账户（首次使用）
```

### API 认证示例

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // 1. 获取会话信息
  const session = await getServerSession(authOptions);

  // 2. 验证用户身份
  if (!session?.user) {
    return NextResponse.json(
      { error: "未登录" },
      { status: 401 }
    );
  }

  // 3. 验证管理员权限
  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "无权限访问" },
      { status: 403 }
    );
  }

  // 4. 处理业务逻辑
  // ...

  return NextResponse.json({ data: "success" });
}
```

### 数据验证

项目使用 Zod 进行请求数据验证：

```typescript
import { z } from "zod";

// 定义验证 schema
const createPostSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(200),
  slug: z.string().min(1, "slug不能为空"),
  content: z.string().min(1, "内容不能为空"),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().url().optional(),
  published: z.boolean().default(false),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// 在 API 中使用
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createPostSchema.parse(body); // 验证数据

    // 处理业务逻辑...
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "数据验证失败", details: error.issues },
        { status: 400 }
      );
    }
  }
}
```

## 🎨 组件开发

### 使用 shadcn/ui 组件

shadcn/ui 是一个可复制粘贴的组件库，不是传统的 npm 依赖。

#### 添加新组件

```bash
# 添加预制组件
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add table
npx shadcn@latest add toast

# 查看所有可用组件
npx shadcn@latest add --help
```

组件会被添加到 `src/components/ui/` 目录。

#### 自定义组件示例

```tsx
// src/components/custom/custom-button.tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomButtonProps extends React.ComponentProps<typeof Button> {
  variant?: "default" | "primary" | "danger";
}

export function CustomButton({
  variant = "default",
  className,
  ...props
}: CustomButtonProps) {
  return (
    <Button
      className={cn(
        variant === "primary" && "bg-blue-600 hover:bg-blue-700",
        variant === "danger" && "bg-red-600 hover:bg-red-700",
        className
      )}
      {...props}
    />
  );
}
```

### 客户端组件 vs 服务端组件

Next.js 15 默认使用服务端组件（RSC），需要交互的组件需标记为客户端组件。

```tsx
// 服务端组件（默认）
export default function ServerComponent() {
  return <div>服务端渲染的组件</div>;
}

// 客户端组件（需要 "use client"）
"use client";
import { useState } from "react";

export default function ClientComponent() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      点击次数: {count}
    </button>
  );
}
```

### 常用组件模式

**1. 布局组件**

```tsx
// src/components/layout/public-layout.tsx
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export default function PublicLayout({ children, sidebar }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header>{/* 导航栏 */}</header>
      <main className="container">
        {sidebar && <aside>{sidebar}</aside>}
        {children}
      </main>
      <footer>{/* 页脚 */}</footer>
    </div>
  );
}
```

**2. 数据获取组件**

```tsx
// src/components/posts/post-list.tsx
import { prisma } from "@/lib/prisma";

async function getPosts() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true, category: true },
    orderBy: { createdAt: "desc" },
  });
  return posts;
}

export default async function PostList() {
  const posts = await getPosts();

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <article key={post.id}>{/* 文章卡片 */}</article>
      ))}
    </div>
  );
}
```

**3. 表单组件**

```tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z.string().min(1, "用户名不能为空"),
  email: z.string().email("邮箱格式不正确"),
});

export function UserForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    // 提交逻辑
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register("username")} />
      <Input {...form.register("email")} />
      <Button type="submit">提交</Button>
    </form>
  );
}
```

## 🔐 认证与授权

### NextAuth.js 配置

项目的认证系统配置在 `src/lib/auth.ts:14-184`。

**核心配置**：
- **认证方式**: Credentials Provider（用户名/密码）
- **会话策略**: JWT（无状态）
- **会话有效期**: 30 天
- **角色支持**: ADMIN / USER

### 路由保护

**中间件保护**（`middleware.ts:38-94`）：

```typescript
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // 中间件逻辑
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // 保护管理员路由
        if (pathname.startsWith("/admin")) {
          return token?.role === "ADMIN";
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
```

### 客户端会话管理

```tsx
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function ProtectedComponent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div>加载中...</div>;
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  if (session.user.role !== "ADMIN") {
    return <div>无权限访问</div>;
  }

  return <div>欢迎，{session.user.username}!</div>;
}
```

### 服务端会话获取

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function MyServerAction() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("未登录");
  }

  if (session.user.role !== "ADMIN") {
    throw new Error("无权限");
  }

  // 业务逻辑
}
```

## 🎨 设计系统

### 颜色系统

项目使用 HSL 颜色空间的 CSS 变量，支持亮色/暗色主题。

**CSS 变量定义**（`src/app/globals.css`）：

```css
:root {
  /* 基础颜色 */
  --background: 0 0% 100%;        /* 背景色 */
  --foreground: 240 10% 3.9%;     /* 文字色 */

  /* 主色调 */
  --primary: 221.2 83.2% 53.3%;    /* 主色（蓝色） */
  --primary-foreground: 210 40% 98%;

  /* 次要色 */
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;

  /* 功能色 */
  --muted: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%;
  --success: 142 76% 36%;

  /* 边框和输入 */
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;

  /* 圆角 */
  --radius: 0.5rem;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;

  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;

  /* ... 其他暗色变量 */
}
```

**使用示例**：

```tsx
// 使用 Tailwind 类名
<div className="bg-background text-foreground border border-border">
  <h1 className="text-primary">主标题</h1>
  <p className="text-muted-foreground">次要文字</p>
  <button className="bg-destructive text-destructive-foreground">
    危险操作
  </button>
</div>
```

### 响应式设计

Tailwind 断点系统：

```tsx
// 移动优先的响应式设计
<div className="
  grid
  grid-cols-1        // 移动端：1 列
  md:grid-cols-2     // 平板：2 列
  lg:grid-cols-3     // 桌面：3 列
  gap-4              // 间距
  p-4                // 移动端内边距
  sm:p-6             // 小屏以上内边距
  lg:p-8             // 大屏以上内边距
">
  <Card className="p-4">内容</Card>
</div>
```

### 主题切换

项目支持亮色/暗色主题切换。

```tsx
"use client";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

## 🚀 部署指南

### 生产环境部署步骤

#### 1. 准备生产环境

```bash
# 克隆代码到服务器
git clone <repository-url>
cd Spring-Broken-AI-Blog

# 安装依赖
npm install
```

#### 2. 配置环境变量

创建 `.env.production`：

```bash
# PostgreSQL 数据库（推荐）
DATABASE_URL="postgresql://user:password@localhost:5432/blog_db"

# NextAuth.js 配置
NEXTAUTH_SECRET="使用 openssl rand -base64 32 生成"
NEXTAUTH_URL="https://your-domain.com"

# 管理员账户
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="secure-password-here"
```

#### 3. 设置数据库

```bash
# 使用 PostgreSQL
npm run db:generate:prod
npm run db:push:prod
npm run db:seed:prod
```

#### 4. 构建应用

```bash
npm run build
```

#### 5. 使用 PM2 启动（推荐）

```bash
# 安装 PM2（全局）
npm install -g pm2

# 启动应用
npm run pm2:start

# 查看状态
pm2 status

# 查看日志
pm2 logs spring-lament-blog

# 重启应用
npm run pm2:restart
```

**PM2 配置**（`ecosystem.config.js`）：

```javascript
module.exports = {
  apps: [
    {
      name: "spring-lament-blog",
      script: "node",
      args: ".next/standalone/server.js",
      instances: 1,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
```

#### 6. Nginx 反向代理（可选）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Docker 部署（可选）

创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine AS base

# 安装依赖
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 构建应用
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 生产镜像
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

构建和运行：

```bash
# 构建镜像
docker build -t spring-lament-blog .

# 运行容器
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_SECRET="..." \
  spring-lament-blog
```

### 性能优化建议

1. **数据库优化**
   - 为常用查询字段添加索引
   - 使用连接池
   - 启用查询缓存

2. **应用优化**
   - 启用 CDN 静态资源
   - 配置图片优化（`next.config.js`）
   - 使用 ISR（增量静态再生成）

3. **服务器优化**
   - 使用 PM2 集群模式
   - 配置 Nginx 缓存
   - 启用 Gzip 压缩

## 🐛 常见问题

### 数据库相关

**Q: Prisma Client 生成失败？**
```bash
# 删除 node_modules 和重新安装
rm -rf node_modules
npm install
npm run db:generate
```

**Q: 数据库迁移失败？**
```bash
# 重置数据库（开发环境）
npm run db:reset

# 生产环境请使用迁移文件
npm run db:migrate
```

### 构建相关

**Q: 构建时内存溢出？**
```bash
# 增加 Node.js 内存限制
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

**Q: 构建卡在类型生成？**
```bash
# 临时禁用 typedRoutes（next.config.js）
experimental: {
  typedRoutes: false,
}
```

### 认证相关

**Q: 登录后立即退出？**
- 检查 `NEXTAUTH_SECRET` 是否一致
- 确认 `NEXTAUTH_URL` 配置正确
- 检查 Cookie 域名设置

**Q: 中间件不生效？**
- 确认 `matcher` 配置正确
- 检查路由是否在 `matcher` 范围内

### 部署相关

**Q: PM2 启动失败？**
```bash
# 检查日志
pm2 logs spring-lament-blog

# 删除并重新启动
npm run pm2:delete
npm run pm2:start
```

## 📚 学习资源

### 官方文档

- [Next.js 文档](https://nextjs.org/docs)
- [Prisma 文档](https://www.prisma.io/docs)
- [NextAuth.js 文档](https://next-auth.js.org)
- [shadcn/ui 文档](https://ui.shadcn.com)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

### 推荐阅读

- [React 18 新特性](https://react.dev/blog/2022/03/29/react-v18)
- [TypeScript 最佳实践](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Zod 验证库](https://zod.dev)

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出新功能建议！

### 开发流程

1. Fork 项目仓库
2. 创建功能分支: `git checkout -b feature/new-feature`
3. 提交更改: `git commit -m 'feat: add new feature'`
4. 推送到分支: `git push origin feature/new-feature`
5. 创建 Pull Request

### 代码风格

- 使用 TypeScript 进行开发
- 遵循 ESLint 和 Prettier 规则
- 为新功能添加适当的注释
- 保持组件的单一职责原则

### 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
feat: 添加新功能
fix: 修复 Bug
docs: 更新文档
style: 代码格式调整（不影响功能）
refactor: 代码重构
test: 添加测试
chore: 构建过程或工具变更
perf: 性能优化
ci: CI/CD 配置变更
```

## 📄 许可证

本项目采用 MIT 许可证。详情请查看 [LICENSE](./LICENSE) 文件。

---

**Spring Broken AI Blog** - 专注于高效创作和优雅展示的现代化博客系统

🔗 **技术栈**: Next.js 15 + TypeScript + shadcn/ui + NextAuth.js + Prisma + Tailwind CSS

📧 **联系**: GitHub [@flawlessv](https://github.com/flawlessv)

---

最后更新：2025-12-26
