# 移动端记账本 - 后端项目

## 项目概述

这是移动端记账本应用的后端部分，采用 Egg.js + MySQL 技术栈。

## 技术栈

- **框架**：Egg.js 3.x
- **数据库**：MySQL
- **认证**：JWT（双 token 模式）
- **密码加密**：bcryptjs
- **CORS**：egg-cors

## 项目结构

```
app/
├── controller/          # 控制器
│   ├── home.js         # 首页
│   ├── auth.js         # 认证
│   ├── category.js     # 分类
│   ├── transaction.js  # 交易
│   └── report.js       # 报表
├── service/            # 业务逻辑
│   ├── user.js        # 用户服务
│   ├── category.js    # 分类服务
│   ├── transaction.js # 交易服务
│   └── report.js      # 报表服务
├── model/             # 数据模型（待实现）
├── middleware/        # 中间件（待实现）
└── router.js          # 路由配置

config/
├── config.default.js  # 默认配置
├── config.prod.js     # 生产环境配置
└── config.local.js    # 本地开发配置

database/
└── migrations/        # 数据库迁移脚本（待实现）

app.js                 # 应用启动文件
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

服务将在 `http://localhost:7001` 启动。

### 生产模式

```bash
npm start
```

### 停止服务

```bash
npm stop
```

### 运行测试

```bash
npm test
```

### 代码检查

```bash
npm run lint
```

## 环境变量

创建 `.env` 文件，配置以下变量：

```
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=mobile_accounting
JWT_SECRET=your-secret-key
```

## API 文档

### 认证相关

#### 用户注册
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "user",
  "email": "user@example.com",
  "password": "password"
}
```

#### 用户登陆
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

#### 刷新 Token
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "token"
}
```

#### 获取当前用户
```
GET /api/auth/me
Authorization: Bearer <accessToken>
```

### 分类相关

#### 获取分类列表
```
GET /api/categories?type=expense
Authorization: Bearer <accessToken>
```

#### 创建分类
```
POST /api/categories
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "食物",
  "type": "expense"
}
```

### 交易相关

#### 获取交易列表
```
GET /api/transactions?page=1&pageSize=10
Authorization: Bearer <accessToken>
```

#### 创建交易
```
POST /api/transactions
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "categoryId": "1",
  "amount": 100,
  "type": "expense",
  "description": "午餐",
  "date": "2024-01-01"
}
```

### 报表相关

#### 获取月度报表
```
GET /api/reports/monthly?year=2024&month=1
Authorization: Bearer <accessToken>
```

#### 获取分类统计
```
GET /api/reports/category-stats?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <accessToken>
```

## 开发规范

详见项目根目录的 [`.codewiz/rules/project-rules.md`](../.codewiz/rules/project-rules.md)

## 数据库设计

### 用户表 (users)
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 分类表 (categories)
```sql
CREATE TABLE categories (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  icon VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 交易表 (transactions)
```sql
CREATE TABLE transactions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  category_id VARCHAR(36) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

## 贡献指南

1. 创建新分支：`git checkout -b feature/your-feature`
2. 提交更改：`git commit -m '[feat] your feature'`
3. 推送分支：`git push origin feature/your-feature`
4. 创建 Pull Request

## 许可证

MIT
