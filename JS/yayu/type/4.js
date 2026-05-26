// 基本数据类型间的显示类型转换之Number
// Number 
console.log(Number()); // 什么都不传入默认值为 0
console.log(Number(undefined)); // NaN undefined 数值上下文中没有转成一个特定数字的含义  
console.log(Number(null)); // 0 在数字上下文中有转化成0的可能
console.log(Number(false)); // 0 
console.log(Number(true)); // 1 
console.log(Number("123")); // 123 
console.log(Number("-123")); // -123 
console.log(Number("0x11")); // 16进制
console.log(Number(""), Number(" ")); // 0
console.log(Number("100a")); // NaN 