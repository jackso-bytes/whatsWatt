import { airQuality } from './air-quality'
import { geocoding } from './geocoding'

jest.mock('./geocoding')

const mockGeocoding = geocoding as jest.MockedFunction<typeof geocoding>
const mockFetch = jest.fn()
globalThis.fetch = mockFetch

afterEach(() => {
  mockFetch.mockReset()
  mockGeocoding.mockReset()
})

describe('airQuality', () => {
  it('calls Open-Meteo with correct lat/lon URL', async () => {
    mockGeocoding.mockResolvedValueOnce({ lat: 52.628, lon: 1.299 })
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        current: { european_aqi: 10, pm2_5: 1, nitrogen_dioxide: 2, ozone: 3 },
      }),
    } as Response)

    await airQuality('NR1 4AA')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=52.628&longitude=1.299&current=european_aqi,pm2_5,nitrogen_dioxide,ozone',
      undefined,
    )
  })

  it('throws when postcode is invalid (geocoding rejects)', async () => {
    mockGeocoding.mockRejectedValueOnce(new Error('404'))

    await expect(airQuality('ZZZZZ')).rejects.toThrow('404')
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('throws on non-2xx from Open-Meteo', async () => {
    mockGeocoding.mockResolvedValueOnce({ lat: 52.628, lon: 1.299 })
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
    } as Response)

    await expect(airQuality('NR1 4AA')).rejects.toThrow('503')
  })

  it('returns AQI data for valid postcode', async () => {
    mockGeocoding.mockResolvedValueOnce({ lat: 52.628, lon: 1.299 })
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        current: {
          european_aqi: 23,
          pm2_5: 7.1,
          nitrogen_dioxide: 12.4,
          ozone: 88,
        },
      }),
    } as Response)

    const result = await airQuality('NR1 4AA')

    expect(result).toEqual({
      european_aqi: 23,
      pm2_5: 7.1,
      nitrogen_dioxide: 12.4,
      ozone: 88,
    })
  })
})
