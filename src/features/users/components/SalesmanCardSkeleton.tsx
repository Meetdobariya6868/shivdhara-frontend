/**
 * Loading placeholder mirroring SalesmanCard's layout to prevent layout shift.
 */
export function SalesmanCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col items-center gap-3 rounded-2xl bg-card p-6">
      <div className="h-16 w-16 rounded-full bg-border" />
      <div className="h-4 w-24 rounded bg-border" />
      <div className="h-3 w-16 rounded bg-border" />
    </div>
  )
}
