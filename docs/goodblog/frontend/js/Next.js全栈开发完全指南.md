---
title: Next.js全栈开发完全指南
slug: nextfullstack
published: true
featured: true
publishedAt: 2025-10-23T00:00:00.000Z
readingTime: 20
category: 前端
tags:
  - js
coverImage: https://haowallpaper.com/link/common/file/previewFileImg/15691093812220224
---

> 基于Spring Lament Blog项目的实战经验，帮助前端同学快速掌握全栈开发技能

## 前言

最近部门在大力推全栈开发，作为一名前端开发者，想要入门全栈开发，那么这份指南就是为你准备的。我们将通过一个真实的博客项目(Spring Lament Blog)，从零开始学习如何使用Next.js 15构建现代化的全栈应用以及后端、数据库、部署等相关知识简介。

## 文章大纲

**学习路径：概念理解 → 工具掌握 → 实战应用**

### 📚 概念理解篇（打基础）

1. **第1章：后端的本质** - 理解前后端分工和全栈开发价值
2. **第2章：Node.js入门** - JavaScript运行时和服务端能力
3. **第3章：Next.js全栈框架** - 现代化全栈开发解决方案

### 🔧 工具掌握篇（学工具）

4. **第4章：项目结构全解析** - 理解文件组织和架构设计
5. **第5章：数据库与Prisma ORM** - 数据管理和模型设计
6. **第6章：用户认证系统** - 安全控制和权限管理

### 🚀 实战应用篇（做项目）

7. **第7章：部署与运维** - 生产环境部署和自动化
8. **第8章：性能优化** - 提升应用性能和用户体验

---

## 第1章：后端的本质

TODO:画一个前后端交互的流程图

### 什么是后端？

**后端(Backend)**是应用程序的服务器端部分，负责处理业务逻辑、数据管理和服务器通信。简单来说，后端就是"管数据的"。

### 前后端职责划分

**前端职责：**

- 用户界面展示、用户交互、数据展示、用户体验

**后端职责：**

- 数据存储、业务逻辑、API接口、安全控制

### 为什么前端同学要学后端？

1. **大势所趋**：目前Vibe Coding盛行，AI全栈开发工程师可能是未来趋势
2. **职业发展**：全栈开发者更受市场欢迎
3. **项目理解**：知道数据如何流转，写出更好的前端代码
4. **独立开发**：可以独立完成整个项目

### Next.js全栈开发优势

传统开发需要前端项目+后端项目+数据库，而Next.js全栈框架可以：

- 一个项目包含前后端
- 统一的代码库和部署流程
- 更好的开发体验和性能优化

---

## 第2章：Node.js入门

### JavaScript Runtime运行时

在开始学习Node.js之前，我们需要理解一个核心概念：**Runtime(运行时)**。

一段JavaScript代码本质上就是字符串：

```javascript
console.log("hello world");
```

这段字符串能被执行吗？不能，它需要运行环境。

**Runtime就是代码的执行环境**。没有Runtime，代码就无法执行，就是一堆字符串。

### 浏览器 vs Node.js

**浏览器Runtime：**

- 内置JavaScript解释器
- 提供DOM、BOM等浏览器API
- 只能运行在浏览器中
- 主要用于用户界面开发

**Node.js Runtime：**

- 基于Chrome V8引擎
- 提供文件系统、HTTP等服务器API
- 可以运行在任何操作系统
- 主要用于服务器端开发

### Node.js的核心能力

Node.js作为服务器端JavaScript运行时，提供了以下核心能力：

#### 1. 文件系统操作

```javascript
const fs = require("fs");
const path = require("path");

// 读取文件
const data = fs.readFileSync("data.txt", "utf8");
console.log(data);

// 写入文件
fs.writeFileSync("output.txt", "Hello Node.js", "utf8");
```

#### 2. HTTP服务器

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ message: "Hello from Node.js" }));
});

server.listen(3000, () => {
  console.log("服务器运行在 http://localhost:3000");
});
```

#### 3. 数据库操作

```javascript
// 使用Prisma ORM操作数据库
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 创建用户
await prisma.user.create({
  data: {
    name: "张三",
    email: "zhang@example.com",
  },
});

