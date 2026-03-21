/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Navbar } from './Navbar'

describe('Navbar', () => {
  it('renders the What\'s Watt wordmark', () => {
    render(<Navbar />)
    expect(screen.getByText(/What's/)).toBeInTheDocument()
    expect(screen.getByText('Watt')).toBeInTheDocument()
  })

  it('renders the About link with href="#"', () => {
    render(<Navbar />)
    const link = screen.getByRole('link', { name: /about/i })
    expect(link).toHaveAttribute('href', '#')
  })

  it('has role navigation and correct aria-label', () => {
    render(<Navbar />)
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
  })

  it('logo SVG is aria-hidden', () => {
    render(<Navbar />)
    const nav = screen.getByRole('navigation')
    const svg = nav.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })
})
