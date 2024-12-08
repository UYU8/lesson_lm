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
- json-server
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