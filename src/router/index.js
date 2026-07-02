import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/Home.vue') },
  { path: '/login', name: 'login', component: () => import('@/views/Login.vue') },
  { path: '/family', name: 'family', component: () => import('@/views/Family.vue') },
  { path: '/store', name: 'store', component: () => import('@/views/Store.vue') },
  { path: '/mine', name: 'mine', component: () => import('@/views/Mine.vue') },
  { path: '/rules', name: 'rules', component: () => import('@/views/Rules.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
