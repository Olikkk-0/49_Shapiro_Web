// ╔══════════════════════════════════════════════════════╗
// ║  router/index.ts — Vue Router (SPA роутинг)          ║
// ║  Три маршрута: /weather, /posts, /facts              ║
// ║  beforeEach: предзагрузка данных из API (1б.)        ║
// ╚══════════════════════════════════════════════════════╝
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import WeatherPage from '../pages/WeatherPage.vue'
import PostsPage   from '../pages/PostsPage.vue'
import FactsPage   from '../pages/FactsPage.vue'

// Типизированный массив маршрутов
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/weather',
  },
  {
    path: '/weather',
    name: 'weather',
    component: WeatherPage,
    meta: { title: 'Погода' },
  },
  {
    path: '/posts',
    name: 'posts',
    component: PostsPage,
    // beforeEnter — предзагрузка постов при входе на страницу
    beforeEnter: async (_to, _from, next) => {
      // Импортируем хранилище лениво, чтобы не создавать циклических зависимостей
      const { usePostsStore } = await import('../stores/posts')
      const store = usePostsStore()
      // Загружаем только если ещё не загружали (idle)
      if (store.status === 'idle') {
        await store.loadPosts()
      }
      next()
    },
    meta: { title: 'Посты' },
  },
  {
    path: '/facts',
    name: 'facts',
    component: FactsPage,
    meta: { title: 'Факты о кошках' },
  },
  {
    // Catch-all — редирект на главную
    path: '/:pathMatch(.*)*',
    redirect: '/weather',
  },
]

const router = createRouter({
  // Hash-режим — работает без серверной настройки (открывается как файл)
  history: createWebHashHistory(),
  routes,
})

// Глобальный guard — обновляем заголовок страницы
router.afterEach((to) => {
  const title = to.meta?.title as string | undefined
  document.title = title ? `${title} — Лаб. №7` : 'Лабораторная №7'
})

export default router
