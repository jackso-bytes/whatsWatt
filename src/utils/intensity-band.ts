const LOW_THRESHOLD = 100
const MODERATE_THRESHOLD = 200

export function intensityBand(value: number): 'low' | 'moderate' | 'high' {
  if (value < LOW_THRESHOLD) return 'low'
  if (value < MODERATE_THRESHOLD) return 'moderate'
  return 'high'
}
