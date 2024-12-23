# 开发weather 组件 

- 组件思维 先写静态页面 再利用声明周期函数 当组件挂载完成后执行 将耗性能的操作放在生命周期函数中执行 先让html css显示渲染
  - 切页面 
    - 先写 template{{占位数据}}
    - html5 语义化标签 
    - BEM 命名规范 

  - BFC 基本概念
    Block Formatting Context 块级格式化上下文 
    - 浮动 float 用来实现两列（多）列式布局的方案 
      float: left; float: right; 向左或者右浮动 
    - 产生问题
      - 父元素高度为0：因为子元素离开了文档流，父元素高度塌陷 
      - 后面的元素会挤占nav的空间 
    - 和position 的区别，后者是在四个方向上的定位 完全离开文档流
      float 左右 没有完全离开文档流 影响周边的文字，形成环绕效果 

    - overflow: auto; 等 display: flex; 给nav元素开启了一个BFC
      会产生一个新的BFC 给nav元素开启了一个BFC 
        - 规则：BFC 元素可以得到内部浮动元素的高度 
        - 块级元素不等于BFC 