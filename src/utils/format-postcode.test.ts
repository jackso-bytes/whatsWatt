import { formatPostcode } from './format-postcode'

describe('formatPostcode', () => {
  it('returns already-normalised postcode unchanged', () => {
    expect(formatPostcode('NR1 4AA')).toBe('NR1 4AA')
  })

  it('normalises lowercase with no space', () => {
    expect(formatPostcode('nr14aa')).toBe('NR1 4AA')
  })

  it('normalises 4-char outward with no space', () => {
    expect(formatPostcode('EC1A1BB')).toBe('EC1A 1BB')
  })

  it('handles SW1A 2AA unchanged', () => {
    expect(formatPostcode('SW1A 2AA')).toBe('SW1A 2AA')
  })

  it('strips surrounding whitespace and collapses internal spaces', () => {
    expect(formatPostcode(' W1A  0AX ')).toBe('W1A 0AX')
  })

  it('handles valid AANA format', () => {
    expect(formatPostcode('AA9A 9AA')).toBe('AA9A 9AA')
  })

  it('returns undefined for ZZZZZ', () => {
    expect(formatPostcode('ZZZZZ')).toBeUndefined()
  })

  it('returns undefined for empty string', () => {
    expect(formatPostcode('')).toBeUndefined()
  })

  it('returns undefined for all-digits', () => {
    expect(formatPostcode('123')).toBeUndefined()
  })
})
