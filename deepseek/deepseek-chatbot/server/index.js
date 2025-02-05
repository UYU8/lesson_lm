// commonjs 
// node 最简单的后端框架
const koa = require('koa');
const app = new koa(); //也是应用
const Router = require('koa-router');//路由
const router = new Router();//实例化
// 新建 / 路由
router.get("/",async(ctx) => {
    // 响应体
    // ctx 这一次请求响应的上下文
    ctx.body = `
    <html>
      <head>
        <title>chatbot</title>
      </head>
      <body>
        <h1>chatbot</h1>
      </body>
    </html>
  `;
});
// 新建一个叫做 chatai 的路由
// method, url 
// 后端 返回api接口数据 json
// nest.js
router.post("/chatai",async(ctx) => {
    ctx.body = {
        code: 200,
        message: '我是一个机器人',
    }
})

//路由的挂载app
app.use(router.routes());

app.listen(3000,() => {
    console.log('server is running at port 3000');
});