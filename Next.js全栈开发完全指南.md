# Next.js全栈开发完全指南

> 基于Spring Lament Blog项目的实战经验，帮助前端同学快速掌握全栈开发技能

## 前言

最近部门在大力推全栈开发，作为一名前端开发者，想要入门全栈开发，那么这份指南就是为你准备的。我们将通过一个真实的博客项目(Spring Lament Blog)，从零开始学习如何使用Next.js 15构建现代化的全栈应用以及后端、数据库、部署等相关知识简介。

## 文章大纲

**学习路径：先概念 → 再技术 → 后实践**

1. **概念理解篇**（第1-3章）：后端本质、Node.js、Next.js框架
2. **技术深入篇**（第4-7章）：App Router、数据流转、Prisma ORM、数据模型
3. **项目实战篇**（第8-10章）：项目结构、认证系统、CRUD操作
4. **部署运维篇**（第11-12章）：部署实战、性能优化

---

## 第1章：后端的本质

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

## 第3章：全栈框架Next.js

### 传统开发方式的痛点

在传统的Web开发中，我们需要维护多个独立的项目：
TODO: 这个目录可以更详细一点，例如frontend下包含components、pages等、backend下包含service、controll等等。。

```
项目结构：
├── frontend/          # React前端项目
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/           # Node.js后端项目
│   ├── src/
│   ├── package.json
│   └── ...
└── database/          # 数据库
    └── schema.sql
```

这种方式的缺点：

- **开发复杂**：需要同时维护多个项目
- **部署复杂**：需要分别部署前端和后端
- **协调困难**：前后端接口需要协商
- **类型安全**：前后端数据类型不一致

### Next.js的解决方案

Next.js是Vercel开发的React全栈框架，解决了传统开发的问题：

**一个项目，前后端统一：**

```
项目结构：
├── app/               # 页面和API路由
│   ├── page.tsx      # 前端页面
│   ├── api/          # 后端API
│   └── layout.tsx    # 布局组件
├── components/       # React组件
├── lib/              # 工具函数
└── prisma/          # 数据库
```

### Next.js的核心优势

TODO:也需要简单介绍下next的打包方式turbepack的优点

#### 1. 文件系统路由

Next.js使用文件系统作为路由系统，非常直观：

```
app/
├── page.tsx          → /
├── about/page.tsx   → /about
├── posts/
│   ├── page.tsx     → /posts
│   └── [slug]/
│       └── page.tsx → /posts/hello-world
└── api/
    └── posts/
        └── route.ts → /api/posts
```

#### 2. 服务端渲染(SSR)

Next.js支持多种渲染模式：

- **SSR**：服务端渲染，SEO友好
- **SSG**：静态生成，性能最佳
- **ISR**：增量静态再生，平衡性能和更新

#### 3. API路由

在Next.js中，API路由就是普通的文件：

```typescript
// app/api/posts/route.ts
export async function GET() {
  const posts = await prisma.post.findMany();
  return Response.json(posts);
}

export async function POST(request: Request) {
  const data = await request.json();
  const post = await prisma.post.create({ data });
  return Response.json(post);
}
```

#### 4. 类型安全

Next.js + TypeScript提供端到端的类型安全：

```typescript
// 前端组件
interface Post {
  id: string;
  title: string;
  content: string;
}

// API路由
export async function GET(): Promise<Response<Post[]>> {
  // 类型安全的数据查询
}
```

### 为什么选择Next.js？

1. **学习成本低**：基于React，前端同学容易上手
2. **开发效率高**：约定大于配置，减少样板代码
3. **性能优秀**：自动代码分割、图片优化、缓存策略
4. **生态完善**：丰富的插件和工具链
5. **部署简单**：支持Vercel一键部署

### 学习目标

通过本章，你应该理解：

- 传统前后端分离开发的痛点
- Next.js如何解决这些问题
- Next.js的核心优势：文件路由、SSR、API路由、类型安全
- 为什么Next.js是前端同学学习全栈的最佳选择

在下一章，我们将深入学习Next.js 15的App Router，这是Next.js最新的路由系统。

---

## 第4章：Next.js 15 App Router核心

### 版本说明

本指南基于**Next.js 15.0.0**版本，这是Next.js的最新稳定版本，带来了许多性能优化和新特性。

