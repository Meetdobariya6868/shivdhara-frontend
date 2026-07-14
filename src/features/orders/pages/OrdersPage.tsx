import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { GreetingHeader } from '@/components/GreetingHeader'
import { FilterIcon, SearchIcon, SpinnerIcon, XIcon } from '@/components/icons'
import { useDebounce } from '@/hooks/useDebounce'
import { paths } from '@/routes/paths'

import { useOrders } from '../hooks/useOrders'
import type { OrderFilters } from '../types'
import { countActiveFilters } from '../utils/formatters'
import { OrdersFiltersSheet } from '../components/OrdersFiltersSheet'
import { OrdersList } from '../components/OrdersList'

/**
 * Admin Orders screen (the admin Home tab).
 *
 * Search, filtering and pagination all run server-side against indexed columns;
 * rows load a page at a time via infinite scroll. This keeps the payload small
 * and scales to large order volumes. The search box is debounced so typing
 * never fires a request per keystroke.
 */
export default function OrdersPage() {
  const navigate = useNavigate()
  const [isSheetOpen, setIsSheetOpen]   = useState(false)
  const [sheetKey, setSheetKey]         = useState(0)
  const [search, setSearch]             = useState('')
  const [sheetFilters, setSheetFilters] = useState<Omit<OrderFilters, 'search'>>({})

  const debouncedSearch = useDebounce(search, 350)

  const filters: OrderFilters = useMemo(
    () => ({ ...sheetFilters, search: debouncedSearch.trim() || undefined }),
    [sheetFilters, debouncedSearch],
  )

  const {
    data,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useOrders(filters)

  const orders = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  )
  const total = data?.pages[0]?.meta.total ?? 0

  const openSheet = () => { setSheetKey((k) => k + 1); setIsSheetOpen(true) }

  const activeFilterCount = countActiveFilters(sheetFilters) + (search ? 1 : 0)

  const handleApplyFilters = (applied: OrderFilters) => {
    // The sheet only manages non-search filters; keep search on its own state.
    setSheetFilters({
      date_from:         applied.date_from,
      date_to:           applied.date_to,
      order_category_id: applied.order_category_id,
      order_type_id:     applied.order_type_id,
      creator_id:        applied.creator_id,
      status:            applied.status,
    })
    setIsSheetOpen(false)
  }

  const handleClearAll = () => {
    setSheetFilters({})
    setSearch('')
  }

  // Close the filter sheet on Escape.
  useEffect(() => {
    if (!isSheetOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsSheetOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isSheetOpen])

  // Infinite scroll: fetch the next page when the sentinel scrolls into view.
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = loadMoreRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { rootMargin: '300px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div className="mx-auto flex max-w-2xl flex-col">
      {/* Home header — greeting + name (this is the admin's Home tab). */}
      <GreetingHeader />

      {/* Search + Filter bar */}
      <div className="px-5 pb-3">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3">
          <SearchIcon size={18} className="shrink-0 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order by customer name or number"
            aria-label="Search orders"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="shrink-0 text-muted transition-colors hover:text-foreground focus-visible:outline-none"
            >
              <XIcon size={16} />
            </button>
          )}

          <div className="mx-1 h-5 w-px bg-border" />

          <button
            type="button"
            onClick={openSheet}
            aria-label={`Filters${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ''}`}
            className="relative shrink-0 text-muted transition-colors hover:text-foreground focus-visible:outline-none"
          >
            <FilterIcon
              size={18}
              className={activeFilterCount > 0 ? 'text-primary' : ''}
            />
            {activeFilterCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground"
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-5 pb-3">
          <span className="text-xs text-muted">Active:</span>
          {search && (
            <Chip label={`"${search}"`} onRemove={() => setSearch('')} />
          )}
          {sheetFilters.date_from && (
            <Chip
              label={`From ${sheetFilters.date_from}`}
              onRemove={() => setSheetFilters((p) => ({ ...p, date_from: undefined }))}
            />
          )}
          {sheetFilters.date_to && (
            <Chip
              label={`To ${sheetFilters.date_to}`}
              onRemove={() => setSheetFilters((p) => ({ ...p, date_to: undefined }))}
            />
          )}
          {sheetFilters.order_category_id && (
            <Chip
              label="Category"
              onRemove={() => setSheetFilters((p) => ({ ...p, order_category_id: undefined }))}
            />
          )}
          {sheetFilters.order_type_id && (
            <Chip
              label="Type"
              onRemove={() => setSheetFilters((p) => ({ ...p, order_type_id: undefined }))}
            />
          )}
          {sheetFilters.creator_id && (
            <Chip
              label="Salesman"
              onRemove={() => setSheetFilters((p) => ({ ...p, creator_id: undefined }))}
            />
          )}
          {sheetFilters.status && (
            <Chip
              label={sheetFilters.status === 'confirmed' ? 'Confirmed' : 'Pending'}
              onRemove={() => setSheetFilters((p) => ({ ...p, status: undefined }))}
            />
          )}
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline-none"
          >
            Clear all
          </button>
        </div>
      )}

      {/* List */}
      <div className="px-5 pb-24">
        <OrdersList
          orders={orders}
          total={total}
          isLoading={isLoading}
          isError={isError}
          hasFilters={activeFilterCount > 0}
          onRetry={() => void refetch()}
          onOrderClick={(order) => {
            void navigate(paths.orderDetail(order.id))
          }}
        />

        {/* Infinite-scroll sentinel + loading-more indicator */}
        <div ref={loadMoreRef} aria-hidden="true" className="h-px" />
        {isFetchingNextPage && (
          <div className="flex justify-center py-4 text-muted" aria-label="Loading more orders">
            <SpinnerIcon size={20} />
          </div>
        )}
      </div>

      <OrdersFiltersSheet
        key={sheetKey}
        isOpen={isSheetOpen}
        activeFilters={{ ...sheetFilters, search }}
        onApply={handleApplyFilters}
        onClose={() => setIsSheetOpen(false)}
      />
    </div>
  )
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter ${label}`}
        className="ml-0.5 rounded-full hover:bg-primary/20 focus-visible:outline-none"
      >
        <XIcon size={10} />
      </button>
    </span>
  )
}
