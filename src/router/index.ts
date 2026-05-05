import HomeView from '@/views/HomeView.vue'
import BlogOverview from '@/views/BlogOverview.vue'
import BlogView from '@/views/BlogView.vue'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/blog/:timestamp',
    name: 'blog',
    component: BlogView
  },
  {
    path: '/blogs',
    name: 'blogs',
    component: BlogOverview
  }
]
export default routes
