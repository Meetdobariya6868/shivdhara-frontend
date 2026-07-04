import { useQuery } from '@tanstack/react-query'

import { ordersService } from '../services/orders.service'
import { ordersKeys } from './useOrders'

/** Fetch a single order with its full room/item graph (order detail screen). */
export function useOrder(id: number) {
  return useQuery({
    queryKey: ordersKeys.detail(id),
    queryFn: () => ordersService.getById(id),
    enabled: Number.isFinite(id) && id > 0,
  })
}
