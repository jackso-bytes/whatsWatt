export function lcoeWeightedAvg(
  generationMix: Array<{ fuel: string; perc: number }>,
  lcoeMap: Record<string, { low: number; [key: string]: unknown }>,
): number {
  const matched = generationMix.filter(
    ({ fuel }) => lcoeMap[fuel] !== undefined && lcoeMap[fuel].low > 0,
  )
  const totalPerc = matched.reduce((sum, { perc }) => sum + perc, 0)
  if (totalPerc === 0) return 0
  const weightedSum = matched.reduce(
    (sum, { fuel, perc }) => sum + perc * lcoeMap[fuel].low,
    0,
  )
  return weightedSum / totalPerc
}
