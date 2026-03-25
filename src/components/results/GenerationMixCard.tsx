import type { CSSProperties } from 'react'

const DONUT_RADIUS = 56
const CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS
const GAP = 3
const PERCENT = 100

interface FuelEntry { readonly fuel: string; readonly perc: number }
interface LcoeEntry { readonly label: string; readonly low: number; readonly high?: number; readonly colour: string }
interface Properties {
  readonly mix?: FuelEntry[]
  readonly lcoe?: Record<string, LcoeEntry>
  readonly error?: Error
  readonly onRetry?: () => void
}
interface Segment { fuel: string; colour: string; dashArray: string; dashOffset: number }

function fuelLabel(fuel: string, entry: LcoeEntry | undefined): string {
  return entry?.label ?? fuel.charAt(0).toUpperCase() + fuel.slice(1)
}

function buildDonutAriaLabel(sorted: FuelEntry[], lcoe: Record<string, LcoeEntry>): string {
  const parts = sorted.map(({ fuel, perc }) => `${fuelLabel(fuel, lcoe[fuel])} ${perc}%`)
  return `Generation mix donut chart: ${parts.join(', ')}`
}

function buildSegments(sorted: FuelEntry[], lcoe: Record<string, LcoeEntry>): Segment[] {
  let cumulative = 0
  return sorted.map(({ fuel, perc }) => {
    const colour = lcoe[fuel]?.colour ?? '#888'
    const segLength = (perc / PERCENT) * CIRCUMFERENCE - GAP
    const dashOffset = -cumulative
    cumulative += (perc / PERCENT) * CIRCUMFERENCE
    return { fuel, colour, dashArray: `${segLength.toFixed(2)} ${CIRCUMFERENCE.toFixed(2)}`, dashOffset }
  })
}

function formatLcoe(entry: LcoeEntry | undefined): string {
  if (!entry || entry.low === 0) return '—'
  if (entry.high) return `£${entry.low}-${entry.high}/MWh`
  return `£${entry.low}/MWh`
}

const CARD_STYLE: CSSProperties = { background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)', padding: 'var(--space-lg)', boxShadow: '0 2px 24px rgba(0,0,0,0.32)' }
const HEADING_STYLE: CSSProperties = { fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }
const LEGEND_STYLE: CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }
const FOOTER_STYLE: CSSProperties = { fontSize: 'var(--text-xs)', color: 'var(--color-text-disabled)', marginTop: 'var(--space-md)' }

interface CentreProperties { readonly dominant: FuelEntry | undefined; readonly label: string }

function DonutCentreLabel({ dominant, label }: Readonly<CentreProperties>) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{dominant?.perc}%</span>
    </div>
  )
}

interface DonutProperties { readonly sorted: FuelEntry[]; readonly lcoe: Record<string, LcoeEntry> }

function DonutChart({ sorted, lcoe }: DonutProperties) {
  const dominant = sorted[0]
  const segments = buildSegments(sorted, lcoe)
  const ariaLabel = buildDonutAriaLabel(sorted, lcoe)
  const dominantLabel = dominant ? fuelLabel(dominant.fuel, lcoe[dominant.fuel]) : ''
  return (
    <div role="img" aria-label={ariaLabel} style={{ flexShrink: 0, position: 'relative', width: 160, height: 160 }}>
      <svg viewBox="0 0 160 160" width="160" height="160" aria-hidden="true" style={{ transform: 'rotate(-90deg)' }}>
        {segments.map(({ fuel, colour, dashArray, dashOffset }) => (
          <circle key={fuel} cx="80" cy="80" r={DONUT_RADIUS} fill="none" stroke={colour} strokeWidth="22" strokeDasharray={dashArray} strokeDashoffset={dashOffset} />
        ))}
      </svg>
      <DonutCentreLabel dominant={dominant} label={dominantLabel} />
    </div>
  )
}

interface LegendItemProperties { readonly fuel: string; readonly perc: number; readonly entry: LcoeEntry | undefined }

function LegendItem({ fuel, perc, entry }: LegendItemProperties) {
  const label = fuelLabel(fuel, entry)
  const colour = entry?.colour ?? '#888'
  return (
    <li role="listitem" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
      <span aria-hidden="true" style={{ width: 9, height: 9, borderRadius: '50%', background: colour, flexShrink: 0 }} />
      <span className="legend-fuel" style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-secondary)' }}>{label}</span>
      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{perc}%</span>
      <span className="legend-lcoe" style={{ fontSize: 10, fontWeight: 500, color: 'var(--color-text-disabled)', fontVariantNumeric: 'tabular-nums', minWidth: 96, textAlign: 'right' }}>{formatLcoe(entry)}</span>
    </li>
  )
}

const MIX_ICON = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="8" stroke="#3aad63" strokeWidth="1.5" />
    <path d="M9 9 L9 3.5 A5.5 5.5 0 0 1 13.76 12 Z" fill="#3aad63" opacity="0.8" />
    <path d="M9 9 L13.76 12 A5.5 5.5 0 0 1 4.6 13.7 Z" fill="#8899aa" opacity="0.8" />
  </svg>
)

export function GenerationMixCard({ mix, lcoe, error, onRetry }: Properties) {
  if (error) {
    return (
      <article style={CARD_STYLE}>
        <p role="alert" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Something went wrong loading generation mix data.</p>
        {onRetry && <button onClick={onRetry} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand-light)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Retry</button>}
      </article>
    )
  }
  if (!mix || !lcoe) return
  const sorted = mix.toSorted((a, b) => b.perc - a.perc)
  return (
    <article data-testid="generation-mix-card" style={CARD_STYLE}>
      <h2 style={HEADING_STYLE}>{MIX_ICON}Generation Mix</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
        <DonutChart sorted={sorted} lcoe={lcoe} />
        <ul role="list" aria-label="Generation mix legend" style={LEGEND_STYLE}>
          {sorted.map(({ fuel, perc }) => <LegendItem key={fuel} fuel={fuel} perc={perc} entry={lcoe[fuel]} />)}
        </ul>
      </div>
      <p style={FOOTER_STYLE}>LCOE figures from DESNZ Electricity Generation Costs 2025 (January 2026), 2030 commissioning estimates. — indicates no published figure for this edition.</p>
    </article>
  )
}
