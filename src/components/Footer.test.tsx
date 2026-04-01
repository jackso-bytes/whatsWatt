import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Footer } from './Footer'

describe('Footer', () => {
  beforeEach(() => {
    render(<Footer />)
  })

  it('renders contentinfo landmark', () => {
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('shows Data: label', () => {
    expect(screen.getByText(/Data:/)).toBeInTheDocument()
  })

  it('links to Carbon Intensity API', () => {
    const link = screen.getByRole('link', { name: /Carbon Intensity API/i })
    expect(link).toHaveAttribute('href', 'https://carbonintensity.org.uk')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('links to Octopus Energy', () => {
    const link = screen.getByRole('link', { name: /Octopus Energy/i })
    expect(link).toHaveAttribute('href', 'https://octopus.energy')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('links to Open-Meteo Air Quality API', () => {
    const link = screen.getByRole('link', { name: /Open-Meteo Air Quality API/i })
    expect(link).toHaveAttribute('href', 'https://open-meteo.com/en/docs/air-quality-api')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it("shows What's Watt branding", () => {
    expect(screen.getByText("What's Watt")).toBeInTheDocument()
  })
})
