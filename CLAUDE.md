# SpringLament 博客系统 - Claude 开发文档

这是一个基于 Next.js 15 + TypeScript + shadcn/ui + NextAuth.js 构建的现代化个人博客系统。

## 🚀 项目概览

SpringLament 是一个全栈博客系统，专注于**高效创作**和**优雅展示**。系统采用现代化技术栈，提供完整的内容管理功能和用户友好的管理界面。

### 核心特性

- ✅ **现代化前端**: Next.js 15 + App Router
- ✅ **类型安全**: 全栈 TypeScript 支持
- ✅ **无头组件**: shadcn/ui + Radix UI + Tailwind CSS
- ✅ **身份认证**: NextAuth.js v4 + JWT 策略
- ✅ **数据库**: Prisma ORM + SQLite/PostgreSQL
- ✅ **代码质量**: ESLint + Prettier + Husky
- ✅ **响应式设计**: 移动端友好的界面

## 📁 项目结构

```
SpringLament Blog/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── admin/             # 管理后台页面
│   │   ├── login/             # 登录页面
│   │   ├── api/auth/          # NextAuth.js API 路由
│   │   ├── globals.css        # 全局样式
│   │   └── layout.tsx         # 根布局
│   ├── components/            # React 组件
│   │   ├── ui/               # shadcn/ui 基础组件
│   │   ├── admin/            # 管理后台组件
│   │   └── providers/        # 上下文提供器
│   ├── lib/                  # 工具库和配置
│   │   ├── auth.ts           # NextAuth.js 配置
│   │   └── utils.ts          # 工具函数
│   └── types/                # TypeScript 类型定义
├── prisma/                   # Prisma 数据库配置
│   ├── schema.prisma         # 数据库模型
│   └── seed.ts              # 数据库种子
├── docs/                     # 项目文档
├── components.json           # shadcn/ui 配置
├── tailwind.config.ts        # Tailwind CSS 配置
└── middleware.ts             # Next.js 中间件 (路由保护)
```

## 🛠️ 技术栈

### 核心框架

- **Next.js 15**: React 全栈框架，使用 App Router
- **TypeScript**: 静态类型检查
- **React 18**: 用户界面库

### UI 系统

- **shadcn/ui**: 无头组件库
- **Radix UI**: 无头 UI 原语
- **Tailwind CSS**: 实用优先的 CSS 框架
- **Lucide React**: 现代化图标库

### 数据层

- **Prisma**: 现代化 ORM
- **SQLite**: 开发环境数据库
- **PostgreSQL**: 生产环境数据库 (计划)

### 身份认证

- **NextAuth.js v4**: 身份认证库
- **JWT**: 会话管理策略
- **bcryptjs**: 密码哈希

### 开发工具

- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Husky**: Git hooks 管理
- **lint-staged**: 暂存区文件检查

## 🔧 快速开始

### 环境要求

```bash
Node.js >= 18.0.0
npm >= 8.0.0
```

### 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd "Spring Lament Blog"

# 安装依赖
npm install

# 设置环境变量
cp .env.example .env
# 编辑 .env 文件配置数据库连接和认证密钥
```

### 数据库设置

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库架构
npm run db:push

# 填充初始数据
npm run db:seed
```

### 启动开发服务器

```bash
# 启动开发服务器
npm run dev

# 访问应用
# 前台: http://localhost:3000
# 登录: http://localhost:3000/login
# 后台: http://localhost:3000/admin
```

### 默认管理员账户

```
用户名: admin
密码: 0919
```

## 📝 开发指南

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

### 组件开发

#### 创建 UI 组件

使用 shadcn/ui CLI 添加新组件：

```bash
# 添加预制组件
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add table

# 查看可用组件
npx shadcn@latest add --help
```

#### 自定义组件

