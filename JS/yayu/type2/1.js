var a = 1.23;
console.log(typeof a);
var b = new Number(a);  //new Number(a) 返回的是一个 Number 对象，而不是一个数字。
console.log(typeof b);
console.log(b.toFixed(1));
// 面向对象的极致风格   toFixed(a)
console.log(a.toFixed(1));
(new Number(a)).toFixed(1)