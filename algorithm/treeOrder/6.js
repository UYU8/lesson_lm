const key = 'abc123';
let points = 50;
let winner = false;

const person = {
    name:'Wes',
    age:28
}
// 函数是对象 是Object上静态的方法 是属于类的 而不是原型链上的 
// const wes = { ...person }; // 使用扩展运算符进行浅拷贝
// const wes = Object.assign({},person);
// wes.age = 30;
// console.log(wes,person);

// 不可写writeable 
const wes = Object.freeze(person);
person.age = 3;
wes.home = 'wesbos';
wes.age = 3;
console.log(wes,person);