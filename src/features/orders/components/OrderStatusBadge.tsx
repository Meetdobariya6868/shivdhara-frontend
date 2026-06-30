import type { OrderStatus } from '../types'

interface OrderStatusBadgeProps {
  status: OrderStatus
  label: string
}

/** Token-only colour per workflow state (adapts to light/dark themes). */
const STYLES: Record<OrderStatus, string> = {
  pending: 'bg-warning/10 text-warning',
  confirmed: 'bg-success/10 text-success',
}

/** Small pill showing an order's workflow status. */
export function OrderStatusBadge({ status, label }: OrderStatusBadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold',
        STYLES[status],
      ].join(' ')}
    >
      {label}
    </span>
  )
}
