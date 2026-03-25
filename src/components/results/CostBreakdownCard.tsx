// stub — replaced by PR #32 (CostBreakdownCard full implementation)
import type { LCOE as LcoeType } from '../../data/lcoe'

interface Properties {
  readonly generationMix: Array<{ fuel: string; perc: number }>
  readonly lcoe: typeof LcoeType
  readonly unitRate: number
}

export function CostBreakdownCard({ generationMix, lcoe, unitRate }: Readonly<Properties>) {
  return (
    <article data-testid="cost-breakdown-card">
      <p>{unitRate}p/kWh</p>
      <ul>
        {generationMix.map(({ fuel, perc }) => (
          <li key={fuel}>{lcoe[fuel]?.label ?? fuel}: {perc}%</li>
        ))}
      </ul>
    </article>
  )
}
