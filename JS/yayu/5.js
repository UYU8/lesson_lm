// 原型？欧文
const owen = {
    name:'owen',
    playBasketball:function (){
        console.log(`打篮球`);
    }
}

function Person(name,age){
    console.log(this);
    this.name = name;
    this.age = age;
}
Person.prototype = owen;

const kai = new Person('凯',18);
console.log(kai.name,kai.age);
kai.playBasketball();