# vue 哲学 本该如此 业务驱动的框架 

- 前端刀耕火种的年代 原始社会
  - 开发思想 
    底层API DOM编程 + 事件机制 
    缺点 复杂 
    性能差 （频繁访问，修改DOM）
    分为 V8引擎（JS，单线程） + 渲染引擎（html + css）
    以快速显示页面为第一要务 html + css 渲染引擎 独立于JS引擎
    V8 引擎 独立的 
    V8 去到 渲染引擎 犹如上了高速，较远。

    vue（登记）批量收集DOM的更新，减少没必要的跑路 

- jQuery 封建社会
  js 框架，DOM 操作简单 
  $ 等封装简化了 js开发（开发者）

- web 1.0(csdn blog) -> 2.0(twitter,facebook)  
  JS 代码量增大，性能排在第一位 

- 演变到VUE / REACT 现代前端框架 当代社会
  更关注于业务开发（数据，响应式、组件化），不用在意JS DOM 的底层 ，框架封装了 DOM 操作

  数据思维 + vue/react 实现方式 = 前端开发 

  vue 更加专注于业务（数据 + 配套的语法）

  - data title 
  - vue **提供给专注于业务的语法** v-model 双向绑定 
    - data title input.value 使用
    - 同时input 输入了后 data里面的 title 也会更新

- todos 应用 
  - todos 数据项 
  - title 任务 
  - @keydown-enter @event vue 事件监听
    .enter 事件修饰符 监听回车事件 事件业务更快 
  - 动态样式业务 :动态绑定 v-bind：的缩写 
    : class="{}" 双引号内部是JS 运行区域 
    {done:todo.done} 