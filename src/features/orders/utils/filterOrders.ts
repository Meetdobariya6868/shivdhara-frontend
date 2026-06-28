import type { Order, OrderFilters } from '../types'

/**
 * Pure, in-memory filter over the full order roster.
 * Called via useMemo — zero network calls, instant feedback.
 */
export function filterOrders(
  orders: readonly Order[],
  filters: OrderFilters,
): Order[] {
  const search = filters.search?.trim().toLowerCase() ?? ''
  const dateFrom = filters.date_from ?? ''
  const dateTo = filters.date_to ?? ''

  return orders.filter((order) => {
    // Search: order number or customer name
    if (
      search &&
      !order.order_number.toLowerCase().includes(search) &&
      !order.customer.name.toLowerCase().includes(search)
    ) {
      return false
    }

    // Date range (order_date is 'YYYY-MM-DD' — string comparison works correctly)
    if (dateFrom && order.order_date < dateFrom) return false
    if (dateTo   && order.order_date > dateTo)   return false

    // Category
    if (filters.order_category_id && order.category.id !== filters.order_category_id) {
      return false
    }

    // Order type
    if (filters.order_type_id && order.type.id !== filters.order_type_id) {
      return false
    }

    // Salesman / creator
    if (filters.creator_id && order.creator.id !== filters.creator_id) {
      return false
    }

    return true
  })
}