// 查询用户
const users = await prisma.user.findMany();
```

#### 4. 第三方API调用

```javascript
// 调用外部API
const response = await fetch("https://api.example.com/data");
const data = await response.json();
```

### 为什么选择Node.js？

对于前端同学来说，选择Node.js学习后端有以下优势：

1. **语言统一**：前后端都用JavaScript，无需学习新语言
2. **生态丰富**：npm包管理器，海量第三方库
3. **性能优秀**：基于V8引擎，执行效率高
4. **社区活跃**：大量教程和开源项目

### 学习目标

通过本章，你应该理解：

- Runtime是代码的执行环境
- Node.js提供了服务器端JavaScript运行能力
- Node.js的核心功能：文件操作、HTTP服务、数据库操作
- 为什么前端同学选择Node.js学习后端最合适

在下一章，我们将学习Next.js，这是一个基于Node.js的全栈框架，让全栈开发变得更加简单。

---

## 第3章：Next.js全栈框架

### 传统开发方式的痛点

在传统的Web开发中，我们需要维护多个独立的项目：

```
项目结构：
├── frontend/          # React前端项目
│   ├── src/
│   │   ├── components/  # React组件
│   │   ├── pages/      # 页面组件
│   │   ├── hooks/      # 自定义Hook
│   │   ├── utils/      # 工具函数
│   │   ├── services/   # API调用
│   │   ├── store/      # 状态管理
│   │   └── types/      # TypeScript类型
│   ├── public/         # 静态资源
│   ├── package.json
│   └── ...
├── backend/           # Node.js后端项目
│   ├── src/
│   │   ├── controllers/ # 控制器
│   │   ├── services/   # 业务逻辑
│   │   ├── models/     # 数据模型
│   │   ├── routes/     # 路由定义
│   │   ├── middleware/ # 中间件
│   │   ├── utils/      # 工具函数
│   │   └── config/     # 配置文件
│   ├── package.json
│   └── ...
└── database/          # 数据库
    ├── migrations/     # 数据库迁移
    ├── seeds/         # 初始数据
    └── schema.sql     # 数据库架构
```

**这种方式的缺点：**

- **开发复杂**：需要同时维护多个项目
- **部署复杂**：需要分别部署前端和后端
- **协调困难**：前后端接口需要协商
- **类型安全**：前后端数据类型不一致

### Next.js的解决方案

Next.js是Vercel开发的React全栈框架，一个项目解决所有问题：

```
Next.js项目结构：
├── app/               # 页面和API路由
│   ├── page.tsx      # 前端页面
│   ├── api/          # 后端API
│   └── layout.tsx    # 布局组件
├── components/       # React组件
├── lib/              # 工具函数
└── prisma/          # 数据库
```

### Next.js的核心优势

#### 0. Turbopack构建系统

Next.js 15引入了基于Rust的Turbopack构建系统，相比传统的Webpack有显著优势：

**Turbopack优势：**

- **启动速度快**：开发环境启动速度比Webpack快10倍
- **增量编译**：只编译变更的部分，开发时几乎瞬时更新
- **内存占用低**：更高效的内存使用，减少内存泄漏
- **原生支持**：原生支持TypeScript、JSX、CSS等
- **未来架构**：基于Rust，为Next.js未来发展奠定基础

#### 1. 文件系统路由

文件即路由，非常直观：

```
app/
├── page.tsx          → /
├── about/page.tsx   → /about
├── posts/
│   ├── page.tsx     → /posts
│   └── [slug]/page.tsx → /posts/hello-world
└── api/posts/route.ts → /api/posts
```

#### 2. 特殊文件约定

Next.js使用特殊文件名定义不同功能：

```typescript
// app/posts/page.tsx - 页面组件
export default function PostsPage() {
  return <div>文章列表页面</div>
}

// app/api/posts/route.ts - API路由
export async function GET() {
  return Response.json({ message: "获取文章列表" });
}

// app/layout.tsx - 布局组件
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>
        <header>网站头部</header>
        {children}
        <footer>网站底部</footer>
      </body>
    </html>
  )
}

// app/loading.tsx - 加载状态
export default function Loading() {
  return <div>加载中...</div>
}
```

#### 3. Server Components与Client Components

**Server Components（默认）**：在服务器执行，可直接访问数据库

```typescript
// 服务端组件 - 默认
export default async function PostsPage() {
  const posts = await prisma.post.findMany() // 直接数据库查询
  return <div>{posts.map(post => <div key={post.id}>{post.title}</div>)}</div>
}
```

**Client Components**：在浏览器执行，处理交互

```typescript
// 客户端组件 - 需要'use client'声明
'use client'
import { useState } from 'react'

