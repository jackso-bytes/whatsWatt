/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { LCOE } from '../../data/lcoe'
import { GenerationMixCard } from './GenerationMixCard'

const sampleMix = [
  { fuel: 'wind', perc: 32 },
  { fuel: 'gas', perc: 28 },
  { fuel: 'nuclear', perc: 18 },
  { fuel: 'solar', perc: 8 },
  { fuel: 'biomass', perc: 7 },
  { fuel: 'imports', perc: 5 },
  { fuel: 'hydro', perc: 2 },
]

describe('GenerationMixCard', () => {
  it('renders all fuels in the legend', () => {
    render(<GenerationMixCard mix={sampleMix} lcoe={LCOE} />)
    const legend = screen.getByRole('list', { name: /generation mix legend/i })
    expect(legend).toHaveTextContent('Wind')
    expect(legend).toHaveTextContent('Gas')
    expect(legend).toHaveTextContent('Nuclear')
    expect(legend).toHaveTextContent('Solar')
    expect(legend).toHaveTextContent('Biomass')
    expect(legend).toHaveTextContent('Imports')
    expect(legend).toHaveTextContent('Hydro')
  })

  it('shows LCOE value for fuels with known cost; dash for zero-cost fuels', () => {
    render(<GenerationMixCard mix={sampleMix} lcoe={LCOE} />)
    expect(screen.getByText('£83/MWh')).toBeInTheDocument()  // wind
    expect(screen.getByText('£105/MWh')).toBeInTheDocument() // gas
    expect(screen.getByText('£60/MWh')).toBeInTheDocument()  // solar
    // hydro and imports have low=0 → show dash
    const dashes = screen.getAllByText('—')
    expect(dashes.length).toBeGreaterThanOrEqual(2)
  })

  it('centre label shows dominant fuel name and percentage', () => {
    render(<GenerationMixCard mix={sampleMix} lcoe={LCOE} />)
    // Wind is dominant at 32% — centre label is aria-hidden but still in DOM
    // The donut wrapper div is also aria-hidden; check the one with text content
    const allHidden = document.querySelectorAll('[aria-hidden="true"]')
    const centreDiv = [...allHidden].find(element => element.textContent?.includes('32%') && element.textContent?.includes('Wind'))
    expect(centreDiv).toBeTruthy()
  })

  it('donut wrapper has role="img" with aria-label listing each fuel and percentage', () => {
    render(<GenerationMixCard mix={sampleMix} lcoe={LCOE} />)
    const donut = screen.getByRole('img', { name: /Generation mix donut chart/i })
    expect(donut).toBeInTheDocument()
    expect(donut).toHaveAttribute('aria-label', expect.stringContaining('Wind 32%'))
    expect(donut).toHaveAttribute('aria-label', expect.stringContaining('Gas 28%'))
  })

  it('shows LCOE range for nuclear (£95-125/MWh)', () => {
    render(<GenerationMixCard mix={sampleMix} lcoe={LCOE} />)
    expect(screen.getByText('£95-125/MWh')).toBeInTheDocument()
  })
})
