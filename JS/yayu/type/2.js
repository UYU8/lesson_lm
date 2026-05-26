// Primitive 转换成 Boolean类型
// true | false
// 构造函数 来用
console.log(Boolean()); // 什么都不传入默认值为 false

console.log(Boolean(false));
console.log(Boolean(true));
console.log(Boolean(undefined)); // false
console.log(Boolean(null)); // false
console.log(Boolean(+0),'+0'); // false
console.log(Boolean(-0),'-0'); // false
console.log(Boolean(NaN),'NaN'); // false 
console.log(Boolean(''),'空字符串'); // false