import { fetchJson } from '../utils/fetch-json'

export interface LatLon {
  lat: number
  lon: number
}

interface PostcodesResponse {
  result: { latitude: number; longitude: number }
}

export async function geocoding(postcode: string): Promise<LatLon> {
  const encoded = encodeURIComponent(postcode)
  const data = await fetchJson<PostcodesResponse>(
    `https://api.postcodes.io/postcodes/${encoded}`,
  )
  return { lat: data.result.latitude, lon: data.result.longitude }
}