```tsx
// 示例：创建自定义按钮组件
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

### 页面开发

#### 路由结构

```
app/
├── page.tsx                 # 首页 /
├── login/page.tsx          # 登录页 /login
├── admin/
│   ├── page.tsx           # 管理首页 /admin
│   ├── posts/
│   │   ├── page.tsx       # 文章列表 /admin/posts
│   │   └── new/page.tsx   # 新建文章 /admin/posts/new
│   ├── categories/page.tsx # 分类管理 /admin/categories
│   └── layout.tsx         # 管理后台布局
└── api/
    └── auth/[...nextauth]/route.ts # 认证 API
```

#### 页面模板

```tsx
// app/admin/example/page.tsx
import { Metadata } from "next";
import AdminLayout from "@/components/admin/admin-layout";

export const metadata: Metadata = {
  title: "示例页面 - SpringLament Blog",
  description: "这是一个示例页面",
};

export default function ExamplePage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">示例页面</h1>
          <p className="text-muted-foreground">页面描述信息</p>
        </div>
        {/* 页面内容 */}
      </div>
    </AdminLayout>
  );
}
```

### 数据库操作

#### 模型定义

```prisma
// prisma/schema.prisma
model Post {
  id          String   @id @default(cuid())
  title       String
  content     String?
  published   Boolean  @default(false)
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  categories  Category[]
  tags        Tag[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### 数据库查询

```typescript
import { prisma } from "@/lib/prisma";

// 获取文章列表
export async function getPosts() {
  return await prisma.post.findMany({
    include: {
      author: true,
      categories: true,
      tags: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// 创建新文章
export async function createPost(data: CreatePostData) {
  return await prisma.post.create({
    data: {
      ...data,
      author: {
        connect: { id: data.authorId },
      },
    },
  });
}
```

### 认证和授权

#### 保护路由

```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // 额外的中间件逻辑
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // 管理员路由保护
        if (pathname.startsWith("/admin")) {
          return token?.role === "ADMIN";
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
```

#### 获取会话信息

```tsx
"use client";
import { useSession } from "next-auth/react";

export function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>加载中...</div>;
  }

  if (!session) {
    return <div>请先登录</div>;
  }

  return (
    <div>
      <h2>欢迎，{session.user.username}!</h2>
      <p>角色: {session.user.role}</p>
    </div>
  );
}
```

## 🎨 设计系统

### 颜色系统

项目使用 CSS 变量构建灵活的颜色系统：

```css
:root {
  --background: 0 0% 100%; /* 背景色 */
  --foreground: 240 10% 3.9%; /* 文字色 */
  --primary: 221.2 83.2% 53.3%; /* 主色调 */
  --secondary: 210 40% 96%; /* 次要色 */
  --muted: 210 40% 96%; /* 静音色 */
  --accent: 210 40% 96%; /* 强调色 */
  --destructive: 0 84.2% 60.2%; /* 危险色 */
}

.dark {
  --background: 240 10% 3.9%; /* 暗色背景 */
  --foreground: 0 0% 98%; /* 暗色文字 */
  /* ... 其他暗色变量 */
}
```

### 组件样式

```tsx
// 使用设计令牌
<div className="bg-background text-foreground border border-border">
  <h1 className="text-primary">主标题</h1>
  <p className="text-muted-foreground">次要文字</p>
</div>
```

### 响应式设计

```tsx
// Tailwind 响应式类名
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card className="p-4 sm:p-6">
    <h3 className="text-lg sm:text-xl font-semibold">卡片标题</h3>
  </Card>
</div>
```

## 📚 开发阶段

### Phase 1: 基础架构 ✅

- [x] Next.js 15 项目搭建
- [x] TypeScript 配置
- [x] Tailwind CSS 配置
- [x] shadcn/ui 集成
- [x] Prisma 数据库配置
- [x] ESLint + Prettier 配置
- [x] Husky Git hooks 配置

### Phase 2: 认证与路由保护 ✅

- [x] NextAuth.js 配置
- [x] 登录页面实现
- [x] 中间件路由保护
- [x] 管理后台布局
- [x] 用户会话管理

### Phase 3: 前台界面 ✅

- [x] 首页设计与实现
  - [x] 简洁、简约的布局设计
  - [x] 左侧管理员信息卡片
  - [x] 右侧文章列表展示
  - [x] 响应式网格布局
- [x] 文章列表页面
  - [x] 文章卡片式展示
  - [x] 支持精选文章标识
  - [x] 文章摘要和标签显示
  - [x] 分页加载功能
- [x] 文章详情页面
  - [x] 文章内容完整展示
  - [x] Markdown 样式支持
  - [x] 文章元信息展示
  - [x] 返回导航功能
- [x] 响应式优化
  - [x] 移动端适配
  - [x] 平板端适配
  - [x] 桌面端优化
- [x] API 接口实现
  - [x] 公开文章列表 API
  - [x] 文章详情 API
  - [x] 管理员信息 API
- [ ] 分类和标签页面
- [ ] 搜索功能

### Phase 4: 后台管理 (计划中)

- [ ] 文章 CRUD 功能
- [ ] Markdown 编辑器集成
- [ ] 图片上传功能
- [ ] 分类和标签管理
- [ ] 批量操作功能

### Phase 5: 优化与部署 (计划中)

- [ ] SEO 优化
- [ ] 性能优化
- [ ] Docker 容器化
- [ ] CI/CD 配置
- [ ] 部署到生产环境

## 🧪 测试

### 运行测试

```bash
# 构建测试
npm run build

# 类型检查
npm run type-check

# 代码风格检查
npm run lint

# 启动开发服务器测试
npm run dev
```

### 功能测试清单

#### 认证功能

- [ ] 使用正确密码登录成功
- [ ] 使用错误密码显示错误提示
- [ ] 未登录访问管理页面重定向到登录页
- [ ] 登录成功后正确重定向到管理后台
- [ ] 登出功能正常工作

#### 界面功能

- [ ] 登录页面样式正确显示
- [ ] 管理后台布局正常
- [ ] 侧边栏导航功能正常
- [ ] 响应式设计在不同设备上正常工作
- [ ] 深色模式切换 (如果实现)

## 🚀 部署

### 构建生产版本

```bash
# 构建应用
npm run build

# 启动生产服务器
npm start
```

### 环境变量配置

```bash
# 生产环境环境变量
DATABASE_URL="postgresql://username:password@localhost:5432/spring_lament"
NEXTAUTH_SECRET="your-production-secret-key"
NEXTAUTH_URL="http://powder.icu/"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-secure-password"
```

### Docker 部署 (计划中)

```dockerfile
# Dockerfile (示例)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 贡献指南

### 开发流程

1. Fork 项目仓库
2. 创建功能分支: `git checkout -b feature/new-feature`
3. 提交更改: `git commit -m 'Add new feature'`
4. 推送到分支: `git push origin feature/new-feature`
5. 创建 Pull Request

### 代码风格

- 使用 TypeScript 进行开发
- 遵循 ESLint 和 Prettier 规则
- 为新功能添加适当的注释
- 保持组件的单一职责原则

### 提交信息规范

```
feat: 添加新功能
fix: 修复 bug
docs: 更新文档
style: 代码格式调整
refactor: 代码重构
test: 添加测试
chore: 构建过程或工具变更
```

## 📖 相关文档

- [shadcn/ui 无头组件库使用指南](./docs/shadcn-ui-guide.md)
- [Phase 1 实现指南](./docs/phase-1-implementation-guide.md)
- [Phase 2 认证系统指南](./docs/phase-2-authentication-guide.md)

## 📞 支持与反馈

如果你在使用过程中遇到问题或有建议，欢迎：

1. 查阅项目文档
2. 搜索已有的 Issues
3. 创建新的 Issue 描述问题
4. 参与项目讨论

## 📄 许可证

本项目采用 MIT 许可证。详情请查看 [LICENSE](./LICENSE) 文件。

---

**SpringLament Blog** - 专注于高效创作和优雅展示的现代化博客系统

🔗 **技术栈**: Next.js 15 + TypeScript + shadcn/ui + NextAuth.js + Prisma + Tailwind CSS
