# 移动端记账本

## 项目概述

这是一个移动端记账本应用，用于帮助用户记录和管理日常开支。用户可以快速录入收支信息，通过可视化图表分析消费情况，并通过日历视图快速定位特定日期的消费记录。

## 技术栈

### 前端
- **框架**：React 18
- **语言**：TypeScript
- **路由**：React Router v6
- **HTTP 客户端**：Axios
- **可视化**：ECharts
- **日历**：React Big Calendar
- **样式**：苹果官网简约风格 CSS

### 后端
- **框架**：Egg.js 3.x
- **认证**：JWT 双 token 模式
- **密码加密**：bcryptjs
- **CORS**：egg-cors

### 数据库
- **类型**：MySQL
- **ORM**：egg-orm

## 核心功能

### 1. 用户认证模块
- 用户注册和登陆
- JWT 双 token 模式（Access Token + Refresh Token）
- 安全的鉴权机制
- 自动 token 刷新

### 2. 记账管理模块
- 快速录入收入和支出金额
- 支持自定义分类
- 记录交易时间
- 添加交易备注
- 交易记录查询和管理
- 支持标签功能（为交易添加多个标签）
- 数据导出功能（支持 CSV、Excel 格式）

### 3. 账单搜索模块
- 支持通过金额、类别、备注等关键词进行搜索
- 高级筛选功能
- 搜索历史记录

### 4. 预算管理模块
- 为每个收支类别设置月度预算
- 实时预算使用情况展示
- 超出预算时弹窗推送提醒
- 预算统计和分析

### 5. 报表分析模块
- 可视化图表展示
- ECharts 饼状图展示消费分布
- 分类统计数据
- 收支趋势分析
- 支持按时间段统计

### 6. 日历视图模块
- 日历界面展示
- 快速定位特定日期的消费记录
- 直观查看每日消费情况

### 7. AI Chat Agent 模块
- 智能对话助手
- 支持接入大模型 API
- 自然语言查询账单
- 智能财务建议

## 项目结构

