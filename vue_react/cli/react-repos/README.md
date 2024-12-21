# react repos 项目列表

- 用户的仓库列表
  - repos 组件 

- react 组件
  - vue中是 .vue
  - react中是 .jsx
  - components/ -> 挂载App.jsx
  - 相比于Vue的三部分清晰明了 react 函数即组件（首字母大写）
    - 首字母大写 
    - 返回html，JSX

  - 组件类
    - 封装组件 import + export default 功能的拆分
    - 函数（构造）组件 return 一段html 是必须的 
    - 组件可以复用
    - 封装的是UI + 响应式数据（动态数据）
    - 只要写原生JS 就可以了

- vue和react 相同点/区别点
  - 相同点
    - 使用组件化思想
    - 现代前端编程框架 挂载点
    - 都有工程化配套
    - 数据绑定 {{}} {}
    - 都有响应式数据，数据驱动，不需要做DOM 耗性能操作
  
  - 区别点
    - .vue | .jsx
    - template/script/css 三段式 | 函数即组件
    - vue好入门，api风格 | react难，但纯粹 （JS高手都喜欢）
    - vue css 在组件内部，react css 是单独文件 
    - 组件= 组(html + css + js) 和 完成一件功能的拆分 
    - vue template, react JSX
      - JSX 是react 最漂亮的部分 可以在函数中 最方便的表达UI部分
        本身是不可以的 但是react会去解析JSX 并转换为原生JS html(XML) in JS HTML是XML的一种
        - 不能写Clss 用className