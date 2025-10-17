# 宝塔面板 Next.js 部署指南

## 环境要求

- Node.js >= 18.0.0
- PM2 进程管理器
- Nginx 反向代理
- MySQL/PostgreSQL 数据库

## 部署步骤

### 1. 上传代码

将项目文件上传到服务器目录：`/www/wwwroot/your-domain.com`

### 2. 安装依赖

```bash
cd /www/wwwroot/your-domain.com
npm install
```

### 3. 环境变量配置

创建 `.env.production` 文件：

```
# 数据库连接
DATABASE_URL="mysql://username:password@localhost:3306/spring_lament"
# 或 PostgreSQL
# DATABASE_URL="postgresql://username:password@localhost:5432/spring_lament"

# NextAuth 配置
NEXTAUTH_SECRET="your-very-secure-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# 管理员账户
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-secure-password"

# Node 环境
NODE_ENV="production"
```

### 4. 数据库设置

**重要说明**：Prisma CLI 工具默认读取 `.env` 文件，而不是 `.env.production`。因此需要使用带 `:prod` 后缀的专用命令。

```bash
# 方式 1: 使用生产环境专用命令（推荐）
npm run db:generate:prod
npm run db:push:prod
npm run db:seed:prod

# 方式 2: 手动指定环境变量文件
dotenv -e .env.production -- npx prisma generate
dotenv -e .env.production -- npx prisma db push
dotenv -e .env.production -- npm run db:seed

# 或者一键完成所有设置（包括构建）
npm run deploy:setup:prod
```

### 5. 构建项目

```bash
npm run build
```

### 6. PM2 进程配置

创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [
    {
      name: "spring-lament-blog",
      script: "npm",
      args: "start",
      cwd: "/www/wwwroot/your-domain.com",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "/www/wwwroot/your-domain.com/logs/err.log",
      out_file: "/www/wwwroot/your-domain.com/logs/out.log",
      log_file: "/www/wwwroot/your-domain.com/logs/combined.log",
      time: true,
    },
  ],
};
```

### 7. Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # 静态文件缓存
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 启动服务

```bash
# 启动 PM2 应用
pm2 start ecosystem.config.js

# 保存 PM2 配置
pm2 save

# 设置 PM2 开机自启
pm2 startup
```

## 维护命令

```bash
# 查看应用状态
pm2 status

# 重启应用
pm2 restart spring-lament-blog

# 查看日志
pm2 logs spring-lament-blog

# 监控面板
pm2 monit
```

## 常见问题

### 1. 为什么需要 .env 和 .env.production 两个文件？

**原因**：不同工具读取不同的环境变量文件

- **Prisma CLI 工具**（`prisma generate`, `prisma db push`, `npm run db:seed`）
  - 默认只读取 `.env` 文件
  - 不会自动识别 `NODE_ENV` 或 `.env.production`
  - 这是 Prisma 的设计决定
- **Next.js 应用**（`npm run build`, `npm start`）
  - 在 `NODE_ENV=production` 时读取 `.env.production`
  - 在开发时读取 `.env.development`
- **PM2 运行的应用**
  - 通过 `ecosystem.config.js` 配置读取 `.env.production`

**解决方案**：

1. 使用 `dotenv-cli` 包装命令：`dotenv -e .env.production -- prisma generate`
2. 使用项目提供的专用命令：`npm run db:generate:prod`
3. 创建 `.env` 文件（链接到或复制 `.env.production` 的内容）

### 2. DATABASE_URL 找不到错误

**错误信息**：

```
Environment variable not found: DATABASE_URL
```

**原因**：运行 Prisma 命令时没有正确加载环境变量

**解决方案**：

```bash
# 确保 .env.production 文件存在
ls -la .env.production

# 使用生产环境命令
npm run db:generate:prod
npm run db:push:prod
npm run db:seed:prod

# 或者临时创建 .env 文件
cp .env.production .env
npm run db:seed
```

### 3. PM2 应用状态一直是 errored

**症状**：执行 `pm2 status` 显示应用状态为 `errored`，不断重启

**排查步骤**：

```bash
# 1. 查看详细错误日志
pm2 logs spring-lament-blog --lines 100 --err

# 2. 查看所有日志
pm2 logs spring-lament-blog --lines 100
```

**常见原因及解决方案**：

#### 3.1 端口被占用（EADDRINUSE）

**错误信息**：

```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决方案**：

```bash
# 查找占用端口的进程
lsof -i :3000
netstat -tlnp | grep 3000

# 杀掉占用端口的进程
kill -9 <PID>

# 或者一键杀掉
fuser -k 3000/tcp

# 重启 PM2 应用
pm2 restart spring-lament-blog
```

#### 3.2 项目未构建

**症状**：日志显示找不到 `.next` 目录或构建文件

**解决方案**：

```bash
cd /www/wwwroot/my-next-app
npm run build
pm2 restart spring-lament-blog
```

#### 3.3 环境变量未配置

**症状**：数据库连接错误或 NextAuth 错误

**解决方案**：

```bash
# 确保 .env.production 文件存在且正确
cat .env.production

# 重新初始化数据库
npm run db:generate:prod
npm run db:push:prod

# 重启应用
pm2 restart spring-lament-blog
```

### 4. 域名无法访问但本地可以访问

**症状**：

- `curl http://localhost:3000` ✅ 成功
- `curl http://powder.icu` ❌ 失败

**排查步骤**：

#### 4.1 检查 Nginx 配置

