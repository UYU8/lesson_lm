# js 类型转换

- es6之前，js有多少种类型？6种
  - Primitive Types 简单/原始数据类型 拷贝式赋值
    - String
    - Number
    - Boolean
    - Undefined
    - Null
  - 复杂类型 引用式赋值
    - Object

- 为何JS 类型会改变？
  Number("1")

- JS是弱类型语言
- 变量的类型 是可以改变的
- 搞清楚变量的确切类型 
  - Primitive 类型 -> 其他类型的转换
    - Boolean
  - object 类型 -> 其他类型的转换

- Boolean 显示类型转换（构造函数）规则 
  - false 的情况
    - 为空 false
    - false
    - undefiend
    - null
    - +0
    - -0
    - NaN
    - 空字符串

  - true

  - +0 -0
    Object.is()
    1 / +0, 1 / -0 Infinity -Infinity
  - NaN
    类型仍然是Number,表示一个特殊的数字

- Number()
  - esma规范
  - 0 1 NaN 

- String