```
grad/
├── frontend/                      # React 前端项目
│   ├── src/
│   │   ├── components/           # React 组件
│   │   │   ├── auth/            # 认证相关组件 ✅
│   │   │   │   ├── login.tsx
│   │   │   │   ├── register.tsx
│   │   │   │   ├── change-password.tsx
│   │   │   │   ├── auth.css
│   │   │   │   └── index.ts
│   │   │   ├── protected-route.tsx # 受保护的路由 ✅
│   │   │   ├── accounting/      # 记账相关组件
│   │   │   ├── search/          # 搜索相关组件
│   │   │   ├── budget/          # 预算相关组件
│   │   │   ├── report/          # 报表相关组件
│   │   │   ├── calendar/        # 日历相关组件
│   │   │   ├── chat/            # AI Chat 相关组件
│   │   │   └── layout/          # 布局组件（底部 Tab 导航）
│   │   ├── pages/               # 页面组件
│   │   ├── services/            # API 服务
│   │   │   ├── api.ts          # API 客户端
│   │   │   ├── auth.ts         # 认证服务 ✅
│   │   │   ├── accounting.ts   # 记账服务
│   │   │   ├── search.ts       # 搜索服务
│   │   │   ├── budget.ts       # 预算服务
│   │   │   ├── report.ts       # 报表服务
│   │   │   └── chat.ts         # Chat 服务
│   │   ├── hooks/               # 自定义 Hooks
│   │   │   └── useAuth.ts      # 认证 Hook ✅
│   │   ├── utils/               # 工具函数
│   │   │   ├── date.ts         # 日期工具
│   │   │   ├── currency.ts     # 货币工具
│   │   │   └── index.ts        # 导出
│   │   ├── types/               # TypeScript 类型定义
│   │   │   └── index.ts        # 类型定义
│   │   ├── styles/              # 全局样式
│   │   │   └── index.css       # 全局样式
│   │   ├── App.tsx             # 应用主组件 ✅
│   │   ├── App.css             # 应用样式
│   │   └── index.tsx           # 入口文件
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── .gitignore
│   └── README.md
│
├── backend/                       # Egg.js 后端项目
│   ├── app/
│   │   ├── controller/          # 控制器
│   │   │   ├── home.js         # 首页
│   │   │   ├── auth.js         # 认证 ✅
│   │   │   ├── category.js     # 分类
│   │   │   ├── transaction.js  # 交易
│   │   │   ├── search.js       # 搜索
│   │   │   ├── budget.js       # 预算
│   │   │   ├── report.js       # 报表
│   │   │   └── chat.js         # Chat
│   │   ├── service/            # 业务逻辑
│   │   │   ├── user.js        # 用户服务 ✅
│   │   │   ├── category.js    # 分类服务
│   │   │   ├── transaction.js # 交易服务
│   │   │   ├── search.js      # 搜索服务
│   │   │   ├── budget.js      # 预算服务
│   │   │   ├── report.js      # 报表服务
│   │   │   └── chat.js        # Chat 服务
│   │   ├── model/              # 数据模型
│   │   │   ├── user.js        # 用户模型 ✅
│   │   │   └── refresh-token.js # 刷新令牌模型 ✅
│   │   ├── middleware/         # 中间件
│   │   │   ├── auth.js        # JWT 认证中间件 ✅
│   │   │   └── error-handler.js # 错误处理中间件 ✅
│   │   └── router.js           # 路由配置 ✅
│   ├── config/
│   │   ├── config.default.js  # 默认配置 ✅
│   │   ├── config.prod.js     # 生产环境配置 ✅
│   │   └── config.local.js    # 本地开发配置 ✅
│   ├── database/               # 数据库相关
│   │   ├── migrations/         # 数据库迁移脚本
│   │   │   └── 001-init-schema.sql
│   │   └── init.js            # 数据库初始化脚本
│   ├── package.json
│   ├── app.js                 # 应用启动文件
│   ├── API_DOCS.md            # API 文档 ✅
│   ├── .gitignore
│   └── README.md
│
├── .codewiz/                    # Codewiz 配置
│   └── rules/
│       └── project-rules.md    # 项目规则和开发标准
├── README.md                   # 项目说明（本文件）
├── .env.example               # 环境变量模板
└── .gitignore                 # Git 忽略文件
```

## 开发标准

详见 [`.codewiz/rules/project-rules.md`](.codewiz/rules/project-rules.md)

