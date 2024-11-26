// function add(x,y){
//     return x+y;
// }
// 和普通函数的区别在哪？
// 构造对象的过程 构造函数 首字母大写 constructor
function Person(name,age){
    this.name = name;
    this.age = age;
}

const wk = new Person('wk',18);
//new 根据构造函数创建并初始化一个新的对象实例
console.log(wk.name,wk.age);
const kk = new Person('yx',22);
console.log(kk.name,kk.age);