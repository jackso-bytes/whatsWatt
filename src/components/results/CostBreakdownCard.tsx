import * as Collapsible from '@radix-ui/react-collapsible'
import { useState } from 'react'
import { LCOE } from '../../data/lcoe'
import { lcoeWeightedAvg } from '../../utils/lcoe-weighted-avg'

interface Properties {
  readonly generationMix: Array<{ fuel: string; perc: number }>
  readonly lcoe: typeof LCOE
  readonly unitRate: number
}

const LCOE_CEILING = 138
const PERCENT_SCALE = 100

function getDisplayValue(entry: { low: number; high?: number }): number {
  return entry.high === undefined ? entry.low : (entry.low + entry.high) / 2
}

function formatValueText(entry: { low: number; high?: number }): string {
  return entry.high === undefined ? `£${entry.low}` : `£${entry.low}–${entry.high}`
}

function formatValueAriaLabel(entry: { low: number; high?: number }): string {
  return entry.high === undefined
    ? `£${entry.low} per megawatt-hour`
    : `£${entry.low} to £${entry.high} per megawatt-hour`
}

const INFO_ICON = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="flex-shrink-0 mt-[1px] text-[var(--color-brand-light)] opacity-70"
  >
    <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M7 6v4M7 4.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)

function BarChart({ rows }: { readonly rows: [string, typeof LCOE[string]][] }) {
  return (
    <div
      role="list"
      aria-label="Generation cost by fuel type, cheapest first"
      className="flex flex-col gap-[10px]"
    >
      {rows.map(([fuel, entry]) => {
        const displayValue = getDisplayValue(entry)
        const barWidth = (displayValue / LCOE_CEILING) * PERCENT_SCALE
        return (
          <div
            key={fuel}
            role="listitem"
            className="grid items-center gap-[var(--space-sm)]"
            style={{ gridTemplateColumns: '64px 1fr 64px' }}
          >
            <span
              data-fuel
              className="text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)] whitespace-nowrap text-right"
            >
              {entry.label}
            </span>
            <div
              aria-hidden="true"
              className="h-[8px] rounded-[var(--radius-pill)] overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <div
                data-bar-fill
                className="h-full rounded-[var(--radius-pill)] transition-[width] duration-500"
                style={{ width: `${barWidth}%`, background: entry.colour }}
              />
            </div>
            <span
              aria-label={formatValueAriaLabel(entry)}
              className="text-[var(--text-sm)] font-bold text-[var(--color-text-primary)] tabular-nums text-right"
            >
              {formatValueText(entry)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function MethodologyAccordion({ open, onOpenChange }: {
  readonly open: boolean
  readonly onOpenChange: (v: boolean) => void
}) {
  return (
    <Collapsible.Root open={open} onOpenChange={onOpenChange} className="mt-[var(--space-sm)]">
      <Collapsible.Trigger
        aria-label="Methodology"
        className="flex items-center gap-[5px] text-[var(--text-xs)] text-[var(--color-text-disabled)] cursor-pointer select-none py-[var(--space-xs)] hover:text-[var(--color-text-secondary)] transition-colors"
      >
        <span
          className="text-[9px] shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        >
          ▶
        </span>
        About these cost estimates
      </Collapsible.Trigger>
      <Collapsible.Content className="text-[var(--text-xs)] text-[var(--color-text-disabled)] leading-[1.7] pt-[var(--space-md)] pb-[var(--space-xs)]">
        <p className="mb-[var(--space-sm)]">
          <strong className="text-[var(--color-text-secondary)] font-semibold">About these cost estimates</strong>
        </p>
        <p className="mb-[var(--space-sm)]">
          Generation cost data is from the UK Government&apos;s{' '}
          <strong className="text-[var(--color-text-secondary)] font-semibold">Electricity Generation Costs 2025</strong>{' '}
          report (DESNZ, January 2026). Figures are Levelised Cost of Electricity (LCOE)
          estimates for projects commissioning in 2030.
        </p>
        <p className="mb-[var(--space-sm)]">
          <strong className="text-[var(--color-text-secondary)] font-semibold">Wind:</strong>{' '}
          Capacity-weighted average of onshore (~£58/MWh), fixed offshore (~£105/MWh),
          and floating offshore (~£155/MWh) based on 2024 UK installed capacity.
        </p>
        <p>
          <strong className="text-[var(--color-text-secondary)] font-semibold">Nuclear range:</strong>{' '}
          £95–125/MWh. Bar width uses the midpoint (£110/MWh).
        </p>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

export function CostBreakdownCard({ generationMix, lcoe }: Properties) {
  const [open, setOpen] = useState(false)
  const avg = Math.round(lcoeWeightedAvg(generationMix, lcoe))

  const rows = Object.entries(lcoe)
    .filter(([, entry]) => entry.low > 0)
    .toSorted(([, a], [, b]) => getDisplayValue(a) - getDisplayValue(b))

  return (
    <article
      data-testid="cost-breakdown-card"
      aria-labelledby="cost-break-heading"
      className="rounded-[var(--radius-card)] p-[var(--space-lg)] shadow-[0_2px_24px_rgba(0,0,0,0.32)]"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <div className="flex items-baseline justify-between gap-[var(--space-md)] mb-[var(--space-lg)] flex-wrap">
        <h2
          id="cost-break-heading"
          className="text-base font-semibold text-[var(--color-text-primary)]"
        >
          Cost by Generation Source
        </h2>
        <div
          aria-label={`Weighted average generation cost: approximately £${avg} per megawatt-hour`}
          className="flex items-baseline gap-1"
        >
          <span className="font-[var(--font-display)] font-bold text-[var(--text-lg)] text-[var(--color-text-primary)] tabular-nums">
            ~£{avg}
          </span>
          <span className="text-[var(--text-xs)] text-[var(--color-text-disabled)]">/MWh weighted avg</span>
        </div>
      </div>

      <BarChart rows={rows} />

      <div
        role="note"
        className="flex items-start gap-[var(--space-sm)] mt-[var(--space-md)] px-[var(--space-md)] py-[var(--space-sm)] rounded-[10px]"
        style={{
          background: 'rgba(45,139,139,0.08)',
          border: '1px solid rgba(45,139,139,0.18)',
        }}
      >
        {INFO_ICON}
        <p className="text-[var(--text-xs)] font-medium text-[var(--color-text-secondary)] leading-[1.55]">
          Weighted average generation cost across your mix:{' '}
          <strong className="text-[var(--color-brand-light)] font-bold">~£{avg}/MWh</strong>.
          Bar widths are relative to the highest-cost source (Biomass at £138/MWh).
        </p>
      </div>

      <MethodologyAccordion open={open} onOpenChange={setOpen} />
    </article>
  )
}
