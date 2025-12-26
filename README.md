# Spring Broken AI Blog

> 基于 Next.js 15 + TypeScript + shadcn/ui 构建的现代化全栈博客系统

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

一个专注于**高效创作**和**优雅展示**的现代化博客系统，采用最新的 Web 技术栈构建，提供完整的内容管理功能和用户友好的管理界面。

## 特性

### 现代化技术栈
- **Next.js 15** - React 全栈框架，使用 App Router
- **TypeScript** - 全栈类型安全支持
- **shadcn/ui** - 基于 Radix UI 的无头组件库
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Prisma ORM** - 类型安全的数据库访问

### 身份认证与授权
- **NextAuth.js v4** - 完整的身份认证解决方案
- **JWT 策略** - 无状态会话管理
- **角色权限控制** - 支持 ADMIN/USER 角色管理
- **路由保护** - 中间件级别的访问控制

### 内容管理
- **Markdown 编辑器** - 实时预览的富文本编辑
- **代码高亮** - 基于 highlight.js 的语法高亮
- **分类标签系统** - 灵活的内容组织方式
- **草稿发布** - 支持草稿保存和定时发布
- **图片上传** - 支持封面图片管理

### 用户体验
- **响应式设计** - 移动端友好的界面
- **暗色模式** - 支持明暗主题切换
- **SEO 优化** - 完善的元数据和结构化数据
- **高性能** - 静态生成和服务端渲染

### 开发体验
- **类型安全** - 全栈 TypeScript 支持
- **代码规范** - ESLint + Prettier + Husky
- **Git Hooks** - 自动化的代码质量检查
- **热重载** - 快速的开发反馈循环

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0

### 安装步骤

1. **克隆项目**

```bash
git clone https://github.com/flawlessv/Spring-Broken-AI-Blog.git
cd Spring-Broken-AI-Blog
```

2. **安装依赖**

```bash
npm install
```

3. **配置环境变量**

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置以下变量：

```env
# 数据库连接
DATABASE_URL="file:./dev.db"

# NextAuth.js 配置
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:7777"

# 管理员账户
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="0919"
```

4. **初始化数据库**

```bash
# 生成 Prisma Client
npm run db:generate

# 推送数据库架构
npm run db:push

# 填充初始数据
npm run db:seed
```

5. **启动开发服务器**

```bash
npm run dev
```

访问 http://localhost:7777 查看应用

### 默认管理员账户

```
用户名: admin
密码: 0919
```

## 项目结构

```
Spring-Broken-AI-Blog/
├── prisma/                    # 数据库配置
│   ├── schema.prisma         # 数据库模型定义
│   ├── seed.ts              # 数据库种子文件
│   └── dev.db               # SQLite 数据库文件
├── public/                   # 静态资源
│   └── uploads/             # 上传的图片文件
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── admin/          # 管理后台页面
│   │   ├── api/            # API 路由
│   │   ├── login/          # 登录页面
│   │   └── globals.css     # 全局样式
│   ├── components/         # React 组件
│   │   ├── ui/            # shadcn/ui 基础组件
│   │   └── admin/         # 管理后台组件
│   ├── lib/               # 工具库
│   │   ├── auth.ts        # NextAuth.js 配置
│   │   ├── prisma.ts      # Prisma 客户端
│   │   └── utils.ts       # 工具函数
│   └── types/             # TypeScript 类型定义
├── components.json         # shadcn/ui 配置
├── tailwind.config.ts     # Tailwind CSS 配置
├── tsconfig.json          # TypeScript 配置
└── next.config.js         # Next.js 配置
```

## 可用脚本

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
npm run db:reset        # 重置数据库

# 代码质量
npm run lint            # 运行 ESLint 检查
npm run type-check      # TypeScript 类型检查
npm run format          # Prettier 代码格式化

