import { ClipboardIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { StateMessage } from '@/components/ui/StateMessage'
import { OrderListRow } from '@/features/orders/components/OrderListRow'
import type { Order } from '@/features/orders/types'
import { formatOrderDate } from '@/features/orders/utils/formatters'

interface SalesmanOrdersListProps {
  orders: Order[]
  isLoading: boolean
  isError: boolean
  searchActive: boolean
  onRetry: () => void
  onOrderClick: (order: Order) => void
}

const SKELETON_COUNT = 5

/** Group orders into [date → orders], preserving the incoming (newest-first) order. */
function groupByDate(orders: Order[]): Array<[string, Order[]]> {
  const groups = new Map<string, Order[]>()
  for (const order of orders) {
    const bucket = groups.get(order.order_date)
    if (bucket) {
      bucket.push(order)
    } else {
      groups.set(order.order_date, [order])
    }
  }
  return Array.from(groups.entries())
}

/**
 * The salesman's orders, grouped by date, across all UI states
 * (loading · error · empty · success).
 */
export function SalesmanOrdersList({
  orders,
  isLoading,
  isError,
  searchActive,
  onRetry,
  onOrderClick,
}: SalesmanOrdersListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading orders">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-2xl bg-card" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <StateMessage
        icon={<ClipboardIcon size={40} />}
        title="Couldn't load orders"
        description="Something went wrong while fetching this salesman's orders."
        action={
          <Button onClick={onRetry} className="mt-2">
            Retry
          </Button>
        }
      />
    )
  }

  if (orders.length === 0) {
    return (
      <StateMessage
        icon={<ClipboardIcon size={40} />}
        title={searchActive ? 'No matching orders' : 'No orders yet'}
        description={
          searchActive
            ? 'Try a different customer name or number.'
            : 'Orders created by this salesman will appear here.'
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {groupByDate(orders).map(([date, group]) => (
        <div key={date} className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-muted">{formatOrderDate(date)}</p>
          {group.map((order) => (
            <OrderListRow key={order.id} order={order} onClick={onOrderClick} />
          ))}
        </div>
      ))}
    </div>
  )
}
