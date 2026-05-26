# JS Master Agent

- 什么叫做Agent
  是一个智能体，基于大模型。

  JS高级（底层）语法，看小黄书，回答问题？定向开发一个学习JS的Agent
  小黄书 像知识库 喂给 Agent 

## coze ai agent 应用开发平台
  国内 最大的AI应用开发平台 
  国内使用的大模型为豆包
  国外 OpenAI

## JavaScript Master Logo 底层是如何实现的？

- 和前端有什么关系？
  - 前端交互 因AI改变了
    图标，前端是上传图标文件的。
  - 根据title + desc AIGC 生成图标 
  - AIGC 效率太高了，太省钱了

## 技术构成 
  - 需要有一个多模态的模型能力（单模态是文本，多模态包括图片语言视频）
    openai dalle AI
  - ajax
  - 前后端分离 全栈 前端负责制作表单弹窗 后端负责调用大模型请求

## 前端开发
  - bootstrap.css
    css 框架，加速界面开发
  - .container
    layout PC网页布局 1140
      margin-left:auto
      margin-right:auto
      margin:0 auto;

    20px?
  - height
  font-size 14px
  line-hegiht 1.4... 行距
  .container body？
  css inherit 特性
  只需要在顶级元素上设置一些公共属性（文字大小，颜色，line-height）
 - 网格布局 分栏
   .row+.col-6
   laberl for + input id
   读屏聚焦