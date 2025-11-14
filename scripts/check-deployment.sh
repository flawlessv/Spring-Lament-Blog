#!/bin/bash

# Spring Lament Blog - 部署状态诊断脚本
# 用于检查部署状态和问题

echo "==================================="
echo "Spring Lament Blog - 部署诊断"
echo "==================================="
echo ""

# 项目目录
PROJECT_DIR="/www/wwwroot/my-next-app"

if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ 错误: 项目目录不存在: $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR"

# 1. 检查 PM2 状态
echo "📊 PM2 状态："
echo "-----------------------------------"
pm2 list | grep spring-lament-blog || echo "❌ PM2 进程不存在"
echo ""

# 2. 检查构建目录
echo "📁 构建目录检查："
echo "-----------------------------------"
if [ -d ".next" ]; then
    echo "✅ .next 目录存在"
    if [ -f ".next/BUILD_ID" ]; then
        BUILD_ID=$(cat .next/BUILD_ID)
        echo "   Build ID: $BUILD_ID"
    else
        echo "   ⚠️  BUILD_ID 文件不存在"
    fi
    
    if [ -d ".next/static" ]; then
        STATIC_COUNT=$(find .next/static -type f | wc -l)
        echo "   ✅ 静态资源目录存在"
        echo "   静态文件数量: $STATIC_COUNT"
    else
        echo "   ❌ 静态资源目录不存在"
    fi
    
    NEXT_SIZE=$(du -sh .next | cut -f1)
    echo "   .next 目录大小: $NEXT_SIZE"
else
    echo "❌ .next 目录不存在 - 需要重新构建"
fi
echo ""

# 3. 检查应用是否运行
echo "🌐 应用运行状态："
echo "-----------------------------------"
if pm2 list | grep -q "spring-lament-blog.*online"; then
    echo "✅ PM2 进程运行中"
    
    # 检查端口
    if netstat -tuln | grep -q ":3000"; then
        echo "✅ 端口 3000 正在监听"
    else
        echo "❌ 端口 3000 未监听"
    fi
    
    # 测试本地连接
    if curl -f -s http://127.0.0.1:3000 > /dev/null 2>&1; then
        echo "✅ 本地连接正常"
    else
        echo "❌ 本地连接失败"
    fi
else
    echo "❌ PM2 进程未运行"
fi
echo ""

# 4. 检查代码版本
echo "📝 代码版本信息："
echo "-----------------------------------"
if [ -d ".git" ]; then
    echo "Git 提交: $(git rev-parse --short HEAD 2>/dev/null || echo 'N/A')"
    echo "Git 分支: $(git branch --show-current 2>/dev/null || echo 'N/A')"
    echo "最后提交: $(git log -1 --format='%ci %s' 2>/dev/null || echo 'N/A')"
else
    echo "⚠️  不是 Git 仓库"
fi
echo ""

# 5. 检查环境变量
echo "🔐 环境变量检查："
echo "-----------------------------------"
if [ -f ".env.production" ]; then
    echo "✅ .env.production 文件存在"
    if grep -q "DATABASE_URL" .env.production; then
        echo "   ✅ DATABASE_URL 已配置"
    else
        echo "   ❌ DATABASE_URL 未配置"
    fi
    if grep -q "NEXTAUTH_SECRET" .env.production; then
        echo "   ✅ NEXTAUTH_SECRET 已配置"
    else
        echo "   ❌ NEXTAUTH_SECRET 未配置"
    fi
else
    echo "❌ .env.production 文件不存在"
fi
echo ""

# 6. 检查 PM2 日志（最近错误）
echo "📋 PM2 最近日志（最后20行）："
echo "-----------------------------------"
pm2 logs spring-lament-blog --lines 20 --nostream 2>/dev/null || echo "无法获取日志"
echo ""

# 7. 检查 Nginx 配置
echo "🌐 Nginx 配置检查："
echo "-----------------------------------"
if command -v nginx &> /dev/null; then
    if nginx -t 2>&1 | grep -q "successful"; then
        echo "✅ Nginx 配置有效"
    else
        echo "❌ Nginx 配置有错误"
        nginx -t
    fi
else
    echo "⚠️  Nginx 未安装或不在 PATH 中"
fi
echo ""

# 8. 建议
echo "💡 建议操作："
echo "-----------------------------------"
if [ ! -d ".next" ]; then
    echo "1. 运行构建: npm run build"
fi

if ! pm2 list | grep -q "spring-lament-blog.*online"; then
    echo "2. 启动应用: pm2 start ecosystem.config.js"
fi

if pm2 list | grep -q "spring-lament-blog.*online"; then
    echo "3. 如果问题持续，尝试完全重新部署:"
    echo "   bash scripts/redeploy.sh"
fi

echo ""
echo "==================================="
echo "诊断完成"
echo "==================================="

