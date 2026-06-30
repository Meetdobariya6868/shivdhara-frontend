import { OrderStatusBadge } from './OrderStatusBadge'
import type { Order } from '../types'
import { formatINR, formatOrderDate } from '../utils/formatters'

interface OrderCardProps {
  order: Order
  /** When provided, the whole card becomes a button that opens the order. */
  onClick?: (order: Order) => void
}

export function OrderCard({ order, onClick }: OrderCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(order)}
      aria-label={`Order for ${order.customer.name}`}
      className="w-full rounded-2xl bg-card px-4 py-4 text-left shadow-sm transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* Top row — customer name + date */}
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 flex-1 text-base font-semibold text-card-foreground line-clamp-1">
          {order.customer.name}
        </p>
        <span className="mt-0.5 shrink-0 text-xs text-muted">
          {formatOrderDate(order.order_date)}
        </span>
      </div>
      <p className="mt-0.5 text-xs text-muted">
        By {order.creator.name} · {order.customer.contact}
      </p>

      {/* Category + type + status badges */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary capitalize">
          {order.category.name}
        </span>
        <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-foreground capitalize">
          {order.type.name}
        </span>
        <OrderStatusBadge status={order.status} label={order.status_label} />
      </div>

      {/* Footer — total */}
      <div className="mt-3 flex items-end justify-between border-t border-border pt-3">
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted">
          Total product price
        </span>
        <span className="text-base font-bold text-card-foreground">
          ₹{formatINR(order.grand_total)}
        </span>
      </div>
    </button>
  )
}

