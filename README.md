# 🌸 Spring Lament Blog

> 一个基于 Next.js 15 的现代化全栈博客系统，专注于优雅的写作体验和流畅的阅读感受。

## ✨ 特性

### 前台功能

- 📝 **Markdown 渲染** - 支持代码高亮、数学公式、Mermaid 图表
- 📖 **阅读体验** - 自动生成目录、阅读进度条、响应式设计
- 🔍 **内容组织** - 分类浏览、标签筛选、全文搜索
- 🎨 **现代 UI** - 基于 Tailwind CSS 和 shadcn/ui 的精美界面

### 后台管理

- ✍️ **强大编辑器** - Monaco Editor，实时预览，支持图片上传
- 📊 **内容管理** - 文章 CRUD、草稿/发布状态、批量操作
- 🏷️ **分类标签** - 灵活的分类和标签系统，支持颜色和图标
- 📈 **数据统计** - 文章数量、分类统计、标签统计

### 技术亮点

- ⚡ **性能优化** - SSG + ISR，快速页面加载
- 🔐 **安全认证** - NextAuth.js v4，JWT session
- 💾 **灵活数据库** - SQLite（开发/生产均可），支持 PostgreSQL/MySQL
- 🚀 **自动部署** - GitHub Actions CI/CD，一键部署

## 🛠️ 技术栈

### 核心框架