export default function PostForm() {
  const [title, setTitle] = useState('')
  return <input value={title} onChange={(e) => setTitle(e.target.value)} />
}
```

#### 4. 多种渲染模式

- **SSG**：静态生成，构建时生成HTML，性能最佳
- **SSR**：服务端渲染，请求时生成HTML，SEO友好
- **ISR**：增量静态再生，平衡性能和更新

#### 5. 类型安全

前后端共享TypeScript类型：

```typescript
// 共享类型定义
interface Post {
  id: string;
  title: string;
  content: string;
}

// 前端使用
const [posts, setPosts] = useState<Post[]>([]);

// API路由使用
export async function GET(): Promise<Response> {
  const posts: Post[] = await prisma.post.findMany();
  return Response.json(posts);
}
```

### 为什么选择Next.js？

1. **学习成本低**：基于React，前端同学容易上手
2. **开发效率高**：约定大于配置，减少样板代码
3. **性能优秀**：自动代码分割、图片优化、缓存策略
4. **类型安全**：前后端统一的TypeScript支持
5. **部署简单**：支持Vercel一键部署

### 学习目标

通过本章，你应该理解：

- 传统前后端分离开发的痛点
- Next.js如何用一个项目解决所有问题
- 文件系统路由和特殊文件约定
- Server Components和Client Components的区别
- Next.js的核心优势和选择理由

在下一章，我们将了解具体的项目结构，看看文件是如何组织的。

---

## 第4章：项目结构全解析

### 项目目录结构

Spring Lament Blog采用Next.js 15的App Router架构，目录结构如下：

```
Spring-Lament-Blog/
├── src/                          # 源代码目录
│   ├── app/                      # Next.js App Router
│   │   ├── admin/                # 管理后台页面
│   │   │   ├── layout.tsx        # 后台布局
│   │   │   ├── page.tsx          # 后台首页
│   │   │   └── posts/            # 文章管理
│   │   ├── api/                  # API路由
│   │   │   ├── admin/            # 后台API
│   │   │   ├── auth/             # 认证API
│   │   │   └── posts/            # 公开API
│   │   ├── posts/                # 文章展示页面
│   │   │   └── [slug]/           # 文章详情
│   │   ├── login/                # 登录页面
│   │   ├── layout.tsx            # 根布局
│   │   └── page.tsx              # 首页
│   ├── components/               # React组件
│   │   ├── admin/                # 后台组件
│   │   ├── ui/                   # shadcn/ui组件
│   │   └── layout/               # 布局组件
│   ├── lib/                      # 工具函数库
│   │   ├── auth.ts               # NextAuth配置
│   │   ├── prisma.ts             # Prisma客户端
│   │   └── utils.ts              # 通用工具
│   └── types/                    # TypeScript类型
├── prisma/                       # 数据库相关
│   ├── schema.prisma             # 数据模型定义
│   ├── seed.ts                   # 初始数据
│   └── dev.db                    # SQLite数据库
├── public/                       # 静态资源
├── package.json                  # 项目配置
├── next.config.js                # Next.js配置
├── tailwind.config.ts            # Tailwind配置
└── tsconfig.json                 # TypeScript配置
```

### 核心目录详解

#### 1. src/app/ - 页面和API路由

**页面路由示例：**

```typescript
// app/page.tsx - 首页
export default function HomePage() {
  return <div>博客首页</div>
}

// app/posts/[slug]/page.tsx - 文章详情页
interface Props {
  params: { slug: string }
}

export default async function PostPage({ params }: Props) {
  return <div>文章: {params.slug}</div>
}
```

**API路由示例：**

```typescript
// app/api/posts/route.ts - 文章API
export async function GET() {
  return Response.json({ message: "获取文章列表" });
}