```bash
# 查看配置文件
cat /www/server/panel/vhost/nginx/powder.icu.conf

# 测试 Nginx 配置
nginx -t

# 重载 Nginx
nginx -s reload
```

#### 4.2 检查 Nginx 是否运行

```bash
# 查看 Nginx 状态
systemctl status nginx

# 检查 80 端口监听
netstat -tlnp | grep :80
```

#### 4.3 检查域名解析

```bash
# 测试域名解析
ping powder.icu
nslookup powder.icu

# 应该解析到服务器公网 IP
```

#### 4.4 检查防火墙

```bash
# 检查端口是否开放
firewall-cmd --list-ports

# 开放 80 和 443 端口
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --permanent --add-port=443/tcp
firewall-cmd --reload

# 腾讯云/阿里云：还需要在控制台的安全组中开放端口
```

### 5. 宝塔面板占用 80 端口

**症状**：

```bash
lsof -i :80
# 显示：BT-Panel 1243039 root 4u IPv4 TCP *:http (LISTEN)
```

**原因**：宝塔面板端口被错误配置为 80，应该是 8888

**解决方案**：

```bash
# 方法 1：使用宝塔命令修改
bt 8
# 然后输入新端口：8888

# 方法 2：直接修改配置文件
echo '8888' > /www/server/panel/data/port.pl
/etc/init.d/bt restart

# 启动 Nginx
systemctl start nginx

# 验证
systemctl status nginx
curl -I http://powder.icu
```

**注意**：修改后宝塔面板访问地址变为 `https://你的IP:8888/安全入口`

### 6. Nginx 启动失败：端口被占用

**错误信息**：

```
nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)
```

**完整排查流程**：

```bash
# 1. 查找占用 80 端口的程序
lsof -i :80

# 2. 可能的占用程序
# - BT-Panel（宝塔面板）→ 改端口为 8888
# - httpd/apache → killall httpd
# - 其他 nginx 进程 → killall nginx

# 3. 停止占用程序后
systemctl start nginx

# 4. 验证
systemctl status nginx
netstat -tlnp | grep :80
```

### 7. PM2 列表为空

**症状**：执行 `pm2 status` 显示空列表

**原因**：

- PM2 进程被删除或重置
- 服务器重启后 PM2 未自动启动

**解决方案**：

```bash
# 重新启动应用
cd /www/wwwroot/my-next-app
pm2 start ecosystem.config.js

# 保存 PM2 列表
pm2 save

# 设置开机自启
pm2 startup
# 按提示执行返回的命令

# 验证
pm2 status
```

## 故障排查流程图

### PM2 应用异常排查

```
pm2 status 显示 errored？
    ↓
查看日志：pm2 logs spring-lament-blog --lines 100
    ↓
├─ 端口占用错误？
│   └─ lsof -i :3000 → kill 进程 → pm2 restart
│
├─ 找不到 .next？
│   └─ npm run build → pm2 restart
│
├─ 数据库错误？
│   └─ 检查 .env.production → npm run db:generate:prod
│
└─ 其他错误？
    └─ 完整重新部署流程
```

### 域名无法访问排查

```
curl http://powder.icu 失败？
    ↓
curl http://localhost:3000 是否成功？
    ↓
├─ 成功 → Nginx 或网络问题
│   ↓
│   ├─ systemctl status nginx → 未运行？
│   │   └─ lsof -i :80 → 端口被占用？
│   │       └─ 处理占用程序 → systemctl start nginx
│   │
│   ├─ nginx -t → 配置错误？
│   │   └─ 修复配置 → nginx -s reload
│   │
│   └─ ping 域名 → 域名未解析？
│       └─ 配置 DNS A 记录
│
└─ 失败 → PM2 应用问题
    └─ 按 PM2 排查流程处理
```

## 完整健康检查脚本

```bash
#!/bin/bash
# 部署健康检查脚本

echo "========== 1. PM2 状态检查 =========="
pm2 status

echo -e "\n========== 2. 应用端口检查 =========="
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ 应用在 3000 端口正常运行"
else
    echo "❌ 应用无法访问"
fi

echo -e "\n========== 3. Nginx 状态检查 =========="
systemctl status nginx | head -n 5

echo -e "\n========== 4. Nginx 端口检查 =========="
if netstat -tlnp | grep -q ":80.*nginx"; then
    echo "✅ Nginx 正常监听 80 端口"
else
    echo "❌ Nginx 未监听 80 端口"
    lsof -i :80
fi

echo -e "\n========== 5. 域名访问检查 =========="
if curl -s -I http://powder.icu | grep -q "200 OK"; then
    echo "✅ 域名访问正常"
else
    echo "❌ 域名访问失败"
fi

echo -e "\n========== 6. 环境变量检查 =========="
if [ -f /www/wwwroot/my-next-app/.env.production ]; then
    echo "✅ .env.production 存在"
else
    echo "❌ .env.production 不存在"
fi

echo -e "\n========== 7. 构建文件检查 =========="
if [ -d /www/wwwroot/my-next-app/.next ]; then
    echo "✅ .next 构建目录存在"
else
    echo "❌ .next 构建目录不存在，需要运行 npm run build"
fi

echo -e "\n========== 8. 日志目录检查 =========="
if [ -d /www/wwwroot/my-next-app/logs ]; then
    echo "✅ logs 目录存在"
else
    echo "❌ logs 目录不存在"
fi
```

保存为 `/www/wwwroot/my-next-app/health-check.sh`，执行权限：

```bash
chmod +x /www/wwwroot/my-next-app/health-check.sh
./health-check.sh
```
