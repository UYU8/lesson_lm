// "use strict" 在window中变为undefined

var x = 2;
var obj = {
    x:1,
    foo:function(){
        console.log(this,this.x)
    }
}
// 拿到这个函数的地址，找到函数体
var foo = obj.foo
// 相同点是:都是同一个函数在运行
// 区别:被谁调用，调用的位置不一样
// 调用时候？ 调用方式不一样

// 对象方法被调用
// 当调用 obj.foo() 时， 
// this 指向 obj，所以 this.x 就是 obj.x，
// 会打印出 obj 对象的 x 属性的值，也就是 1。
obj.foo() // 1
// 普通函数被调用
foo(); // 2 没有必要有this 所以要严格模式

var obj2 = {
    x:3,
    foo:foo
}   
obj2.foo()
