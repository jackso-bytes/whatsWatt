import { carbonIntensity } from './carbon-intensity'

const ACTUAL_INTENSITY = 85

const FIXTURE = {
  data: [
    {
      shortname: 'South East',
      data: [
        {
          from: '2024-01-15T12:00Z',
          intensity: { actual: ACTUAL_INTENSITY },
          generationmix: [
            { fuel: 'gas', perc: 40.5 },
            { fuel: 'wind', perc: 35.2 },
            { fuel: 'solar', perc: 24.3 },
          ],
        },
      ],
    },
  ],
}

beforeEach(() => {
  globalThis.fetch = jest.fn() as typeof fetch
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('carbonIntensity', () => {
  it('extracts actual, regionName, generationMix, band and updatedAt', async () => {
    ;(globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(FIXTURE),
    })

    const result = await carbonIntensity('SE1')

    expect(result.actual).toBe(ACTUAL_INTENSITY)
    expect(result.regionName).toBe('South East')
    expect(result.band).toBe('low')
    expect(result.updatedAt).toBe('2024-01-15T12:00Z')
    expect(result.generationMix).toEqual([
      { fuel: 'gas', perc: 40.5 },
      { fuel: 'wind', perc: 35.2 },
      { fuel: 'solar', perc: 24.3 },
    ])
  })

  it('uses only the outward code when a full postcode is passed', async () => {
    ;(globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(FIXTURE),
    })

    await carbonIntensity('NR1 3AZ')

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/postcode/NR1'),
    )
    expect(globalThis.fetch).not.toHaveBeenCalledWith(
      expect.stringContaining('3AZ'),
    )
  })

  it('throws on non-2xx response', async () => {
    ;(globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    })

    await expect(carbonIntensity('ZZZZZ')).rejects.toThrow('404')
  })
})
