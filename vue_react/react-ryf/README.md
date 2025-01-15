- 为何学react ?
  - UI 组件界面工程师 
  - react 诞生于 Facebook 复杂业务，大厂喜欢用
  - vue 国内社区很火 大厂vue/react 都在用，因为AIGC 全栈，国际的React 的更多些

- 写项目？
  - 偏向AI 项目 
  - vue / react 项目 nest.js AI 后端
  - 和cursor 协作项目 cursor + deepseek

- JSX 
  - 在XML 里写Javascript 
  -  jsx 是react 的优势和特点之一，相比于vue 提升了组件的表达能力和开发效率，代码逻辑和template 随时互动，而不像vue 三段式 template script
     vue 偏向好理解的api v-if v-for react jsx 基于js，能不要api 就不要api 
     vue 也可以用 jsx 语法  
  - 唯一的标签包住所有标签 可以作为其他节点的容器，又会在挂载后不污染html的fragment 节点实现的 没有实体，文档碎片createDocumentFragment 性能有很大帮助 即每个组件必须返回单一根元素
  - jsx 不能在原生js 里使用，react jsx 是怎么解析的
  文档碎片（Document Fragment）是DOM的一个轻量级容器，它允许你将多个节点暂时组合在一起，然后一次性插入到DOM树中。使用文档碎片可以显著提高性能，特别是在需要进行大量DOM操作时，因为它减少了页面的重绘和回流次数。