/** Loading placeholder for the order detail screen. */
export function OrderDetailSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4 px-4 py-4" aria-hidden="true">
      <div className="h-5 w-32 rounded bg-card" />
      <div className="flex flex-col gap-3 rounded-2xl bg-card p-4">
        <div className="h-4 w-40 rounded bg-surface" />
        <div className="h-4 w-32 rounded bg-surface" />
        <div className="h-4 w-36 rounded bg-surface" />
      </div>
      <div className="flex flex-col gap-3 rounded-2xl bg-card p-4">
        <div className="h-4 w-44 rounded bg-surface" />
        <div className="h-4 w-40 rounded bg-surface" />
      </div>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-2xl bg-card p-4">
          <div className="h-5 w-28 rounded bg-surface" />
          <div className="h-16 w-full rounded-xl bg-surface" />
        </div>
      ))}
    </div>
  )
}
