console.log(1 / + 0) // Infinity 正无穷大
console.log(1 / - 0) // -Infinity 负无穷大
console.log(Object.is(5, 5)); // 比较两者是否相等 true
console.log(Object.is(+0, -0)); // false
// 隐式转换 
// NaN Not a number 
console.log(2 * "a", 2 + "a"); // NaN 
console.log(typeof NaN);
console.log(parseInt("abc")); // 将字符串解析为数字 
console.log(parseInt("12abc"));
console.log(NaN == NaN); // 不代表确切值 
// 不能通过 === 去判断是否为NaN 所以要使用 isNaN 
console.log(isNaN(NaN)), isNaN(parseInt("abc")) 