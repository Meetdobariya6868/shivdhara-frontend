import { httpClient } from '@/lib/axios'
import type { ApiResponse } from '@/types'

import type {
  CreateOrderPayload,
  Order,
  OrderCategory,
  OrderType,
  UploadedImage,
} from '../types'

export const ordersService = {
  /** Full order roster — fetched once, filtered client-side. Admin only. */
  list: async (): Promise<ApiResponse<Order[]>> => {
    const { data } = await httpClient.get<ApiResponse<Order[]>>('/v1/orders')
    return data
  },

  /** Create a full order (customer + rooms + items). */
  create: async (payload: CreateOrderPayload): Promise<ApiResponse<Order>> => {
    const { data } = await httpClient.post<ApiResponse<Order>>('/v1/orders', payload)
    return data
  },

  /**
   * Upload a single product photo. Returns the stored path (to embed in the
   * order payload) plus a public URL (for instant preview).
   */
  uploadItemImage: async (file: File): Promise<ApiResponse<UploadedImage>> => {
    const form = new FormData()
    form.append('image', file)

    const { data } = await httpClient.post<ApiResponse<UploadedImage>>(
      '/v1/order-item-images',
      form,
      // Override the instance's JSON default so the browser sets the multipart
      // boundary; axios fills it in when it detects FormData.
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
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
