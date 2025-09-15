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
npm install --production
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

```bash
# 生成 Prisma 客户端
npx prisma generate

# 推送数据库架构
npx prisma db push

# 填充初始数据
npm run db:seed
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
