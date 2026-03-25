/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react'
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

describe('UnitRateCard — error state', () => {
  it('shows an alert when error prop is set', () => {
    render(<UnitRateCard error={new Error('fetch failed')} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('shows a retry button when error and onRetry are set', () => {
    render(<UnitRateCard error={new Error('oops')} onRetry={jest.fn()} />)
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = jest.fn()
    render(<UnitRateCard error={new Error('oops')} onRetry={onRetry} />)
    fireEvent.click(screen.getByRole('button', { name: /retry/i }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
