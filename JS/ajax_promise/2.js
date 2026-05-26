// 实例化时，传递函数，里面装耗时性任务

const p = new Promise((resolve, reject) => { // executor 执行器
    console.log('333'); // 同步任务
    setTimeout(() => { // 异步任务 event loop
        console.log('222');
        resolve('BMW325'); // 执行then里面的回调函数
        // reject();
    }, 1000);
})
// 异步任务的执行顺序控制的话，用promise 
console.log(p.__proto__, p); // __proto__和prototype区别
p
  .then((data) => {
    // 等到executor 里面的任务执行完后，再执行then里面的回调函数
    console.log('111');
    console.log(p);
    console.log(data);
  })
  .catch(() => {
    console.log('error');
  }) 