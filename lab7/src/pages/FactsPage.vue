<!--
  pages/FactsPage.vue — Страница "Факты о кошках"
  Использует: useFactsStore (Pinia)
  Компоненты: FactCard, LoadingBox, ErrorBox, PlaceholderBox, ApiBadge
  Запрет DOM: только v-for, v-if, @click
-->
<template>
  <section class="api-section active" aria-label="Факты о кошках">
    <div class="section-header">
      <h2 class="section-title">
        Факты о кошках <ApiBadge method="GET" />
      </h2>
      <p class="section-desc">
        Используется <strong>Cat Fact Ninja API</strong> — публичный API
        с рандомными фактами о кошках.
      </p>
    </div>

    <div class="facts-controls">
      <button class="btn-primary"   @click="store.loadOne">Случайный факт</button>
      <button class="btn-secondary" @click="store.loadMany">Загрузить 5 фактов</button>
    </div>

    <PlaceholderBox
      v-if="store.status === 'idle'"
      icon="🐾"
      message="Нажмите кнопку, чтобы узнать интересный факт о кошках"
    />

    <LoadingBox
      v-else-if="store.status === 'loading'"
      message="Ищем интересные факты…"
    />

    <ErrorBox
      v-else-if="store.status === 'error'"
      :message="store.error"
    />

    <div
      v-else-if="store.status === 'success'"
      class="facts-list"
      aria-live="polite"
    >
      <FactCard
        v-for="(fact, index) in store.facts"
        :key="index"
        :fact="fact"
        :index="index"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useFactsStore } from '../stores/facts'
import FactCard       from '../components/FactCard.vue'
import LoadingBox     from '../components/LoadingBox.vue'
import ErrorBox       from '../components/ErrorBox.vue'
import PlaceholderBox from '../components/PlaceholderBox.vue'
import ApiBadge       from '../components/ApiBadge.vue'

export default defineComponent({
  name: 'FactsPage',
  components: { FactCard, LoadingBox, ErrorBox, PlaceholderBox, ApiBadge },
  setup() {
    const store = useFactsStore()
    return { store }
  },
})
</script>
