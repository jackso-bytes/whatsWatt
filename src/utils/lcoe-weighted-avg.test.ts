import { lcoeWeightedAvg } from './lcoe-weighted-avg'

const LCOE_MAP = {
  solar:   { label: 'Solar',   low: 60,  colour: '#f0a500' },
  wind:    { label: 'Wind',    low: 83,  colour: '#3aad63' },
  gas:     { label: 'Gas',     low: 105, colour: '#8899aa' },
  nuclear: { label: 'Nuclear', low: 95,  high: 125, colour: '#a97fd4' },
  biomass: { label: 'Biomass', low: 138, colour: '#5bc9a8' },
  hydro:   { label: 'Hydro',   low: 0,   colour: '#2f9960' },
  imports: { label: 'Imports', low: 0,   colour: '#6a7fa0' },
}

const EXPECTED_UK_MIX_LCOE = 97

describe('lcoeWeightedAvg', () => {
  it('returns the LCOE low for a single-fuel mix', () => {
    const mix = [{ fuel: 'gas', perc: 100 }]
    expect(lcoeWeightedAvg(mix, LCOE_MAP)).toBe(LCOE_MAP.gas.low)
  })

  it('returns ~£97/MWh for prototype UK generation mix', () => {
    // gas=55%, wind=18%, nuclear=14%, solar=5%, hydro=5%, imports=3%
    // matched (low>0): gas+wind+nuclear+solar → totalPerc=92
    // (55*105 + 18*83 + 14*95 + 5*60) / 92 = 8899/92 ≈ 96.73
    const mix = [
      { fuel: 'gas',     perc: 55 },
      { fuel: 'wind',    perc: 18 },
      { fuel: 'nuclear', perc: 14 },
      { fuel: 'solar',   perc: 5  },
      { fuel: 'hydro',   perc: 5  },
      { fuel: 'imports', perc: 3  },
    ]
    expect(lcoeWeightedAvg(mix, LCOE_MAP)).toBeCloseTo(EXPECTED_UK_MIX_LCOE, 0)
  })

  it('returns 0 when no fuels match the LCOE map', () => {
    const mix = [
      { fuel: 'hydro',   perc: 60 },
      { fuel: 'imports', perc: 40 },
    ]
    expect(lcoeWeightedAvg(mix, LCOE_MAP)).toBe(0)
  })

  it('excludes fuels with low === 0 (hydro, imports)', () => {
    // hydro and imports have low=0, so only gas contributes
    const mix = [
      { fuel: 'gas',     perc: 50 },
      { fuel: 'hydro',   perc: 30 },
      { fuel: 'imports', perc: 20 },
    ]
    expect(lcoeWeightedAvg(mix, LCOE_MAP)).toBe(LCOE_MAP.gas.low)
  })
})
