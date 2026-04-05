// ╔══════════════════════════════════════════════════════╗
// ║  stores/facts.ts — Pinia Store: факты о кошках       ║
// ║  Предзагрузка и хранение фактов глобально            ║
// ╚══════════════════════════════════════════════════════╝
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getRandomFact, getFacts } from '../api/facts'
import type { CatFact, LoadStatus } from '../types'

export const useFactsStore = defineStore('facts', () => {
  // ── State ──────────────────────────────────────────────
  const facts   = ref<CatFact[]>([])
  const status  = ref<LoadStatus>('idle')
  const error   = ref<string>('')

  // ── Actions ────────────────────────────────────────────
  async function loadOne(): Promise<void> {
    status.value = 'loading'
    error.value  = ''
    try {
      const fact   = await getRandomFact()
      facts.value  = [fact]
      status.value = 'success'
    } catch (err: unknown) {
      error.value  = err instanceof Error ? err.message : 'Не удалось загрузить факт'
      status.value = 'error'
    }
  }

  async function loadMany(): Promise<void> {
    status.value = 'loading'
    error.value  = ''
    try {
      facts.value  = await getFacts(5)
      status.value = 'success'
    } catch (err: unknown) {
      error.value  = err instanceof Error ? err.message : 'Не удалось загрузить факты'
      status.value = 'error'
    }
  }

  return { facts, status, error, loadOne, loadMany }
})
