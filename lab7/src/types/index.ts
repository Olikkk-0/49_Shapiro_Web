// ╔══════════════════════════════════════════════════════╗
// ║  types/index.ts — Типизация всего проекта            ║
// ║  Все интерфейсы данных, состояний и API              ║
// ╚══════════════════════════════════════════════════════╝

// ─── Weather ─────────────────────────────────────────────
export interface WeatherResult {
  city: string
  country: string
  lat: number
  lon: number
  temp: number
  feels: number
  humidity: number
  wind: number
  visibility: number
  condition: string
  emoji: string
}

export interface GeocodingResult {
  name: string
  country: string
  latitude: number
  longitude: number
}

export interface WmoCondition {
  label: string
  emoji: string
}

export type WmoCodes = Record<number, WmoCondition>

// ─── Posts ───────────────────────────────────────────────
export interface Post {
  id: number
  title: string
  body: string
  userId: number
}

export interface CreatePostPayload {
  title: string
  body: string
  userId?: number
}

export interface UpdatePostPayload {
  title: string
  body: string
}

// ─── Facts ───────────────────────────────────────────────
export interface CatFact {
  text: string
  length: number
}

// ─── Store States ─────────────────────────────────────────
export type LoadStatus = 'idle' | 'loading' | 'success' | 'error'

export interface WeatherState {
  result: WeatherResult | null
  status: LoadStatus
  error: string
}

export interface PostsState {
  posts: Post[]
  status: LoadStatus
  error: string
  editingPost: Post | null
  formOpen: boolean
  formStatus: LoadStatus
  formMessage: string
  formIsError: boolean
}

export interface FactsState {
  facts: CatFact[]
  status: LoadStatus
  error: string
}
