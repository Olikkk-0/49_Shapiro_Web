<!--
  ApiBadge.vue — Переиспользуемый компонент бейджа HTTP-метода
  Props: method — 'GET' | 'POST' | 'PATCH' | 'DELETE'
-->
<template>
  <span :class="['api-badge', methodClass]">{{ method }}</span>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue'

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

export default defineComponent({
  name: 'ApiBadge',
  props: {
    method: {
      type: String as PropType<HttpMethod>,
      required: true,
    },
  },
  setup(props) {
    const methodClass = computed<string>(() => ({
      'GET':    '',
      'POST':   'post',
      'PATCH':  'patch',
      'DELETE': 'del',
    }[props.method] ?? ''))
    return { methodClass }
  },
})
</script>
