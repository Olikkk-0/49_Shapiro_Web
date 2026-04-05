<!--
  pages/WeatherPage.vue — Страница "Погода"
  Использует: useWeatherStore (Pinia)
  Компоненты: WeatherCard, LoadingBox, ErrorBox, PlaceholderBox, ApiBadge
  Запрет DOM: только v-model, v-if, @click, @keyup
-->
<template>
  <section class="api-section active" aria-label="Погода">
    <div class="section-header">
      <h2 class="section-title">
        Погода <ApiBadge method="GET" />
      </h2>
      <p class="section-desc">
        Используется <strong>Open-Meteo API</strong> — бесплатный API без ключа.
        Введите город для поиска координат через Geocoding API.
      </p>
    </div>

    <div class="search-bar">
      <input
        v-model="cityInput"
        type="text"
        placeholder="Например: Москва, London, Paris…"
        autocomplete="off"
        @keyup.enter="handleSearch"
      />
      <button class="btn-primary" @click="handleSearch">Найти</button>
    </div>

    <PlaceholderBox
      v-if="store.status === 'idle'"
      icon="🌍"
      message="Введите название города, чтобы узнать погоду"
    />

    <LoadingBox
      v-else-if="store.status === 'loading'"
      message="Запрашиваем данные…"
    />

    <ErrorBox
      v-else-if="store.status === 'error'"
      :message="store.error"
    />

    <WeatherCard
      v-else-if="store.status === 'success' && store.result"
      :result="store.result"
    />
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useWeatherStore } from '../stores/weather'
import WeatherCard    from '../components/WeatherCard.vue'
import LoadingBox     from '../components/LoadingBox.vue'
import ErrorBox       from '../components/ErrorBox.vue'
import PlaceholderBox from '../components/PlaceholderBox.vue'
import ApiBadge       from '../components/ApiBadge.vue'

export default defineComponent({
  name: 'WeatherPage',
  components: { WeatherCard, LoadingBox, ErrorBox, PlaceholderBox, ApiBadge },
  setup() {
    const store      = useWeatherStore()
    const cityInput  = ref<string>('')

    async function handleSearch(): Promise<void> {
      await store.search(cityInput.value)
    }

    return { store, cityInput, handleSearch }
  },
})
</script>
