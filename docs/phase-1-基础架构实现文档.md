# Phase 1: 基础架构实现文档

本文档详细记录了 SpringLament 博客系统 Phase 1 基础架构的实现思路、步骤和配置细节。

## 目录

1. [项目初始化](#1-项目初始化)
2. [Next.js 应用搭建](#2-nextjs-应用搭建)
3. [开发工具配置](#3-开发工具配置)
4. [Git Hooks 配置](#4-git-hooks-配置)
5. [样式框架配置](#5-样式框架配置)
6. [数据库设计与配置](#6-数据库设计与配置)
7. [项目结构总览](#7-项目结构总览)
8. [问题解决记录](#8-问题解决记录)

## 1. 项目初始化

### 1.1 技术选型思考

**前端框架选择：Next.js 15**

- 使用 App Router 架构，支持服务端组件和客户端组件
- 内置 TypeScript 支持
- 优秀的 SEO 和性能优化能力
- 活跃的社区和生态

**数据库选择：SQLite (开发) / PostgreSQL (生产)**

- 开发阶段使用 SQLite，降低环境配置复杂度
- 生产环境可切换到 PostgreSQL，支持更高并发

**ORM 选择：Prisma**

- 类型安全的数据库访问
- 强大的迁移系统
- 直观的 Schema 定义
- 优秀的开发体验

### 1.2 项目结构规划

```
spring-lament-blog/
├── src/                    # 源码目录
│   ├── app/               # Next.js App Router 页面
│   ├── components/        # React 组件
│   ├── lib/              # 工具库和配置
│   └── types/            # TypeScript 类型定义
├── prisma/               # 数据库相关
├── public/               # 静态资源
├── docs/                 # 项目文档
└── 配置文件
```

## 2. Next.js 应用搭建

### 2.1 核心配置文件

**package.json 脚本设计**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "prepare": "husky",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio"
  }
}
```

**next.config.js 配置**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true, // 启用类型安全的路由
  },
};

module.exports = nextConfig;
```

### 2.2 TypeScript 配置

**tsconfig.json 关键配置**

```json
{
  "compilerOptions": {
    "strict": true, // 严格模式
    "target": "ES2017", // 支持 top-level await
    "module": "esnext", // ES 模块
    "moduleResolution": "bundler", // Next.js bundler 解析
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"] // 路径别名
    }
  }
}
```

### 2.3 应用结构

**根布局 (src/app/layout.tsx)**

- 设置 HTML 语言为中文 (`lang="zh-CN"`)
- 导入全局样式
- 设置页面元数据

**首页 (src/app/page.tsx)**

- 展示项目信息
- 预览四个主要分类
- 响应式设计

## 3. 开发工具配置

### 3.1 ESLint 配置

**思路：**

- 使用 Next.js 官方 ESLint 配置
- 添加 TypeScript 相关规则
- 设置适当的警告级别

**.eslintrc.json**

```json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

### 3.2 Prettier 配置

**格式化规则设计原则：**

- 保持代码一致性
- 适合团队协作
- 符合 JavaScript/TypeScript 社区标准

**.prettierrc**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2
}
```

## 4. Git Hooks 配置

### 4.1 Husky 安装与配置

**实现思路：**

- 在 `git commit` 前自动运行代码检查
- 确保提交的代码符合规范
- 提高代码质量

**安装步骤：**

```bash
npm install -D husky lint-staged
npx husky init
```

**配置 pre-commit hook (.husky/pre-commit):**

```bash
npx lint-staged
```

### 4.2 lint-staged 配置

**package.json 中的配置：**

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix", // 自动修复 ESLint 错误
      "prettier --write" // 自动格式化代码
    ],
    "*.{json,css,md}": [
      "prettier --write" // 格式化其他文件
    ]
  }
}
```

**配置原理：**

- 只对暂存区的文件运行检查
- 先运行 ESLint 修复，再运行 Prettier 格式化
- 避免全项目扫描，提高效率

## 5. 样式框架配置

### 5.1 Tailwind CSS 配置思路

**选择 Tailwind CSS 的原因：**

- 原子化 CSS，快速开发
- 优秀的响应式设计支持
- 内置设计系统
- 生产环境自动优化

**tailwind.config.ts 配置：**

```typescript
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
```

### 5.2 PostCSS 配置

**postcss.config.js：**

```javascript
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}, // 自动添加浏览器前缀
  },
};

module.exports = config;
```

### 5.3 全局样式设计

**src/app/globals.css 设计思路：**

- 引入 Tailwind 基础样式
- 定义 CSS 变量支持主题切换
- 设置基础字体和背景色

## 6. 数据库设计与配置

### 6.1 数据模型设计思路

**用户系统设计：**

- `User` 模型：基础用户信息
- `Profile` 模型：扩展用户资料
- `Role` 枚举：用户角色管理

**内容管理系统设计：**

- `Post` 模型：文章核心信息
- `Category` 模型：文章分类
- `Tag` 模型：文章标签
- `PostTag` 模型：多对多关系表

**关系设计原则：**

- 用户-文章：一对多 (1:N)
- 文章-分类：多对一 (N:1)
- 文章-标签：多对多 (N:M)

### 6.2 Prisma Schema 详细设计

```prisma
// 用户模型
model User {
  id        String   @id @default(cuid())
  username  String   @unique
  email     String?  @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // 关系
  profile Profile?
  posts   Post[]

  @@map("users")
}

// 用户角色枚举
enum Role {
  ADMIN
  USER
}

