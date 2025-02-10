// commonjs
// node 最简单的后端框架
const koa = require('koa');
// 实例化
const app = new koa(); // 也是应用
const Router = require('koa-router'); // 路由
const router = new Router(); // 实例化
const axios = require('axios'); // 
const bodyParser = require('koa-bodyparser');

// 添加跨域支持
// 上下文 ctx = req  ... 跨域，路由，错误处理....    res
// next  
// 中间件 middleware 
app.use(async (ctx, next) => {
  console.log('--------- 跨域中间件');
  ctx.set('Access-Control-Allow-Origin', '*');
  
  // 设置允许的请求方法
  ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE');
  
  // 设置允许的请求头
  ctx.set('Access-Control-Allow-Headers', 'x-requested-with, accept, origin, content-type');
  
  // 如果是预检请求（OPTIONS），直接返回204 No Content
  if (ctx.method === 'OPTIONS') {
    // 响应头 http 状态码为 204  201  created 200 OK 
    ctx.status = 204; 
    return;
  }

  await next();
})
/**
 * 启用了 bodyParser 中间件，
 */
app.use(bodyParser())


// 新建 / 路由
router.get('/', async (ctx) => {
  // 响应体
  // ctx 这一次请求响应的上下文
  ctx.body = JSON.stringify({
    a: 1
  });
})

// 新建一个叫做 chatai 的路由 
//  method, url 
// post 
// 后端 api 接口数据 json 
// nest.js 
// 前端react axios 向 /chatai 发送post 请求
router.post("/chatai", async (ctx) => {
  // 前端 input 传过来的内容 message 
  // 向ollama ：11434/api/chat 发送 post 请求
  // chatgpt 行业标准
  // message 请求体中解出来
  // console.log(ctx.request.body, '------')
  const message = ctx.request.body.message || "";
  const data = {
    model: "deepseek-r1:1.5b", // 必须制定
    messages: [
      {
        role: "user",
        content: message
      }
    ],
    stream: false
  }

  // axios 发送请求就用它 转发请求
  // AI 能力集成
  const response = await axios
    .post("http://localhost:11434/api/chat", data)
    .then(response => {
      // console.log(response.data);
      ctx.body = {
        code: 200,
        content: response.data.message.content
      }
    })
})
// 路由的挂载app
app.use(router.routes())

app.listen(3000, () => {
  console.log("server is running at port 3000");
})