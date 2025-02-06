// commonjs 
// node 最简单的后端框架
const koa = require('koa');
const app = new koa(); //也是应用
const Router = require('koa-router');//路由
const router = new Router();//实例化
const axios = require('axios');
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
// 前端react axios 向/chatai 发送post请求
router.post("/chatai",async(ctx) => {
  // 前端 input 传过来的内容 message
  // 向ollama 11434/api/chat 发送post请求
  // chatgpt 行业标准 
  const message = 'hello';
  const data = {
    model: 'deepseek-r1:1.5b',// 必须制定 
    messages:[
      {
        role: 'user',
        content: message
      }
    ]    
  }
  //axios 发送请求就用它 转发请求
const response = await axios
.post('http://localhost:11434/api/chat',data)
.then(response => {
    // console.log(response.data);
    ctx.body = {
      code: 200,
      content: response.data.message.content
}
})
})


//路由的挂载app
app.use(router.routes());

app.listen(3000,() => {
    console.log('server is running at port 3000');
});