### "约定大于配置"的设计哲学

Next.js遵循"约定大于配置"的设计理念，通过文件命名和目录结构来定义应用的行为，而不是通过复杂的配置文件。

### 核心文件约定

在Next.js 15的App Router中，每个文件都有特定的作用：

#### 1. page.tsx - 页面组件

```typescript
// app/posts/page.tsx
export default function PostsPage() {
  return <div>文章列表页面</div>
}
```

这个文件自动成为`/posts`路由的页面组件。

#### 2. route.ts - API路由

```typescript
// app/api/posts/route.ts
export async function GET() {
  return Response.json({ message: "获取文章列表" });
}

export async function POST(request: Request) {
  const data = await request.json();
  return Response.json({ message: "创建文章", data });
}
```

这个文件自动成为`/api/posts`的API端点。

#### 3. layout.tsx - 布局组件

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
```

布局组件会包裹所有子页面。

#### 4. loading.tsx - 加载状态

```typescript
// app/posts/loading.tsx
export default function Loading() {
  return <div>加载中...</div>
}
```

当页面加载时自动显示。

#### 5. error.tsx - 错误处理

```typescript
// app/posts/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>出错了!</h2>
      <button onClick={() => reset()}>重试</button>
    </div>
  )
}
```

当页面出错时自动显示。

### 文件系统路由规则

Next.js 15使用文件系统来定义路由，非常直观：

```
app/
├── page.tsx                    → /
├── about/
│   └── page.tsx               → /about
├── posts/
│   ├── page.tsx               → /posts
│   ├── loading.tsx            → 加载状态
│   ├── error.tsx              → 错误处理
│   └── [slug]/
│       ├── page.tsx           → /posts/hello-world
│       └── not-found.tsx      → 404页面
└── api/
    ├── posts/
    │   └── route.ts           → /api/posts
    └── posts/
        └── [id]/
            └── route.ts       → /api/posts/123
```

### Server Components vs Client Components

Next.js 15默认使用Server Components，但也可以使用Client Components：

#### Server Components（默认）

```typescript
// app/posts/page.tsx - 服务端组件
import { prisma } from '@/lib/prisma'

