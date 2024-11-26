// constructor 构造
function Person(name,age){
    console.log(this);
    this.name = name;
    this.age = age;
}
// 每个函数都有一个原型对象(属性)
Person.prototype = {
    eat:function(){
        console.log(`${this.name}爱吃饭`);
    }
}

const xx = new Person('xx',18)
xx.eat()