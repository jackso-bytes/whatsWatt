/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { Hero } from './Hero'

const localStorageKey = 'whats-watt:postcode'

beforeEach(() => {
  localStorage.clear()
})

describe('Hero', () => {
  it('renders postcode input', () => {
    render(<Hero onSubmit={() => { /* noop */ }} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<Hero onSubmit={() => { /* noop */ }} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onSubmit with normalised postcode on valid submit', () => {
    const onSubmit = jest.fn()
    render(<Hero onSubmit={onSubmit} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'nr14aa' } })
    fireEvent.click(screen.getByRole('button'))
    expect(onSubmit).toHaveBeenCalledWith('NR1 4AA')
  })

  it('shows error and does not call onSubmit for invalid postcode', () => {
    const onSubmit = jest.fn()
    render(<Hero onSubmit={onSubmit} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'ZZZZZ' } })
    fireEvent.click(screen.getByRole('button'))
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('pre-fills input from localStorage on mount, no auto-submit', () => {
    const onSubmit = jest.fn()
    localStorage.setItem(localStorageKey, 'SW1A 2AA')
    render(<Hero onSubmit={onSubmit} />)
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('SW1A 2AA')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('error is associated with input via aria-describedby', () => {
    render(<Hero onSubmit={() => { /* noop */ }} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'bad' } })
    fireEvent.click(screen.getByRole('button'))
    const input = screen.getByRole('textbox')
    const errorId = input.getAttribute('aria-describedby')
    expect(errorId).toBeTruthy()
    const errorElement = document.querySelector(`#${CSS.escape(errorId!)}`)
    expect(errorElement).toBeInTheDocument()
  })
})
