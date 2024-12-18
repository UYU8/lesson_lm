# 显式类型转换和隐式类型转换
- String()  Number() Boolean()  函数运行 强制类型转换
- 构造函数 new  
- Primitive 怎么转对象 

- 包装类
   "abc".length
   "1.23".toFixed(1)
   new String("abc") new Number("1.23") 
   一切面向对象，自动的帮我们包装一下简单数据类型

- 什么是包装对象？
包装对象是 JavaScript 内置的构造函数（String、Number 和 Boolean）创建的对象，它们分别用于包装字符串、数字和布尔值。当你尝试访问一个原始值的属性或调用它的方法时，JavaScript 会自动将该原始值临时转换为相应的包装对象，执行完操作后，这个临时对象会被销毁，原始值保持不变。


- 对象转Primitive类型

- Number()
- Boolean()
- String()
  toString()
  - Object.prototype.toString().call({a:1}) "[object Object]"
    确切类型
  - 数组，调用原型上的toString方法
  - 函数，返回源代码

 
作用域查找会在找到第一个匹配的标识符时停止。在多层的嵌套作用域中可以定义同名的
标识符，这叫作“遮蔽效应”（内部的标识符“遮蔽”了外部的标识符）。抛开遮蔽效应，
作用域查找始终从运行时所处的最内部作用域开始，逐级向外或者说向上进行，直到遇见
第一个匹配的标识符为止。

- Object => primitive
   - String
     - 先valueOf,如果是原始值，返回
     - 否则，调用toString 返回一个原始值，返回。
     - 否则 抛出异常


- Object => String | Number 
  - toPrimitive 是使命 
  - toString 
  - valueOf
   - Number 先valueof 再toString
   - String 先toString 再valueOf
   也在情理之中
   - 报错  cannot convert object to primitive value
    