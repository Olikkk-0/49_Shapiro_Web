<!--
  ErrorBox.vue — Переиспользуемый компонент ошибки
  Props: message — текст ошибки
-->
<template>
  <div class="error-box">
    <span class="error-icon">⚠️</span>
    <p>{{ message }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ErrorBox',
  props: {
    message: {
      type: String,
      required: true,
    },
  },
})
</script>
