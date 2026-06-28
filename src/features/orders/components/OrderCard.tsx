import type { Order } from '../types'
import { formatINR, formatOrderDate } from '../utils/formatters'

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  const balanceDue = parseFloat(order.balance_due)
  const profit = parseFloat(order.total_profit)
  const hasBalance = balanceDue > 0

  return (
    <article
      className="rounded-2xl bg-card px-4 py-4 shadow-sm transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.99]"
      aria-label={`Order ${order.order_number}`}
    >
      {/* Top row — order number + date */}
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-bold tracking-wide text-primary">
          {order.order_number}
        </span>
        <span className="shrink-0 text-xs text-muted">
          {formatOrderDate(order.order_date)}
        </span>
      </div>

      {/* Customer + creator */}
      <p className="mt-1.5 text-sm font-semibold text-card-foreground line-clamp-1">
        {order.customer.name}
      </p>
      <p className="mt-0.5 text-xs text-muted">
        By {order.creator.name} · {order.customer.contact}
      </p>

      {/* Category + type badges */}
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary capitalize">
          {order.category.name}
        </span>
        <span className="rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-medium text-foreground capitalize">
          {order.type.name}
        </span>
      </div>

      {/* Divider */}
      <div className="mt-3 border-t border-border" />

      {/* Financials */}
      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted">Grand Total</p>
          <p className="text-sm font-bold text-card-foreground">
            ₹{formatINR(order.grand_total)}
          </p>
        </div>

        <div className="flex gap-4 text-right">
          {profit > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted">Profit</p>
              <p className="text-sm font-semibold text-success">
                ₹{formatINR(order.total_profit)}
              </p>
            </div>
          )}

          {hasBalance && (
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted">Due</p>
              <p className="text-sm font-semibold text-error">
                ₹{formatINR(order.balance_due)}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

