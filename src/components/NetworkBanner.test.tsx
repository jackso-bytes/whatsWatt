import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { NetworkBanner } from './NetworkBanner'

describe('NetworkBanner', () => {
  it('renders error message', () => {
    render(<NetworkBanner onRetry={jest.fn()} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('calls onRetry when retry button clicked', () => {
    const onRetry = jest.fn()
    render(<NetworkBanner onRetry={onRetry} />)
    fireEvent.click(screen.getByRole('button', { name: /retry/i }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
