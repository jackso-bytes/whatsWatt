import { fetchJson } from '../utils/fetch-json'
import { geocoding } from './geocoding'

export interface AirQualityData {
  european_aqi: number
  pm2_5: number
  nitrogen_dioxide: number
  ozone: number
}

interface OpenMeteoResponse {
  current: {
    european_aqi: number
    pm2_5: number
    nitrogen_dioxide: number
    ozone: number
  }
}

export async function airQuality(postcode: string): Promise<AirQualityData> {
  const { lat, lon } = await geocoding(postcode)
  const url =
    `https://air-quality-api.open-meteo.com/v1/air-quality` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=european_aqi,pm2_5,nitrogen_dioxide,ozone`
  const data = await fetchJson<OpenMeteoResponse>(url)
  return {
    european_aqi: data.current.european_aqi,
    pm2_5: data.current.pm2_5,
    nitrogen_dioxide: data.current.nitrogen_dioxide,
    ozone: data.current.ozone,
  }
}
