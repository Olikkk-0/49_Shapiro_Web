<!--
  PlaceholderBox.vue — Переиспользуемый компонент-заглушка (пустое состояние)
  Props: icon — эмодзи, message — текст
-->
<template>
  <div class="placeholder-box">
    <span class="placeholder-icon">{{ icon }}</span>
    <p>{{ message }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'PlaceholderBox',
  props: {
    icon:    { type: String, default: '💡' },
    message: { type: String, required: true },
  },
})
</script>
