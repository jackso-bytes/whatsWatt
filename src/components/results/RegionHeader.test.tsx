import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { RegionHeader } from './RegionHeader'

describe('RegionHeader', () => {
  it('renders postcode in left element', () => {
    render(<RegionHeader postcode="NR1 4AA" regionName="East England" gspId="_P" />)
    expect(screen.getByTestId('region-header-postcode')).toHaveTextContent('NR1 4AA')
  })

  it('renders region name and GSP letter in right element', () => {
    render(<RegionHeader postcode="NR1 4AA" regionName="East England" gspId="_P" />)
    expect(screen.getByTestId('region-header-region')).toHaveTextContent('East England · GSP Region P')
  })

  it('strips leading underscore from gspId', () => {
    render(<RegionHeader postcode="SW1A 1AA" regionName="South East" gspId="_J" />)
    expect(screen.getByTestId('region-header-region')).toHaveTextContent('GSP Region J')
  })

  it('handles gspId without underscore prefix', () => {
    render(<RegionHeader postcode="M1 1AE" regionName="North West" gspId="A" />)
    expect(screen.getByTestId('region-header-region')).toHaveTextContent('GSP Region A')
  })
})
