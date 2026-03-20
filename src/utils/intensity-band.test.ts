import { intensityBand } from './intensity-band'

const LOW_THRESHOLD = 100
const MODERATE_THRESHOLD = 200

describe('intensityBand', () => {
  it('returns "low" at 0', () => {
    expect(intensityBand(0)).toBe('low')
  })

  it('returns "low" just below low threshold', () => {
    expect(intensityBand(LOW_THRESHOLD - 1)).toBe('low')
  })

  it('returns "moderate" at low threshold', () => {
    expect(intensityBand(LOW_THRESHOLD)).toBe('moderate')
  })

  it('returns "moderate" just below moderate threshold', () => {
    expect(intensityBand(MODERATE_THRESHOLD - 1)).toBe('moderate')
  })

  it('returns "high" at moderate threshold', () => {
    expect(intensityBand(MODERATE_THRESHOLD)).toBe('high')
  })

  it('returns "high" above moderate threshold', () => {
    expect(intensityBand(MODERATE_THRESHOLD + LOW_THRESHOLD)).toBe('high')
  })
})
