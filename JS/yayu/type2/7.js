// 两端只要不是数字， +连接符
console.log([] + []);

//一元加号运算符 (+)：当你使用一元加号运算符对一个对象（如数组）进行操作时，JavaScript 会尝试将该对象转换为一个数值。
console.log(+[1, 2, 3]);


// + 和 - 用于数值转换，++ 和 -- 用于递增和递减，
// ! 用于布尔反转，~ 用于按位取反，delete 用于删除对象属性，typeof 用于检查数据类型，
// 而 ?? 用于处理 null 和 undefined。

console.log([] == []);



let x = 42;
let y = {
    valueOf: function () {
        return 42;
    }
}

console.log(x == y);