export default async function PostsPage() {
  // 在服务端执行，可以直接访问数据库
  const posts = await prisma.post.findMany()

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

#### Client Components

```typescript
// app/components/PostForm.tsx - 客户端组件
'use client'

import { useState } from 'react'

export default function PostForm() {
  const [title, setTitle] = useState('')

  const handleSubmit = () => {
    // 客户端交互逻辑
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </form>
  )
}
```

### 动态路由

Next.js支持动态路由，使用方括号语法：

```typescript
// app/posts/[slug]/page.tsx
interface Props {
  params: { slug: string }
}

export default async function PostPage({ params }: Props) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug }
  })

  return <div>{post?.title}</div>
}
```

### 学习目标

通过本章，你应该理解：

- Next.js 15的App Router核心概念
- 各种文件类型的作用：page.tsx、route.ts、layout.tsx等
- 文件系统路由的规则和约定
- Server Components和Client Components的区别
- 动态路由的使用方法

在下一章，我们将通过博客项目的实际代码，学习完整的数据流转过程。

---

## 第5章：博客项目数据流转

### 项目概述

Spring Lament Blog是一个基于Next.js 15的现代化博客系统，包含：

- **前台功能**：文章展示、分类浏览、标签筛选
- **后台管理**：文章CRUD、用户管理、数据统计
- **技术栈**：Next.js 15 + Prisma + NextAuth + SQLite

### 完整的数据流转过程

让我们通过一个具体的例子，看看数据是如何在系统中流转的：

#### 场景：用户访问文章详情页

**1. 用户访问URL**

```
用户访问：/posts/hello-world
```

**2. 路由匹配**

```
app/posts/[slug]/page.tsx
```

**3. 服务端组件执行**

```typescript
// app/posts/[slug]/page.tsx
import { prisma } from '@/lib/prisma'

interface Props {
  params: { slug: string }
}

export default async function PostPage({ params }: Props) {
  // 1. 从数据库查询文章数据
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: { select: { name: true, avatar: true } },
      category: true,
      tags: true
    }
  })

  if (!post) {
    return <div>文章不存在</div>
  }

  // 2. 渲染页面
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
      <div>作者：{post.author.name}</div>
      <div>分类：{post.category.name}</div>
    </article>
  )
}
```

**4. 数据库查询**

```typescript
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();
```

**5. 返回渲染结果**

- 服务端渲染完成
- 返回HTML给浏览器
- 浏览器显示页面

### API路由的数据流转

#### 场景：创建新文章

**1. 前端表单提交**

```typescript
// app/admin/posts/new/page.tsx
'use client'

export default function NewPostPage() {
  const handleSubmit = async (data: FormData) => {
    const response = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      router.push('/admin/posts')
    }
  }

  return <PostForm onSubmit={handleSubmit} />
}
```

**2. API路由处理**

```typescript
// app/api/admin/posts/route.ts
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  // 1. 验证用户身份
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "未授权" }, { status: 401 });
  }

  // 2. 解析请求数据
  const data = await request.json();

  // 3. 数据验证
  if (!data.title || !data.content) {
    return Response.json({ error: "标题和内容不能为空" }, { status: 400 });
  }

  // 4. 保存到数据库
  const post = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      slug: generateSlug(data.title),
      authorId: session.user.id,
    },
  });

  // 5. 返回结果
  return Response.json({ post });
}
```

**3. 数据库操作**

```typescript
// Prisma自动生成的SQL
INSERT INTO Post (title, content, slug, authorId)
VALUES (?, ?, ?, ?)
```

### 前后端在同一个项目的好处

#### 1. 类型安全

```typescript
// 共享类型定义
interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  authorId: string;
}

// 前端使用
const [posts, setPosts] = useState<Post[]>([]);

// API路由使用
export async function GET(): Promise<Response<Post[]>> {
  const posts = await prisma.post.findMany();
  return Response.json(posts);
}
```

#### 2. 代码复用

```typescript
// lib/utils.ts - 共享工具函数
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// 前端使用
const slug = generateSlug(formData.title);

// 后端使用
const post = await prisma.post.create({
  data: { slug: generateSlug(data.title) },
});
```

#### 3. 统一部署

```bash
# 一个命令部署整个应用
npm run build
npm start
```

### 学习目标

通过本章，你应该理解：

- 完整的数据流转过程：用户请求 → 路由匹配 → 服务端组件 → 数据库查询 → 渲染返回
- API路由的处理流程：请求验证 → 数据解析 → 业务逻辑 → 数据库操作 → 响应返回
- 前后端统一开发的优势：类型安全、代码复用、统一部署
- 如何在Next.js中实现完整的数据流转

在下一章，我们将深入学习Prisma ORM，这是操作数据库的核心工具。

---

## 第6章：Prisma ORM

### 什么是ORM？

**ORM(Object-Relational Mapping)**是对象关系映射，是一种编程技术，用于在面向对象编程语言中管理关系型数据库。

简单来说，ORM让我们可以用面向对象的方式操作数据库，而不需要写SQL语句。

### 传统SQL vs Prisma对比

#### 传统SQL方式

```sql
-- 创建用户
INSERT INTO users (name, email, password)
VALUES ('张三', 'zhang@example.com', 'hashed_password');

-- 查询用户
SELECT * FROM users WHERE email = 'zhang@example.com';

-- 更新用户
UPDATE users SET name = '李四' WHERE id = 1;

-- 删除用户
DELETE FROM users WHERE id = 1;
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

// 更新用户
await prisma.user.update({
  where: { id: 1 },
  data: { name: "李四" },
});

// 删除用户
await prisma.user.delete({
  where: { id: 1 },
});
```

### Schema定义详解

Prisma使用`schema.prisma`文件来定义数据库结构：

```prisma
// prisma/schema.prisma
//TODO: 写上注释
generator client {
  provider = "prisma-client-js"
}
//TODO: 写上注释
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
//TODO: 写上注释
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
//TODO: 写上注释 @relation是啥意思？

model Post {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  authorId String
  author   User   @relation(fields: [authorId], references: [id])

  categoryId String?
  category   Category? @relation(fields: [categoryId], references: [id])

  tags PostTag[]

  @@map("posts")
}

model Category {
  id          String @id @default(cuid())
  name        String @unique
  slug        String @unique
  description String?

  posts Post[]

  @@map("categories")
}

model Tag {
  id          String @id @default(cuid())
  name        String @unique
  slug        String @unique
  color       String?

  posts PostTag[]

  @@map("tags")
}

model PostTag {
  postId String
  post   Post @relation(fields: [postId], references: [id])
  tagId  String
  tag    Tag  @relation(fields: [tagId], references: [id])

  @@id([postId, tagId])
  @@map("post_tags")
}

model Profile {
  id     String @id @default(cuid())
  bio    String?
  avatar String?

  userId String @unique
  user   User   @relation(fields: [userId], references: [id])

  @@map("profiles")
}

enum Role {
  USER
  ADMIN
}
```

### 关键概念解析

#### 1. 字段类型

```prisma
model User {
  id        String   @id @default(cuid())    // 主键，自动生成ID
  email     String   @unique                 // 唯一字段
  name      String?                          // 可选字段
  password  String                           // 必填字段
  role      Role     @default(USER)          // 枚举类型，默认值
  createdAt DateTime @default(now())          // 时间戳，默认当前时间
  updatedAt DateTime @updatedAt              // 更新时间，自动维护
}
```

#### 2. 表关联关系

**一对多关系 (One-to-Many)**

```prisma
model User {
  id    String @id @default(cuid())
  posts Post[]  // 一个用户可以有多个文章
}

model Post {
  id       String @id @default(cuid())
  authorId String
  author   User @relation(fields: [authorId], references: [id])
}
```

**一对一关系 (One-to-One)**

```prisma
model User {
  id      String  @id @default(cuid())
  profile Profile?  // 一个用户最多有一个资料
}

model Profile {
  id     String @id @default(cuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id])
}
```

**多对多关系 (Many-to-Many)**

```prisma
model Post {
  id   String @id @default(cuid())
  tags PostTag[]  // 通过中间表实现多对多
}

model Tag {
  id    String @id @default(cuid())
  posts PostTag[]
}

model PostTag {
  postId String
  post   Post @relation(fields: [postId], references: [id])
  tagId  String
  tag    Tag  @relation(fields: [tagId], references: [id])

  @@id([postId, tagId])  // 复合主键
}
```

### 基础查询操作

#### 1. 创建数据 (Create)

```typescript
// 创建单个记录
const user = await prisma.user.create({
  data: {
    name: "张三",
    email: "zhang@example.com",
    password: "hashed_password",
  },
});

// 创建关联数据
const post = await prisma.post.create({
  data: {
    title: "我的第一篇文章",
    content: "文章内容...",
    slug: "my-first-post",
    author: {
      connect: { id: user.id },
    },
  },
});
```

#### 2. 查询数据 (Read)

```typescript
// 查询所有记录
const users = await prisma.user.findMany();

// 查询单个记录
const user = await prisma.user.findUnique({
  where: { email: "zhang@example.com" },
});

// 条件查询
const posts = await prisma.post.findMany({
  where: {
    published: true,
    author: {
      name: "张三",
    },
  },
});

// 关联查询 TODO: 这个查出来跟普通的查询有啥区别，可以举个例子
const postsWithAuthor = await prisma.post.findMany({
  include: {
    author: true,
    category: true,
    tags: true,
  },
});
```

#### 3. 更新数据 (Update)

```typescript
// 更新单个记录
const updatedUser = await prisma.user.update({
  where: { id: user.id },
  data: { name: "李四" },
});

// 批量更新
await prisma.post.updateMany({
  where: { published: false },
  data: { published: true },
});
```

#### 4. 删除数据 (Delete)

```typescript
// 删除单个记录
await prisma.user.delete({
  where: { id: user.id },
});

// 批量删除
await prisma.post.deleteMany({
  where: { published: false },
});
```

### Migration迁移

当Schema发生变化时，需要运行迁移来更新数据库：

```bash
# 生成迁移文件
npx prisma migrate dev --name add-user-role

# 应用迁移
npx prisma db push

# 生成Prisma Client
npx prisma generate
```

TODO: 需要补充Prisma的使用方式，例如先生成Prisma Client，然后再push等等，并解释每一步都是干嘛的

### 学习目标

通过本章，你应该理解：

- ORM的概念和优势
- Prisma Schema的定义方法
- 各种字段类型和约束
- 表关联关系的设计
- 基本的CRUD操作
- Migration迁移的作用

在下一章，我们将深入分析博客项目的数据模型，学习如何设计复杂的数据结构。

---

## 第7章：博客数据模型解析

### 项目数据模型概览

Spring Lament Blog的数据模型包含以下核心实体：

```
User (用户)
├── Profile (个人资料) - 一对一
├── Post (文章) - 一对多
└── Role (角色) - 枚举

Post (文章)
├── User (作者) - 多对一
├── Category (分类) - 多对一 TODO: 这里的多对一只的 是啥意思？确定不是一对多吗
└── Tag (标签) - 多对多

Category (分类)
└── Post (文章) - 一对多

Tag (标签)
└── Post (文章) - 多对多
```

### 核心模型详解

#### 1. User模型 - 用户管理

```prisma
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
```

**字段说明：**

- `id`: 主键，使用cuid()生成唯一ID
- `email`: 邮箱，唯一约束，用于登录
- `name`: 姓名，可选字段
- `password`: 密码，存储加密后的哈希值
- `role`: 角色，枚举类型(USER/ADMIN)
- `createdAt/updatedAt`: 时间戳，自动维护

**实际应用：**

```typescript
// 创建管理员用户
const admin = await prisma.user.create({
  data: {
    email: "admin@blog.com",
    name: "博客管理员",
    password: await bcrypt.hash("password123", 10),
    role: "ADMIN",
  },
});

// 查询用户及其文章
const userWithPosts = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: "desc" },
    },
  },
});
```

#### 2. Post模型 - 文章管理

```prisma
model Post {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String
  excerpt     String?
  coverImage  String?
  published   Boolean  @default(false)
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  authorId String
  author   User @relation(fields: [authorId], references: [id])

  categoryId String?
  category   Category? @relation(fields: [categoryId], references: [id])

  tags PostTag[]

  @@map("posts")
}
```

**字段说明：**

- `title`: 文章标题
- `slug`: URL友好的标识符，唯一约束
- `content`: 文章内容(Markdown格式)
- `excerpt`: 文章摘要，可选
- `coverImage`: 封面图片URL，可选
- `published`: 发布状态，默认草稿
- `publishedAt`: 发布时间，可选

**实际应用：**

```typescript
// 创建文章
const post = await prisma.post.create({
  data: {
    title: "Next.js全栈开发指南",
    slug: "nextjs-fullstack-guide",
    content: "# 指南内容...",
    excerpt: "学习Next.js全栈开发",
    authorId: user.id,
    categoryId: category.id,
    tags: {
      create: [
        { tag: { connect: { id: tag1.id } } },
        { tag: { connect: { id: tag2.id } } },
      ],
    },
  },
});

// 查询文章详情(包含所有关联数据)
const postDetail = await prisma.post.findUnique({
  where: { slug: "nextjs-fullstack-guide" },
  include: {
    author: { select: { name: true, avatar: true } },
    category: true,
    tags: { include: { tag: true } },
  },
});
```

#### 3. Category模型 - 分类管理

```prisma
model Category {
  id          String @id @default(cuid())
  name        String @unique
  slug        String @unique
  description String?

  posts Post[]

  @@map("categories")
}
```

**实际应用：**

```typescript
// 创建分类
const category = await prisma.category.create({
  data: {
    name: "前端技术",
    slug: "frontend",
    description: "前端开发相关文章",
  },
});

// 查询分类及其文章数量
const categoriesWithCount = await prisma.category.findMany({
  include: {
    _count: {
      select: { posts: true },
    },
  },
});
```

#### 4. Tag模型 - 标签管理

```prisma
model Tag {
  id          String @id @default(cuid())
  name        String @unique
  slug        String @unique
  color       String?

  posts PostTag[]

  @@map("tags")
}
```

**实际应用：**

```typescript
// 创建标签
const tag = await prisma.tag.create({
  data: {
    name: "Next.js",
    slug: "nextjs",
    color: "#000000",
  },
});

// 查询热门标签
const popularTags = await prisma.tag.findMany({
  include: {
    _count: {
      select: { posts: true },
    },
  },
  orderBy: {
    posts: { _count: "desc" },
  },
  take: 10,
});
```

#### 5. PostTag模型 - 文章标签关联

```prisma
model PostTag {
  postId String
  post   Post @relation(fields: [postId], references: [id])
  tagId  String
  tag    Tag  @relation(fields: [tagId], references: [id])

  @@id([postId, tagId])
  @@map("post_tags")
}
```

**实际应用：**

```typescript
// 为文章添加标签
await prisma.postTag.create({
  data: {
    postId: post.id,
    tagId: tag.id,
  },
});

// 查询文章的所有标签
const postWithTags = await prisma.post.findUnique({
  where: { id: postId },
  include: {
    tags: {
      include: { tag: true },
    },
  },
});
```

### 复杂查询示例

#### 1. 分页查询文章列表

```typescript
const posts = await prisma.post.findMany({
  where: { published: true },
  include: {
    author: { select: { name: true, avatar: true } },
    category: true,
    tags: { include: { tag: true } },
  },
  orderBy: { publishedAt: "desc" },
  skip: (page - 1) * limit, //TODO:添加注释
  take: limit, //TODO:添加注释
});
```

#### 2. 按分类筛选文章

```typescript
const postsByCategory = await prisma.post.findMany({
  where: {
    published: true,
    category: {
      slug: "frontend",
    },
  },
  include: {
    author: true,
    category: true,
  },
});
```

#### 3. 标签云查询

```typescript
const tagCloud = await prisma.tag.findMany({
  include: {
    _count: {
      select: { posts: true },
    },
  },
  orderBy: {
    posts: { _count: "desc" },
  },
});
```

### 数据模型设计原则

#### 1. 规范化设计

- 避免数据冗余
- 使用外键建立关联
- 合理使用索引

#### 2. 性能考虑

- 主键使用cuid()而非自增ID
- 为常用查询字段添加索引
- 使用include控制查询深度

#### 3. 扩展性

- 预留可选字段
- 使用枚举类型
- 考虑未来需求

### 学习目标

通过本章，你应该理解：

- 博客项目的完整数据模型设计
- 各种关联关系的实际应用
- 复杂查询的实现方法
- 数据模型设计的最佳实践
- 如何在Prisma中实现复杂的业务逻辑

在下一章，我们将学习项目的整体结构，了解各个目录和文件的作用。

---

## 第8章：项目结构全解析

### 项目目录结构

Spring Lament Blog采用Next.js 15的App Router架构，目录结构如下：

```
Spring-Lament-Blog/
├── src/                          # 源代码目录
│   ├── app/                      # Next.js App Router
│   │   ├── admin/                # 管理后台页面
│   │   │   ├── layout.tsx        # 后台布局
│   │   │   ├── page.tsx          # 后台首页
│   │   │   ├── posts/            # 文章管理
│   │   │   │   ├── page.tsx      # 文章列表
│   │   │   │   ├── new/          # 新建文章
│   │   │   │   └── [id]/         # 编辑文章
│   │   │   ├── categories/       # 分类管理
│   │   │   ├── tags/             # 标签管理
│   │   │   └── profile/          # 个人资料
│   │   ├── api/                  # API路由
│   │   │   ├── admin/            # 后台API
│   │   │   │   ├── posts/        # 文章API
│   │   │   │   ├── categories/   # 分类API
│   │   │   │   └── tags/         # 标签API
│   │   │   ├── auth/             # 认证API
│   │   │   └── posts/            # 公开API
│   │   ├── posts/                # 文章展示页面
│   │   │   └── [slug]/           # 文章详情
│   │   ├── category/             # 分类页面
│   │   ├── login/                # 登录页面
│   │   ├── layout.tsx            # 根布局
│   │   └── page.tsx              # 首页
│   ├── components/               # React组件
│   │   ├── admin/                # 后台组件
│   │   │   ├── post-editor.tsx   # 文章编辑器
│   │   │   ├── unified-posts-table.tsx # 文章表格
│   │   │   └── ...
│   │   ├── ui/                   # shadcn/ui组件
│   │   │   ├── button.tsx        # 按钮组件
│   │   │   ├── form.tsx          # 表单组件
│   │   │   └── ...
│   │   ├── markdown/             # Markdown组件
│   │   │   ├── markdown-renderer.tsx
│   │   │   └── code-block.tsx
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
├── docs/                         # 项目文档
├── scripts/                      # 部署脚本
├── package.json                  # 项目配置
├── next.config.js                # Next.js配置
├── tailwind.config.ts            # Tailwind配置
└── tsconfig.json                 # TypeScript配置
```

### 核心目录详解

#### 1. src/app/ - Next.js App Router

**页面路由 (Pages)**

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
  const post = await prisma.post.findUnique({
    where: { slug: params.slug }
  })

  return <div>{post?.title}</div>
}
```

**API路由 (API Routes)**

```typescript
// app/api/posts/route.ts - 文章API
export async function GET() {
  const posts = await prisma.post.findMany();
  return Response.json(posts);
}

