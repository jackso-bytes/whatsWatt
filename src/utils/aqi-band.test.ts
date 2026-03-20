import { aqiBand } from './aqi-band'

const GOOD_MAX = 20
const FAIR_MAX = 40
const MODERATE_MAX = 60
const POOR_MAX = 80

describe('aqiBand', () => {
  it('returns "good" (level 1) for value 0', () => {
    expect(aqiBand(0)).toBe('good')
  })

  it('returns "good" (level 1) at boundary 20', () => {
    expect(aqiBand(GOOD_MAX)).toBe('good')
  })

  it('returns "fair" (level 2) just above good boundary', () => {
    expect(aqiBand(GOOD_MAX + 1)).toBe('fair')
  })

  it('returns "fair" (level 2) at boundary 40', () => {
    expect(aqiBand(FAIR_MAX)).toBe('fair')
  })

  it('returns "moderate" (level 3) just above fair boundary', () => {
    expect(aqiBand(FAIR_MAX + 1)).toBe('moderate')
  })

  it('returns "moderate" (level 3) at boundary 60', () => {
    expect(aqiBand(MODERATE_MAX)).toBe('moderate')
  })

  it('returns "poor" (level 4) just above moderate boundary', () => {
    expect(aqiBand(MODERATE_MAX + 1)).toBe('poor')
  })

  it('returns "poor" (level 4) at boundary 80', () => {
    expect(aqiBand(POOR_MAX)).toBe('poor')
  })

  it('returns "very-poor" (level 5) just above poor boundary', () => {
    expect(aqiBand(POOR_MAX + 1)).toBe('very-poor')
  })

  it('returns "very-poor" (level 5) for high value', () => {
    expect(aqiBand(POOR_MAX * 2 + GOOD_MAX)).toBe('very-poor')
  })
})
