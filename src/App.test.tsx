/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'
import type { PostcodeDataState } from './hooks/use-postcode-data'

jest.mock('./hooks/use-postcode-data', () => ({
  usePostcodeData: jest.fn(),
}))

import { usePostcodeData } from './hooks/use-postcode-data'
const mockUsePostcodeData = usePostcodeData as jest.MockedFunction<typeof usePostcodeData>

const idle: PostcodeDataState = { status: 'idle' }
const loading: PostcodeDataState = { status: 'loading' }
const fullSuccess: PostcodeDataState = {
  status: 'success',
  region: { name: 'East England', gspId: '_P' },
  intensity: { actual: 150, band: 'moderate', updatedAt: '2024-01-01T12:00:00Z' },
  generationMix: [{ fuel: 'wind', perc: 40 }, { fuel: 'gas', perc: 60 }],
  unitRate: { value: 24.5, tariff: 'E-1R-VAR-22-11-01-P' },
  aqi: { index: 2, level: 'fair', pm25: 8, no2: 15, o3: 60 },
}

beforeEach(() => {
  mockUsePostcodeData.mockReturnValue(idle)
})

describe('App — landing state', () => {
  it('renders navbar', () => {
    render(<App />)
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument()
  })

  it('renders hero postcode form', () => {
    render(<App />)
    expect(screen.getByRole('search', { name: /postcode lookup/i })).toBeInTheDocument()
  })

  it('renders footer', () => {
    render(<App />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('does not render dashboard cards', () => {
    render(<App />)
    expect(screen.queryByTestId('region-header')).not.toBeInTheDocument()
    expect(screen.queryByTestId('carbon-intensity-card')).not.toBeInTheDocument()
  })
})

describe('App — results loading state', () => {
  it('shows skeleton while loading', () => {
    mockUsePostcodeData.mockReturnValue(loading)
    render(<App />)
    // submit a postcode to trigger results view
    fireEvent.change(screen.getByRole('textbox', { name: /uk postcode/i }), {
      target: { value: 'NR1 4AA' },
    })
    fireEvent.click(screen.getByRole('button', { name: /get electricity data/i }))
    expect(screen.getByRole('status', { name: /loading results/i })).toBeInTheDocument()
  })
})

describe('App — results success state', () => {
  beforeEach(() => {
    mockUsePostcodeData.mockReturnValue(fullSuccess)
    render(<App />)
    fireEvent.change(screen.getByRole('textbox', { name: /uk postcode/i }), {
      target: { value: 'NR1 4AA' },
    })
    fireEvent.click(screen.getByRole('button', { name: /get electricity data/i }))
  })

  it('renders region header', () => {
    expect(screen.getByTestId('region-header')).toBeInTheDocument()
  })

  it('renders carbon intensity card', () => {
    expect(screen.getByTestId('carbon-intensity-card')).toBeInTheDocument()
  })

  it('renders generation mix card', () => {
    expect(screen.getByTestId('generation-mix-card')).toBeInTheDocument()
  })

  it('renders air quality card', () => {
    expect(screen.getByTestId('air-quality-card')).toBeInTheDocument()
  })

  it('renders unit rate card', () => {
    expect(screen.getByTestId('unit-rate-card')).toBeInTheDocument()
  })

  it('renders cost breakdown card', () => {
    expect(screen.getByTestId('cost-breakdown-card')).toBeInTheDocument()
  })
})

describe('App — results partial state (missing data)', () => {
  it('omits intensity card when intensity is undefined', () => {
    mockUsePostcodeData.mockReturnValue({ ...fullSuccess, intensity: undefined })
    render(<App />)
    fireEvent.change(screen.getByRole('textbox', { name: /uk postcode/i }), {
      target: { value: 'NR1 4AA' },
    })
    fireEvent.click(screen.getByRole('button', { name: /get electricity data/i }))
    expect(screen.queryByTestId('carbon-intensity-card')).not.toBeInTheDocument()
  })

  it('omits cost breakdown when generationMix is undefined', () => {
    mockUsePostcodeData.mockReturnValue({ ...fullSuccess, generationMix: undefined })
    render(<App />)
    fireEvent.change(screen.getByRole('textbox', { name: /uk postcode/i }), {
      target: { value: 'NR1 4AA' },
    })
    fireEvent.click(screen.getByRole('button', { name: /get electricity data/i }))
    expect(screen.queryByTestId('cost-breakdown-card')).not.toBeInTheDocument()
  })
})
