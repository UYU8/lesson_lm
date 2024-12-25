# 面向 Openai 接口编程

- 多模态模型
  - 单模态模型
    chatgpt 文本
  - 图片、视频、音频

- npm init -y 初始化变成后端项目 node package manager
  npm i openai    openai sdk
- 多个项目都安装 浪费时间 占用空间
  npm i -g openai 全局安装 -g

- npm config set registry https://registry.npmmirror.com 国内镜像
  设置了npm 的源，npm是国外的网站，慢，阿里在国内做了npm的镜像 提速

- 时间 占用空间
  npm i -g openai
  npm i -g pnpm
  装在哪里去了？ 在命令行可以直接调用 环境变量？ 污染全局

- 既不会重复安装，也不会污染全局，符号链接去指向之前的安装
  快且省空间 pnpm 

- main.mjs 主入口，入口程序，单点入口的职责
  mjs 支持es6 的 module import from

- 调试能力
  console.log(result)  深  查看他的json 结构

- 理解参数 
  gpt 4o 多模态读图能力 
  - 文本指令
  - 图片地址

- try catch
  容错

- key 不能提交到 github
  资产的安全风险
