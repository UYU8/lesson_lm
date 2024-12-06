# 定时器

- JS是单线程的，v8引擎执行时只有一个主线程
- setTimeout 是异步执行的计时器，会在主线程执行完之后才会执行
  callback 函数 放入一个专有的地方（event loop）等主线完成，时间(ms)
- 一定会在 指定时间后执行吗？
- 找回？如何在主线程完成后再次找到定时器的函数呢？
  执行的是回调函数（一个函数作为参数传递给另一个参数，并在指定事件后执行）
- 定时器ID 

准确表达：setTimeout 是异步执行的定时器，会在规定时间之后执行它的回调函数
返回值是定时器ID，也有可能不能准确执行，因为js是单线程的，它要在主线程完成之后才会有执行的机会。

- 如何用 setTimeout 准确执行 实现 setInterval ?
  - 场景编程题
  - 手写题 fn
    - customInterval
    - callback ,time 参数
    - 可以用setTimeout 实现
    - 递归（自己调用自己）
    - 关闭？

- this more
  有什么办法让它不指向全局？

- 1.call
  - 函数对象上的方法 Function.prototype.call
    call 是 Function 的原型上的方法
    Function 为所有函数的构造函数 其余函数都是它的实例
    例如  const function = new Function()
          const arr = new Array()
- 2.箭头函数没有this 指向其所在词法作用域的this
- 3.let_this = this; _this.func1(); this指向丢失 换另一个函数的this
  三种做法都是在什么时候指定的this？
  提前指定定好this，再调用，而不是在调用的时候前一刻