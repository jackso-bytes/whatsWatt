import type { CSSProperties } from 'react'

interface UnitRateData {
  readonly value: number
  readonly tariff: string
}

interface Properties {
  readonly unitRate: UnitRateData
}

const CARD_STYLE: CSSProperties = {
  borderRadius: 'var(--radius-card)',
  padding: 'var(--space-lg)',
  background: 'var(--color-card-bg)',
  border: '1px solid var(--color-border)',
  boxShadow: '0 2px 24px rgba(0,0,0,0.32)',
}

const TOP_STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 'var(--space-md)',
}

const TITLE_STYLE: CSSProperties = {
  fontSize: 'var(--text-base)',
  fontWeight: 600,
  color: 'var(--color-text-primary)',
}

const BADGE_STYLE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  padding: '4px 12px',
  borderRadius: 'var(--radius-pill)',
  background: 'var(--color-brand)',
  color: '#fff',
  fontSize: 'var(--text-xs)',
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
}

const NUMBER_BLOCK: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: 'var(--space-sm)',
}

export function UnitRateCard({ unitRate }: Readonly<Properties>) {
  const { value, tariff } = unitRate

  return (
    <article style={CARD_STYLE} aria-labelledby="unit-rate-heading">
      <div style={TOP_STYLE}>
        <span style={TITLE_STYLE} id="unit-rate-heading">Unit Rate</span>
        <span style={BADGE_STYLE} aria-label={`Tariff: ${tariff}`}>{tariff}</span>
      </div>

      <div style={NUMBER_BLOCK}>
        <span
          style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 800, lineHeight: 1, color: 'var(--color-brand-light)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.04em' }}
          aria-label={`${value.toFixed(2)} pence per kilowatt hour`}
        >
          {value.toFixed(2)}
        </span>
        <span aria-hidden="true" style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>p/kWh</span>
      </div>
    </article>
  )
}
