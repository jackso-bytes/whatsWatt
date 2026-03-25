const MAX_INTENSITY = 300
const PERCENT_SCALE = 100

interface Intensity {
  actual: number
  band: 'low' | 'moderate' | 'high'
  updatedAt: string
}

interface Properties {
  readonly intensity?: Intensity
  readonly error?: Error
  readonly onRetry?: () => void
}

function bandLabel(band: Intensity['band']): string {
  if (band === 'low') return 'Low'
  if (band === 'moderate') return 'Moderate'
  return 'High'
}

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/London',
})

interface BadgeProperties {
  readonly band: Intensity['band']
  readonly colorToken: string
}

function IntensityBadge({ band, colorToken }: BadgeProperties) {
  const label = bandLabel(band)
  return (
    <div
      role="img"
      aria-label={`Intensity level: ${label}`}
      className="inline-flex items-center gap-[5px] px-3 py-1 rounded-[var(--radius-pill)] text-white text-[var(--text-xs)] font-bold uppercase tracking-[0.06em]"
      style={{ background: colorToken }}
    >
      <span className="w-[5px] h-[5px] rounded-full bg-white/70" aria-hidden="true" />
      {label}
    </div>
  )
}

interface ScaleBarProperties {
  readonly actual: number
  readonly colorToken: string
}

function ScaleBar({ actual, colorToken }: ScaleBarProperties) {
  const markerPct = Math.min(PERCENT_SCALE, Math.max(0, (actual / MAX_INTENSITY) * PERCENT_SCALE))
  return (
    <div className="intensity-scale mt-[var(--space-md)]" aria-hidden="true">
      <div
        className="intensity-scale-bar relative h-[6px] rounded-[3px] opacity-50 overflow-visible"
        style={{
          background:
            'linear-gradient(to right, var(--color-intensity-low) 0%, var(--color-intensity-moderate) 50%, var(--color-intensity-high) 100%)',
        }}
        role="presentation"
      >
        <div
          className="intensity-scale-marker absolute top-1/2 w-[14px] h-[14px] rounded-full border-[2.5px] border-[var(--color-surface)]"
          style={{
            left: `${markerPct}%`,
            transform: 'translate(-50%, -50%)',
            background: colorToken,
            boxShadow: `0 0 0 2px ${colorToken}, 0 2px 8px rgba(0,0,0,0.4)`,
          }}
        />
      </div>
      <div className="flex justify-between mt-[var(--space-xs)]">
        <span className="text-[var(--text-xs)] text-[var(--color-text-disabled)] font-medium">Low · 0</span>
        <span className="text-[var(--text-xs)] text-[var(--color-text-disabled)] font-medium">200</span>
        <span className="text-[var(--text-xs)] text-[var(--color-text-disabled)] font-medium">High · 300+</span>
      </div>
    </div>
  )
}

interface ErrorFallbackProperties { readonly onRetry?: () => void }

function CardErrorFallback({ onRetry }: ErrorFallbackProperties) {
  return (
    <article aria-labelledby="intensity-heading" className="relative overflow-hidden rounded-[var(--radius-card)] p-[var(--space-lg)] bg-surface border border-border flex flex-col gap-[var(--space-sm)]">
      <span id="intensity-heading" className="sr-only">Carbon Intensity</span>
      <p role="alert" className="text-sm text-text-secondary">Something went wrong loading carbon intensity data.</p>
      {onRetry && <button onClick={onRetry} className="text-xs text-brand-light underline self-start">Retry</button>}
    </article>
  )
}

export function CarbonIntensityCard({ intensity, error, onRetry }: Properties) {
  if (error) return <CardErrorFallback onRetry={onRetry} />
  if (!intensity) return

  const colorToken = `var(--color-intensity-${intensity.band})`
  const bgToken = `var(--color-intensity-${intensity.band}-bg)`
  const borderToken = `var(--color-intensity-${intensity.band}-border)`
  const time = timeFormatter.format(new Date(intensity.updatedAt))

  return (
    <article
      data-testid="carbon-intensity-card"
      aria-labelledby="intensity-heading"
      className="relative overflow-hidden rounded-[var(--radius-card)] p-[var(--space-lg)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_4px_32px_rgba(0,0,0,0.45)]"
      style={{ background: bgToken, border: `1px solid ${borderToken}` }}
    >
      <div className="flex items-center justify-between mb-[var(--space-md)]">
        <span
          id="intensity-heading"
          className="text-[var(--text-sm)] font-semibold text-[var(--color-text-secondary)] uppercase tracking-[0.08em]"
        >
          Carbon Intensity
        </span>
        <IntensityBadge band={intensity.band} colorToken={colorToken} />
      </div>
      <div className="flex items-baseline gap-[var(--space-sm)] mb-[var(--space-sm)]">
        <span
          className="font-[var(--font-display)] text-[var(--text-hero)] font-extrabold leading-none tabular-nums tracking-[-0.04em]"
          aria-label={`${intensity.actual} grams CO2 per kilowatt-hour`}
          style={{ color: colorToken }}
        >
          {intensity.actual}
        </span>
        <span className="text-base font-normal text-[var(--color-text-secondary)] pb-[6px]" aria-hidden="true">
          gCO₂/kWh
        </span>
      </div>
      <ScaleBar actual={intensity.actual} colorToken={colorToken} />
      <span className="sr-only">
        Carbon intensity: {intensity.actual} gCO₂/kWh, {intensity.band} level
      </span>
      <p
        className="intensity-timestamp mt-[var(--space-md)] text-[var(--text-xs)] text-[var(--color-text-disabled)]"
        aria-label={`Data updated at ${time}`}
      >
        Updated {time}
      </p>
    </article>
  )
}
