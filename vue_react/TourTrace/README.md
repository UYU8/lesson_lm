# 字节vue前端项目学习

- VUE 纯前端项目 
  创建 VUE + TS vue-router pinia 全家桶
  去git 上新建一个文件夹 按需提交

- VUE + KOA + MYSQL 全栈项目
- TS 放心用
  - TS 像写java一样写js 强大的类型约束
- vue-router
  - RouteRecordRaw 类型约束 让路由配置声明更加正确
  - 首页路由中 加入 redirect 重定向 /home
  - 开发根目录下增加 ts类型声明文件
  - src/shims-vue.d.ts
  告诉 TypeScript 编译器如何处理 .vue 文件
- vant UI 组件库
  - element-ui 不太一样 包小 更快
  按需加载.use(list(组件列表))
  - vite 工程化
  预先加载UI组件库 更快 在后端加载
  vant 
  @vant/auto-import-resolver
  vite 支持
  vite.config.ts 中的配置

- 移动端 的App 
  - vant 适合移动端 element-ui PC 端
  - 路由 App(根组件) -> router-view -> KeepAlive -> redirect -> Home 
  - 图标字体库 iconfont 由阿里提供 
    - 在线选择需要的图标 下载后有文件夹
      .ttf 为图标字体库
      .css 中 font-family: 'iconfont' 定义了图标字体库的名字 
  - 组件 + 状态管理(pinia) 
  - @ 路径的别名 alias 代表 /src
    在 vite.config.ts 中配置
  - types 自定义类型 ts 中的关键词 用于声明自定义类型 
  -  es6 module(模块) 高级语法 引入类型时加入type
  - 泛型 类型约束 接受类型的传参 你将这个类型传到我<> 这里面 我就用这个约束ref