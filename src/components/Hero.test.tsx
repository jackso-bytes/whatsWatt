/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders postcode input', () => {
    render(<Hero onSubmit={jest.fn()} />)
    expect(screen.getByRole('textbox', { name: /uk postcode/i })).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<Hero onSubmit={jest.fn()} />)
    expect(screen.getByRole('button', { name: /get electricity data/i })).toBeInTheDocument()
  })

  it('submit with valid postcode calls onSubmit with formatted postcode', () => {
    const onSubmit = jest.fn()
    render(<Hero onSubmit={onSubmit} />)
    fireEvent.change(screen.getByRole('textbox', { name: /uk postcode/i }), { target: { value: 'nr14aa' } })
    fireEvent.click(screen.getByRole('button', { name: /get electricity data/i }))
    expect(onSubmit).toHaveBeenCalledWith('NR1 4AA')
  })

  it('invalid postcode shows error and does not call onSubmit', () => {
    const onSubmit = jest.fn()
    render(<Hero onSubmit={onSubmit} />)
    fireEvent.change(screen.getByRole('textbox', { name: /uk postcode/i }), { target: { value: 'ZZZZZ' } })
    fireEvent.click(screen.getByRole('button', { name: /get electricity data/i }))
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent('Please enter a valid UK postcode')
  })

  it('pre-fills input from localStorage on mount', () => {
    localStorage.setItem('whats-watt:postcode', 'SW1A 2AA')
    render(<Hero onSubmit={jest.fn()} />)
    expect(screen.getByRole('textbox', { name: /uk postcode/i })).toHaveValue('SW1A 2AA')
    localStorage.clear()
  })

  it('error clears when user types after invalid submit', () => {
    render(<Hero onSubmit={jest.fn()} />)
    fireEvent.change(screen.getByRole('textbox', { name: /uk postcode/i }), { target: { value: 'ZZZZZ' } })
    fireEvent.click(screen.getByRole('button', { name: /get electricity data/i }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
    fireEvent.change(screen.getByRole('textbox', { name: /uk postcode/i }), { target: { value: 'N' } })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
