export interface LatLon {
  lat: number
  lon: number
}

export async function geocoding(postcode: string): Promise<LatLon> {
  const encoded = encodeURIComponent(postcode)
  let response: Response
  try {
    response = await fetch(`https://api.postcodes.io/postcodes/${encoded}`)
  } catch {
    throw new Error('Network error: unable to reach geocoding service')
  }
  if (!response.ok) throw new Error(String(response.status))
  const data = (await response.json()) as { result: { latitude: number; longitude: number } }
  return { lat: data.result.latitude, lon: data.result.longitude }
}
