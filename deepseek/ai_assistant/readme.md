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

- 状态码
  1XX 请求中...
  2XX 成功 201 Created
  3XX 重定向
  4XX 客户端错误 404 Not Found
  5XX 服务器错误

  响应头第一个数据包 浏览器或程序 就通过状态码知道怎么处理
  程序逻辑的一部分

- env

## 界面

- html 结构框架
  - 写注释
  - 图标字体库 font-awesome iconfont
    - 性能优化
    - 小图标都用图片，http 请求数的暴涨，网页同时并发请求数是有上限的
    - 下载一个图标字体文件
    - fas fa-comment-alt
    - font-awesime 不提供选择，都是一样的
- css 样式的组合 面向对象特性 多态 方便复用和维护
  tailwindecss 原子类
- textarea LLM 支持比较多的 tokens 出入长度 kimi deepseek
- 语义化标签
- 无障碍访问
  label + for
- css

  - 弹性布局
    - 居中
    - align-items 纵轴
    - justify-content 横轴
    - flex-direction row|colum
  - grid 布局
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap 24px
  - 响应式布局
    width max-width
    @media screen and (max-width: 768px) {

    }

  - transition animation 过度
    - width 旋转屏幕 宽度变化
    - 多个属性分别设置，用逗号隔开
  - 面向对象思想
    - 封装 多态 继承
    - button 样式组件 基础样式
      UI 风格 antd
    - 组合业务样式
      primary secondary default -> tailwindcss 原子类
    - calc
      css 中用于动态布局设计中精确控制元素大小与位置
      不能滥用 因为要计算 性能有一点点问题 涉及不必要的重绘重排
    - flex:1
      flex-grow: 1 其他子元素没有设置，主元素 ,其他元素占完后，剩下都归他来 grow；多个元素都设置 按比例划分
      flex-shrink 收缩比例
      flex-basis 设置基础大小

- 代码风格

  - 注释
  - 封装
    - 一个函数只做一件事
    - 一个函数不超过 10 行
  - es6+ 风格
    promise + async/await

- js
  - 用户体验
    - keydown enter
    - event.preventDefault 阻止默认行为
  - promise 的使用
    await 后面的肯定是 promise 或返回 promise 实例的函数
    then 链式调用
    处理函数返回的仍然是 promise 链式调用
    如果不是？ promise.resolve(包一下)
  - BOM
    - navigator.useAgent
      操作系统 浏览器版本 内核
    - navigator.clipboard
  - localStorage
    - 本地存储
    - 本地存储的大小 5M cookie kb 带上
    - getItem 传 null 也是 null
    - setItem
  - array, string 方法强化一下
    - slice 负数
  - event 事件机制
    - onclick（内联 DOM 0） addEventListener(事件监听 DOM 2)
    - 小红书 (JS 高级程序设计)
    - 事件冒泡 | 事件捕获
    - 事件委托
      - 事件委托是利用事件冒泡原理来实现的 父元素上 性能好 监听一次
      - event.target 事件目标元素 data-index
  - 产品需求
    - 产品经理提出产品需求
    - 设计师 界面设计
    - 前端 vue/react 完成需求
      - 分析
      - 技术点设计
      - 代码实现
      - debug
      - 交付上线
    - 后端 数据和 mvc 提供 api

## 业务

- 界面业务
  - grid 布局
  - transition
  - css 面向对象
- scrollToTop 业务 滚动到顶部
- 发消息业务
- 流式输出
- 剪切板功能
- 聊天历史分组功能
  - localStorage chatlog