export async function POST(request: Request) {
  const data = await request.json();
  return Response.json({ message: "创建文章", data });
}
```

### 文件命名约定

| 文件名        | 作用     | 示例                                     |
| ------------- | -------- | ---------------------------------------- |
| `page.tsx`    | 页面组件 | `/app/posts/page.tsx` → `/posts`         |
| `layout.tsx`  | 布局组件 | `/app/layout.tsx` → 全局布局             |
| `route.ts`    | API端点  | `/app/api/posts/route.ts` → `/api/posts` |
| `loading.tsx` | 加载状态 | `/app/posts/loading.tsx` → 加载中...     |
| `error.tsx`   | 错误处理 | `/app/posts/error.tsx` → 错误页面        |

### 数据流转过程

理解数据在Next.js应用中的流转过程是全栈开发的关键。让我们通过一个具体例子来看看：

#### 用户访问文章详情页的完整流程

**1. 用户访问URL**

```
用户访问：/posts/nextjs-guide
```

**2. Next.js路由匹配**

```
app/posts/[slug]/page.tsx
```

**3. 服务端组件执行**

```typescript
// app/posts/[slug]/page.tsx
import { prisma } from '@/lib/prisma'

export default async function PostPage({ params }: { params: { slug: string } }) {
  // 服务端直接查询数据库
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: true, category: true }
  })

  return (
    <article>
      <h1>{post.title}</h1>
      <div>作者：{post.author.name}</div>
    </article>
  )
}
```

**4. 响应返回**

- 服务端渲染完成
- 返回完整HTML给浏览器
- 用户看到完整页面（SEO友好）

**核心优势：**

- **零API调用**：服务端组件直接访问数据库
- **首屏速度快**：服务端渲染，无需等待客户端请求
- **SEO友好**：搜索引擎可以直接抓取完整内容

### 学习目标

通过本章，你应该理解：

- Next.js项目的完整目录结构
- 各个目录和文件的作用
- 页面路由和API路由的组织方式
- 数据在Next.js应用中的流转过程
- 服务端组件的数据获取方式
- 组件库的层次结构
- 配置文件的作用

在下一章，我们将学习数据库和Prisma ORM，了解如何管理应用的数据。

---

## 第5章：数据库与Prisma ORM

### 什么是ORM？

**ORM(Object-Relational Mapping)**是对象关系映射，让我们可以用面向对象的方式操作数据库，而不需要写SQL语句。

### 传统SQL vs Prisma对比

#### 传统SQL方式

```sql
-- 创建用户
INSERT INTO users (name, email, password)
VALUES ('张三', 'zhang@example.com', 'hashed_password');

-- 查询用户
SELECT * FROM users WHERE email = 'zhang@example.com';
```

#### Prisma方式

```typescript
// 创建用户
await prisma.user.create({
  data: {
    name: "张三",
    email: "zhang@example.com",
    password: "hashed_password",
  },
});

// 查询用户
const user = await prisma.user.findUnique({
  where: { email: "zhang@example.com" },
});
```

### Prisma完整使用流程

**1. 安装Prisma**

```bash
npm install prisma @prisma/client
```

**2. 初始化Prisma**

```bash
npx prisma init
```

**3. 编写Schema**

编辑`prisma/schema.prisma`文件定义数据模型

**4. 生成Prisma Client**

```bash
npx prisma generate
```

**5. 推送Schema到数据库**

```bash
npx prisma db push  # 开发环境
npx prisma migrate dev  # 生产环境
```

### 博客数据模型设计

#### 核心实体关系

```
User (用户) 1:N Post (文章)
Post (文章) N:1 Category (分类)
Post (文章) N:M Tag (标签)
```

#### Schema定义

```prisma
// prisma/schema.prisma
// Prisma客户端生成器配置，指定生成JavaScript/TypeScript客户端
generator client {
  provider = "prisma-client-js"
}
// 数据库连接配置，指定数据库类型和连接URL
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
// 用户数据模型定义
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts    Post[]
  profile  Profile?

  @@map("users")
}

// 文章模型
model Post {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  authorId String
// @relation装饰器用于定义表之间的关联关系，指定外键字段和引用字段
  author   User   @relation(fields: [authorId], references: [id])

  categoryId String?
  category   Category? @relation(fields: [categoryId], references: [id])

  tags PostTag[]

  @@map("posts")
}




```

### 基础CRUD操作

#### 1. 创建数据

```typescript
// 创建用户
const user = await prisma.user.create({
  data: {
    name: "张三",
    email: "zhang@example.com",
    password: "hashed_password",
  },
});

