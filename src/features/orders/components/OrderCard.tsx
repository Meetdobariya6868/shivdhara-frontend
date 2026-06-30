import type { Order } from '../types'
import { formatINR, formatOrderDate } from '../utils/formatters'

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <article
      className="rounded-2xl bg-card px-4 py-4 shadow-sm transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.99]"
      aria-label={`Order for ${order.customer.name}`}
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

      {/* Category + type badges */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary capitalize">
          {order.category.name}
        </span>
        <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-foreground capitalize">
          {order.type.name}
        </span>
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
    </article>
  )
}

