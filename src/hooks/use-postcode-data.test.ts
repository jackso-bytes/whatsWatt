/**
 * @jest-environment jsdom
 */
import { renderHook, waitFor } from '@testing-library/react'
import { usePostcodeData } from './use-postcode-data'

jest.mock('../services/carbon-intensity')
jest.mock('../services/octopus')
jest.mock('../services/air-quality')

import { carbonIntensity } from '../services/carbon-intensity'
import { octopus } from '../services/octopus'
import { airQuality } from '../services/air-quality'

const mockCarbonIntensity = carbonIntensity as jest.MockedFunction<typeof carbonIntensity>
const mockOctopus = octopus as jest.MockedFunction<typeof octopus>
const mockAirQuality = airQuality as jest.MockedFunction<typeof airQuality>

const CI_RESULT = {
  actual: 120,
  band: 'moderate' as const,
  generationMix: [{ fuel: 'wind', perc: 40 }],
  regionName: 'East England',
  updatedAt: '2024-01-01T00:00Z',
}

const OCTOPUS_RESULT = { value: 24.5, tariff: 'E-1R-VAR-22-11-01-P' }

const AQ_RESULT = {
  european_aqi: 35,
  pm2_5: 8.1,
  nitrogen_dioxide: 12.3,
  ozone: 55,
}

function setupAllMocksOk(): void {
  mockCarbonIntensity.mockResolvedValue(CI_RESULT)
  mockOctopus.mockResolvedValue(OCTOPUS_RESULT)
  mockAirQuality.mockResolvedValue(AQ_RESULT)
}

beforeEach(() => { jest.resetAllMocks() })

it('returns idle when postcode is empty', () => {
  const { result } = renderHook(() => usePostcodeData(''))
  expect(result.current.status).toBe('idle')
  expect(result.current.intensity).toBeUndefined()
})

it('enters loading state on non-empty postcode', async () => {
  setupAllMocksOk()
  const { result } = renderHook(() => usePostcodeData('NR1'))
  expect(result.current.status).toBe('loading')
  await waitFor(() => { expect(result.current.status).toBe('success') })
})

it('returns intensity and region on success', async () => {
  setupAllMocksOk()
  const { result } = renderHook(() => usePostcodeData('NR1'))
  await waitFor(() => { expect(result.current.status).toBe('success') })

  expect(result.current.intensity).toEqual({
    actual: 120,
    band: 'moderate',
    updatedAt: '2024-01-01T00:00Z',
  })
  expect(result.current.generationMix).toEqual([{ fuel: 'wind', perc: 40 }])
  expect(result.current.region).toEqual({ name: 'East England', gspId: '_P' })
})

it('returns unitRate and aqi on success', async () => {
  setupAllMocksOk()
  const { result } = renderHook(() => usePostcodeData('NR1'))
  await waitFor(() => { expect(result.current.status).toBe('success') })

  expect(result.current.unitRate).toEqual({ value: 24.5, tariff: 'E-1R-VAR-22-11-01-P' })
  expect(result.current.aqi).toEqual({
    index: 35,
    level: 'fair',
    pm25: 8.1,
    no2: 12.3,
    o3: 55,
  })
})

it('sets intensityError and still resolves others when carbonIntensity rejects', async () => {
  mockCarbonIntensity.mockRejectedValue(new Error('CI failed'))
  mockOctopus.mockResolvedValue(OCTOPUS_RESULT)
  mockAirQuality.mockResolvedValue(AQ_RESULT)

  const { result } = renderHook(() => usePostcodeData('NR1'))
  await waitFor(() => { expect(result.current.status).toBe('success') })

  expect(result.current.intensityError).toBeInstanceOf(Error)
  expect(result.current.intensity).toBeUndefined()
  expect(result.current.unitRate).toEqual(OCTOPUS_RESULT)
  expect(result.current.aqi?.index).toBe(AQ_RESULT.european_aqi)
})

it('ignores stale results when postcode changes mid-flight', async () => {
  let resolveFirst!: (value: typeof CI_RESULT) => void
  const firstCall = new Promise<typeof CI_RESULT>((resolve) => { resolveFirst = resolve })
  mockCarbonIntensity.mockReturnValueOnce(firstCall).mockResolvedValue(CI_RESULT)
  mockOctopus.mockResolvedValue(OCTOPUS_RESULT)
  mockAirQuality.mockResolvedValue(AQ_RESULT)

  const { result, rerender } = renderHook(({ postcode }) => usePostcodeData(postcode), {
    initialProps: { postcode: 'OLD1' },
  })

  rerender({ postcode: 'NR1' })
  resolveFirst(CI_RESULT)

  await waitFor(() => { expect(result.current.status).toBe('success') })
  expect(result.current.status).toBe('success')
})
