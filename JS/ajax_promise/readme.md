- es6 promise
  Promise 类，专门解决异步耗时性问题，执行流程可控，
  其他大型语言一般是同步的，js 通过 es6 解决了 单线程，异步执行顺序不好控制的问题 promise 让异步变同步 提供了完善解决异步任务的机制
  - 提供了一个口袋 装耗时性的内容 executor 立即执行
    - resolve, reject 两个函数参数 
    - resolve 成功解决Promise ,then 执行
    - reject 失败了 catch 执行
  - then 方法 等他完成后  
    resolve(data) 后执行回调函数 data 传给回调函数
  - catch 方法
    reject(err) 后执行回调函数 err 传给回调函数 
  - 三种状态
    - pending 等待状态 实例化后，resolve 之前 或者 reject 之前
    - fulfilled 成功状态 resolve 后，得从pending 到 fulfilled
    - rejected 失败状态 reject 后，得从pending 到 rejected
    - 只能从 pending 到 fulfilled 或者 pending 到 rejected
    - 状态一旦改变 就不会再变
    - 状态改变不可逆