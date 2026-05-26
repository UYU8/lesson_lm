# 移动端记账本 - 前端项目

## 项目概述

这是移动端记账本应用的前端部分，采用 React + TypeScript 技术栈。

## 技术栈

- **框架**：React 18
- **语言**：TypeScript
- **路由**：React Router v6
- **HTTP 客户端**：Axios
- **可视化**：ECharts
- **日历**：React Big Calendar
- **样式**：CSS（苹果官网简约风格）

## 项目结构

```
src/
├── components/           # React 组件
│   ├── auth/            # 认证相关组件
│   ├── accounting/      # 记账相关组件
│   ├── report/          # 报表相关组件
│   └── calendar/        # 日历相关组件
├── pages/               # 页面组件
├── services/            # API 服务
│   ├── api.ts          # API 客户端
│   ├── auth.ts         # 认证服务
│   ├── accounting.ts   # 记账服务
│   └── report.ts       # 报表服务
├── hooks/               # 自定义 Hooks
│   └── useAuth.ts      # 认证 Hook
├── utils/               # 工具函数
│   ├── date.ts         # 日期工具
│   ├── currency.ts     # 货币工具
│   └── index.ts        # 导出
├── types/               # TypeScript 类型定义
│   └── index.ts        # 类型定义
├── styles/              # 全局样式
│   └── index.css       # 全局样式
├── App.tsx             # 应用主组件
├── App.css             # 应用样式
└── index.tsx           # 入口文件
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm start
```

应用将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
npm run build
```

### 运行测试

```bash
npm test
```

## 环境变量

创建 `.env` 文件，配置以下变量：

```
REACT_APP_API_URL=http://localhost:7001/api
```

## 开发规范

详见项目根目录的 [`.codewiz/rules/project-rules.md`](../.codewiz/rules/project-rules.md)

## 主要功能

### 1. 用户认证
- 用户注册和登陆
- JWT 双 token 认证
- 自动 token 刷新

### 2. 记账管理
- 快速录入收支
- 分类管理
- 交易记录查询

### 3. 报表分析
- ECharts 可视化
- 分类统计
- 收支趋势

### 4. 日历视图
- 日历展示
- 快速定位消费

## 贡献指南

1. 创建新分支：`git checkout -b feature/your-feature`
2. 提交更改：`git commit -m '[feat] your feature'`
3. 推送分支：`git push origin feature/your-feature`
4. 创建 Pull Request

## 许可证

MIT
