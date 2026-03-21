import { octopus } from './octopus'

const UNIT_RATE_P = 28.37
const UNIT_RATE_A = 24.5

const GSP_FIXTURE_P = { results: [{ group_id: '_P' }] }
const GSP_FIXTURE_A = { results: [{ group_id: '_A' }] }
const RATE_FIXTURE_P = { results: [{ value_inc_vat: UNIT_RATE_P }] }
const RATE_FIXTURE_A = { results: [{ value_inc_vat: UNIT_RATE_A }] }

const HTTP_500 = 500
const HTTP_403 = 403

const mockOkJson = (body: unknown) => ({ ok: true, json: () => Promise.resolve(body) })
const mockError = (status: number) => ({ ok: false, status })

beforeEach(() => {
  globalThis.fetch = jest.fn() as typeof fetch
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('octopus — happy path', () => {
  it('returns unit rate and tariff for postcode (GSP _P)', async () => {
    ;(globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce(mockOkJson(GSP_FIXTURE_P))
      .mockResolvedValueOnce(mockOkJson(RATE_FIXTURE_P))

    const result = await octopus('NR1 4AA')

    expect(result.value).toBe(UNIT_RATE_P)
    expect(result.tariff).toBe('E-1R-VAR-22-11-01-P')
  })

  it('strips leading underscore to derive GSP letter (GSP _A)', async () => {
    ;(globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce(mockOkJson(GSP_FIXTURE_A))
      .mockResolvedValueOnce(mockOkJson(RATE_FIXTURE_A))

    const result = await octopus('SW1A 1AA')

    expect(result.tariff).toBe('E-1R-VAR-22-11-01-A')
    expect(result.value).toBe(UNIT_RATE_A)
  })

  it('calls GSP endpoint with URL-encoded postcode', async () => {
    ;(globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce(mockOkJson(GSP_FIXTURE_P))
      .mockResolvedValueOnce(mockOkJson(RATE_FIXTURE_P))

    await octopus('NR1 4AA')

    const [firstUrl] = (globalThis.fetch as jest.Mock).mock.calls[0] as [string]
    expect(firstUrl).toBe(
      'https://api.octopus.energy/v1/industry/grid-supply-points/?postcode=NR1%204AA',
    )
  })
})

describe('octopus — errors', () => {
  it('throws on non-2xx GSP response', async () => {
    ;(globalThis.fetch as jest.Mock).mockResolvedValueOnce(mockError(HTTP_500))
    await expect(octopus('NR1 4AA')).rejects.toThrow(String(HTTP_500))
  })

  it('throws on non-2xx unit rate response', async () => {
    ;(globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce(mockOkJson(GSP_FIXTURE_P))
      .mockResolvedValueOnce(mockError(HTTP_403))
    await expect(octopus('NR1 4AA')).rejects.toThrow(String(HTTP_403))
  })
})
