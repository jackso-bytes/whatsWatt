import { fetchJson } from './fetch-json'

const mockFetch = jest.fn()
globalThis.fetch = mockFetch

afterEach(() => {
  mockFetch.mockReset()
})

describe('fetchJson', () => {
  it('returns parsed JSON on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ value: 42 }),
    } as Response)

    const result = await fetchJson<{ value: number }>('https://example.com')
    expect(result).toEqual({ value: 42 })
  })

  it('throws status code string on non-2xx response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 } as Response)

    await expect(fetchJson('https://example.com')).rejects.toThrow('404')
  })

  it('throws Network error on connectivity failure', async () => {
    mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

    await expect(fetchJson('https://example.com')).rejects.toThrow('Network error')
  })

  it('passes options through to fetch', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response)

    const options = { headers: { Authorization: 'Bearer token' } }
    await fetchJson('https://example.com', options)

    expect(mockFetch).toHaveBeenCalledWith('https://example.com', options)
  })
})
