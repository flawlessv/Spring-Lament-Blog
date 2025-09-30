#!/bin/bash

# Spring Lament Blog Linux/macOS 部署脚本
# 使用方法: bash deploy.sh

set -e

echo "🚀 开始部署 Spring Lament Blog"
echo "================================"

# 检查 Node.js 版本
echo "📋 检查环境..."
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未检测到 Node.js，请先安装 Node.js 18 或更高版本"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

node_version=$(node -v)
echo "✅ Node.js 版本: $node_version"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: npm 未安装或不可用"
    exit 1
fi

echo "✅ npm 版本: $(npm --version)"

# 安装 PM2 (如果未安装)
if ! command -v pm2 &> /dev/null; then
    echo "📦 正在安装 PM2..."
    npm install -g pm2
    if [ $? -ne 0 ]; then
        echo "❌ 错误: PM2 安装失败"
        exit 1
    fi
fi

echo "✅ PM2 已准备就绪"

# 检查环境变量文件
if [ ! -f .env.production ]; then
    echo "📝 创建环境变量文件..."
    echo "⚠️  请编辑 .env.production 文件配置数据库连接等信息"
    echo "配置完成后重新运行此脚本"
    exit 1
fi

echo "✅ 环境检查通过"

# 安装依赖
echo "📦 安装依赖..."
npm install --production
if [ $? -ne 0 ]; then
    echo "❌ 错误: 依赖安装失败"
    exit 1
fi

# 生成 Prisma 客户端
echo "🔧 生成 Prisma 客户端..."
npm run db:generate
if [ $? -ne 0 ]; then
    echo "❌ 错误: Prisma 客户端生成失败"
    exit 1
fi

# 构建项目
echo "🏗️ 构建项目..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 错误: 项目构建失败"
    exit 1
fi

# 创建日志目录
echo "📁 创建日志目录..."
mkdir -p logs

# 数据库设置
echo "🗄️ 设置数据库..."
read -p "是否需要初始化数据库？(y/N): " init_db
if [[ $init_db =~ ^[Yy]$ ]]; then
    echo "正在推送数据库架构..."
    npm run db:push
    
    echo "正在填充初始数据..."
    npm run db:seed
    
    echo "✅ 数据库初始化完成"
fi

# 停止现有的 PM2 进程
echo "🔄 停止现有服务..."
pm2 stop spring-lament-blog || true
pm2 delete spring-lament-blog || true

# 启动 PM2 服务
echo "🚀 启动服务..."
npm run pm2:start

# 保存 PM2 配置
echo "💾 保存 PM2 配置..."
pm2 save

# 设置开机自启
echo "⚙️ 设置开机自启..."
pm2 startup || echo "请手动运行 pm2 startup 命令设置开机自启"

echo ""
echo "🎉 部署完成！"
echo "================================"
echo "📊 服务状态:"
pm2 status
echo ""
echo "🔍 实用命令:"
echo "  查看日志: pm2 logs spring-lament-blog"
echo "  重启服务: npm run pm2:restart"
echo "  停止服务: npm run pm2:stop"
echo "  服务监控: pm2 monit"
echo ""
echo "🌐 访问地址: http://您的服务器IP:3000"
echo "🔑 管理后台: http://您的服务器IP:3000/admin"
echo ""
echo "⚠️ 请确保配置防火墙允许 3000 端口访问"