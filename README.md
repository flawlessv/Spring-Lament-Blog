# SpringLament 博客系统技术方案

## 项目概述
基于 Next.js 的全栈个人博客系统，、聚焦高效创作与优雅以及简洁展示。

## 技术架构
- **前端**: Next.js 15 (App Router)
- **API**: Next.js API Routes + Hono.js
- **数据库**: SQLite（开发）/ PostgreSQL（生产）
- **ORM**: Prisma（主）+ Drizzle ORM（可选）
- **认证**: NextAuth.js v4（凭证登录）
- **样式**: Tailwind CSS v4
- **语言**: TypeScript（全栈类型安全）
- **容器**: Docker + Docker Compose

## 功能范围
- **前台**
  - 首页、文章列表、文章详情
  - Markdown 渲染（代码高亮、图片展示）
  - 自动目录、阅读进度
  - 搜索与筛选：分类、标签（支持多标签组合）
  - 排序：时间
- **后台**
  - 文章 CRUD：草稿/发布/精选、批量操作
  - 编辑器：Monaco，分屏实时预览，图片上传
  - 分类与标签管理：CRUD、颜色与图标、内容统计
- **认证与权限**
  - 默认管理员：username=admin，password=0919（仅需要这一个用户

## 数据模型（摘要）
- 用户（User）/ 角色（Role：ADMIN、USER）/ 个人资料（Profile）
- 文章（Post）/ 分类（Category）/ 标签（Tag）/ 文章标签关联（PostTag）
- 关系：User-Post（1:N），Post-Tag（N:M），Post-Category（N:1）

## 文章分类（默认）
- 前端技术（frontend）
- 人工智能（ai）
- 算法数据结构（algorithm）
- 生活随笔（happyLife）
说明：后台可进行分类与标签 CRUD，首版可写死默认值。

## 开发计划
### Phase 1: 基础架构
- [ ] 项目初始化（Husky、ESLint、TypeScript 配置）
- [ ] 数据库设计与迁移

### Phase 2: 路由与认证
- [ ] 认证系统（NextAuth 凭证登录）
- [ ] 登录页与后台路由保护（仅默认管理员）

### Phase 3: 前台界面
- [ ] 首页实现
- [ ] 文章列表与详情（Markdown、目录、阅读进度）
- [ ] 搜索、筛选与排序
- [ ] 响应式与可访问性优化

### Phase 4: 后台界面
- [ ] 文章 CRUD、草稿/发布/精选
- [ ] 编辑器集成与实时预览
- [ ] 文件上传
- [ ] 分类与标签管理
<!-- 
### Phase 5: 其他与上线
- [ ] 国际化完善（可选）
- [ ] SEO 与性能优化（SSG/缓存/图片优化）
- [ ] Docker 部署与环境配置（PostgreSQL、Redis 可选）
- [ ] 监控与数据备份 -->


