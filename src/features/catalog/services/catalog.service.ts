import { httpClient } from '@/lib/axios'
import type { ApiResponse, PaginatedResponse } from '@/types'

import type {
  DesignDetail,
  DesignListItem,
  DesignListParams,
  DesignVariantRate,
  UpdateVariantRatesPayload,
} from '../types'

export const catalogService = {
  /** A filtered, paginated page of designs. Admin only. */
  listDesigns: async (
    params: DesignListParams,
  ): Promise<PaginatedResponse<DesignListItem>> => {
    const { data } = await httpClient.get<PaginatedResponse<DesignListItem>>(
      '/v1/designs',
      { params },
    )
    return data
  },

  /** A single design with all its variants. Admin only. */
  getDesign: async (id: number): Promise<ApiResponse<DesignDetail>> => {
    const { data } = await httpClient.get<ApiResponse<DesignDetail>>(`/v1/designs/${id}`)
    return data
  },

  /** Update a variant's purchase + sell rate. Admin only. */
  updateVariantRates: async (
    id: number,
    payload: UpdateVariantRatesPayload,
  ): Promise<ApiResponse<DesignVariantRate>> => {
    const { data } = await httpClient.patch<ApiResponse<DesignVariantRate>>(
      `/v1/design-variants/${id}`,
      payload,
    )
    return data
  },
}
