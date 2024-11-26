// js 造人
// 对象字面量 {} 一个一个自己添加
let i = {
    name:'小奶龙',
}
let j = {
    name:'小恶魔',
    age:17
}
// class 属于es6
class person {  //构造函数person
    constructor(name,age){
        this.name = name
        this.age = age
    }
    sayHi(){
        console.log('hi');
    }
}

let ii = new person('大奶龙',18) // 通过构造函数实例化一个对象