/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
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

  it('shows error state when error prop set', () => {
    render(<UnitRateCard unitRate={{ value: 24.5, tariff: 'VAR' }} error={new Error('fail')} onRetry={jest.fn()} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('calls onRetry when retry clicked in error state', () => {
    const onRetry = jest.fn()
    render(<UnitRateCard unitRate={{ value: 24.5, tariff: 'VAR' }} error={new Error('fail')} onRetry={onRetry} />)
    fireEvent.click(screen.getByRole('button', { name: /retry/i }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
