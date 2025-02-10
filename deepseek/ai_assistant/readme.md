# AI Assistant 全栈项目

- 大前端全栈
- 后端驱动全栈为主

  - 设计模式
    大前端 前端 mvvm model(数据状态 useState,ref/reactive api/axios 接口，pinia) view

    model 模型层 = 数据定义+数据处理+数据管理+数据请求
    view 视图层 = component 组件 views components vm 视图模型层 数据绑定{} {{}} 数据驱动界面（v-if / v-show / v-for）... script 事件监听 @change onChange 让数据和界面结合起来

    后端 mvc 思想 数据库 mysql table 简历模型
    model 数据库独立于后端的 数据模型文件 schema orm
    view 视图层 = 前端页面 index.html about.html
    controller 控制器层 = 后端接口文件 api.js

  - 并发数
  - 基础设施
  - DDos 肉鸡攻击 qps

## 后端全栈 AI 项目

- python flask 框架 node koa
  app.py 单点入口
- 纯 js
- deepseek 在线 api

## 写文章 + leetcode 150+

- 安装 python
- 配置虚拟环境
  python -m venv name
  本地项目项目依赖 不受全局影响 不影响全局
  项目下有了项目依赖包
  .\ai_assistant\Scripts\activate
  pip install openai Flask python-dotenv -i https://mirrors.aliyun.com/pypi/simple/

openai 已经成为了 aigc LLM 的事实标准
/completion / chat
base_url deepseek api
Flask koa 后端框架

- 没有前后端分离 mvc 开发模式

  - 前端 static 目录下
  - 路由 / 显示 index.html

- 静态文件
  - js/css/img FE
  - 启动静态服务器
  -
