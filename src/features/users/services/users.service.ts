import type { UserStatus } from '@/features/auth/types'
import { httpClient } from '@/lib/axios'
import type { ApiResponse } from '@/types'

import type {
  CreateSalesmanPayload,
  Salesman,
  SalesmenQuery,
  UpdateSalesmanPayload,
} from '../types'

export const usersService = {
  /**
   * Fetch the full salesman roster. Filtering/search is handled client-side.
   * Admin-only on the backend (UserPolicy).
   */
  list: async (query?: SalesmenQuery): Promise<ApiResponse<Salesman[]>> => {
    const { data } = await httpClient.get<ApiResponse<Salesman[]>>(
      '/v1/users',
      { params: query },
    )
    return data
  },

  /** A single salesman, including their orders_count (for the detail header). */
  getById: async (id: number): Promise<ApiResponse<Salesman>> => {
    const { data } = await httpClient.get<ApiResponse<Salesman>>(`/v1/users/${id}`)
    return data
  },

  /** Create a new salesman account. Admin-only. */
  create: async (payload: CreateSalesmanPayload): Promise<ApiResponse<Salesman>> => {
    const { data } = await httpClient.post<ApiResponse<Salesman>>('/v1/users', payload)
    return data
  },

  /** Update a salesman's profile (name, mobile). Admin-only. */
  update: async (
    id: number,
    payload: UpdateSalesmanPayload,
  ): Promise<ApiResponse<Salesman>> => {
    const { data } = await httpClient.put<ApiResponse<Salesman>>(`/v1/users/${id}`, payload)
    return data
  },

  /** Block or unblock a salesman. Blocking revokes their tokens server-side. */
  updateStatus: async (
    id: number,
    status: UserStatus,
  ): Promise<ApiResponse<Salesman>> => {
    const { data } = await httpClient.patch<ApiResponse<Salesman>>(
      `/v1/users/${id}/status`,
      { status },
    )
    return data
  },

  /** Grant or revoke a salesman's permission to create orders. */
  updatePermissions: async (
    id: number,
    canCreateOrders: boolean,
  ): Promise<ApiResponse<Salesman>> => {
    const { data } = await httpClient.patch<ApiResponse<Salesman>>(
      `/v1/users/${id}/permissions`,
      { can_create_orders: canCreateOrders },
    )
    return data
  },

  /** Soft-delete a salesman. Admin-only. */
  remove: async (id: number): Promise<ApiResponse<null>> => {
    const { data } = await httpClient.delete<ApiResponse<null>>(`/v1/users/${id}`)
    return data
  },
}
