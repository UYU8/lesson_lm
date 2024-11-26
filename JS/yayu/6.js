function Person(name,age){
    this.name = name;
    this.age = age;
}
Person.prototype.name = '孔子'
Person.prototype.hometown = '山东'
let Person1 = new Person('x',18);
let Person2 = new Person('k',17);
console.log(Person1 === Person2);
console.log(Person1.name,Person2.name);