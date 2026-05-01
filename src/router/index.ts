import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BlogOverview from '@/views/BlogOverview.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/blog/:timestamp',
      name: 'blog',
      component: () => import('@/views/BlogView.vue')
    },
    {
      path: '/blogs',
      name: 'blogs',
      component: BlogOverview
    }
  ]
})

export default router
