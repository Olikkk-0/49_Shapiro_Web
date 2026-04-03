<!--
  FactCard.vue — Карточка одного факта о кошках
  Props: fact: CatFact, index: number
-->
<template>
  <div class="fact-card" :style="{ animationDelay: `${index * 0.07}s` }">
    <span class="fact-icon">{{ icon }}</span>
    <div>
      <p class="fact-text">{{ fact.text }}</p>
      <p class="fact-meta">{{ fact.length }} символов</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue'
import type { CatFact } from '../types'

const ICONS = ['🐱', '🐾', '😸', '🐈', '😺'] as const

export default defineComponent({
  name: 'FactCard',
  props: {
    fact:  { type: Object as PropType<CatFact>, required: true },
    index: { type: Number, default: 0 },
  },
  setup(props) {
    const icon = computed<string>(() => ICONS[props.index % ICONS.length])
    return { icon }
  },
})
</script>
