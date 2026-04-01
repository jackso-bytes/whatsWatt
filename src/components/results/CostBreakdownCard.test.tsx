import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { LCOE } from '../../data/lcoe'
import { CostBreakdownCard } from './CostBreakdownCard'

const MIX = [
  { fuel: 'wind', perc: 32 },
  { fuel: 'solar', perc: 8 },
  { fuel: 'gas', perc: 28 },
  { fuel: 'nuclear', perc: 18 },
  { fuel: 'biomass', perc: 7 },
  { fuel: 'hydro', perc: 2 },
  { fuel: 'imports', perc: 5 },
]

const PERCENT_SCALE = 100
const LCOE_CEILING = LCOE.biomass.low
const NUCLEAR_MIDPOINT = (LCOE.nuclear.low + (LCOE.nuclear.high ?? LCOE.nuclear.low)) / 2

function getFuelItems(list: HTMLElement) {
  return [...list.querySelectorAll('[role="listitem"]')]
}

function getFuelLabels(list: HTMLElement) {
  return getFuelItems(list).map((element) => element.querySelector('[data-fuel]')?.textContent)
}

describe('CostBreakdownCard — header', () => {
  it('renders heading', () => {
    render(<CostBreakdownCard generationMix={MIX} lcoe={LCOE} unitRate={24.5} />)
    expect(screen.getByRole('heading', { name: /cost by generation source/i })).toBeInTheDocument()
  })

  it('shows weighted avg aria-label', () => {
    render(<CostBreakdownCard generationMix={MIX} lcoe={LCOE} unitRate={24.5} />)
    expect(screen.getByLabelText(/weighted average generation cost/i)).toBeInTheDocument()
  })
})

describe('CostBreakdownCard — bar chart', () => {
  it('rows are sorted cheapest-first', () => {
    render(<CostBreakdownCard generationMix={MIX} lcoe={LCOE} unitRate={24.5} />)
    const list = screen.getByRole('list', { name: /generation cost by fuel/i })
    const labels = getFuelLabels(list)
    expect(labels.indexOf('Solar')).toBeLessThan(labels.indexOf('Wind'))
    expect(labels.indexOf('Wind')).toBeLessThan(labels.indexOf('Gas'))
  })

  it('omits hydro and imports (low === 0)', () => {
    render(<CostBreakdownCard generationMix={MIX} lcoe={LCOE} unitRate={24.5} />)
    const list = screen.getByRole('list', { name: /generation cost by fuel/i })
    const labels = getFuelLabels(list)
    expect(labels).not.toContain('Hydro')
    expect(labels).not.toContain('Imports')
  })

  it('solar bar fill width proportional to LCOE / ceiling', () => {
    render(<CostBreakdownCard generationMix={MIX} lcoe={LCOE} unitRate={24.5} />)
    const list = screen.getByRole('list', { name: /generation cost by fuel/i })
    const solarItem = getFuelItems(list).find(
      (element) => element.querySelector('[data-fuel]')?.textContent === 'Solar',
    )
    const fill = solarItem?.querySelector('[data-bar-fill]') as HTMLElement | null
    expect(fill).not.toBeNull()
    const expected = (LCOE.solar.low / LCOE_CEILING) * PERCENT_SCALE
    expect(Number.parseFloat(fill!.style.width)).toBeCloseTo(expected, 0)
  })

  it('nuclear bar fill width uses midpoint', () => {
    render(<CostBreakdownCard generationMix={MIX} lcoe={LCOE} unitRate={24.5} />)
    const list = screen.getByRole('list', { name: /generation cost by fuel/i })
    const nuclearItem = getFuelItems(list).find(
      (element) => element.querySelector('[data-fuel]')?.textContent === 'Nuclear',
    )
    const fill = nuclearItem?.querySelector('[data-bar-fill]') as HTMLElement | null
    const expected = (NUCLEAR_MIDPOINT / LCOE_CEILING) * PERCENT_SCALE
    expect(Number.parseFloat(fill!.style.width)).toBeCloseTo(expected, 0)
  })
})

describe('CostBreakdownCard — insight + accordion', () => {
  it('renders insight callout with role=note', () => {
    render(<CostBreakdownCard generationMix={MIX} lcoe={LCOE} unitRate={24.5} />)
    expect(screen.getByRole('note')).toBeInTheDocument()
  })

  it('methodology accordion is collapsed by default and expands on click', () => {
    render(<CostBreakdownCard generationMix={MIX} lcoe={LCOE} unitRate={24.5} />)
    const trigger = screen.getByRole('button', { name: /methodology/i })
    expect(trigger).toHaveAttribute('data-state', 'closed')
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('data-state', 'open')
  })
})
