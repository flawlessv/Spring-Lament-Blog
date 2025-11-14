#!/bin/bash

# Spring Lament Blog - 更新部署脚本
# 用于更新已部署的应用

set -e  # 遇到错误立即退出

echo "==================================="
echo "Spring Lament Blog - 更新部署"
echo "==================================="
echo ""

# 项目目录
PROJECT_DIR="/www/wwwroot/my-next-app"

echo "📁 项目目录: $PROJECT_DIR"
echo ""

# 检查目录是否存在
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ 错误: 项目目录不存在: $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR"

# 备份当前版本
echo "💾 备份当前版本..."
BACKUP_DIR="../backups/backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r .next package.json package-lock.json "$BACKUP_DIR/" 2>/dev/null || true
echo "✅ 备份完成: $BACKUP_DIR"
echo ""

# 拉取最新代码
echo "📥 拉取最新代码..."
if [ -d ".git" ]; then
    git pull origin main
    echo "✅ 代码更新完成"
else
    echo "⚠️  不是 Git 仓库，跳过代码拉取"
fi
echo ""

# 安装依赖
echo "📦 安装/更新依赖..."
npm ci --production
echo "✅ 依赖更新完成"
echo ""

# 生成 Prisma Client
echo "🔧 生成 Prisma Client..."
npm run db:generate
echo "✅ Prisma Client 生成完成"
echo ""

# 数据库迁移
read -p "是否需要运行数据库迁移？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗄️  运行数据库迁移..."
    npm run db:push
    echo "✅ 数据库迁移完成"
    echo ""
fi

# 构建项目
echo "🏗️  构建项目..."
npm run build
echo "✅ 项目构建完成"
echo ""

# 完全重启应用（确保使用新构建）
echo "🔄 完全重启应用..."
pm2 stop spring-lament-blog || true
sleep 2
pm2 delete spring-lament-blog || true
pm2 start ecosystem.config.js --env production --update-env

# 等待应用启动
echo "⏳ 等待应用启动..."
sleep 10

# 验证应用状态
if pm2 list | grep -q "spring-lament-blog.*online"; then
    echo "✅ 应用启动成功"
else
    echo "❌ 应用启动失败，请查看日志："
    pm2 logs spring-lament-blog --lines 50
    exit 1
fi

# 保存 PM2 配置
pm2 save

echo "✅ 应用重启完成"
echo ""

# 显示状态
echo "📊 应用状态："
pm2 status
echo ""

echo "==================================="
echo "✅ 更新部署完成！"
echo "==================================="
echo ""
echo "📝 如需查看日志："
echo "   pm2 logs spring-lament-blog"
echo ""
echo "📝 如需回滚到备份版本："
echo "   cp -r $BACKUP_DIR/* $PROJECT_DIR/"
echo "   pm2 restart spring-lament-blog"
echo ""

