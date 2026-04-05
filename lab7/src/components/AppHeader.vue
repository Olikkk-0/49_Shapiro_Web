<!--
  AppHeader.vue — Переиспользуемый шапка сайта
  Компонент: навигация через <router-link> (Vue Router)
  Запрет DOM: никаких document.getElementById, querySelector
-->
<template>
  <header class="site-header">
    <div class="header-inner">
      <h1 class="site-title">Лабораторная&nbsp;№7</h1>
      <nav class="main-nav" aria-label="Основная навигация">
        <ul class="nav-list">
          <li v-for="link in navLinks" :key="link.to">
            <router-link
              :to="link.to"
              class="nav-btn"
              active-class="active"
            >
              {{ link.label }}
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface NavLink {
  to: string
  label: string
}

export default defineComponent({
  name: 'AppHeader',
  setup() {
    const navLinks: NavLink[] = [
      { to: '/weather', label: '🌤 Погода'  },
      { to: '/posts',   label: '📝 Посты'   },
      { to: '/facts',   label: '🐱 Факты'   },
    ]
    return { navLinks }
  },
})
</script>
