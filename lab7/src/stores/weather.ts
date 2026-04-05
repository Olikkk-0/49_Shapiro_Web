// ╔══════════════════════════════════════════════════════╗
// ║  stores/weather.ts — Pinia Store: погода             ║
// ║  Глобальное хранилище + предзагрузка данных          ║
// ╚══════════════════════════════════════════════════════╝
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { searchByCity } from '../api/weather'
import type { WeatherResult, LoadStatus } from '../types'

export const useWeatherStore = defineStore('weather', () => {
  // ── State ──────────────────────────────────────────────
  const result  = ref<WeatherResult | null>(null)
  const status  = ref<LoadStatus>('idle')
  const error   = ref<string>('')

  // ── Actions ────────────────────────────────────────────
  async function search(cityName: string): Promise<void> {
    if (!cityName.trim()) {
      error.value  = 'Введите название города'
      status.value = 'error'
      return
    }
    if (cityName.trim().length < 2) {
      error.value  = 'Название города слишком короткое'
      status.value = 'error'
      return
    }
    status.value = 'loading'
    error.value  = ''
    try {
      result.value  = await searchByCity(cityName)
      status.value  = 'success'
    } catch (err: unknown) {
      error.value  = err instanceof Error ? err.message : 'Не удалось получить данные о погоде'
      status.value = 'error'
    }
  }

  function reset(): void {
    result.value = null
    status.value = 'idle'
    error.value  = ''
  }

  return { result, status, error, search, reset }
})
