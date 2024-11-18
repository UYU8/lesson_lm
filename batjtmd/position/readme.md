# 百度面试题之定位

## 文档(document 顺序)流(从上到下 块级;从左到右 行内)

- document html 文档
  网页的结构 
  页面绘制的本质 像素绘制的

  - 按文档流先绘制 #box1 
    盒子的顺序 文档流
    精确计算盒子的大小 = 内容(width * height) + 内边距(Padding) + 边框(border)
    盒子的位置 在原来的位置上偏移 margin间距，给位置定位

## position 的属性和原理
   文档流有什么关系?
  - relative 相对定位
    - 默认（在原来本该的位置上）的位置 相对移动 left top... 原本的位置相对于移动后的位置距离了多少left right top bottom
    - 盒子原来的占位（文档流中的位置和大小）不受影响
  - absolute 绝对定位
    - 绝对定位会使盒子离开文档流
    - 会找到最近的父级拥有Position且非static的定位
      如果没有找到的话 相对于body定位