// 创建文章（包含关联）
const post = await prisma.post.create({
  data: {
    title: "Next.js全栈开发指南",
    slug: "nextjs-fullstack-guide",
    content: "# 指南内容...",
    authorId: user.id,
    categoryId: category.id,
  },
});
```

#### 2. 查询数据

```typescript
// 查询所有文章
const posts = await prisma.post.findMany();

// 条件查询
const publishedPosts = await prisma.post.findMany({
  where: { published: true },
});

// 关联查询 - 一次性获取文章及其关联数据
const postsWithRelations = await prisma.post.findMany({
  include: {
    author: true,
    category: true,
    tags: { include: { tag: true } },
  },
});
```

#### 3. 更新数据

```typescript
// 更新文章
const updatedPost = await prisma.post.update({
  where: { id: postId },
  data: { title: "新标题" },
});
```

#### 4. 删除数据

```typescript
// 删除文章
await prisma.post.delete({
  where: { id: postId },
});
```

### 复杂查询示例

#### 分页查询

```typescript
const posts = await prisma.post.findMany({
  where: { published: true },
  include: {
    author: { select: { name: true } },
    category: true,
  },
  orderBy: { createdAt: "desc" },
  skip: (page - 1) * limit, // 跳过前面的记录数，实现分页
  take: limit, // 限制返回的记录数量
});
```

#### 按分类筛选

```typescript
const postsByCategory = await prisma.post.findMany({
  where: {
    published: true,
    category: { slug: "frontend" },
  },
});
```

### 数据库客户端配置

```typescript
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

### 学习目标

通过本章，你应该理解：

- ORM的概念和优势
- Prisma的完整使用流程
- 博客系统的数据模型设计
- 各种关联关系的实现
- 基本的CRUD操作和复杂查询

在下一章，我们将学习用户认证系统，保护应用的安全。

---

## 第6章：用户认证系统

### 为什么需要认证系统？

认证系统在现代Web应用中是必不可少的安全基础设施。无论是电商平台、社交媒体、在线银行还是博客系统，都需要认证系统来保护用户数据和业务逻辑。

#### 通用后端认证系统的核心价值：

**1. 身份验证(Authentication)**

- 确认用户身份：验证"你是谁"
- 防止未授权访问：只有合法用户才能登录系统
- 保护用户隐私：个人数据只对本人可见

**2. 权限控制(Authorization)**

- 角色管理：不同用户有不同权限级别
- 资源保护：敏感操作需要特定权限
- 业务隔离：确保用户只能访问自己的数据

**3. 安全审计**

- 操作记录：追踪谁在什么时候做了什么
- 异常检测：发现可疑登录或操作行为
- 合规要求：满足数据保护法规要求

**4. 用户体验**

- 个性化服务：根据用户身份提供定制化内容
- 状态保持：用户无需反复登录
- 跨设备同步：多设备间保持一致的用户状态

#### 在我们的博客系统中的具体应用：

- **普通用户**：只能查看文章，不能编辑
- **管理员**：可以管理文章、分类、标签
- **未登录用户**：只能访问公开内容

认证系统确保只有授权用户才能访问受保护的资源。

### NextAuth.js简介

NextAuth.js是Next.js生态中最流行的认证解决方案，支持多种认证方式：

- **Credentials Provider**：用户名密码登录
- **OAuth Providers**：Google、GitHub等第三方登录
- **JWT Sessions**：JWT令牌管理

### 认证配置

#### 基础配置 (lib/auth.ts)

```typescript
// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};
```

#### 密码加密

```typescript
// 注册时加密密码
const hashedPassword = await bcrypt.hash(password, 10);

// 登录时验证密码
const isPasswordValid = await bcrypt.compare(password, user.password);
```

### Middleware路由保护

#### 路由保护 (middleware.ts)

Next.js的Middleware可以在请求到达页面前进行拦截和验证：

```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ req, token }) {
      // 检查是否访问后台路由
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "ADMIN";
      }
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
```

**工作原理：**

- 用户访问`/admin/*`路由时
- Middleware检查是否有有效的session
- 检查用户角色是否为ADMIN
- 如果验证失败，重定向到登录页

### 获取用户信息

#### 在服务端组件中

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const session = await getServerSession(authOptions);
console.log(session?.user); // { id, email, name, role }
```

#### 在客户端组件中

```typescript
"use client";
import { useSession } from "next-auth/react";

