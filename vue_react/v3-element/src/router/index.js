import { createRouter, createWebHistory } from 'vue-router'

// 路由配置数组
const routes = [
  {
    path: '/',
    name: 'Home',
    // 路由懒加载
    component: () => import('../pages/Home.vue'),
    meta: {
      title: '首页',
      requireLogin: true
    },
    children: [
      {
        path: 'about',
        name: 'About',
        component: () => import('../pages/About.vue'),
        meta: {
          title: '关于',
          requireLogin: true
        },
      }
    ]
  },
  {
    path: '/login',
    component: () => import('../pages/Login.vue'),
    name: 'login',
    meta: {
      title: '登陆',
      requireLogin: false
    }
  }
]

// 实例化路由对象
const router = createRouter(
  {
    history: createWebHistory(),
    routes
  }
)

// 路由守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "掘金"
  if (to.meta.requireLogin) {
    next('/login')
    return
  }
  next()
})

export default router 