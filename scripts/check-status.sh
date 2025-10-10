#!/bin/bash

# Spring Lament Blog - 状态检查脚本
# 用于检查应用和服务器状态

echo "==================================="
echo "Spring Lament Blog - 状态检查"
echo "==================================="
echo ""

# 项目目录
PROJECT_DIR="/www/wwwroot/my-next-app"

# 检查 Node.js
echo "🔍 Node.js:"
if command -v node &> /dev/null; then
    echo "   ✅ 版本: $(node -v)"
else
    echo "   ❌ 未安装"
fi
echo ""

# 检查 npm
echo "🔍 npm:"
if command -v npm &> /dev/null; then
    echo "   ✅ 版本: $(npm -v)"
else
    echo "   ❌ 未安装"
fi
echo ""

# 检查 PM2
echo "🔍 PM2:"
if command -v pm2 &> /dev/null; then
    echo "   ✅ 版本: $(pm2 -v)"
    echo ""
    echo "   应用状态:"
    pm2 status
else
    echo "   ❌ 未安装"
fi
echo ""

# 检查端口
echo "🔍 端口占用:"
if command -v lsof &> /dev/null; then
    echo "   端口 80:"
    if lsof -i :80 &> /dev/null; then
        lsof -i :80 | grep LISTEN
    else
        echo "   ⚠️  未被占用（应用可能未运行）"
    fi
else
    echo "   ⚠️  无法检查（lsof 未安装）"
fi
echo ""

# 检查环境变量文件
echo "🔍 环境配置:"
if [ -f "$PROJECT_DIR/.env.production" ]; then
    echo "   ✅ .env.production 存在"
else
    echo "   ❌ .env.production 不存在"
fi
echo ""

# 检查数据库文件（如果使用 SQLite）
echo "🔍 数据库:"
if [ -f "$PROJECT_DIR/prisma/production.db" ]; then
    DB_SIZE=$(du -h "$PROJECT_DIR/prisma/production.db" | cut -f1)
    echo "   ✅ SQLite 数据库存在 (大小: $DB_SIZE)"
elif [ -f "$PROJECT_DIR/prisma/dev.db" ]; then
    DB_SIZE=$(du -h "$PROJECT_DIR/prisma/dev.db" | cut -f1)
    echo "   ⚠️  使用开发数据库 (大小: $DB_SIZE)"
else
    echo "   ℹ️  可能使用外部数据库 (PostgreSQL/MySQL)"
fi
echo ""

# 检查构建目录
echo "🔍 构建文件:"
if [ -d "$PROJECT_DIR/.next" ]; then
    echo "   ✅ .next 目录存在"
    BUILD_SIZE=$(du -sh "$PROJECT_DIR/.next" 2>/dev/null | cut -f1)
    echo "   大小: $BUILD_SIZE"
else
    echo "   ❌ .next 目录不存在（需要运行 npm run build）"
fi
echo ""

# 检查日志
echo "🔍 最近日志 (最后 5 行):"
if [ -f "$PROJECT_DIR/logs/out.log" ]; then
    echo "   输出日志:"
    tail -n 5 "$PROJECT_DIR/logs/out.log"
    echo ""
fi

if [ -f "$PROJECT_DIR/logs/err.log" ]; then
    echo "   错误日志:"
    if [ -s "$PROJECT_DIR/logs/err.log" ]; then
        tail -n 5 "$PROJECT_DIR/logs/err.log"
    else
        echo "   ✅ 无错误"
    fi
    echo ""
fi

# 检查磁盘空间
echo "🔍 磁盘空间:"
df -h "$PROJECT_DIR" | awk 'NR==2 {print "   使用: " $5 " (剩余: " $4 ")"}'
echo ""

# 检查内存使用
echo "🔍 内存使用:"
free -h | awk 'NR==2 {print "   使用: " $3 " / " $2 " (可用: " $7 ")"}'
echo ""

# 测试应用访问
echo "🔍 应用访问测试:"
if command -v curl &> /dev/null; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:80 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" = "200" ]; then
        echo "   ✅ 本地访问正常 (HTTP $HTTP_CODE)"
    else
        echo "   ❌ 本地访问失败 (HTTP $HTTP_CODE)"
    fi
else
    echo "   ⚠️  无法测试（curl 未安装）"
fi
echo ""

echo "==================================="
echo "检查完成！"
echo "==================================="
echo ""
echo "📝 如需查看实时日志:"
echo "   pm2 logs spring-lament-blog --lines 50"
echo ""

