# VUE + REACT CLD 命令行

- vue-cli command line 
  - 比较复杂的大型项目，不是简单的页面开发
    web app，而非page
    - npm init vite
      vite 快速构建前端项目，前端基建工具（工程化的核心套件，）
      npm init 初始化项目 将初始化交给vite 这个工程化巨佬
      - 标准项目模板
        没必要每次都搞

- 项目的结构
  - package.json 项目描述文件
    依赖
    - vue 3^ 开发和上线了都要
    - vite 开发阶段才用，上线后不需要（前端基建）vite是大boss 包工头 

- 工程的不同生命周期（项目的不同阶段）
  - dev 开发阶段
  - test 测试阶段
  - build 上线阶段
  - online 运营维护

- npm run dev  vite
  - 先找到根目录下的 启动http协议在5173端口 将index.html作为首页（website） 其中有挂载点 #app
  - 从中启动src/main.js 入口文件

- src/main.js
  - src 开发目录
    开发的主战场
    - main.js 入口文件
      createApp().mount('#app') 
      - App.vue
        .vue 专属后缀
        - 三段式
          - template 模板 负责写结构 {{}}
          - script 逻辑 响应式 事件 ... 负责写数据
          - css 样式 负责写样式2

        - .vue 太好 像胶囊一样 
        - 组件就是 > html的 页面构建模块
          组件是现代前端的开发新单元（比html大，组件 = 由一个逻辑单元的html构成 + css + js（汉堡包）组成一个.vue文件）
          是对某项功能的抽象 
        
        - 现代前端拥抱组件思维 vue前端组件库
        - 组件按照功能划分
        - 组件 = html(一堆) + css（一堆） + js（一堆）
        - .vue 三段式组合成这个组件
        - 轮播图 功能属性凸显 经典的组件
        组件嵌套组件
        - 前端的开发单位是组件，不是页面（不同页面可能会重复都需要同一个功能）
          不能以html 为单位？ 单个功能弱小
        - 从工程化角度理解组件
          - 按功能块划分，好安排工作
          - 组件可以复用（.vue）哪里要用直接 import 给它
          - 好维护 
        - 组件以标签的方式嵌入页面
          可读性非常高
          