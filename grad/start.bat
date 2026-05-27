@echo off
REM 移动端记账本 - Windows 快速启动脚本

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo 移动端记账本 - 项目启动
echo ==========================================
echo.

REM 检查 Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js ^>= 14.0.0
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js 版本: %NODE_VERSION%
echo.

REM 检查 .env 文件
if not exist .env (
    echo 📝 创建 .env 文件...
    copy .env.example .env
    echo ✅ .env 文件已创建，请编辑配置数据库信息
    echo.
)

REM 后端启动
echo ==========================================
echo 启动后端服务...
echo ==========================================
echo.

cd backend

REM 检查依赖
if not exist node_modules (
    echo 📦 安装后端依赖...
    call npm install
    echo.
)

REM 初始化数据库
echo 🗄️  初始化数据库...
node database/init.js >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  数据库初始化可能失败，请检查数据库配置
)
echo.

REM 启动后端
echo 🚀 启动后端服务 (http://localhost:7001)...
start "Backend - Mobile Accounting" cmd /k npm run dev
echo ✅ 后端已启动
echo.

REM 等待后端启动
timeout /t 3 /nobreak

REM 前端启动
echo ==========================================
echo 启动前端服务...
echo ==========================================
echo.

cd ..\frontend

REM 检查依赖
if not exist node_modules (
    echo 📦 安装前端依赖...
    call npm install
    echo.
)

REM 启动前端
echo 🚀 启动前端服务 (http://localhost:3000)...
start "Frontend - Mobile Accounting" cmd /k npm start
echo ✅ 前端已启动
echo.

echo ==========================================
echo ✅ 项目启动成功！
echo ==========================================
echo.
echo 📱 前端地址: http://localhost:3000
echo 🔌 后端地址: http://localhost:7001
echo 📚 API 文档: http://localhost:7001/health
echo.
echo 提示: 两个新窗口已打开，分别运行前端和后端服务
echo.

pause
