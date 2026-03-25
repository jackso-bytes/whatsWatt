interface Properties {
  readonly intensityError: Error | undefined
  readonly unitRateError: Error | undefined
  readonly aqiError: Error | undefined
  readonly onRetry: () => void
}

export function NetworkBanner({ intensityError, unitRateError, aqiError, onRetry }: Properties) {
  if (!intensityError || !unitRateError || !aqiError) return

  return (
    <div role="alert" className="flex items-center justify-between gap-md px-md py-sm rounded-button bg-red-900/30 border border-red-700/40 text-sm text-text-secondary">
      <span>Network error — unable to load data. Check your connection.</span>
      <button onClick={onRetry} className="text-xs text-brand-light underline bg-transparent border-none cursor-pointer p-0 shrink-0">Retry</button>
    </div>
  )
}
