export interface LatLon {
  lat: number
  lon: number
}

export async function geocoding(postcode: string): Promise<LatLon> {
  const encoded = encodeURIComponent(postcode)
  const response = await fetch(`https://api.postcodes.io/postcodes/${encoded}`)
  if (!response.ok) throw new Error(String(response.status))
  const data = (await response.json()) as { result: { latitude: number; longitude: number } }
  return { lat: data.result.latitude, lon: data.result.longitude }
}
