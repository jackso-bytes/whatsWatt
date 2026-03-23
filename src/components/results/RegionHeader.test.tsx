/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { RegionHeader } from './RegionHeader'

describe('RegionHeader', () => {
  it('renders postcode, region name, and GSP letter joined by middle dots', () => {
    render(<RegionHeader postcode="NR1 4AA" regionName="East England" gspId="_P" />)
    expect(screen.getByText('NR1 4AA · East England · GSP Region P')).toBeInTheDocument()
  })

  it('strips leading underscore from gspId', () => {
    render(<RegionHeader postcode="SW1A 1AA" regionName="South East" gspId="_J" />)
    expect(screen.getByText('SW1A 1AA · South East · GSP Region J')).toBeInTheDocument()
  })

  it('handles gspId without underscore prefix', () => {
    render(<RegionHeader postcode="M1 1AE" regionName="North West" gspId="A" />)
    expect(screen.getByText('M1 1AE · North West · GSP Region A')).toBeInTheDocument()
  })
})
