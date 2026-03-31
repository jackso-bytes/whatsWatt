interface UnitRateData {
  readonly value: number
  readonly tariff: string
}

import { Primitive } from '@radix-ui/react-primitive'

interface Properties {
  readonly unitRate: UnitRateData
  readonly error?: Error
  readonly onRetry?: () => void
}

export function UnitRateCard({ unitRate, error, onRetry }: Readonly<Properties>) {
  const { value, tariff } = unitRate

  if (error) {
    return (
      <article data-testid="unit-rate-card" className="rounded-card p-lg bg-surface-raised border border-border shadow-[0_2px_24px_rgba(0,0,0,0.32)] flex items-center justify-between gap-md">
        <p role="alert" className="text-sm text-[var(--color-intensity-high)]">Unit rate unavailable</p>
        {onRetry && (
          <Primitive.button type="button" onClick={onRetry} aria-label="Retry loading unit rate" className="text-xs font-semibold text-[var(--color-intensity-high)] border border-[var(--color-intensity-high-border)] rounded-button px-3 py-1 cursor-pointer">
            Retry
          </Primitive.button>
        )}
      </article>
    )
  }

  return (
    <article
      data-testid="unit-rate-card"
      className="rounded-card p-lg bg-surface-raised border border-border shadow-[0_2px_24px_rgba(0,0,0,0.32)]"
      aria-labelledby="unit-rate-heading"
    >
      <div className="flex items-center justify-between mb-md">
        <span className="text-base font-semibold text-text-primary" id="unit-rate-heading">Unit Rate</span>
        <span
          className="inline-flex items-center gap-[5px] px-3 py-1 rounded-pill bg-brand text-white text-xs font-bold tracking-[0.06em] uppercase"
          aria-label={`Tariff: ${tariff}`}
        >
          {tariff}
        </span>
      </div>

      <div className="flex items-baseline gap-sm">
        <span
          className="font-display text-[3.5rem] font-extrabold leading-none text-brand-light tabular-nums tracking-[-0.04em]"
          aria-label={`${value.toFixed(2)} pence per kilowatt hour`}
        >
          {value.toFixed(2)}
        </span>
        <span aria-hidden="true" className="text-lg font-semibold text-text-secondary">p/kWh</span>
      </div>
    </article>
  )
}
