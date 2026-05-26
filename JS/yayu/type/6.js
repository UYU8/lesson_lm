var a = 1.234;
console.log(typeof a, a.toFixed(2));
var b = new Number(a);
// valueOf
console.log(typeof b);
console.log(b.toFixed(2)); // Number.prototype.toFixed 