import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query'

import { ordersService } from '../services/orders.service'
import type { OrderFilters } from '../types'

export const ordersKeys = {
  all: ['orders'] as const,
  list: () => [...ordersKeys.all, 'list'] as const,
  meta: () => [...ordersKeys.all, 'meta'] as const,
  detail: (id: number) => [...ordersKeys.all, 'detail', id] as const,
  salesmen: () => [...ordersKeys.all, 'salesmen'] as const,
}

/** Page size for the admin order list's infinite scroll. */
export const ORDERS_PER_PAGE = 20

/**
 * Paginated, server-filtered admin order list (infinite scroll).
 *
 * Filtering, search and pagination all run server-side against indexed columns,
 * so the payload stays small and the query scales to large order volumes.
 * Changing filters starts a fresh query while the previous page stays on screen
 * (keepPreviousData) to avoid an empty flash.
 */
export function useOrders(filters: OrderFilters) {
  return useInfiniteQuery({
    queryKey: [...ordersKeys.list(), filters],
    queryFn: ({ pageParam }) =>
      ordersService.list({
        search: filters.search?.trim() || undefined,
        date_from: filters.date_from || undefined,
        date_to: filters.date_to || undefined,
        order_category_id: filters.order_category_id,
        order_type_id: filters.order_type_id,
        creator_id: filters.creator_id,
        page: pageParam,
        per_page: ORDERS_PER_PAGE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.last_page
        ? lastPage.meta.current_page + 1
        : undefined,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  })
}

/**
 * Salesmen (including deleted ones) who have created orders — the option set
 * for the order list's salesman filter. Admin-only on the backend, so callers
 * must pass `enabled: false` for a salesman viewing their own orders (the
 * filter is meaningless there and the request would 403).
 */
export function useOrderSalesmen(enabled = true) {
  return useQuery({
    queryKey: ordersKeys.salesmen(),
    queryFn: () => ordersService.salesmen(),
    enabled,
    staleTime: 60_000,
  })
}
