<!--
  WeatherCard.vue — Карточка с результатами погоды
  Props: result: WeatherResult
  Запрет DOM: нет document.*
-->
<template>
  <article class="weather-card" aria-live="polite">
    <div class="weather-city-row">
      <h3 class="weather-city">{{ result.city }}, {{ result.country }}</h3>
      <span class="weather-condition">{{ result.condition }}</span>
    </div>
    <div class="weather-main">
      <span class="weather-temp">{{ result.temp }}°C</span>
      <span class="weather-emoji">{{ result.emoji }}</span>
    </div>
    <ul class="weather-details">
      <li><strong>Ощущается как:</strong> {{ result.feels }}°C</li>
      <li><strong>Влажность:</strong> {{ result.humidity }}%</li>
      <li><strong>Ветер:</strong> {{ result.wind }} м/с</li>
      <li><strong>Видимость:</strong> {{ visibilityText }}</li>
    </ul>
    <p class="weather-coords">
      {{ result.lat.toFixed(4) }}°N, {{ result.lon.toFixed(4) }}°E
    </p>
  </article>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue'
import type { WeatherResult } from '../types'

export default defineComponent({
  name: 'WeatherCard',
  props: {
    result: {
      type: Object as PropType<WeatherResult>,
      required: true,
    },
  },
  setup(props) {
    const visibilityText = computed<string>(() =>
      props.result.visibility >= 1000
        ? `${(props.result.visibility / 1000).toFixed(1)} км`
        : `${props.result.visibility} м`
    )
    return { visibilityText }
  },
})
</script>
