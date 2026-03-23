/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Skeleton } from './Skeleton'

const MIN_SKELETON_CARDS = 5

describe('Skeleton', () => {
  it('renders with a loading status role', () => {
    render(<Skeleton />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('has aria-label describing loading state', () => {
    render(<Skeleton />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', expect.stringMatching(/loading/i))
  })

  it('renders 5 or more skeleton card placeholders', () => {
    render(<Skeleton />)
    const cards = screen.getAllByTestId('skeleton-card')
    expect(cards.length).toBeGreaterThanOrEqual(MIN_SKELETON_CARDS)
  })
})
