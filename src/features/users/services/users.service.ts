import { httpClient } from '@/lib/axios'
import type { ApiResponse } from '@/types'

import type { CreateSalesmanPayload, Salesman, SalesmenQuery } from '../types'

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
}
