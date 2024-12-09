# 星球大战

- <!DOCTYPE html>
  申明使用的是html5 版本申明头

- <meta charset="utf-8">
  申明使用的是utf-8 编码

-  *
  css 通配符，所有元素
  margin 0 padding 0 所有元素初始化一致
  由于有不同的浏览器厂商，默认值不一样
  需要在页面样式开始之前，做一个样式的reset 让任何浏览器访问，我们的页面都是一张白纸
  在所有浏览器上体验一致 
  
  * 性能不太好，所以我们宁愿列出来所有的标签

- 居中
  - 定位 position: absolute; left: 50%; top: 50%; 元素左上角先对于父元素（页面）左上角定位
  - 百分比相对于父亲
  - transform 变基属性 
  - translate(-50%,-50%) 移动
    x 左移 负 右移 正
    y 上移 负 下移 正
    百分比相对于自己
  - 背景大法
    盒子在页面的占位会出来

- css 动画
  - animation
  - @keyframes
  - transform scale  translaterY
  - 飞船模拟动画，逼真
  - 1% 时间差，画龙点睛
  - transform-style: preserve-3d; 开启3d支持
  - perspective: 800px; 视点 眼睛离屏幕的距离 

  - inline 元素不支持transform,display 属性切换为inline-block