主要包括：
- **命名规范**：前后端命名约定
- **代码风格**：缩进、行长、注释等要求
- **提交规范**：Git 提交信息格式
- **项目结构**：推荐的目录组织方式
- **React 规范**：组件、样式、API 调用规范
- **Egg.js 规范**：控制器、服务、API 响应格式
- **数据库规范**：表设计、索引、字段命名
- **安全规范**：敏感信息管理、防护措施
- **依赖管理**：依赖更新和版本锁定

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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);
```

### 刷新令牌表 (refresh_tokens)
```sql
CREATE TABLE refresh_tokens (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 快速开始

### 前置要求
- Node.js >= 14.0.0
- MySQL >= 5.7
- npm 或 yarn

### 环境配置

1. 复制环境变量模板：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，配置数据库和 JWT 密钥：
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=mobile_accounting
JWT_SECRET=your-secret-key-here
```

### 数据库初始化

```bash
cd backend
npm install
node database/init.js
```

### 前端开发

```bash
cd frontend
npm install
npm start
```

应用将在 `http://localhost:3000` 启动。

### 后端开发

```bash
cd backend
npm install
npm run dev
```

服务将在 `http://localhost:7001` 启动。

## API 文档

详见 [`backend/API_DOCS.md`](backend/API_DOCS.md) 和 [`backend/README.md`](backend/README.md)

### 认证相关 API ✅
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登陆
- `POST /api/auth/refresh` - 刷新 token
- `GET /api/auth/me` - 获取当前用户
- `POST /api/auth/change-password` - 修改密码
- `POST /api/auth/logout` - 用户登出

### 分类相关 API
- `GET /api/categories` - 获取分类列表
- `POST /api/categories` - 创建分类
- `PUT /api/categories/:id` - 更新分类
- `DELETE /api/categories/:id` - 删除分类

### 交易相关 API
- `GET /api/transactions` - 获取交易列表
- `POST /api/transactions` - 创建交易
- `GET /api/transactions/:id` - 获取交易详情
- `PUT /api/transactions/:id` - 更新交易
- `DELETE /api/transactions/:id` - 删除交易
- `GET /api/transactions/by-date/:date` - 获取特定日期的交易

### 报表相关 API
- `GET /api/reports/monthly` - 获取月度报表
- `GET /api/reports/category-stats` - 获取分类统计
- `GET /api/reports/trend` - 获取趋势数据
- `GET /api/reports/yearly` - 获取年度报表

## 开发流程

1. **需求分析**：明确功能需求和技术方案
2. **数据库设计**：设计数据库 schema ✅
3. **后端开发**：实现 API 和业务逻辑
4. **前端开发**：实现 UI 和交互
5. **集成测试**：进行功能测试
6. **部署上线**：部署到生产环境

## 项目进度

### 已完成 ✅
- [x] 项目规划和文档
- [x] 前端项目初始化
- [x] 后端项目初始化
- [x] 数据库设计和迁移脚本
- [x] 用户认证模块（JWT 双 token 模式）
  - [x] 用户注册、登陆、登出
  - [x] 修改密码功能
  - [x] JWT 双 token 认证（Access Token + Refresh Token）
  - [x] Token 自动刷新机制
  - [x] 前端认证页面和路由保护
  - [x] 后端认证中间件和错误处理
  - [x] 完整的 API 文档

### 进行中 🚀
- [ ] 记账管理模块
  - [ ] 后端：分类管理 API（预设分类初始化）
  - [ ] 后端：交易 CRUD API
  - [ ] 后端：标签管理 API
  - [ ] 后端：数据导出 API（CSV、Excel）
  - [ ] 前端：快速录入表单
  - [ ] 前端：交易列表展示
  - [ ] 前端：分类管理界面
  - [ ] 前端：标签管理界面
  - [ ] 前端：数据导出功能
- [ ] 账单搜索模块
  - [ ] 后端：搜索 API（支持多条件搜索）
  - [ ] 前端：搜索页面
  - [ ] 前端：高级筛选功能
  - [ ] 前端：搜索历史记录
- [ ] 预算管理模块
  - [ ] 后端：预算 CRUD API
  - [ ] 后端：预算检查和提醒 API
  - [ ] 前端：预算设置页面
  - [ ] 前端：预算展示和统计
  - [ ] 前端：超出预算弹窗提醒
- [ ] 报表分析模块
  - [ ] 后端：统计 API
  - [ ] 前端：日统计展示
  - [ ] 前端：月统计展示
  - [ ] 前端：ECharts 饼状图
- [ ] 日历视图模块
  - [ ] 前端：日历界面
  - [ ] 前端：日期定位功能
- [ ] AI Chat Agent 模块
  - [ ] 前端：Chat 页面设计
  - [ ] 前端：消息展示和输入
  - [ ] 前端：Chat 服务集成
  - [ ] 后端：Chat API（预留接口）
- [ ] 底部 Tab 导航
  - [ ] 前端：Tab 导航组件
  - [ ] 前端：页面路由集成
- [ ] 样式优化
- [ ] 测试和部署

## 贡献指南

1. 创建新分支：`git checkout -b feature/your-feature`
2. 提交更改：`git commit -m '[feat] your feature'`
3. 推送分支：`git push origin feature/your-feature`
4. 创建 Pull Request

## 许可证

MIT

## 相关文档

- [项目总结](.codewiz/PROJECT_SUMMARY.md) - 项目概览和快速参考
- [前端项目 README](frontend/README.md)
- [后端项目 README](backend/README.md)
- [API 文档](backend/API_DOCS.md)
- [项目规则和开发标准](.codewiz/rules/project-rules.md)
- [开发 TODO 列表](.codewiz/DEVELOPMENT_TODO.md)
- [完整功能规划](.codewiz/COMPLETE_FEATURE_PLAN.md)
- [记账模块详细计划](.codewiz/ACCOUNTING_MODULE_PLAN.md)