export async function POST(request: Request) {
  const data = await request.json();
  const post = await prisma.post.create({ data });
  return Response.json(post);
}
```

**布局组件 (Layouts)**

```typescript
// app/layout.tsx - 根布局
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}

// app/admin/layout.tsx - 后台布局
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="ml-64">
        {children}
      </main>
    </div>
  )
}
```

#### 2. src/components/ - React组件

**后台组件 (Admin Components)**

```typescript
// components/admin/post-editor.tsx
'use client'

export default function PostEditor({ post }: { post?: Post }) {
  const [title, setTitle] = useState(post?.title || '')
  const [content, setContent] = useState(post?.content || '')

  const handleSubmit = async () => {
    // 提交逻辑
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="文章标题"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="文章内容"
      />
      <button type="submit">保存</button>
    </form>
  )
}
```

**UI组件 (shadcn/ui)**

```typescript
// components/ui/button.tsx
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary"
  size?: "default" | "sm" | "lg"
}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium",
        {
          "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
          "bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === "destructive",
        },
        className
      )}
      {...props}
    />
  )
}
```

#### 3. src/lib/ - 工具函数库

**认证配置 (auth.ts)**

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

**Prisma客户端 (prisma.ts)**

```typescript
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

**通用工具 (utils.ts)**

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
```

#### 4. prisma/ - 数据库相关

**Schema定义 (schema.prisma)**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

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

// ... 其他模型定义
```

