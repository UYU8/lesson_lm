- 变量提升怎么来的？
  预编译
  暂时性死区？TDZ
  词法环境中的变量和常量，在申明之前不能访问，就是暂时性死区
  - 调用栈是JS的执行机制
  - 入栈的是执行上下文
    - 栈底是全局执行上下文
    - 其余都是函数

      - 块级作用域 栈的结构来维护 
    ## 块级作用域运行完也会销毁 词法环境中会形成独立的栈结构

## 变量提升这个坏问题
- ES6 通过 let/const 词法环境 跟 变量环境分开，区别对待
- 变量申明前 处于暂时性死区 不可访问
  