const { data: session, status } = useSession();
if (status === "authenticated") {
  console.log(session.user);
}
```

### 实际应用场景

#### 保护API路由

```typescript
// app/api/admin/posts/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return Response.json({ error: "未授权" }, { status: 401 });
  }

  // 继续处理请求...
}
```

### 学习目标

通过本章，你应该理解：

- 认证系统的必要性和工作原理
- NextAuth.js的配置和使用
- 密码加密和验证流程
- Middleware如何保护路由
- 如何在服务端和客户端获取用户信息
- 如何保护API路由和实现权限控制

在下一章，我们将学习如何将应用部署到生产环境。

---

---

## 第7章：部署与运维

### 环境概念

在实际开发中，我们通常需要区分不同的运行环境：

#### 开发环境 vs 生产环境

| 环境类型     | 位置       | 端口 | 数据库            | 配置文件        | 特点               |
| ------------ | ---------- | ---- | ----------------- | --------------- | ------------------ |
| **开发环境** | 本地电脑   | 7777 | SQLite (dev.db)   | .env.local      | 热更新，调试模式   |
| **生产环境** | 远程服务器 | 3000 | SQLite/PostgreSQL | .env.production | 优化构建，稳定运行 |

### 数据库选择

| 数据库         | 优势                     | 劣势         | 适用场景           |
| -------------- | ------------------------ | ------------ | ------------------ |
| **SQLite**     | 无需安装，轻量级，零配置 | 并发性能较弱 | 个人博客，小型项目 |
| **PostgreSQL** | 性能强，功能完善，高并发 | 需要独立部署 | 中大型应用         |
| **MySQL**      | 生态好，成熟稳定         | 配置相对复杂 | 通用场景           |

**项目选择**: SQLite（开发和生产都可以用，适合博客系统）

### 部署方式对比

#### 1. Vercel (最简单)

**优点:**

- 一键部署，自动CI/CD
- 全球CDN，免费额度
- 与Next.js完美集成

**缺点:**

- 不支持SQLite文件存储
- Serverless限制
- 需要外部数据库

#### 2. 宝塔+PM2 (推荐)

**优点:**

- 完全控制，支持SQLite
- 无Serverless限制
- 稳定可靠，易于管理

**缺点:**

- 需要VPS服务器
- 配置稍复杂

### 宝塔+PM2部署实战

#### 步骤1: 服务器准备

```bash
# 1. 购买VPS (阿里云/腾讯云)
# 2. 安装宝塔面板
wget -O install.sh http://download.bt.cn/install/install-ubuntu_6.0.sh
sudo bash install.sh

# 3. 在宝塔面板安装 Node.js 18+
```

#### 步骤2: 上传代码

```bash
# 在服务器上
cd /www/wwwroot
git clone https://github.com/your-repo/Spring-Lament-Blog.git
cd Spring-Lament-Blog
npm install
```

#### 步骤3: 配置环境变量

```bash
# .env.production
DATABASE_URL="file:./prisma/prod.db"
NEXTAUTH_SECRET="your-production-secret-min-32-chars"
NEXTAUTH_URL="http://your-domain.com"
NODE_ENV="production"
```

#### 步骤4: 初始化数据库

```bash
npm run db:push
npm run db:seed
```

#### 步骤5: 构建项目

```bash
npm run build
```

#### 步骤6: PM2配置

创建`ecosystem.config.js`：

```javascript
module.exports = {
  apps: [
    {
      name: "spring-lament-blog",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      env: {
        NODE_ENV: "production",
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
    },
  ],
};
```

启动应用：

```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 步骤7: Nginx配置

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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 常见问题解决

#### 1. 端口占用

```bash
# 检查端口占用
lsof -i :3000
# 杀死进程
kill -9 PID
```

#### 2. 权限问题

```bash
# 设置文件权限
chmod -R 755 /www/wwwroot/Spring-Lament-Blog
chown -R www:www /www/wwwroot/Spring-Lament-Blog
```

#### 3. 数据库权限

```bash
# SQLite文件权限
chmod 664 prisma/prod.db
chown www:www prisma/prod.db
```

### 运维管理

#### PM2常用命令

```bash
pm2 list                # 查看进程
pm2 restart app-name    # 重启应用
pm2 stop app-name       # 停止应用
pm2 logs app-name       # 查看日志
pm2 monit              # 监控面板
```

#### 日志管理

```bash
# 查看应用日志
pm2 logs spring-lament-blog

# Nginx日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 学习目标

通过本章，你应该理解：

- 开发环境和生产环境的区别
- 不同部署方式的优劣
- 宝塔+PM2的完整部署流程
- GitHub Actions自动化部署
- 常见问题的排查方法
- 基本的运维管理操作

在下一章，我们将学习性能优化技术，提升应用的运行效率。

---

## 第8章：性能优化

### Next.js性能优化

#### 1. 渲染模式优化

**SSG (Static Site Generation)** - 静态站点生成：
在构建时预先生成HTML页面，用户访问时直接返回静态文件，速度极快。

**ISR (Incremental Static Regeneration)** - 增量静态再生：
在SSG基础上，允许页面在运行时按需更新，既保证了性能又保证了内容的时效性。

**三种渲染模式对比：**

| 渲染模式 | 生成时机      | 优势               | 劣势                 | 适用场景                 |
| -------- | ------------- | ------------------ | -------------------- | ------------------------ |
| **SSG**  | 构建时        | 性能最佳，SEO友好  | 内容更新需要重新构建 | 静态内容，如文档、博客   |
| **ISR**  | 构建时+运行时 | 性能好，内容可更新 | 配置相对复杂         | 半静态内容，如新闻、商品 |
| **SSR**  | 请求时        | 内容实时，交互性好 | 服务器压力大         | 动态内容，如用户面板     |

**实际应用：**

```typescript
// app/posts/[slug]/page.tsx
// 使用SSG生成静态页面
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  });

  return posts.map((post) => ({ slug: post.slug }));
}