**初始数据 (seed.ts)**

```typescript
// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 创建管理员用户
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@blog.com" },
    update: {},
    create: {
      email: "admin@blog.com",
      name: "博客管理员",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // 创建默认分类
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "前端技术",
        slug: "frontend",
        description: "前端开发相关文章",
      },
    }),
    prisma.category.create({
      data: {
        name: "后端技术",
        slug: "backend",
        description: "后端开发相关文章",
      },
    }),
  ]);

  console.log("种子数据创建完成");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

### 配置文件

#### package.json

```json
{
  "name": "spring-lament-blog",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev -p 7777",
    "build": "next build",
    "start": "next start -p 3000",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "next": "15.0.0",
    "react": "^18",
    "@prisma/client": "6.16.1",
    "next-auth": "^4.24.11"
  }
}
```

#### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
};

module.exports = nextConfig;
```

### 学习目标

通过本章，你应该理解：

- Next.js 15项目的完整目录结构
- 各个目录和文件的作用
- 页面路由和API路由的组织方式
- 组件库的层次结构
- 工具函数库的设计
- 数据库相关的文件组织
- 配置文件的作用

在下一章，我们将学习NextAuth认证系统，这是保护后台功能的关键。

---

## 第9章：NextAuth认证系统

### 为什么需要认证系统？

