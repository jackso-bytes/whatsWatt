export type AqiLevel = 'good' | 'fair' | 'moderate' | 'poor' | 'very-poor'

const GOOD_MAX = 20
const FAIR_MAX = 40
const MODERATE_MAX = 60
const POOR_MAX = 80

export function aqiBand(value: number): AqiLevel {
  if (value <= GOOD_MAX) return 'good'
  if (value <= FAIR_MAX) return 'fair'
  if (value <= MODERATE_MAX) return 'moderate'
  if (value <= POOR_MAX) return 'poor'
  return 'very-poor'
}
