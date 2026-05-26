- package.json
  项目描述文件
  - deoendencies 依赖部分？
  - devDependencies 开发期间依赖
  - scripts 脚本
    npm run dev(development)

  - 版本号 的意义
    > 1.0.0  正式版 商用 成熟
    - 1.0.0  1主版本 0次更新 0 bug修复
    - 2.0.0  Vue2 Vue3 
      2.2.0  添加了某项功能 
      2.2.1  新增的功能有bug 修复

- es6
  - es6 模块化 import from 文件后缀为mjs
  - {} 解构 将对象中的属性提取出来并将其赋值给变量
    对象、数组一次性解构 一批变量
    - 待解构的对象在 = 右边 
    - 解构出来的在 = 左边
    - 对象（key）、数组（下标）都可以解构
    - ... rest 剩余运算符 

- AI 爬虫的核心
  - 发送请求爬取HTML 完成了 输入（html 字符串）
  - http 请求
  - 解析出来 indent

  - 交给大模型 prompt
  `
  ${indent_html}
  Get the image link
  `