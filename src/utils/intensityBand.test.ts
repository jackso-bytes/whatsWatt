import { intensityBand } from './intensityBand'

describe('intensityBand', () => {
  it('returns "low" at 0', () => {
    expect(intensityBand(0)).toBe('low')
  })

  it('returns "low" at 99', () => {
    expect(intensityBand(99)).toBe('low')
  })

  it('returns "moderate" at 100', () => {
    expect(intensityBand(100)).toBe('moderate')
  })

  it('returns "moderate" at 199', () => {
    expect(intensityBand(199)).toBe('moderate')
  })

  it('returns "high" at 200', () => {
    expect(intensityBand(200)).toBe('high')
  })

  it('returns "high" at 300', () => {
    expect(intensityBand(300)).toBe('high')
  })
})
