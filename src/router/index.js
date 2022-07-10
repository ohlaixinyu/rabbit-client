import { createRouter, createWebHashHistory } from 'vue-router'
const LayOut = () => import('@/views/Layout.vue')
const Home = () => import('@/views/home/index.vue')
const category = () => import('@/views/category/index.vue')
const sub = () => import('@/views/category/sub.vue')
const Goods = () => import('@/views/goods/index.vue')
const Login = () => import('@/views/login/index.vue')

const routes = [
  {
    path: '/',
    component: LayOut,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: category },
      { path: '/category/sub/:id', component: sub },
      { path: '/product/:id', component: Goods }
    ]
  },
  {
    path: '/login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 切换路由时控制页面滚动--顶部
  scrollBehavior () {
    return { left: 0, top: 0 }
  }
})

export default router
