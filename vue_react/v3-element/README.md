- 如何开发一个vue项目？
  - vite 工程化 npm init vite cli 
  - vue 核心语法（响应式，组件化，指令等）
    前端框架
  - vue-router
  - pinia 
  - element3 UI 组件库 
  - stylus 
  - axios ajax 请求封装库

- app.use
  向vue app 中注册插件 生态
  element3 提供的组件可以全局使用
  - 注意问题 性能问题
    - 首页打开就会变慢 按需加载
  - element3 组件 以el-开头
  - 不要重复造轮子 70% 常见组件需求 

## 项目亮点
- 项目全面使用es6+ 风格
  代码简洁 易读 易维护
- 良好的注释
- 按需加载vue 组件库 element3，性能优化，页面加载速度
- 路由 
  - 多级路由 
    二级路由 path 前面不要/ 
  - path,component ,name,meta
  - 必须做路由懒加载
    最佳用户体验 是 快 
    按需加载页面级别组件 在component 中 ipmort 函数引入方式 () => import('')
  - 路由守卫
  