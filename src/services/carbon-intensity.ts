import { intensityBand } from '../utils/intensity-band'

export interface CarbonIntensityResult {
  actual: number
  band: 'low' | 'moderate' | 'high'
  generationMix: Array<{ fuel: string; perc: number }>
  regionName: string
  updatedAt: string
}

interface ApiResponse {
  data: Array<{
    shortname: string
    data: Array<{
      from: string
      intensity: { actual: number }
      generationmix: Array<{ fuel: string; perc: number }>
    }>
  }>
}

export async function carbonIntensity(postcode: string): Promise<CarbonIntensityResult> {
  const response = await fetch(
    `https://api.carbonintensity.org.uk/regional/postcode/${postcode}`,
  )
  if (!response.ok) throw new Error(`Carbon Intensity API error: ${response.status}`)

  const json: ApiResponse = await response.json()
  const region = json.data[0]
  const period = region.data[0]
  const actual = period.intensity.actual

  return {
    actual,
    band: intensityBand(actual),
    regionName: region.shortname,
    updatedAt: period.from,
    generationMix: period.generationmix,
  }
}
