function foo(){
    var a = 1;
    let b = 2;
    {
        let b = 3;
        var c = 4;
        let d = 5;
        console.log(a); // 1
        console.log(b); // 3
    }
    console.log(b); // 2
    console.log(c); // 4
    console.log(d); // 引用错误 未被定义 块级作用域销毁出栈
}
foo();