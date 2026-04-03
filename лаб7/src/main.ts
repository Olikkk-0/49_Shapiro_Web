// ╔══════════════════════════════════════════════════════╗
// ║  main.ts — Точка входа приложения                    ║
// ║  Подключает Vue 3, Pinia, Vue Router                 ║
// ╚══════════════════════════════════════════════════════╝
import { createApp }  from 'vue'
import { createPinia } from 'pinia'
import App    from './App.vue'
import router from './router/index'

const app   = createApp(App)
const pinia = createPinia()

app.use(pinia)   // Глобальное хранилище Pinia
app.use(router)  // SPA роутинг Vue Router

app.mount('#app')
