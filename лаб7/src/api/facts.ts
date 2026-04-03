// ╔══════════════════════════════════════════════════════╗
// ║  api/facts.ts — Cat Facts API Module                 ║
// ║  catfact.ninja — GET random fact / paginated list    ║
// ╚══════════════════════════════════════════════════════╝
import type { CatFact } from '../types'

const BASE = 'https://catfact.ninja'

export async function getRandomFact(): Promise<CatFact> {
  const res = await fetch(`${BASE}/fact`)
  if (!res.ok) throw new Error(`GET /fact failed: ${res.status}`)
  const data = await res.json()
  return { text: data.fact, length: data.length }
}

export async function getFacts(limit = 5): Promise<CatFact[]> {
  const params = new URLSearchParams({ limit: String(limit) })
  const res = await fetch(`${BASE}/facts?${params}`)
  if (!res.ok) throw new Error(`GET /facts failed: ${res.status}`)
  const data = await res.json()
  return (data.data ?? []).map((item: { fact: string; length: number }) => ({
    text:   item.fact,
    length: item.length,
  }))
}
