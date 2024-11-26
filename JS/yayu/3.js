function Person(name,age){
    console.log(this);
    this.name = name;
    this.age = age;
}

Person('凯总',19) // 以普通方式运行 普通函数 this指向window
const k = new Person('yx',22); 
// 以构造函数方式运行 构造函数 this指向实例对象k