import type { CSSProperties } from 'react'
import type { AqiLevel } from '../../utils/aqi-band'

interface AqiData {
  readonly index: number
  readonly level: AqiLevel
  readonly pm25: number
  readonly no2: number
  readonly o3: number
}

interface Properties {
  readonly aqi: AqiData
}

const LEVEL_ORDER: AqiLevel[] = ['good', 'fair', 'moderate', 'poor', 'very-poor']
const LEVEL_COLOURS: Record<AqiLevel, string> = {
  good: '#3aad63',
  fair: '#a3c93a',
  moderate: '#f0a500',
  poor: '#e05c3e',
  'very-poor': '#c0392b',
}
const LEVEL_LABELS: Record<AqiLevel, string> = {
  good: 'Good',
  fair: 'Fair',
  moderate: 'Moderate',
  poor: 'Poor',
  'very-poor': 'Very Poor',
}

const INACTIVE_OPACITY = 0.35

function levelToIndex(level: AqiLevel): number {
  return LEVEL_ORDER.indexOf(level) + 1
}

const CARD_BASE: CSSProperties = {
  borderRadius: 'var(--radius-card)',
  padding: 'var(--space-lg)',
  boxShadow: '0 2px 24px rgba(0,0,0,0.32)',
}
const TOP_STYLE: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }
const TITLE_STYLE: CSSProperties = { fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)' }
const BADGE_BASE: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 'var(--radius-pill)', color: '#fff', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }
const NUMBER_BLOCK: CSSProperties = { display: 'flex', alignItems: 'baseline', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }
const SCALE_STYLE: CSSProperties = { display: 'flex', gap: 3, height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: 'var(--space-xs)' }
const SCALE_LABELS_STYLE: CSSProperties = { display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }
const SCALE_LABEL_TEXT: CSSProperties = { fontSize: 'var(--text-xs)', color: 'var(--color-text-disabled)', fontWeight: 500 }
const POLLUTANTS_STYLE: CSSProperties = { display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }
const POLLUTANT_TILE: CSSProperties = { flex: 1, minWidth: 72, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)', borderRadius: 10, padding: 'var(--space-sm) var(--space-md)' }
const POLLUTANT_NAME: CSSProperties = { fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }
const POLLUTANT_VALUE: CSSProperties = { fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-primary)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }
const POLLUTANT_UNIT: CSSProperties = { fontSize: 'var(--text-xs)', color: 'var(--color-text-disabled)', fontWeight: 400, display: 'block', marginTop: 1 }

interface PollutantProperties { name: string; value: number; ariaLabel: string }

function PollutantTile({ name, value, ariaLabel }: Readonly<PollutantProperties>) {
  return (
    <div role="listitem" style={POLLUTANT_TILE}>
      <p style={POLLUTANT_NAME}>{name}</p>
      <p style={POLLUTANT_VALUE} aria-label={ariaLabel}>{value.toFixed(1)}</p>
      <span style={POLLUTANT_UNIT}>µg/m³</span>
    </div>
  )
}

interface ScaleBarProperties { readonly activeIndex: number }

function ScaleBar({ activeIndex }: Readonly<ScaleBarProperties>) {
  return (
    <>
      <div style={SCALE_STYLE} aria-hidden="true">
        {LEVEL_ORDER.map((lvl, segmentIndex) => (
          <div
            key={lvl}
            data-testid={`aqi-seg-${segmentIndex + 1}`}
            style={{ flex: 1, borderRadius: 2, background: LEVEL_COLOURS[lvl], opacity: segmentIndex + 1 === activeIndex ? 1 : INACTIVE_OPACITY }}
          />
        ))}
      </div>
      <div style={SCALE_LABELS_STYLE} aria-hidden="true">
        <span style={SCALE_LABEL_TEXT}>Good</span>
        <span style={SCALE_LABEL_TEXT}>Very Poor</span>
      </div>
    </>
  )
}

export function AirQualityCard({ aqi }: Readonly<Properties>) {
  const { level, pm25, no2, o3 } = aqi
  const displayIndex = levelToIndex(level)
  const colour = LEVEL_COLOURS[level]
  const label = LEVEL_LABELS[level]

  const cardStyle: CSSProperties = {
    ...CARD_BASE,
    background: `var(--color-aqi-${level}-bg)`,
    border: `1px solid var(--color-aqi-${level}-border, var(--color-border))`,
  }

  return (
    <article style={cardStyle} aria-labelledby="aqi-heading">
      <div style={TOP_STYLE}>
        <span style={TITLE_STYLE} id="aqi-heading">Air Quality</span>
        <div role="img" aria-label={`Air quality: ${label}`} style={{ ...BADGE_BASE, background: colour }}>
          <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.6)', display: 'inline-block' }} />
          {label}
        </div>
      </div>

      <div style={NUMBER_BLOCK}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 800, lineHeight: 1, color: colour, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.04em' }} aria-label={`European AQI ${displayIndex}`}>
          {displayIndex}
        </span>
        <span aria-hidden="true" style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: colour }}>/ 5</span>
      </div>

      <ScaleBar activeIndex={displayIndex} />

      <div role="list" aria-label="Key pollutants" style={POLLUTANTS_STYLE}>
        <PollutantTile name="PM2.5" value={pm25} ariaLabel={`${pm25.toFixed(1)} micrograms per cubic metre`} />
        <PollutantTile name="NO₂" value={no2} ariaLabel={`${no2.toFixed(1)} micrograms per cubic metre`} />
        <PollutantTile name="O₃" value={o3} ariaLabel={`${o3.toFixed(1)} micrograms per cubic metre`} />
      </div>
    </article>
  )
}
