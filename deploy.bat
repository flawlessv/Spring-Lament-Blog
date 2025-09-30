@echo off
:: Windows 部署脚本 - 部署 Spring Lament Blog 到腾讯云 Windows 服务器
:: 使用方法: deploy.bat

echo ========================================
echo Spring Lament Blog Windows 部署脚本
echo ========================================

:: 检查 Node.js 是否已安装
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo 错误: 未检测到 Node.js，请先安装 Node.js 18 或更高版本
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js 已安装，版本:
node --version

:: 检查 npm 是否可用
npm --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo 错误: npm 未安装或不可用
    pause
    exit /b 1
)

echo ✅ npm 已安装，版本:
npm --version

:: 安装 PM2 (如果未安装)
pm2 --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo 📦 正在安装 PM2...
    npm install -g pm2
    npm install -g pm2-windows-startup
    if %ERRORLEVEL% neq 0 (
        echo 错误: PM2 安装失败
        pause
        exit /b 1
    )
)

echo ✅ PM2 已准备就绪

:: 安装项目依赖
echo 📦 正在安装项目依赖...
npm install --production
if %ERRORLEVEL% neq 0 (
    echo 错误: 依赖安装失败
    pause
    exit /b 1
)

:: 生成 Prisma 客户端
echo 🔧 正在生成 Prisma 客户端...
npm run db:generate
if %ERRORLEVEL% neq 0 (
    echo 错误: Prisma 客户端生成失败
    pause
    exit /b 1
)

:: 推送数据库结构
echo 🗃️ 正在设置数据库...
npm run db:push
if %ERRORLEVEL% neq 0 (
    echo 错误: 数据库设置失败
    pause
    exit /b 1
)

:: 填充初始数据
echo 🌱 正在填充初始数据...
npm run db:seed
if %ERRORLEVEL% neq 0 (
    echo 警告: 初始数据填充失败，可能数据已存在
)

:: 构建项目
echo 🏗️ 正在构建项目...
npm run build
if %ERRORLEVEL% neq 0 (
    echo 错误: 项目构建失败
    pause
    exit /b 1
)

:: 创建 logs 目录
if not exist "logs" mkdir logs

:: 配置 PM2 Windows 服务 (可选)
echo 🔧 配置 PM2 Windows 服务...
pm2-startup install
pm2 save

echo ========================================
echo ✅ 部署完成！
echo ========================================
echo.
echo 📝 下一步操作:
echo 1. 检查 .env.production 文件并修改配置
echo 2. 运行 'npm run pm2:start' 启动服务
echo 3. 运行 'pm2 list' 查看服务状态
echo 4. 访问 http://您的服务器IP:3000
echo.
echo 🔐 默认管理员账户:
echo 用户名: admin
echo 密码: 0919 (请及时修改)
echo.
pause