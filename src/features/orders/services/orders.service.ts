import { httpClient } from '@/lib/axios'
import type { ApiResponse } from '@/types'

import type { Order, OrderCategory, OrderType } from '../types'

export const ordersService = {
  /** Full order roster — fetched once, filtered client-side. Admin only. */
  list: async (): Promise<ApiResponse<Order[]>> => {
    const { data } = await httpClient.get<ApiResponse<Order[]>>('/v1/orders')
    return data
  },

  /** Active categories for filter dropdowns. Cached aggressively (rarely changes). */
  getCategories: async (): Promise<ApiResponse<OrderCategory[]>> => {
    const { data } = await httpClient.get<ApiResponse<OrderCategory[]>>('/v1/order-categories')
    return data
  },

  /** Active order types for filter dropdowns. */
  getTypes: async (): Promise<ApiResponse<OrderType[]>> => {
    const { data } = await httpClient.get<ApiResponse<OrderType[]>>('/v1/order-types')
    return data
  },
}
