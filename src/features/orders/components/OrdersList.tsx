import { ClipboardIcon } from '@/components/icons'

import type { Order } from '../types'
import { OrderCard } from './OrderCard'
import { OrderCardSkeleton } from './OrderCardSkeleton'

interface OrdersListProps {
  orders: Order[]
  /** Total matching the current filters (from the server), across all pages. */
  total: number
  isLoading: boolean
  isError: boolean
  hasFilters: boolean
  onRetry: () => void
  onOrderClick: (order: Order) => void
}

const SKELETON_COUNT = 6

export function OrdersList({
  orders,
  total,
  isLoading,
  isError,
  hasFilters,
  onRetry,
  onOrderClick,
}: OrdersListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading orders">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <OrderCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <span className="text-muted">
          <ClipboardIcon size={40} />
        </span>
        <div>
          <p className="font-semibold text-foreground">Failed to load orders</p>
          <p className="mt-1 text-sm text-muted">Check your connection and try again.</p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Retry
        </button>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <span className="text-muted">
          <ClipboardIcon size={40} />
        </span>
        <div>
          <p className="font-semibold text-foreground">
            {hasFilters ? 'No orders match your filters' : 'No orders yet'}
          </p>
          <p className="mt-1 text-sm text-muted">
            {hasFilters
              ? 'Try adjusting or clearing the active filters.'
              : 'Orders will appear here once they are created.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-3 text-xs text-muted">
        {total} order{total !== 1 ? 's' : ''}
      </p>

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} onClick={onOrderClick} />
        ))}
      </div>
    </div>
  )
}
