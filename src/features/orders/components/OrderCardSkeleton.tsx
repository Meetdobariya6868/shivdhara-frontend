/** Loading placeholder that mirrors the OrderCard layout. */
export function OrderCardSkeleton() {
  return (
    <div
      className="rounded-2xl bg-card px-4 py-4 shadow-sm"
      aria-hidden="true"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="h-4 w-32 animate-pulse rounded bg-border" />
        <div className="h-3.5 w-20 animate-pulse rounded bg-border" />
      </div>

      {/* Customer */}
      <div className="mt-2.5 h-4 w-40 animate-pulse rounded bg-border" />
      <div className="mt-1.5 h-3 w-28 animate-pulse rounded bg-border" />

      {/* Badges */}
      <div className="mt-3 flex gap-1.5">
        <div className="h-5 w-16 animate-pulse rounded-full bg-border" />
        <div className="h-5 w-14 animate-pulse rounded-full bg-border" />
      </div>

      {/* Divider */}
      <div className="mt-3 border-t border-border" />

      {/* Financials */}
      <div className="mt-3 flex items-end justify-between">
        <div>
          <div className="h-2.5 w-16 animate-pulse rounded bg-border" />
          <div className="mt-1 h-4 w-24 animate-pulse rounded bg-border" />
        </div>
        <div className="h-4 w-20 animate-pulse rounded bg-border" />
      </div>
    </div>
  )
}
