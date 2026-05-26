- 余说react 学习路径
  - react 基础语法 过一遍 | （B站 | 文档）
  - hooks 相关
  - 全家桶
  - 状态管理
  - react 源码
  - Antd ...
  - ts

- AI Coding 
  - VUE & React 一起搞
  - 自然语义编程
    tailwindcss 语义 
    antd 组件

- 给AI一张设计稿 -> 生成组件
  
- http（cdn更快） 引入 前端组件库
  - vue
    Vue

- 挂载点
  - 将前端工作交给vue/react，在html里面只需要一个挂载点 #root

  - 挂载Vue App 应用实例

- vue 哲学 让我们focus业务的现代前端框架
- html界面上升到应用的复杂，现在前端复杂
  - Web应用是数据驱动的界面
  - vue 事件机制 方便 @event="handler"
  - 响应式编程
    - ref(0) 包装简单数据类型 成为一个响应式对象
    - .value = "" 修改value 值改变的同时，界面热更新
    - 规避DOM 编程
    - 不再为API 编程，而focus 业务(需求)开发


- App 和传统编程的区别
  - createApp 创建Vue App
  - #root 结合 将App挂载到挂载点 
  - #root 里面 Vue 的世界了
    {{count}}

  - {{}} vue 的数据占位符
    - 数据是可以被改变的，不需要document.querySelector(""),现在只需在{{data}}中
      setup(){
        return{
            data
        }
      }
