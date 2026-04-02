interface Properties {
  readonly postcode: string
  readonly regionName: string
  readonly gspId: string
}

export function RegionHeader({ postcode, regionName, gspId }: Properties) {
  const gspLetter = gspId.startsWith('_') ? gspId.slice(1) : gspId
  return (
    <div
      data-testid="region-header"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-sm) 0',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-secondary)',
      }}
    >
      <span
        data-testid="region-header-postcode"
        style={{
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}
      >
        {postcode}
      </span>
      <span
        data-testid="region-header-region"
        style={{
          fontWeight: 500,
          maxWidth: '180px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {regionName} · GSP Region {gspLetter}
      </span>
    </div>
  )
}
