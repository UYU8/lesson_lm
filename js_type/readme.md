# js 数据类型

- js有多少种数据类型？
**内存分配机制**
**简单拷贝 复杂引用式**
**依据变量内存的分配机制，栈内存，复杂数据类型的栈里存的是指向堆内存的地址**
- 有8种，但是把新出来的bigint和number 统称为numeric类型
1.简单数据类型:Numeric(number + bigint),strting,null,undefined,boolean,symbol
 - null
   表示一个空值或者不存在的对象(显示回收内存)，是一个可以赋给变量的特殊值。

 - undefined 未定义(类型)
 - symbol 代表唯一的值
   以函数的形式创建，简单值，可以给他一个标签，哪怕标签一样，值也不能判断相等
 - bigint 大整数
   
2.复杂数据类型:object

- 简单数据类型 Primitive
  一眼就能看出其值

  函数、数组等有很多特性无法表达

## 对象
  - 丰富、复杂、笼统
  - 函数？函数对象、一等对象？可执行对象：
    函数有属性，方法可以添加
    函数可以作为形参传递
  - 数组 可迭代的对象
 
- ECMAScript 是js的标准

- 区分这么多种的对象？
- 得到变量的确切类型 
  typeof 除了null之外的primitive类型 都可以得到正确结果
  typeof null 是object 当初设计时的bug
  前三位是表示类型的描述 null object 前三位都是000