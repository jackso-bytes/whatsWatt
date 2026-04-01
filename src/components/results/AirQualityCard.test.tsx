import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { AirQualityCard } from './AirQualityCard'

const fairAqi = { index: 25, level: 'fair' as const, pm25: 8.3, no2: 12.1, o3: 54.2 }

describe('AirQualityCard', () => {
  it('renders AQI index as 1-5 number derived from level', () => {
    render(<AirQualityCard aqi={fairAqi} />)
    expect(screen.getByLabelText(/european aqi 2/i)).toBeInTheDocument()
  })

  it('badge shows level label with aria-label', () => {
    render(<AirQualityCard aqi={fairAqi} />)
    expect(screen.getByRole('img', { name: /air quality: fair/i })).toBeInTheDocument()
  })

  it('active scale segment matches level index', () => {
    render(<AirQualityCard aqi={fairAqi} />)
    const activeSeg = screen.getByTestId('aqi-seg-2')
    expect(activeSeg).toHaveStyle({ opacity: '1' })
    const inactiveSeg = screen.getByTestId('aqi-seg-1')
    expect(inactiveSeg).toHaveStyle({ opacity: '0.35' })
  })

  it('renders pollutant values', () => {
    render(<AirQualityCard aqi={fairAqi} />)
    expect(screen.getByLabelText(/8\.3 micrograms/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/12\.1 micrograms/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/54\.2 micrograms/i)).toBeInTheDocument()
  })

  it('renders all pollutant names', () => {
    render(<AirQualityCard aqi={fairAqi} />)
    expect(screen.getByText('PM2.5')).toBeInTheDocument()
    expect(screen.getByText('NO₂')).toBeInTheDocument()
    expect(screen.getByText('O₃')).toBeInTheDocument()
  })

  it('shows error state when error prop set', () => {
    render(<AirQualityCard aqi={fairAqi} error={new Error('fail')} onRetry={jest.fn()} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('calls onRetry when retry clicked in error state', () => {
    const onRetry = jest.fn()
    render(<AirQualityCard aqi={fairAqi} error={new Error('fail')} onRetry={onRetry} />)
    fireEvent.click(screen.getByRole('button', { name: /retry/i }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
