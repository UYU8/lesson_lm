import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// 自动导入index.js文件
import router from './router' // 路由对象

createApp(App) // vue 根组件 -> 
// app 对象 use 方法
.use(router) // 插件使用路由功能
.mount('#app') // -> 挂载点 
