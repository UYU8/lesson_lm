# AI 全栈

- 架构
  - frontend 前端
  - backend 后端
    数据接口 user.json 数据文件
    文件型数据
    http服务 http:localhost:3000/users(web访问的路径)
    json-server

    - 提供数据接口
      - npm i json-server
        - 启动了就会有一个 
          http server 响应 http请求 localhost 127.0.0.1
        - json 文件 json-server --port 3001 --watch user.json
      - scripts
        "dev": "json-server --port 3001 --watch user.json"
      - npm run dev
  - llm ai server