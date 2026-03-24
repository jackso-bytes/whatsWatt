/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { UnitRateCard } from './UnitRateCard'

describe('UnitRateCard', () => {
  it('displays rate formatted to 2 dp with p/kWh unit', () => {
    render(<UnitRateCard unitRate={{ value: 24.5, tariff: 'VAR-22-11-01' }} />)
    expect(screen.getByText('24.50')).toBeInTheDocument()
    expect(screen.getByText('p/kWh')).toBeInTheDocument()
  })

  it('displays the tariff badge', () => {
    render(<UnitRateCard unitRate={{ value: 24.5, tariff: 'Flexible Octopus' }} />)
    expect(screen.getByText('Flexible Octopus')).toBeInTheDocument()
  })
})
