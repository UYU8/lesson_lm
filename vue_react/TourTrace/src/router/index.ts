import { createRouter, createWebHistory } from 'vue-router'
// 路由类型
import type { RouteRecordRaw } from 'vue-router'

// js 弱类型 好学
// 大型项目 弱类型为缺点 
const rootRoutes :RouteRecordRaw[] = [
  {
      path: 'home',
      name: 'Home',
      meta:{
          title: '首页',
          cache:true
      },
      component: () => import('../views/Home/Home.vue')
  },
  {
    path: 'assistant',
    name: 'Assistant',
    meta:{
        title: 'ai助手',
        cache:true
    },
    component: () => import('../views/Assistant/Assistant.vue')
},
{
    path:'shopping',
    name: 'Shopping',
    meta:{
        title: '商城',
        cache:true
    },
    component: () => import('../views/Shop/Shopping.vue')
},
{
    path:'mine',
    name: 'Mine',
    meta:{
        title: '个人中心',
        cache:false
    },
    component: () => import('../views/My/Mine.vue')
}

]
// 类型约束可以让代码正确
const routes : RouteRecordRaw[] = [
  {
    path: '/',
    name: 'App',
    component: () => import('../views/KeepAlive.vue'),
    redirect: '/home', // 重定向
    children: rootRoutes
  },
  {
    path:'/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next)=>{
    // as 当成什么类型处理 断言
    document.title = to.meta.title as string;
    next()

})

export default router