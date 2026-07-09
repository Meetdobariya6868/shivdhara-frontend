import type { DesignListItem } from '../types'

interface DesignCardProps {
  design: DesignListItem
  onClick: (design: DesignListItem) => void
}

/** A single design row in the catalogue list: name, company, code, variant count. */
export function DesignCard({ design, onClick }: DesignCardProps) {
  const count = design.variants_count

  return (
    <button
      type="button"
      onClick={() => onClick(design)}
      className="flex w-full flex-col gap-1 rounded-2xl bg-card p-4 text-left shadow-sm transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 flex-1 truncate text-base font-semibold text-card-foreground">
          {design.design_name}
        </p>
        <span className="shrink-0 rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-medium text-muted">
          {count} {count === 1 ? 'variant' : 'variants'}
        </span>
      </div>
      <p className="truncate text-sm text-muted">{design.company.company_name}</p>
      {design.code && (
        <p className="text-xs text-muted">
          Code: <span className="font-medium text-foreground">{design.code}</span>
        </p>
      )}
    </button>
  )
}
