import { httpClient } from '@/lib/axios'
import type { ApiResponse, PaginatedResponse } from '@/types'

import type {
  CreateOrderPayload,
  DesignVariantOption,
  Order,
  OrderCategory,
  OrderDetail,
  OrderListParams,
  OrderStatus,
  OrderType,
  QuotationFormat,
  SalesmanOption,
  UpdateOrderItemPayload,
  UploadedImage,
} from '../types'

export const ordersService = {
  /** A filtered, paginated page of orders. Admin only. */
  list: async (params: OrderListParams): Promise<PaginatedResponse<Order>> => {
    const { data } = await httpClient.get<PaginatedResponse<Order>>('/v1/orders', {
      params,
    })
    return data
  },

  /** Salesmen (incl. deleted) who have orders — options for the salesman filter. */
  salesmen: async (): Promise<ApiResponse<SalesmanOption[]>> => {
    const { data } = await httpClient.get<ApiResponse<SalesmanOption[]>>(
      '/v1/orders/salesmen',
    )
    return data
  },

  /** Single order with its full room/item graph. */
  getById: async (id: number): Promise<ApiResponse<OrderDetail>> => {
    const { data } = await httpClient.get<ApiResponse<OrderDetail>>(`/v1/orders/${id}`)
    return data
  },

  /** The order's quotation PDF (design name or code), as a Blob to view or save. */
  downloadQuotation: async (id: number, format: QuotationFormat): Promise<Blob> => {
    const { data } = await httpClient.get<Blob>(`/v1/orders/${id}/quotation`, {
      params: { format },
      responseType: 'blob',
    })
    return data
  },

  /** Create a full order (customer + rooms + items). */
  create: async (payload: CreateOrderPayload): Promise<ApiResponse<Order>> => {
    const { data } = await httpClient.post<ApiResponse<Order>>('/v1/orders', payload)
    return data
  },

  /** Change an order's workflow status (e.g. confirm). Returns the updated detail. */
  updateStatus: async (id: number, status: OrderStatus): Promise<ApiResponse<OrderDetail>> => {
    const { data } = await httpClient.patch<ApiResponse<OrderDetail>>(
      `/v1/orders/${id}/status`,
      { status },
    )
    return data
  },

  /** Soft-delete an order. */
  remove: async (id: number): Promise<ApiResponse<null>> => {
    const { data } = await httpClient.delete<ApiResponse<null>>(`/v1/orders/${id}`)
    return data
  },

  /** Rename a room. Returns the reloaded parent order detail. */
  renameRoom: async (roomId: number, roomName: string): Promise<ApiResponse<OrderDetail>> => {
    const { data } = await httpClient.patch<ApiResponse<OrderDetail>>(
      `/v1/order-rooms/${roomId}`,
      { room_name: roomName },
    )
    return data
  },

  /** Update mutable item fields. Returns the updated parent order detail. */
  updateItem: async (id: number, payload: UpdateOrderItemPayload): Promise<ApiResponse<OrderDetail>> => {
    const { data } = await httpClient.patch<ApiResponse<OrderDetail>>(
      `/v1/order-items/${id}`,
      payload,
    )
    return data
  },

  /** Soft-delete an item. Returns the updated parent order detail for cache sync. */
  deleteItem: async (id: number): Promise<ApiResponse<OrderDetail>> => {
    const { data } = await httpClient.delete<ApiResponse<OrderDetail>>(`/v1/order-items/${id}`)
    return data
  },

  /** Move an item to another room of the same order. Returns the updated detail. */
  moveItem: async (itemId: number, roomId: number): Promise<ApiResponse<OrderDetail>> => {
    const { data } = await httpClient.patch<ApiResponse<OrderDetail>>(
      `/v1/order-items/${itemId}/move`,
      { room_id: roomId },
    )
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

  /**
   * Server-side catalogue search for the Add-Item autocomplete. Returns up to
   * 30 active variants matching the query against design name / code / company
   * (FULLTEXT-backed, so it scales to large catalogues).
   */
  searchDesignVariants: async (q: string): Promise<ApiResponse<DesignVariantOption[]>> => {
    const { data } = await httpClient.get<ApiResponse<DesignVariantOption[]>>(
      '/v1/design-variants/search',
      { params: { q } },
    )
    return data
  },
}
