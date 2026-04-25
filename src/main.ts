import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vue-98/dist/main.css'

import './assets/main.css'
import './assets/crt.css'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

app.mount('#app')
