import App from './App.vue'
import 'vue-98/style.css'
import { ViteSSG } from 'vite-ssg'

import './assets/main.css'
import './assets/crt.css'
import { createPinia } from 'pinia'
import 'highlight.js/styles/night-owl.css'
import routes from './router'
import type { RouteRecordRaw } from 'vue-router'

export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL
  },
  ({ app, initialState }) => {
    const pinia = createPinia()

    app.use(pinia)

    if (!import.meta.env.SSR) {
      pinia.state.value = initialState.pinia || {}
    } else {
      initialState.pinia = pinia.state.value
    }
  }
)

export function includedRoutes(_, routes: RouteRecordRaw[]) {
  return routes.flatMap((route: RouteRecordRaw) => {
    return route.name === 'blog' ? ['1777622081916'].map((slug) => `/blog/${slug}`) : route.path
  })
}
