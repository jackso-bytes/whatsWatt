interface UnitRateData {
  readonly value: number
  readonly tariff: string
}

interface Properties {
  readonly unitRate: UnitRateData
}

export function UnitRateCard({ unitRate }: Readonly<Properties>) {
  const { value, tariff } = unitRate

  return (
    <article
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
