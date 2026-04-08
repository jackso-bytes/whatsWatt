interface Properties {
  readonly postcode: string;
  readonly regionName: string;
  readonly gspId: string;
}

export function RegionHeader({ postcode, regionName, gspId }: Properties) {
  const gspLetter = gspId.startsWith('_') ? gspId.slice(1) : gspId;
  return (
    <div
      data-testid='region-header'
      className='flex justify-between items-center py-[var(--space-sm)]'
    >
      <span
        data-testid='region-header-postcode'
        className='text-[length:var(--text-sm)] font-semibold text-[var(--color-text-secondary)] uppercase tracking-[0.1em]'
      >
        {postcode}
      </span>
      <span
        data-testid='region-header-region'
        className='text-[length:var(--text-sm)] font-medium text-[var(--color-text-secondary)] max-w-[180px] truncate'
      >
        {regionName} · GSP Region {gspLetter}
      </span>
    </div>
  );
}