- **[Next.js 15](https://nextjs.org/)** - React 全栈框架（App Router）
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全
- **[Prisma](https://www.prisma.io/)** - 现代 ORM

### UI & 样式

- **[Tailwind CSS](https://tailwindcss.com/)** - 原子化 CSS 框架
- **[shadcn/ui](https://ui.shadcn.com/)** - 高质量 React 组件库
- **[Lucide Icons](https://lucide.dev/)** - 现代图标库

### 认证 & 数据库

- **[NextAuth.js](https://next-auth.js.org/)** - 认证解决方案
- **[SQLite](https://www.sqlite.org/)** - 轻量级数据库（默认）
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** - 密码加密

### 开发工具

- **[ESLint](https://eslint.org/)** - 代码规范
- **[Prettier](https://prettier.io/)** - 代码格式化
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[lint-staged](https://github.com/okonet/lint-staged)** - 暂存区文件检查

## 🚀 快速开始

### 环境要求

- Node.js >= 18.17.0
- npm >= 9.0.0

### 本地开发

1. **克隆项目**

   ```bash
   git clone https://github.com/flawlessv/Spring-Lament-Blog.git
   cd Spring-Lament-Blog
   ```

2. **安装依赖**

   ```bash
   npm install
   ```

3. **配置环境变量**

   创建 `.env.local` 文件（开发环境）：

   ```env
   # 数据库配置（SQLite）
   DATABASE_URL="file:./dev.db"

   # NextAuth 配置
   NEXTAUTH_SECRET="your-secret-key-min-32-characters"
   NEXTAUTH_URL="http://localhost:7777"

   # 管理员账号（用于数据库种子）
   ADMIN_USERNAME="admin"
   ADMIN_PASSWORD="0919"
   ```

4. **初始化数据库**

   ```bash
   # 推送数据库 schema
   npm run db:push

   # 填充初始数据（管理员账号 + 示例内容）
   npm run db:seed
   ```

5. **启动开发服务器**

   ```bash
   npm run dev
   ```

6. **访问应用**
   - 前台：http://localhost:7777
   - 后台：http://localhost:7777/admin
   - 默认管理员账号：`admin` / `0919`

## 📁 项目结构

```
Spring-Lament-Blog/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/              # 后台管理页面
│   │   ├── api/                # API 路由
│   │   ├── posts/              # 文章页面
│   │   └── ...
│   ├── components/             # React 组件
│   │   ├── admin/              # 后台组件
│   │   ├── markdown/           # Markdown 渲染组件
│   │   ├── ui/                 # UI 组件库（shadcn/ui）
│   │   └── ...
│   ├── lib/                    # 工具函数
│   │   ├── auth.ts             # NextAuth 配置
│   │   ├── prisma.ts           # Prisma 客户端
│   │   └── utils.ts            # 通用工具
│   └── types/                  # TypeScript 类型定义
├── prisma/
│   ├── schema.prisma           # 数据库模型
│   ├── seed.ts                 # 数据库种子文件
│   └── dev.db                  # SQLite 数据库（开发）
├── .github/
│   └── workflows/              # GitHub Actions CI/CD
├── docs/                       # 项目文档
│   └── 部署指南.md             # 部署文档
├── ecosystem.config.js         # PM2 配置
├── package.json
└── README.md
```

## 📦 可用脚本

```bash
# 开发
npm run dev              # 启动开发服务器（端口 7777）
npm run build            # 构建生产版本
npm start                # 启动生产服务器（端口 3000）

# 数据库（开发环境）
npm run db:push          # 推送 schema 到数据库
npm run db:migrate       # 创建数据库迁移
npm run db:seed          # 填充初始数据
npm run db:studio        # 打开 Prisma Studio
npm run db:generate      # 生成 Prisma Client

# 数据库（生产环境）
npm run db:generate:prod # 生成 Prisma Client（读取 .env.production）
npm run db:push:prod     # 推送 schema（读取 .env.production）
npm run db:seed:prod     # 填充初始数据（读取 .env.production）
npm run deploy:setup:prod # 一键完成所有初始化和构建

# 代码质量
npm run lint             # 运行 ESLint
npm run type-check       # TypeScript 类型检查
npm run format           # 格式化代码

# PM2（生产环境）
npm run pm2:start        # 启动应用
npm run pm2:restart      # 重启应用
npm run pm2:stop         # 停止应用
npm run pm2:delete       # 删除应用
```

## 🚀 部署

本项目支持多种部署方式：

### 1. 宝塔面板 + PM2 部署（推荐）

📚 **完整文档**：[DEPLOYMENT.md](./docs/DEPLOYMENT.md)

适合使用宝塔面板管理服务器的用户，集成了详细的故障排查指南。

**快速部署步骤：**

```bash
# 1. 服务器上克隆项目
git clone https://github.com/flawlessv/Spring-Lament-Blog.git
cd Spring-Lament-Blog

# 2. 安装依赖
npm install

# 3. 配置生产环境变量
cat > .env.production << EOF
DATABASE_URL="file:./prisma/prod.db"
NEXTAUTH_SECRET="your-production-secret-min-32-chars"
NEXTAUTH_URL="http://your-domain.com"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-password"
NODE_ENV="production"
EOF

# 4. 初始化数据库（使用生产环境专用命令）
npm run db:generate:prod
npm run db:push:prod
npm run db:seed:prod

# 5. 构建项目
npm run build

# 6. 使用 PM2 启动
npm run pm2:start

# 7. 健康检查
bash scripts/health-check.sh
```

**常见问题快速参考：**

| 问题                | 解决方案                               |
| ------------------- | -------------------------------------- |
| PM2 应用 errored    | 查看日志 `pm2 logs spring-lament-blog` |
| 端口占用            | `lsof -i :3000` 找到进程并 kill        |
| 域名无法访问        | 检查 Nginx 配置和域名解析              |
| 宝塔占用 80 端口    | 修改宝塔端口为 8888                    |
| DATABASE_URL 找不到 | 使用 `:prod` 后缀的命令                |

详细的故障排查流程和解决方案请参考 [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

### 2. GitHub Actions 自动部署

推送到 `main` 分支时自动部署到服务器。

**配置 GitHub Secrets：**

在仓库的 `Settings` → `Secrets and variables` → `Actions` 中添加：

| Secret 名称       | 说明          | 示例                     |
| ----------------- | ------------- | ------------------------ |
| `SERVER_HOST`     | 服务器 IP     | `42.193.227.185`         |
| `SERVER_USER`     | SSH 用户名    | `root`                   |
| `SERVER_SSH_KEY`  | SSH 私钥      | 完整的私钥内容           |
| `SERVER_PORT`     | SSH 端口      | `22`                     |
| `DATABASE_URL`    | 数据库地址    | `file:./prod.db`         |
| `NEXTAUTH_SECRET` | NextAuth 密钥 | 32+ 字符随机字符串       |
| `NEXTAUTH_URL`    | 网站地址      | `http://your-domain.com` |

### 3. Docker 部署（即将支持）

```bash
# 即将推出
docker-compose up -d
```

## 🔧 配置说明

### 环境变量

| 变量名            | 必填 | 默认值        | 说明                          |
| ----------------- | ---- | ------------- | ----------------------------- |
| `DATABASE_URL`    | ✅   | -             | 数据库连接地址                |
| `NEXTAUTH_SECRET` | ✅   | -             | NextAuth 加密密钥（32+ 字符） |
| `NEXTAUTH_URL`    | ✅   | -             | 网站完整地址                  |
| `ADMIN_USERNAME`  | ❌   | `admin`       | 默认管理员用户名              |
| `ADMIN_PASSWORD`  | ❌   | `0919`        | 默认管理员密码                |
| `NODE_ENV`        | ❌   | `development` | 运行环境                      |
| `PORT`            | ❌   | `3000`        | 生产端口                      |

### 数据库配置

**SQLite（默认，推荐用于中小型博客）：**

```env
DATABASE_URL="file:./prod.db"
```

**PostgreSQL：**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/database"
```

**MySQL：**

```env
DATABASE_URL="mysql://user:password@localhost:3306/database"
```

修改 `prisma/schema.prisma` 中的 `provider` 为对应数据库类型。

## 📝 数据库模型

### 主要模型

- **User** - 用户（管理员）
- **Profile** - 个人资料
- **Post** - 文章
- **Category** - 分类
- **Tag** - 标签
- **PostTag** - 文章标签关联

### 默认分类

- 🎨 前端技术（frontend）
- 🤖 人工智能（ai）
- 📊 算法数据结构（algorithm）
- 🌈 生活随笔（happyLife）

## 🐛 常见问题

<details>
<summary><strong>Q: 如何修改管理员密码？</strong></summary>

**方法 1：使用后台修改**

1. 登录后台 `/admin/profile`
2. 在个人资料页面修改密码

**方法 2：直接修改数据库**

```bash
# 在服务器上执行
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('new-password', 12));"
# 复制输出的哈希值，更新数据库
```

</details>

<details>
<summary><strong>Q: 登录时报 CredentialsSignin 错误？</strong></summary>

可能原因：

1. 用户名或密码错误
2. `NEXTAUTH_SECRET` 配置不正确
3. `NEXTAUTH_URL` 配置不正确（注意不要有尾部斜杠）
4. 数据库连接失败

**解决方法：**

- 检查 `.env.production` 配置
- 确保 PM2 重启时使用 `--update-env` 更新环境变量
- 查看应用日志：`pm2 logs spring-lament-blog`
</details>

<details>
<summary><strong>Q: 如何切换数据库类型？</strong></summary>

1. 修改 `prisma/schema.prisma`：

   ```prisma
   datasource db {
     provider = "postgresql"  // 或 "mysql"
     url      = env("DATABASE_URL")
   }
   ```

2. 更新 `DATABASE_URL`
3. 重新推送 schema：`npm run db:push`
4. 重新填充数据：`npm run db:seed`
</details>

<details>
<summary><strong>Q: npm install 太慢怎么办？</strong></summary>

使用淘宝镜像（项目已配置 `.npmrc`）：

```bash
npm config get registry
# 应该显示：https://registry.npmmirror.com
```

如果不是，手动设置：

```bash
npm config set registry https://registry.npmmirror.com
```

</details>

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m 'Add some feature'`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 Pull Request

### 代码规范

- 使用 TypeScript
- 遵循 ESLint 规则
- 提交前会自动运行 Prettier 和 ESLint
- 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)

## 📄 许可证

MIT License © 2024 [flawlessv](https://github.com/flawlessv)

---

<div align="center">
  <p>如果这个项目对你有帮助，欢迎 ⭐ Star 支持一下！</p>
  <p>Made with ❤️ by <a href="https://github.com/flawlessv">flawlessv</a></p>
</div>
