#!/bin/bash

# 移动端记账本 - 快速启动脚本

set -e

echo "=========================================="
echo "移动端记账本 - 项目启动"
echo "=========================================="
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js >= 14.0.0"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo ""

# 检查 MySQL
if ! command -v mysql &> /dev/null; then
    echo "⚠️  警告: 未找到 MySQL 命令行工具"
    echo "   请确保 MySQL 服务已启动"
fi

echo ""

# 检查 .env 文件
if [ ! -f .env ]; then
    echo "📝 创建 .env 文件..."
    cp .env.example .env
    echo "✅ .env 文件已创建，请编辑配置数据库信息"
    echo ""
fi

# 后端启动
echo "=========================================="
echo "启动后端服务..."
echo "=========================================="
echo ""

cd backend

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装后端依赖..."
    npm install
    echo ""
fi

# 初始化数据库
echo "🗄️  初始化数据库..."
node database/init.js 2>/dev/null || echo "⚠️  数据库初始化可能失败，请检查数据库配置"
echo ""

# 启动后端
echo "🚀 启动后端服务 (http://localhost:7001)..."
npm run dev &
BACKEND_PID=$!
echo "✅ 后端进程 ID: $BACKEND_PID"
echo ""

# 等待后端启动
sleep 3

# 前端启动
echo "=========================================="
echo "启动前端服务..."
echo "=========================================="
echo ""

cd ../frontend

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    npm install
    echo ""
fi

# 启动前端
echo "🚀 启动前端服务 (http://localhost:3000)..."
npm start &
FRONTEND_PID=$!
echo "✅ 前端进程 ID: $FRONTEND_PID"
echo ""

echo "=========================================="
echo "✅ 项目启动成功！"
echo "=========================================="
echo ""
echo "📱 前端地址: http://localhost:3000"
echo "🔌 后端地址: http://localhost:7001"
echo "📚 API 文档: http://localhost:7001/health"
echo ""
echo "按 Ctrl+C 停止所有服务"
echo ""

# 等待用户中断
wait