在博客系统中，我们需要区分不同的用户角色：

- **普通用户**：只能查看文章，不能编辑
- **管理员**：可以管理文章、分类、标签
- **未登录用户**：只能访问公开内容

认证系统确保只有授权用户才能访问受保护的资源。

### NextAuth.js简介

NextAuth.js是Next.js生态中最流行的认证解决方案，支持多种认证方式：

- **Credentials Provider**：用户名密码登录
- **OAuth Providers**：Google、GitHub等第三方登录
- **Database Sessions**：数据库会话管理
- **JWT Sessions**：JWT令牌管理

### 认证配置详解

#### 1. 基础配置 (lib/auth.ts)

```typescript
// lib/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        return isPasswordValid ? user : null;
      },
    }),
  ],
  session: { strategy: "jwt" },
};
```

#### 2. 密码加密

```typescript
// 注册时加密密码
const hashedPassword = await bcrypt.hash(password, 10);

// 登录时验证密码
const isPasswordValid = await bcrypt.compare(password, user.password);
```

### Middleware全局拦截器

#### 1. 路由保护 (middleware.ts)

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
- 如果验证失败,重定向到登录页

#### 2. 获取当前用户信息

**在服务端组件中：**

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const session = await getServerSession(authOptions);
console.log(session?.user); // { id, email, name, role }
```

**在客户端组件中：**

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

通过本章,你应该理解：

- 认证系统的必要性和工作原理
- NextAuth.js的配置和使用
- 密码加密和验证流程
- Middleware如何保护路由
- 如何在服务端和客户端获取用户信息

---

## 第12章：部署知识体系

### 环境概念

#### 开发环境 vs 生产环境

**开发环境(Development):**

- 本地电脑
- 端口7777
- SQLite数据库(`dev.db`)
- `.env.local`配置文件
- 热更新,调试模式

**生产环境(Production):**

- 远程服务器
- 端口3000
- SQLite/PostgreSQL数据库(`prod.db`)
- `.env.production`配置文件
- 优化构建,稳定运行

### 数据库选择

| 数据库     | 优势            | 劣势         | 适用场景          |
| ---------- | --------------- | ------------ | ----------------- |
| SQLite     | 无需安装,轻量级 | 并发性能较弱 | 个人博客,小型项目 |
| PostgreSQL | 性能强,功能完善 | 需要独立部署 | 中大型应用        |
| MySQL      | 生态好,成熟稳定 | 配置相对复杂 | 通用场景          |

**项目当前使用**: SQLite(开发和生产都可以用)

### 部署方式对比

#### 1. Vercel (最简单)

**优点:**

- 一键部署
- 自动CI/CD
- 全球CDN
- 免费额度

**缺点:**

- 不支持SQLite
- Serverless限制
- 需要外部数据库

#### 2. 宝塔+PM2 (项目采用)

**优点:**

- 完全控制
- 支持SQLite
- 无Serverless限制
- 稳定可靠

**缺点:**

- 需要VPS
- 配置稍复杂
- 需要基础运维知识

#### 3. Docker (进阶)

**优点:**

- 环境隔离
- 易于迁移
- 可扩展性强

**缺点:**

- 学习成本高
- 资源占用多

### 宝塔+PM2部署实战

#### 步骤1: 服务器准备

1. 购买VPS(阿里云/腾讯云)
2. 安装宝塔面板
3. 安装Node.js 18+

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
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-password"
NODE_ENV="production"
```

