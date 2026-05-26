- 认识几个url
  url的设计模式 restful api
  网站是用来暴露资源的 如何将资源暴露出去
  通过http协议来发送请求 来获取资源
  - http://localhost:3000/posts/ 列表页的链接
  - http://localhost:3000/posts/:id id查询参数 详情页的链接
  - http://localhost:3000/users/:id 用户主页链接

- 数据的查询 Read CRUD
- 访问资源的方式
  - apiFox 是啥？
    web 请求代理软件 代替我们发送请求 测试增删改查 省的写一堆代码测试一个功能
    Get http://localhost:3001/posts/1 
    Patch http://localhost:3001/posts/1 
    - 资源 db.json 通过json-server代理 users posts
    - HTTP 协议
      - Method（动作 GET | PATHC 修改| DELETE 删除| POST 新增） + url （资源）请求行
      - 请求头 Cookie Content-Type:text/json ...
      - 请求体
- json-server 完全实现restful api接口的数据服务器
  - 提供 http 服务
  - 让dn.json 作为数据资源向外提供访问 支持CRUD 操作

- 会设计restful api 接口 
  - 需求
    - 新增一篇文章
      POST  http://localhost:3001/posts 
      JSON
      {
        ...
      }
    - 删除 文章2
      DELETE http://localhost:3001/posts/2

- json-server 是一个支持restful api 设计的数据服务器

- 全栈防抖
  - 前后端分离 解耦 前后端不直接通信 中间通过http协议通信 前后端都可以独立开发 互不影响
  - 前端 live-server 5500
    通过 fetch 方法 对 后端url 发送请求
  - 后端 json-server 3001
    后端为前端提供url的接口服务 json-server 中实现了 restful api 接口
  - api 接口

- filter、map
  - 都是Array.prototype上的方法,所有数组的都有
  - filter 数组过滤，回调函数返回值是否为true 则保留 否则过滤掉
  - mpa 数组映射，回调函数返回值作为新数组的元素 原有数组不能满足需求
  - forEach 迭代每一项 不需要返回值 
  
- 防抖
  - 将要执行的函数debounce()高阶函数去优化
  - 减少执行次数 只执行连续输入的最后一次 
  - 定时器来实现 本次关掉上一次的定时器