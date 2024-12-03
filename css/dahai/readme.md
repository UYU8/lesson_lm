# css 底层基础

- 何为css？
  ```css
  /*css rules*/
  /*css规则*/
  h1{ /*选择器*/
    color:red; /*声明*/
    text-align:center; /*声明*/
  }
  ```

- css ？层叠样式表
  - html DOM 不能裸奔
  - css是怎么引入的
    - style 内联样式
    - link 外联样式
    - 行内样式 <p style="color:red;"></p>
  
  先下载样式 再解析DOM 应用样式
  dom + css = render tree (显示页面 数据结构)
  -> 浏览器渲染引擎 -> 渲染得到页面

- 优先级
  - 从小到大
  - 计算规则
    *10
    标签 1 | 类名 10 | id 100 | 行内样式 1000 | !imimport 10000(最大)

  - 当选择器比较复杂的时候 优先级加法
    .container ul li:nth-child(odd) 22
    一定选择最后的元素

- css 选择器分成哪几类？
  - 基础选择器
    - 标签选择器
    - 类选择器
    - id选择器
    - 通配符选择器 * 性能不好
  - 组合选择器
    - 后代选择器 空格
    - 子选择器 >
    - 相邻兄弟选择器 +
    - 普通兄弟选择器 ~
  - 伪类选择器
    ::active ::hover ::selection.... 可交互状态
  - 伪元素选择器
  - 属性选择器