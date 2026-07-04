import { useState } from 'react'

import { XIcon } from '@/components/icons'

import { useOrderMeta } from '../hooks/useOrderMeta'
import { useOrderSalesmen } from '../hooks/useOrders'
import type { OrderFilters } from '../types'

interface OrdersFiltersSheetProps {
  isOpen: boolean
  /** Current committed filters — used to seed draft when the sheet mounts. */
  activeFilters: OrderFilters
  onApply: (filters: OrderFilters) => void
  onClose: () => void
}

const LABEL = 'text-xs font-semibold uppercase tracking-wide text-muted mb-1.5 block'
const FIELD =
  'w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-surface-foreground placeholder:text-muted focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring'

/**
 * Bottom-sheet for non-search filters (date range, category, type, salesman).
 *
 * Draft state is seeded from `activeFilters` via a lazy useState initializer.
 * The parent remounts this component (via `key`) each time the sheet opens,
 * so the draft is always fresh — no useEffect needed.
 */
export function OrdersFiltersSheet({
  isOpen,
  activeFilters,
  onApply,
  onClose,
}: OrdersFiltersSheetProps) {
  const [draft, setDraft] = useState<OrderFilters>(() => ({
    date_from:         activeFilters.date_from,
    date_to:           activeFilters.date_to,
    order_category_id: activeFilters.order_category_id,
    order_type_id:     activeFilters.order_type_id,
    creator_id:        activeFilters.creator_id,
  }))

  const { categories, types } = useOrderMeta()
  const { data: salesmenData } = useOrderSalesmen()
  const salesmanOptions = salesmenData?.data ?? []

  const set = <K extends keyof OrderFilters>(key: K, value: OrderFilters[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value || undefined }))

  const hasDraft = Object.values(draft).some((v) => v !== undefined && v !== '')

  return (
    <>
      {/* Backdrop */}
      <div
        className={[
          'fixed inset-0 z-40 bg-foreground/40 transition-opacity duration-200',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filter orders"
        className={[
          'fixed inset-x-0 bottom-0 z-50 mx-auto max-w-2xl rounded-t-3xl bg-background',
          'flex max-h-[85dvh] flex-col shadow-2xl',
          'transition-transform duration-300 ease-out',
          isOpen ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
      >
        {/* Handle + Header */}
        <div className="relative flex shrink-0 items-center justify-between px-5 pb-3 pt-5">
          <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-border" />
          <h2 className="text-base font-bold text-foreground">Filters</h2>
          <div className="flex items-center gap-3">
            {hasDraft && (
              <button
                type="button"
                onClick={() => setDraft({})}
                className="text-xs font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline-none"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="rounded-full p-1 text-muted transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <XIcon size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable fields */}
        <div className="flex-1 overflow-y-auto px-5 pb-4">
          {/* Date range */}
          <div className="mb-5">
            <span className={LABEL}>Date Range</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="filter-date-from" className="mb-1 block text-xs text-muted">
                  From
                </label>
                <input
                  id="filter-date-from"
                  type="date"
                  value={draft.date_from ?? ''}
                  max={draft.date_to ?? undefined}
                  onChange={(e) => set('date_from', e.target.value)}
                  className={FIELD}
                />
              </div>
              <div>
                <label htmlFor="filter-date-to" className="mb-1 block text-xs text-muted">
                  To
                </label>
                <input
                  id="filter-date-to"
                  type="date"
                  value={draft.date_to ?? ''}
                  min={draft.date_from ?? undefined}
                  onChange={(e) => set('date_to', e.target.value)}
                  className={FIELD}
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="mb-5">
            <label htmlFor="filter-category" className={LABEL}>
              Category
            </label>
            <select
              id="filter-category"
              value={draft.order_category_id ?? ''}
              onChange={(e) =>
                set('order_category_id', e.target.value ? Number(e.target.value) : undefined)
              }
              className={FIELD}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Order type */}
          <div className="mb-5">
            <label htmlFor="filter-type" className={LABEL}>
              Order Type
            </label>
            <select
              id="filter-type"
              value={draft.order_type_id ?? ''}
              onChange={(e) =>
                set('order_type_id', e.target.value ? Number(e.target.value) : undefined)
              }
              className={FIELD}
            >
              <option value="">All types</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Salesman / Creator */}
          <div className="mb-5">
            <label htmlFor="filter-salesman" className={LABEL}>
              Salesman
            </label>
            <select
              id="filter-salesman"
              value={draft.creator_id ?? ''}
              onChange={(e) =>
                set('creator_id', e.target.value ? Number(e.target.value) : undefined)
              }
              className={FIELD}
            >
              <option value="">All salesmen</option>
              {salesmanOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer — Apply */}
        <div className="shrink-0 border-t border-border px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => onApply(draft)}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  )
}