#### 步骤4: 初始化数据库

```bash
npm run db:generate:prod
npm run db:push:prod
npm run db:seed:prod
```

#### 步骤5: 构建项目

```bash
npm run build
```

#### 步骤6: PM2启动

```bash
npm run pm2:start
```

PM2配置文件(`ecosystem.config.js`):

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
    },
  ],
};
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
    proxy_cache_bypass $http_upgrade;
  }
}
```

TODO: 补充github action一键发布部署链接

### 学习目标

通过本章,你应该理解：

- 开发环境和生产环境的区别
- 不同部署方式的优劣
- 宝塔+PM2的完整部署流程
- 常见问题的排查方法
- 如何进行代码更新和维护

---

## 第13章：性能优化

### Next.js性能优化

#### 1. SSG/ISR特性

TODO: SSG/ISR是啥都没介绍

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

项目中的`ImageWithFallback`组件:

```typescript
import Image from 'next/image'

<Image
  src={post.coverImage}
  alt={post.title}
  width={800}
  height={400}
  priority={isFirstPost}
  placeholder="blur"
/>
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

#### 2. 使用索引

```prisma
model Post {
  slug String @unique  // 自动创建索引

  @@index([published, createdAt])  // 复合索引
}
```

---

## 总结

通过这份指南,你已经学习了：

✅ 后端的本质和Node.js基础
✅ Next.js 15全栈开发
✅ Prisma数据库操作
✅ NextAuth认证系统
✅ 完整的CRUD实现
✅ shadcn/ui组件库
✅ 生产环境部署

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
