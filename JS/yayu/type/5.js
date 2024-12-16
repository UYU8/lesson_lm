// 基本数据类型间的显示类型转换之String
console.log(String());
console.log(String(undefined), typeof String(undefined)); // "undefined"
console.log(String(null), typeof String(null)); // "null"
console.log(String(+0), String(-0)); // "0"
console.log(String(NaN)); // NaN
console.log(String(1));