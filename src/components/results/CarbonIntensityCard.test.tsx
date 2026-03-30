/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { CarbonIntensityCard } from './CarbonIntensityCard'

const baseIntensity = {
  actual: 142,
  band: 'moderate' as const,
  updatedAt: '2025-01-15T14:30:00Z',
}

describe('CarbonIntensityCard', () => {
  it('renders the actual value as the hero number', () => {
    render(<CarbonIntensityCard intensity={baseIntensity} />)
    expect(screen.getByLabelText('142 grams CO2 per kilowatt-hour')).toBeInTheDocument()
  })

  it('renders the correct band badge text and aria-label', () => {
    render(<CarbonIntensityCard intensity={baseIntensity} />)
    expect(screen.getByRole('img', { name: 'Intensity level: Moderate' })).toBeInTheDocument()
    expect(screen.getByText('Moderate')).toBeInTheDocument()
  })

  it('renders Low badge for low band', () => {
    render(<CarbonIntensityCard intensity={{ ...baseIntensity, band: 'low', actual: 50 }} />)
    expect(screen.getByRole('img', { name: 'Intensity level: Low' })).toBeInTheDocument()
  })

  it('sets scale marker left position as percentage of 300', () => {
    render(<CarbonIntensityCard intensity={baseIntensity} />)
    const marker = document.querySelector('.intensity-scale-marker') as HTMLElement
    // 142/300 * 100 = 47.333...%
    expect(marker.style.left).toBe('47.333333333333336%')
  })

  it('clamps marker to 100% when actual exceeds 300', () => {
    render(<CarbonIntensityCard intensity={{ ...baseIntensity, actual: 500 }} />)
    const marker = document.querySelector('.intensity-scale-marker') as HTMLElement
    expect(marker.style.left).toBe('100%')
  })

  it('scale bar container is aria-hidden', () => {
    render(<CarbonIntensityCard intensity={baseIntensity} />)
    const scale = document.querySelector('.intensity-scale')
    expect(scale).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders sr-only text with value and band', () => {
    render(<CarbonIntensityCard intensity={baseIntensity} />)
    expect(screen.getByText('Carbon intensity: 142 gCO₂/kWh, moderate level')).toBeInTheDocument()
  })

  it('renders updated timestamp from ISO string', () => {
    render(<CarbonIntensityCard intensity={baseIntensity} />)
    // 2025-01-15T14:30:00Z → "Updated 14:30" in Europe/London (UTC in winter)
    const timestamp = document.querySelector('.intensity-timestamp')
    expect(timestamp?.textContent).toMatch(/Updated \d{2}:\d{2}/)
  })

  it('shows error state when error prop set', () => {
    render(<CarbonIntensityCard intensity={baseIntensity} error={new Error('fail')} onRetry={jest.fn()} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('calls onRetry when retry clicked in error state', () => {
    const onRetry = jest.fn()
    render(<CarbonIntensityCard intensity={baseIntensity} error={new Error('fail')} onRetry={onRetry} />)
    fireEvent.click(screen.getByRole('button', { name: /retry/i }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
