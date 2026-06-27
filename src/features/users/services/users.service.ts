import { httpClient } from '@/lib/axios'
import type { ApiResponse } from '@/types'

import type { Salesman, SalesmenQuery } from '../types'

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
}
