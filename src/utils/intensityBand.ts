export function intensityBand(value: number): 'low' | 'moderate' | 'high' {
  if (value < 100) return 'low'
  if (value < 200) return 'moderate'
  return 'high'
}
