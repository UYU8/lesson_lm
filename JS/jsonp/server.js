// http  服务启动
// 内置的http模块 
// commojs node早期 es6模块化 
const http = require('http');
// 启动http 服务
// 基于请求/相应的简单协议
const users = [
    {
        name: 'zhangsan',
        age: 18
    },
    {
        name: 'lisi',
        age: 19

    }
]
const server = http.createServer((req,res) => {
// 异步 高并发
// 请求带到服务器后，该函数会被执行
// req 请求对象解析
// 拿到资源
// res 响应请求，
// http 结束
  res.end("callback(" + JSON.stringify(users) + ")")
})
server.listen(3000,() => {
  console.log('server start')
})