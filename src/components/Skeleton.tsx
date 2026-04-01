function SkeletonCard({ className = '' }: Readonly<{ className?: string }>) {
  return (
    <div
      data-testid="skeleton-card"
      aria-hidden="true"
      className={`rounded-[var(--radius-card)] bg-[var(--color-surface)] animate-pulse ${className}`}
    />
  )
}

export function Skeleton() {
  return (
    <div role="status" aria-label="Loading results" className="grid gap-4 w-full">
      <span className="sr-only">Loading results…</span>
      <SkeletonCard className="h-10" />
      <SkeletonCard className="h-6 w-48" />
      <SkeletonCard className="h-36" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr]">
        <SkeletonCard className="h-56" />
        <SkeletonCard className="h-56" />
      </div>
      <SkeletonCard className="h-6 w-40" />
      <SkeletonCard className="h-24" />
      <SkeletonCard className="h-48" />
    </div>
  )
}
