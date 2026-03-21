import { geocoding } from './geocoding'

const mockFetch = jest.fn()
globalThis.fetch = mockFetch

afterEach(() => {
  mockFetch.mockReset()
})

describe('geocoding', () => {
  it('returns lat/lon for a valid postcode', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        result: { latitude: 51.501, longitude: -0.142 },
      }),
    } as Response)

    const result = await geocoding('SW1A 1AA')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.postcodes.io/postcodes/SW1A%201AA',
      undefined,
    )
    expect(result).toEqual({ lat: 51.501, lon: -0.142 })
  })

  it('throws on non-2xx response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response)

    await expect(geocoding('INVALID')).rejects.toThrow('404')
  })

  it('throws a network error when fetch rejects', async () => {
    mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

    await expect(geocoding('SW1A 1AA')).rejects.toThrow('Network error')
  })
})