# 部署
npm run deploy:build    # 构建生产版本
npm run deploy:setup    # 设置生产数据库
npm run pm2:start       # 使用 PM2 启动应用
npm run pm2:stop        # 停止 PM2 应用
```

## 功能演示

### 管理后台
- 仪表盘 - 文章统计、系统概览
- 文章管理 - 创建、编辑、删除文章
- 分类标签 - 内容分类管理
- 用户管理 - 用户资料和权限管理
- 媒体管理 - 图片上传和管理

### 前台展示
- 文章列表 - 分页展示所有已发布文章
- 文章详情 - Markdown 渲染、代码高亮
- 分类筛选 - 按分类浏览文章
- 标签云 - 标签聚合展示
- 响应式设计 - 适配各种设备

## 技术栈详情

| 类别 | 技术 |
|------|------|
| **框架** | Next.js 15, React 18 |
| **语言** | TypeScript 5 |
| **样式** | Tailwind CSS, Radix UI |
| **组件库** | shadcn/ui, Lucide React |
| **数据库** | Prisma ORM, SQLite/PostgreSQL |
| **认证** | NextAuth.js v4 |
| **编辑器** | @uiw/react-md-editor |
| **代码高亮** | highlight.js |
| **表单** | React Hook Form, Zod |
| **工具** | date-fns, clsx, class-variance-authority |

## 数据库模型

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│    User     │      │    Post     │      │  Category   │
├─────────────┤      ├─────────────┤      ├─────────────┤
│ id          │──┐   │ id          │──┐   │ id          │
│ username    │  └──│ authorId    │  └──│ categoryId  │
│ email       │      │ title       │      │ name        │
│ password    │      │ content     │      │ slug        │
│ role        │      │ published   │      │ description │
└─────────────┘      └─────────────┘      └─────────────┘
       │                    │
       │              ┌─────┴─────┐
       │              │           │
       ▼              ▼           ▼
┌─────────────┐ ┌──────────┐ ┌─────────┐
│  Profile    │ │ PostTag  │ │   Tag   │
├─────────────┤ ├──────────┤ ├─────────┤
│ userId      │ │ postId   │ │ name    │
│ displayName │ │ tagId    │ │ slug    │
│ bio         │ └──────────┘ └─────────┘
│ avatar      │
└─────────────┘
```

## 环境变量说明

| 变量名 | 说明 | 默认值 | 必填 |
|--------|------|--------|------|
| `DATABASE_URL` | 数据库连接字符串 | `file:./dev.db` | 是 |
| `NEXTAUTH_SECRET` | NextAuth.js 密钥 | - | 是 |
| `NEXTAUTH_URL` | 应用 URL | `http://localhost:7777` | 是 |
| `ADMIN_USERNAME` | 管理员用户名 | `admin` | 否 |
| `ADMIN_PASSWORD` | 管理员密码 | `0919` | 否 |

## 测试与构建

```bash
# 类型检查
npm run type-check

# 代码检查
npm run lint

# 构建项目
npm run build

# 启动生产服务器
npm start
```

## 部署指南

### 使用 PM2 部署

```bash
# 构建项目
npm run build

# 设置数据库
npm run deploy:setup

# 启动 PM2
npm run pm2:start
```

### Docker 部署（待实现）

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 贡献指南

欢迎贡献代码、报告问题或提出新功能建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 遵循 ESLint 和 Prettier 配置
- 使用 TypeScript 编写代码
- 为新功能添加测试
- 更新相关文档

### 提交信息规范

```
feat: 添加新功能
fix: 修复 Bug
docs: 更新文档
style: 代码格式调整
refactor: 代码重构
test: 添加测试
chore: 构建过程或工具变更
```

## 开发路线图

- [x] 基础博客功能
- [x] 用户认证系统
- [x] 管理后台
- [x] Markdown 编辑器
- [x] 图片上传
- [ ] 评论系统
- [ ] 全文搜索
- [ ] RSS 订阅
- [ ] 邮件通知
- [ ] 多语言支持
- [ ] API 文档
- [ ] Docker 部署
- [ ] CI/CD 流程

## 许可证

本项目采用 [MIT](LICENSE) 许可证。

## 致谢

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Radix UI](https://www.radix-ui.com/)

## 联系方式

- GitHub: [@flawlessv](https://github.com/flawlessv)
- Issues: [GitHub Issues](https://github.com/flawlessv/Spring-Broken-AI-Blog/issues)

---

**Spring Broken AI Blog** - 专注于高效创作和优雅展示的现代化博客系统

Made with ❤️ by [flawlessv](https://github.com/flawlessv)
