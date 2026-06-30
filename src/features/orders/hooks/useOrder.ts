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

/** Fetch every order created by a salesman (salesman detail screen). */
export function useSalesmanOrders(userId: number) {
  return useQuery({
    queryKey: ordersKeys.byUser(userId),
    queryFn: () => ordersService.listByUser(userId),
    enabled: Number.isFinite(userId) && userId > 0,
    staleTime: 30_000,
  })
}
