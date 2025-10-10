#!/bin/bash

# Spring Lament Blog - 服务器初始化脚本
# 用于首次在服务器上设置项目

set -e  # 遇到错误立即退出

echo "==================================="
echo "Spring Lament Blog - 服务器初始化"
echo "==================================="
echo ""

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    echo "❌ 请使用 root 用户或 sudo 运行此脚本"
    exit 1
fi

# 项目目录
PROJECT_DIR="/www/wwwroot/my-next-app"

echo "📁 项目目录: $PROJECT_DIR"
echo ""

# 检查目录是否存在
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ 错误: 项目目录不存在: $PROJECT_DIR"
    echo "请先在宝塔面板中创建网站"
    exit 1
fi

cd "$PROJECT_DIR"

# 检查 Node.js
echo "🔍 检查 Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请在宝塔面板安装 Node.js 20.x"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js 版本: $NODE_VERSION"
echo ""

# 检查 npm
echo "🔍 检查 npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm 版本: $NPM_VERSION"
echo ""

# 检查 PM2
echo "🔍 检查 PM2..."
if ! command -v pm2 &> /dev/null; then
    echo "⚠️  PM2 未安装，正在安装..."
    npm install -g pm2
    echo "✅ PM2 安装完成"
else
    PM2_VERSION=$(pm2 -v)
    echo "✅ PM2 版本: $PM2_VERSION"
fi
echo ""

# 检查环境变量文件
echo "🔍 检查环境变量..."
if [ ! -f ".env.production" ]; then
    echo "⚠️  未找到 .env.production 文件"
    echo "正在创建模板文件..."
    
    cat > .env.production << 'EOF'
# 数据库配置
DATABASE_URL="postgresql://blog_user:your_password@localhost:5432/spring_lament_blog?schema=public"

# NextAuth 配置
NEXTAUTH_SECRET="请使用-openssl-rand-base64-32-生成密钥"
NEXTAUTH_URL="http://powder.icu"

# Node 环境
NODE_ENV="production"
EOF
    
    echo "✅ 已创建 .env.production 模板"
    echo "⚠️  请编辑此文件并填入正确的配置信息！"
    echo ""
    echo "生成 NEXTAUTH_SECRET："
    echo "$(openssl rand -base64 32)"
    echo ""
    echo "按 Enter 键继续编辑环境变量文件..."
    read
    
    # 尝试打开编辑器
    if command -v nano &> /dev/null; then
        nano .env.production
    elif command -v vi &> /dev/null; then
        vi .env.production
    else
        echo "请手动编辑: $PROJECT_DIR/.env.production"
    fi
else
    echo "✅ 找到 .env.production 文件"
fi
echo ""

# 安装依赖
echo "📦 安装项目依赖..."
npm ci --production
echo "✅ 依赖安装完成"
echo ""

# 生成 Prisma Client
echo "🔧 生成 Prisma Client..."
npm run db:generate
echo "✅ Prisma Client 生成完成"
echo ""

# 初始化数据库
echo "🗄️  初始化数据库..."
read -p "是否需要初始化数据库？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run db:push
    echo "✅ 数据库初始化完成"
    echo ""
    
    # 运行种子数据
    read -p "是否需要创建初始管理员账户？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm run db:seed
        echo "✅ 初始数据创建完成"
        echo ""
        echo "📝 默认管理员账户："
        echo "   用户名: admin"
        echo "   密码: admin123"
        echo "   ⚠️  请登录后立即修改密码！"
    fi
fi
echo ""

# 构建项目
echo "🏗️  构建项目..."
npm run build
echo "✅ 项目构建完成"
echo ""

# 创建日志目录
echo "📝 创建日志目录..."
mkdir -p logs
echo "✅ 日志目录创建完成"
echo ""

# 启动应用
echo "🚀 启动应用..."
npm run pm2:start

# 保存 PM2 配置
pm2 save

# 设置 PM2 开机自启
pm2 startup | grep -v PM2 | bash

echo "✅ 应用启动完成"
echo ""

# 显示状态
echo "📊 应用状态："
pm2 status
echo ""

echo "==================================="
echo "✅ 部署完成！"
echo "==================================="
echo ""
echo "🌐 访问地址："
echo "   网站首页: http://powder.icu"
echo "   管理后台: http://powder.icu/admin"
echo ""
echo "📝 有用的命令："
echo "   查看状态: pm2 status"
echo "   查看日志: pm2 logs spring-lament-blog"
echo "   重启应用: pm2 restart spring-lament-blog"
echo "   停止应用: pm2 stop spring-lament-blog"
echo ""
echo "📚 更多信息请查看: docs/BAOTA-DEPLOYMENT.md"
echo ""

