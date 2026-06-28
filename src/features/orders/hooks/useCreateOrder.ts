import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import type { ApiError } from '@/types'

import { ordersService } from '../services/orders.service'
import type { CreateOrderPayload, Order } from '../types'
import { ordersKeys } from './useOrders'

/**
 * Mutation for POST /orders. On success the order roster is invalidated so the
 * admin list reflects the new order on its next visit.
 */
export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation<{ data: Order }, AxiosError<ApiError>, CreateOrderPayload>({
    mutationFn: async (payload) => {
      const response = await ordersService.create(payload)
      return { data: response.data }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ordersKeys.all })
    },
  })
}
