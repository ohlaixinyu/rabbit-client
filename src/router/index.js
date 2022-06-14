import { createRouter, createWebHashHistory } from 'vue-router'
const LayOut = () => import('@/views/Layout.vue')
const Home = () => import('@/views/home/index.vue')
const category = () => import('@/views/category/index.vue')
const sub = () => import('@/views/category/sub.vue')
const routes = [
  {
    path: '/',
    component: LayOut,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: category },
      { path: '/category/sub/:id', component: sub }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
