## 春招执行方案

- 时间
  3 月-5 月
- 大厂最容易
  - 语言能力
  - 面试能力
  - 算法
- 3 月份-4 月份 面试新手期 4 月份远程实习（AI 远程实习）
- 拿下一个 offer 150 一天
  - 项目
  - leetcode 每天 3 题 动态规划+分治
- 第二个目标点，找到实习，面大厂之前有一份实习经验（通过简历）
- 4-5 月份 边实习边提升面试能力（凯闻）
- 百度/字节 大厂+未来 AI 大厂
- 5.1 润出去 - 9 月份 4 月+

## deepseek

- 性价比高
  aigc
  百万 tokens 1 元
  tokens 提问以及返回 按 token 计费
  token 分词

  参照物 gpt4 o1 每百万 280 人民币 99.6%

- 为什么这么省
  - OpenAI 堆算力 GPU
  - 新的算法 甚至可以绕开 英伟达 cuda 编程
  - DeepSeek V3 2048 块 H800 557.6 万美元，算力消耗 meta llama3 是 deepseek 的 11 倍
    openai No.1 闭源的
    llama3 开源的 No.1
  - 英伟达股价大跌
  - 用户 -> 赚钱 -> AI

## DeepSeek AI 全栈 APP

前端+后端+LLM = AI fullstuck

- ai 应用集合项目
  coze 工作流 + ai 应用
  deepseek openai 的替代品 来做 prompt
  langchain rag 应用开发

- react(chatbot)
- node koa
  前端提供 api 调用
- LLM 发送请求(deepseek + ollama) 302.ai
  离线大模型调用？

react <-> koa <-> LLM

- 大前端（前后端分离）
  - 前端包着后端
    domain ：5173
    - 前端
      - react 组件
    - 后端
      domain ：3000 请求
      - 选择 koa 框架
      - 启动 http 服务 在 3000 端口 进入伺服状态
      - 路由/chatai message
        - npm i koa-router(周边生态)
        - 实例化路由对象 new Router()
        - router.Method('/path',async(ctx) => {
          })注册路由
          - ctx 上下文对象 request response
          - ctx.body 设置响应体
  - 跨域 同源策略
