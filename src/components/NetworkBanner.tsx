import { Primitive } from '@radix-ui/react-primitive'

interface Properties {
  readonly onRetry: () => void
}

export function NetworkBanner({ onRetry }: Properties) {
  return (
    <div
      role="alert"
      className="flex items-center justify-between gap-md px-lg py-md rounded-card bg-[var(--color-intensity-high-bg)] border border-[var(--color-intensity-high-border)] my-md"
    >
      <p className="text-sm text-[var(--color-intensity-high)]">
        Unable to load data — check your connection.
      </p>
      <Primitive.button
        type="button"
        onClick={onRetry}
        aria-label="Retry loading data"
        className="text-xs font-semibold text-[var(--color-intensity-high)] border border-[var(--color-intensity-high-border)] rounded-button px-3 py-1 hover:bg-[var(--color-intensity-high-bg)] cursor-pointer"
      >
        Retry
      </Primitive.button>
    </div>
  )
}
