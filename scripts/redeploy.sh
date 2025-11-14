#!/bin/bash

# Spring Lament Blog - 完整重新部署脚本
# 确保使用最新构建的代码

set -e  # 遇到错误立即退出

echo "==================================="
echo "Spring Lament Blog - 完整重新部署"
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

# 1. 完全停止并删除 PM2 进程
echo "🛑 停止并删除 PM2 进程..."
pm2 stop spring-lament-blog || true
sleep 2
pm2 delete spring-lament-blog || true
echo "✅ PM2 进程已清理"
echo ""

# 2. 检查并清理旧的构建文件（可选，取消注释以启用）
# echo "🧹 清理旧的构建文件..."
# rm -rf .next
# echo "✅ 构建文件已清理"
# echo ""

# 3. 验证当前代码版本
echo "📋 当前代码信息："
if [ -d ".git" ]; then
    echo "Git 提交: $(git rev-parse --short HEAD)"
    echo "Git 分支: $(git branch --show-current)"
    echo "最后提交: $(git log -1 --format='%ci %s')"
else
    echo "⚠️  不是 Git 仓库"
fi
echo ""

# 4. 安装/更新依赖（包含 devDependencies，Next.js 构建需要）
echo "📦 安装/更新依赖..."
npm ci
echo "✅ 依赖更新完成"
echo ""

# 5. 生成 Prisma Client
echo "🔧 生成 Prisma Client..."
npm run db:generate
echo "✅ Prisma Client 生成完成"
echo ""

# 6. 构建项目
echo "🏗️  构建项目..."
echo "开始时间: $(date '+%Y-%m-%d %H:%M:%S')"
npm run build
echo "结束时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "✅ 项目构建完成"
echo ""

# 7. 验证构建结果
echo "🔍 验证构建结果..."
if [ ! -d ".next" ]; then
    echo "❌ 错误: .next 目录不存在，构建失败！"
    exit 1
fi

if [ ! -f ".next/BUILD_ID" ]; then
    echo "❌ 错误: BUILD_ID 文件不存在，构建不完整！"
    exit 1
fi

BUILD_ID=$(cat .next/BUILD_ID)
echo "✅ 构建验证成功"
echo "   Build ID: $BUILD_ID"
echo "   .next 目录大小: $(du -sh .next | cut -f1)"
echo ""

# 8. 检查静态资源
echo "🔍 检查静态资源..."
if [ -d ".next/static" ]; then
    echo "✅ 静态资源目录存在"
    echo "   静态文件数量: $(find .next/static -type f | wc -l)"
else
    echo "⚠️  警告: 静态资源目录不存在"
fi
echo ""

# 9. 重新启动 PM2
echo "🚀 启动 PM2 应用..."
pm2 start ecosystem.config.js --env production --update-env

# 等待应用启动
echo "⏳ 等待应用启动..."
sleep 10

# 10. 验证 PM2 状态
echo "📊 验证 PM2 状态..."
pm2 list

if pm2 list | grep -q "spring-lament-blog.*online"; then
    echo "✅ 应用启动成功"
else
    echo "❌ 应用启动失败，请查看日志："
    pm2 logs spring-lament-blog --lines 50
    exit 1
fi
echo ""

# 11. 保存 PM2 配置
pm2 save

# 12. 测试应用
echo "🧪 测试应用..."
sleep 5
if curl -f -s http://127.0.0.1:3000 > /dev/null; then
    echo "✅ 应用响应正常"
else
    echo "⚠️  警告: 应用可能未正常响应，请检查日志"
    pm2 logs spring-lament-blog --lines 20
fi
echo ""

echo "==================================="
echo "✅ 重新部署完成！"
echo "==================================="
echo ""
echo "📝 有用的命令："
echo "   查看状态: pm2 status"
echo "   查看日志: pm2 logs spring-lament-blog"
echo "   查看实时日志: pm2 logs spring-lament-blog --lines 100"
echo "   重启应用: pm2 restart spring-lament-blog"
echo ""
echo "🔍 检查构建信息："
echo "   Build ID: $BUILD_ID"
echo "   构建时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