// 使用ISR定期更新
export const revalidate = 3600; // 每小时重新生成
```

#### 2. 图片优化

```typescript
import Image from 'next/image'

// 优化前
<img src="/blog-cover.jpg" alt="封面" />

// 优化后
<Image
  src="/blog-cover.jpg"
  alt="封面"
  width={800}
  height={400}
  priority={isFirstPost}  // 首屏图片优先加载
  placeholder="blur"      // 模糊占位符
  sizes="(max-width: 768px) 100vw, 50vw"  // 响应式尺寸
/>
```

#### 3. 代码分割

```typescript
// 动态导入，减少首屏加载时间
import dynamic from 'next/dynamic'

const AdminPanel = dynamic(() => import('@/components/AdminPanel'), {
  loading: () => <div>加载中...</div>,
  ssr: false, // 仅客户端渲染
})

// 路由级别的代码分割（自动）
// app/admin/page.tsx 会自动分割为独立的chunk
```

### 数据库查询优化

#### 1. 只查询需要的字段

```typescript
// ❌ 不好 - 查询所有字段
const users = await prisma.user.findMany();

// ✅ 好 - 只查询需要的字段
const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true },
});
```

#### 2. 使用数据库索引

```prisma
model Post {
  slug String @unique  // 自动创建索引
  published Boolean
  createdAt DateTime

  @@index([published, createdAt])  // 复合索引
  @@index([authorId])              // 外键索引
}
```

### 学习目标

通过本章，你应该理解：

- Next.js的渲染模式优化策略
- 图片和代码分割的最佳实践
- 数据库查询优化技术

恭喜你！通过前面8章的学习，你已经掌握了Next.js全栈开发的核心技能，可以独立构建现代化的Web应用了。

---

## 总结

通过这份指南,你已经学习了：

✅ 后端的本质和Node.js基础
✅ Next.js 15全栈开发
✅ 项目结构和文件组织
✅ Prisma数据库操作
✅ NextAuth认证系统
✅ 生产环境部署
✅ 性能优化技术

**恭喜你！你已经具备了全栈开发的基础能力。**

接下来,建议你：

1. 动手实践,搭建自己的项目
2. 阅读Next.js和Prisma官方文档
3. 参与开源项目
4. 持续学习新技术

记住:**实践是最好的老师,动手写代码才能真正掌握全栈开发！**

---

## 参考资源

- [Next.js官方文档](https://nextjs.org/docs)
- [Prisma官方文档](https://www.prisma.io/docs)
- [NextAuth.js文档](https://next-auth.js.org/)
- [shadcn/ui组件库](https://ui.shadcn.com/)
- [Spring Lament Blog源码](https://github.com/flawlessv/Spring-Lament-Blog)

**祝你全栈开发之路顺利！** 🚀
