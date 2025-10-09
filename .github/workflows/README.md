# GitHub Actions 部署说明

## 🔧 修复的问题

### 原始错误

```
sh: 1: next: not found
Error: Process completed with exit code 127.
```

### 问题原因

1. **缺少 Prisma Client 生成**：Next.js 项目依赖 Prisma，必须先生成 Client 才能构建
2. **npm install vs npm ci**：CI 环境中应该使用 `npm ci` 而不是 `npm install`
3. **没有排除 node_modules**：上传到服务器时应该排除 node_modules，在服务器上重新安装

## ✅ 解决方案

### 1. 使用 npm ci

```yaml
- name: Install dependencies
  run: npm ci # CI 环境专用，更快更可靠
```

### 2. 添加 Prisma Client 生成步骤

```yaml
- name: Generate Prisma Client
  run: npm run db:generate
```

### 3. 启用 npm 缓存

```yaml
- name: Set up Node.js
  uses: actions/setup-node@v3
  with:
    node-version: 18
    cache: "npm" # 加速依赖安装
```

### 4. 排除不必要的文件上传

```yaml
tar_exec: "tar -czf - --exclude=node_modules --exclude=.git --exclude=.github --exclude=.next/cache ."
```

### 5. 服务器端完整初始化

```yaml
script: |
  cd /www/wwwroot/my-next-app
  npm install --production
  npx prisma generate
  npx prisma db push --accept-data-loss || true
  pm2 restart spring-lament-blog || pm2 start ecosystem.config.js
  pm2 save
```

## 📋 完整工作流程

```
1. Checkout 代码
   ↓
2. 设置 Node.js 18 + npm 缓存
   ↓
3. 安装依赖 (npm ci)
   ↓
4. 生成 Prisma Client
   ↓
5. 构建项目 (npm run build)
   ↓
6. 上传到服务器 (排除 node_modules)
   ↓
7. 服务器端：安装依赖 + 生成 Prisma + 推送数据库
   ↓
8. 重启 PM2 进程
```

## 🔑 需要配置的 Secrets

在 GitHub 仓库的 Settings → Secrets → Actions 中添加：

- `SSH_HOST`: 服务器 IP 或域名（例如：`123.456.789.0` 或 `powder.icu`）
- `SSH_USERNAME`: SSH 用户名（通常是 `root` 或其他用户）
- `SSH_PRIVATE_KEY`: SSH 私钥（完整的私钥内容）

### 生成 SSH 密钥

如果还没有 SSH 密钥：

```bash
# 在本地生成 SSH 密钥对
ssh-keygen -t rsa -b 4096 -C "github-actions"

# 查看私钥内容（用于 GitHub Secret）
cat ~/.ssh/id_rsa

# 查看公钥内容（需要添加到服务器）
cat ~/.ssh/id_rsa.pub
```

将公钥添加到服务器：

```bash
# 在服务器上
echo "你的公钥内容" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

## 🚀 触发部署

只需要推送代码到 `main` 分支：

```bash
git add .
git commit -m "update"
git push origin main
```

GitHub Actions 会自动：

1. 构建项目
2. 部署到服务器
3. 重启应用

## 📊 查看部署状态

在 GitHub 仓库页面：

- 点击 **Actions** 标签
- 查看最新的 workflow 运行状态
- 点击具体的 workflow 查看详细日志

## ⚠️ 注意事项

### 首次部署

首次部署时，确保服务器上：

1. **已安装 Node.js 18+**

   ```bash
   node -v  # 应该显示 v18.x.x
   ```

2. **已安装 PM2**

   ```bash
   npm install -g pm2
   ```

3. **目标目录存在**

   ```bash
   mkdir -p /www/wwwroot/my-next-app
   ```

4. **环境变量文件**
   ```bash
   # 在服务器上创建 .env.production
   cd /www/wwwroot/my-next-app
   cat > .env.production << 'EOF'
   DATABASE_URL="file:./prisma/dev.db"
   NEXTAUTH_SECRET="your-random-secret"
   NEXTAUTH_URL="https://your-domain.com"
   NODE_ENV="production"
   EOF
   ```

### 数据库持久化

确保数据库文件不会被覆盖：

```bash
# 如果使用 SQLite，备份数据库
cp /www/wwwroot/my-next-app/prisma/dev.db /www/wwwroot/my-next-app/prisma/dev.db.backup
```

## 🐛 常见问题

### Q: 部署后网站无法访问？

A: 检查：

1. PM2 进程是否运行：`pm2 list`
2. 端口是否开放：`netstat -tlnp | grep 3000`
3. Nginx 配置是否正确

### Q: 数据库连接错误？

A: 检查：

1. `.env.production` 文件是否存在
2. `DATABASE_URL` 是否正确
3. 数据库文件权限：`chmod 644 prisma/dev.db`

### Q: Prisma Client 错误？

A: 重新生成：

```bash
cd /www/wwwroot/my-next-app
npx prisma generate
pm2 restart spring-lament-blog
```

## 📝 本地测试 CI 流程

在推送前，可以本地测试相同的流程：

```bash
# 清理
rm -rf node_modules .next

# 安装
npm ci

# 生成 Prisma
npm run db:generate

# 构建
npm run build

# 测试
npm start
```

## 🎯 性能优化

当前配置已包含：

- ✅ npm 缓存
- ✅ 排除 node_modules 传输
- ✅ 使用 npm ci 加速安装
- ✅ 压缩传输文件

---

**最后更新**: 2025年10月  
**适用版本**: SpringLament Blog v0.2.0
