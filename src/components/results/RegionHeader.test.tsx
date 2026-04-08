import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { RegionHeader } from './RegionHeader';

describe('RegionHeader', () => {
  it('renders postcode on the left in uppercase', () => {
    render(
      <RegionHeader postcode='NR1 4AA' regionName='East England' gspId='_P' />,
    );
    expect(screen.getByTestId('region-header-postcode')).toHaveTextContent(
      'NR1 4AA',
    );
  });

  it('renders region name and GSP letter on the right', () => {
    render(
      <RegionHeader postcode='NR1 4AA' regionName='East England' gspId='_P' />,
    );
    expect(screen.getByTestId('region-header-region')).toHaveTextContent(
      'East England · GSP Region P',
    );
  });

  it('strips leading underscore from gspId', () => {
    render(
      <RegionHeader postcode='SW1A 1AA' regionName='South East' gspId='_J' />,
    );
    expect(screen.getByTestId('region-header-region')).toHaveTextContent(
      'South East · GSP Region J',
    );
  });

  it('handles gspId without underscore prefix', () => {
    render(<RegionHeader postcode='M1 1AE' regionName='North West' gspId='A' />);
    expect(screen.getByTestId('region-header-region')).toHaveTextContent(
      'North West · GSP Region A',
    );
  });

  it('container has flex layout with space-between', () => {
    render(
      <RegionHeader postcode='NR1 4AA' regionName='East England' gspId='_P' />,
    );
    const container = screen.getByTestId('region-header');
    expect(container).toHaveClass('flex');
    expect(container).toHaveClass('justify-between');
  });
});
