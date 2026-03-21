import { fetchJson } from '../utils/fetch-json'

export interface OctopusResult {
  value: number
  tariff: string
}

interface GspResponse {
  results: Array<{ group_id: string }>
}

interface UnitRateResponse {
  results: Array<{ value_inc_vat: number }>
}

const PRODUCT = 'VAR-22-11-01'

export async function octopus(postcode: string): Promise<OctopusResult> {
  const encoded = encodeURIComponent(postcode)
  const gspData = await fetchJson<GspResponse>(
    `https://api.octopus.energy/v1/industry/grid-supply-points/?postcode=${encoded}`,
  )
  const gsp = gspData.results[0].group_id.replace(/^_/, '')
  const tariff = `E-1R-${PRODUCT}-${gsp}`

  const rateData = await fetchJson<UnitRateResponse>(
    `https://api.octopus.energy/v1/products/${PRODUCT}/electricity-tariffs/${tariff}/standard-unit-rates/?page_size=1`,
  )

  return { value: rateData.results[0].value_inc_vat, tariff }
}
