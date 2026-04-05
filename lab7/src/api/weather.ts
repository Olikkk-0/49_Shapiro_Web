// ╔══════════════════════════════════════════════════════╗
// ║  api/weather.ts — Weather API Module                 ║
// ║  Open-Meteo (бесплатно, без ключа)                   ║
// ╚══════════════════════════════════════════════════════╝
import type { WeatherResult, GeocodingResult, WmoCodes } from '../types'

const GEO_URL     = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast'

const WMO_CODES: WmoCodes = {
  0:  { label: 'Ясно',                   emoji: '☀️' },
  1:  { label: 'Преимущественно ясно',   emoji: '🌤' },
  2:  { label: 'Переменная облачность',  emoji: '⛅' },
  3:  { label: 'Пасмурно',              emoji: '☁️' },
  45: { label: 'Туман',                  emoji: '🌫' },
  48: { label: 'Изморозь',               emoji: '🌫' },
  51: { label: 'Морось лёгкая',          emoji: '🌦' },
  61: { label: 'Дождь слабый',           emoji: '🌧' },
  63: { label: 'Дождь',                  emoji: '🌧' },
  65: { label: 'Сильный дождь',          emoji: '🌧' },
  71: { label: 'Снег слабый',            emoji: '🌨' },
  73: { label: 'Снег',                   emoji: '❄️' },
  80: { label: 'Ливень',                 emoji: '🌦' },
  95: { label: 'Гроза',                  emoji: '⛈' },
  99: { label: 'Гроза с градом',         emoji: '⛈' },
}

async function geocodeCity(cityName: string): Promise<GeocodingResult> {
  const params = new URLSearchParams({ name: cityName, count: '1', language: 'ru', format: 'json' })
  const res = await fetch(`${GEO_URL}?${params}`)
  if (!res.ok) throw new Error(`Geocoding error: ${res.status}`)
  const data = await res.json()
  if (!data.results?.length) throw new Error(`Город "${cityName}" не найден`)
  return data.results[0] as GeocodingResult
}

async function fetchWeather(lat: number, lon: number) {
  const params = new URLSearchParams({
    latitude:  String(lat),
    longitude: String(lon),
    current:   ['temperature_2m','apparent_temperature','relative_humidity_2m','wind_speed_10m','visibility','weather_code'].join(','),
    wind_speed_unit: 'ms',
    timezone: 'auto',
  })
  const res = await fetch(`${WEATHER_URL}?${params}`)
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`)
  return res.json()
}

export async function searchByCity(cityName: string): Promise<WeatherResult> {
  if (!cityName?.trim()) throw new Error('Введите название города')
  const location = await geocodeCity(cityName.trim())
  const weatherData = await fetchWeather(location.latitude, location.longitude)
  const current = weatherData.current
  const code: number = current.weather_code
  const condition = WMO_CODES[code] ?? { label: `Код ${code}`, emoji: '❓' }
  return {
    city:       location.name,
    country:    location.country,
    lat:        location.latitude,
    lon:        location.longitude,
    temp:       Math.round(current.temperature_2m),
    feels:      Math.round(current.apparent_temperature),
    humidity:   current.relative_humidity_2m,
    wind:       current.wind_speed_10m,
    visibility: current.visibility,
    condition:  condition.label,
    emoji:      condition.emoji,
  }
}
