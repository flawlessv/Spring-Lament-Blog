#!/bin/bash
# Spring Lament Blog - 部署健康检查脚本
# 用于快速检查生产环境的部署状态

echo "========================================="
echo "  Spring Lament Blog 健康检查"
echo "========================================="

# 项目目录
PROJECT_DIR="/www/wwwroot/my-next-app"
DOMAIN="powder.icu"

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "\n========== 1. PM2 状态检查 =========="
if pm2 list | grep -q "spring-lament-blog"; then
    PM2_STATUS=$(pm2 list | grep "spring-lament-blog" | awk '{print $10}')
    if [ "$PM2_STATUS" = "online" ]; then
        echo -e "${GREEN}✅ PM2 应用状态：online${NC}"
    else
        echo -e "${RED}❌ PM2 应用状态：$PM2_STATUS${NC}"
    fi
    pm2 status
else
    echo -e "${RED}❌ PM2 应用未找到${NC}"
fi

echo -e "\n========== 2. 应用端口检查 (3000) =========="
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ 应用在 3000 端口正常运行${NC}"
else
    echo -e "${RED}❌ 应用无法访问 3000 端口${NC}"
fi

echo -e "\n========== 3. Nginx 状态检查 =========="
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx 服务正在运行${NC}"
    systemctl status nginx | head -n 5
else
    echo -e "${RED}❌ Nginx 服务未运行${NC}"
fi

echo -e "\n========== 4. Nginx 端口检查 (80) =========="
if netstat -tlnp | grep -q ":80.*nginx"; then
    echo -e "${GREEN}✅ Nginx 正常监听 80 端口${NC}"
else
    echo -e "${RED}❌ Nginx 未监听 80 端口${NC}"
    echo "占用 80 端口的进程："
    lsof -i :80
fi

echo -e "\n========== 5. 域名访问检查 =========="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ 域名 http://$DOMAIN 访问正常 (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}❌ 域名访问失败 (HTTP $HTTP_CODE)${NC}"
fi

echo -e "\n========== 6. 环境变量检查 =========="
if [ -f "$PROJECT_DIR/.env.production" ]; then
    echo -e "${GREEN}✅ .env.production 存在${NC}"
    # 检查关键环境变量（不显示值）
    if grep -q "DATABASE_URL" "$PROJECT_DIR/.env.production"; then
        echo "  - DATABASE_URL: 已配置"
    fi
    if grep -q "NEXTAUTH_SECRET" "$PROJECT_DIR/.env.production"; then
        echo "  - NEXTAUTH_SECRET: 已配置"
    fi
    if grep -q "NEXTAUTH_URL" "$PROJECT_DIR/.env.production"; then
        echo "  - NEXTAUTH_URL: 已配置"
    fi
else
    echo -e "${RED}❌ .env.production 不存在${NC}"
fi

echo -e "\n========== 7. 构建文件检查 =========="
if [ -d "$PROJECT_DIR/.next" ]; then
    echo -e "${GREEN}✅ .next 构建目录存在${NC}"
    BUILD_ID=$(cat "$PROJECT_DIR/.next/BUILD_ID" 2>/dev/null)
    if [ -n "$BUILD_ID" ]; then
        echo "  - Build ID: $BUILD_ID"
    fi
else
    echo -e "${RED}❌ .next 构建目录不存在，需要运行 npm run build${NC}"
fi

echo -e "\n========== 8. 日志目录检查 =========="
if [ -d "$PROJECT_DIR/logs" ]; then
    echo -e "${GREEN}✅ logs 目录存在${NC}"
    LOG_COUNT=$(ls -1 "$PROJECT_DIR/logs" 2>/dev/null | wc -l)
    echo "  - 日志文件数量: $LOG_COUNT"
else
    echo -e "${RED}❌ logs 目录不存在${NC}"
fi

echo -e "\n========== 9. Node.js 版本检查 =========="
NODE_VERSION=$(node -v)
echo "  - Node.js 版本: $NODE_VERSION"
if [[ "$NODE_VERSION" =~ ^v(1[8-9]|[2-9][0-9]) ]]; then
    echo -e "${GREEN}✅ Node.js 版本符合要求 (>= 18)${NC}"
else
    echo -e "${RED}❌ Node.js 版本过低，建议升级到 18 或更高${NC}"
fi

echo -e "\n========== 10. 磁盘空间检查 =========="
DISK_USAGE=$(df -h "$PROJECT_DIR" | awk 'NR==2 {print $5}' | sed 's/%//')
echo "  - 磁盘使用率: ${DISK_USAGE}%"
if [ "$DISK_USAGE" -lt 80 ]; then
    echo -e "${GREEN}✅ 磁盘空间充足${NC}"
else
    echo -e "${RED}⚠️  磁盘使用率较高，建议清理${NC}"
fi

echo -e "\n========== 11. 最近的应用日志 =========="
if [ -d "$PROJECT_DIR/logs" ]; then
    echo "最近 5 条错误日志："
    if [ -f "$PROJECT_DIR/logs/err.log" ]; then
        tail -n 5 "$PROJECT_DIR/logs/err.log" 2>/dev/null || echo "无错误日志"
    else
        echo "无错误日志文件"
    fi
fi

echo -e "\n========================================="
echo "  检查完成！"
echo "========================================="

