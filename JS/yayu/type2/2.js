console.log(Boolean(new Boolean(false)));
console.log(Boolean({}));
console.log(Boolean([]));


let date = new Date();
console.log(date);
// 创建一个新的 Error 对象
let error = new Error('Something went wrong');

// 调用 toString 方法
console.log(error.toString()); // 输出: "Error: Something went wrong"


console.log((function () { return 1; }).toString());