// 文章模型 - 核心字段设计
model Post {
  id          String      @id @default(cuid())
  title       String      // 文章标题
  slug        String      @unique  // URL 友好的标识符
  content     String      // Markdown 内容
  excerpt     String?     // 摘要
  coverImage  String?     // 封面图片
  published   Boolean     @default(false)  // 发布状态
  featured    Boolean     @default(false)  // 精选文章
  views       Int         @default(0)      // 浏览量
  readingTime Int?        // 预计阅读时间（分钟）
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  publishedAt DateTime?   // 发布时间

  // 关系
  authorId   String
  author     User       @relation(fields: [authorId], references: [id], onDelete: Cascade)
  categoryId String?
  category   Category?  @relation(fields: [categoryId], references: [id])
  tags       PostTag[]

  @@map("posts")
}
```

### 6.3 默认分类设计

**分类设计原则：**

- 覆盖技术博客主要内容领域
- 支持颜色和图标自定义
- 预留排序字段

**四个默认分类：**

1. **前端技术** (`frontend`) - 蓝色 💻
2. **人工智能** (`ai`) - 紫色 🤖
3. **算法数据结构** (`algorithm`) - 绿色 🧮
4. **生活随笔** (`happy-life`) - 橙色 📝

### 6.4 数据库初始化

**种子数据设计 (prisma/seed.ts)：**

**管理员用户创建：**

```typescript
const adminUser = await prisma.user.upsert({
  where: { username: "admin" },
  update: {},
  create: {
    username: "admin",
    email: "admin@springlament.com",
    password: await bcrypt.hash("0919", 12), // 密码加密
    role: "ADMIN",
    profile: {
      create: {
        displayName: "管理员",
        bio: "SpringLament Blog 系统管理员",
      },
    },
  },
});
```

**分类和标签创建：**

- 创建 4 个默认分类
- 创建 14 个常用标签
- 包含前端、AI、算法、生活等领域

**示例文章创建：**

- 创建 2 篇示例文章
- 演示 Markdown 内容结构
- 建立文章与标签的关联关系

### 6.5 Prisma Client 配置

**lib/prisma.ts 设计思路：**

```typescript
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// 开发环境避免热重载时重复创建实例
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

## 7. 项目结构总览

```
SpringLament Blog/
├── README.md                 # 项目说明文档
├── package.json             # 项目配置和依赖
├── next.config.js           # Next.js 配置
├── tsconfig.json           # TypeScript 配置
├── tailwind.config.ts      # Tailwind CSS 配置
├── postcss.config.js       # PostCSS 配置
├── .eslintrc.json         # ESLint 配置
├── .prettierrc            # Prettier 配置
├── .gitignore            # Git 忽略文件
├── .env                  # 环境变量
├── .husky/               # Git hooks
│   └── pre-commit
├── src/                  # 源代码目录
│   ├── app/             # Next.js App Router
│   │   ├── globals.css  # 全局样式
│   │   ├── layout.tsx   # 根布局
│   │   └── page.tsx     # 首页
│   └── lib/             # 工具库
│       └── prisma.ts    # Prisma 客户端
├── prisma/              # 数据库相关
│   ├── schema.prisma    # 数据模型定义
│   ├── seed.ts         # 种子数据脚本
│   ├── dev.db          # SQLite 数据库文件
│   └── migrations/     # 数据库迁移文件
├── docs/               # 项目文档
│   └── phase-1-implementation.md
└── node_modules/       # 依赖包
```

## 8. 问题解决记录

### 8.1 ES Module 配置问题

**问题：**

```
SyntaxError: Unexpected token 'export'
```

**原因分析：**

- Next.js 配置文件默认使用 CommonJS 格式
- PostCSS 配置文件也需要使用 CommonJS

**解决方案：**

```javascript
// next.config.js & postcss.config.js 使用 CommonJS 格式
module.exports = config;
// 而不是 export default config;
```

### 8.2 npm 包名称限制

**问题：**

```
Could not create a project called "Spring Lament Blog" because of npm naming restrictions
```

**解决方案：**

- 使用手动创建项目结构的方式
- package.json 中使用 `spring-lament-blog` 作为包名

### 8.3 TypeScript 配置自动调整

**现象：**
Next.js 自动调整了 tsconfig.json 的 target 配置

**原因：**

- Next.js 检测到项目使用 TypeScript
- 自动优化配置以支持 top-level await

**结果：**

- target 被设置为 "ES2017"
- 配置更适合现代 JavaScript 特性

## 9. 下一步计划

Phase 1 基础架构已完成，下一步将进入 Phase 2：

1. **认证系统集成**
   - NextAuth.js 配置
   - 凭证认证实现
   - 会话管理

2. **后台路由保护**
   - 中间件配置
   - 权限验证

3. **登录页面**
   - UI 设计实现
   - 表单验证

## 10. 可用命令总结

```bash
# 开发相关
npm run dev          # 启动开发服务器
npm run build        # 生产构建
npm run start        # 启动生产服务器
npm run lint         # 代码检查
npm run type-check   # 类型检查

# 数据库相关
npm run db:generate  # 生成 Prisma 客户端
npm run db:push      # 推送 schema 变更到数据库
npm run db:migrate   # 创建并应用迁移
npm run db:seed      # 运行种子数据
npm run db:studio    # 打开数据库管理界面
```

---

**实现总结：**
Phase 1 成功搭建了完整的基础架构，包括现代化的开发环境、类型安全的数据访问层、完善的代码质量保障机制。项目结构清晰，配置完善，为后续功能开发奠定了坚实基础。
