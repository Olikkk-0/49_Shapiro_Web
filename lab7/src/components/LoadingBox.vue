<!--
  LoadingBox.vue — Переиспользуемый компонент индикатора загрузки
  Props: message — текст под спиннером
-->
<template>
  <div class="loading-box">
    <div class="spinner"></div>
    <p>{{ message }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'LoadingBox',
  props: {
    message: {
      type: String,
      default: 'Загружаем данные…',
    },
  },
})
</script>
