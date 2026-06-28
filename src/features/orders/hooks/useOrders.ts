import { useQuery } from '@tanstack/react-query'

import { ordersService } from '../services/orders.service'

export const ordersKeys = {
  all: ['orders'] as const,
  list: () => [...ordersKeys.all, 'list'] as const,
  meta: () => [...ordersKeys.all, 'meta'] as const,
}

/**
 * Fetches the full order roster ONCE and caches it.
 * All filtering (search, dates, category, type, salesman) is handled
 * client-side via filterOrders(), so typing never triggers a network call.
 */
export function useOrders() {
  return useQuery({
    queryKey: ordersKeys.list(),
    queryFn: () => ordersService.list(),
    staleTime: 30_000,
  })
}
