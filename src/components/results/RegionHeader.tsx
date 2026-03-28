interface Properties {
  readonly postcode: string
  readonly regionName: string
  readonly gspId: string
}

export function RegionHeader({ postcode, regionName, gspId }: Properties) {
  const gspLetter = gspId.startsWith('_') ? gspId.slice(1) : gspId
  return (
    <p data-testid="region-header">
      {postcode} · {regionName} · GSP Region {gspLetter}
    </p>
  )
}
