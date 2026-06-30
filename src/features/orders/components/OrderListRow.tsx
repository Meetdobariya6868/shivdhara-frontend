import { Avatar } from '@/components/ui/Avatar'

import { OrderStatusBadge } from './OrderStatusBadge'
import type { Order } from '../types'

interface OrderListRowProps {
  order: Order
  onClick: (order: Order) => void
}

/**
 * Compact, tappable order row (customer + contact + status). Reused in the
 * salesman detail screen's date-grouped order list.
 */
export function OrderListRow({ order, onClick }: OrderListRowProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(order)}
      aria-label={`Order for ${order.customer.name}`}
      className="flex w-full items-center gap-3 rounded-2xl bg-card px-3 py-3 text-left shadow-sm transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Avatar name={order.customer.name} size="sm" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-card-foreground">
          {order.customer.name}
        </p>
        <p className="truncate text-xs text-muted">{order.customer.contact}</p>
      </div>

      <OrderStatusBadge status={order.status} label={order.status_label} />
    </button>
  )
}
