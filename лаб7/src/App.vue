<!--
  App.vue — Корневой компонент приложения
  Содержит: AppHeader, <router-view>, AppFooter
  <router-view> рендерит активную страницу в зависимости от маршрута
-->
<template>
  <AppHeader />
  <main class="site-main">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <AppFooter />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

export default defineComponent({
  name: 'App',
  components: { AppHeader, AppFooter },
})
</script>

<style>
/* Анимация перехода между страницами */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
