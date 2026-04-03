interface Properties {
  readonly postcode: string;
  readonly regionName: string;
  readonly gspId: string;
}

export function RegionHeader({ postcode, regionName, gspId }: Properties) {
  const gspLetter = gspId.startsWith('_') ? gspId.slice(1) : gspId;
  return (
    <div className='flex justify-between text-sm font-semibold text-[var(--color-text-secondary)]'>
      <p data-testid='region-header'>{postcode}</p>
      <p>
        {regionName} · GSP Region {gspLetter}
      </p>
    </div>
  );
}
