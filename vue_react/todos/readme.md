# 双向绑定

- title data
  {{title}} 数据驱动的界面 
  input v-model="title"
  input 输入的时候，输入框的值改变了，和数据项title 不一样。数据项为{{}}
  @input 麻烦，v-model 专门解决数据双向绑定


- :class  :value ?
  动态绑定属性业务时用：v-bind:

- 数据和界面保持一致

- all 所有任务的数量
  - title,todos 不一样 独立 
  - all 依赖于 对todos 的计算
  - computed 计算属性 关注于其中的响应式数据 
    形式是函数，返回值是计算结果
  - 当计算属性函数依赖项发生改变时，会重新执行函数，得到新的值。
  - 关注函数体内的 数据属性 
  - 计算属性也是数据的一类 this.可以直接找到
  - get set 两种操作 set 数据属性的特质更明显

- 数据的和界面状态的正确性 

allDone：这是一个计算属性，具有 get 和 set 两个方法，使得它可以像普通属性一样被读取和赋值。
get()：当访问 allDone 时，会调用 get 方法。它返回一个布尔值，表示所有待办事项是否都已完成。这里的逻辑是检查 this.active 是否等于 0，假设 this.active 是一个表示未完成待办事项数量的属性。
set(val)：当给 allDone 赋值时，会调用 set 方法。它接收一个参数 val，并更新 todos 数组中每个待办事项的 done 属性为 val，确保数据和界面保持一致。

- 数据和界面状态的正确性
  - 数据驱动界面 {{}} 单项数据绑定 数据绑定界面
  - 双向绑定 v-model 
    - 先是**界面的状态**发生了改变
    - 数据要保持一致 
    - v-mode 修改数据 
    - 保证状态一致
  - 依赖项的联动一致
    allDone true/false todos 也得变 

  - 不犯错误，数据和界面状态一致 

  - vue 2.0 让开发者 爽 专注于数据业务
    data
    method
    computed
    简单，缺点是 不灵活
  - vue 3.0?
    选项式 -> setup 组合式 对应的data + method + computed 放一起
    有利于大型项目（组件代码 > 100行）的维护