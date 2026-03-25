/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { NetworkBanner } from './NetworkBanner'

describe('NetworkBanner', () => {
  it('renders nothing when not all errors are set', () => {
    const { container } = render(<NetworkBanner intensityError={new Error('x')} unitRateError={undefined} aqiError={undefined} onRetry={jest.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('shows a banner when all three error props are set', () => {
    render(<NetworkBanner intensityError={new Error('a')} unitRateError={new Error('b')} aqiError={new Error('c')} onRetry={jest.fn()} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = jest.fn()
    render(<NetworkBanner intensityError={new Error('a')} unitRateError={new Error('b')} aqiError={new Error('c')} onRetry={onRetry} />)
    fireEvent.click(screen.getByRole('button', { name: /retry/i }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
