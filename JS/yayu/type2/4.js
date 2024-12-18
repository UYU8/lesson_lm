// Object => primitive
let specialObj = {
    valueOf: function () {
        return 100
    },

    toString: function () {
        return '100'
    }

}


let objectWithoutValueOf = {
    valueOf: function () {
        return this
    },
    toString: function () {
        return '100'
    }
}

console.log(Number(objectWithoutValueOf))

// Step 1: 调用 objectWithoutValueOf.valueOf()，返回 objectWithoutValueOf 对象本身。
// Step 2: 检查返回值 objectWithoutValueOf，发现它不是一个原始值。
// Step 3: 调用 objectWithoutValueOf.toString()，返回 "[object Object]"。
// Step 4: 尝试将 "[object Object]" 转换为数字，结果是 NaN。

// 但是如果加了一个自己定义的toString方法,将其转换成数字字符串就可以了。



