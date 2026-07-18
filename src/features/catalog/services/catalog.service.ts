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
  /**
   * A filtered, paginated page of designs. Admin only. The optional signal is
   * forwarded to axios so React Query can abort an in-flight request the moment
   * a newer search supersedes it — otherwise stale keystroke requests pile up
   * against the browser's ~6-connection limit and later ones queue for seconds.
   */
  listDesigns: async (
    params: DesignListParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResponse<DesignListItem>> => {
    const { data } = await httpClient.get<PaginatedResponse<DesignListItem>>(
      '/v1/designs',
      { params, signal },
    )
    return data
  },

  /** A single design with all its variants. Admin only. */
  getDesign: async (id: number): Promise<ApiResponse<DesignDetail>> => {
    const { data } = await httpClient.get<ApiResponse<DesignDetail>>(`/v1/designs/${id}`)
    return data
  },

  /** The full catalogue (designs + variants) as an .xlsx Blob to save. Admin only. */
  exportDesigns: async (): Promise<Blob> => {
    const { data } = await httpClient.get<Blob>('/v1/designs/export', {
      responseType: 'blob',
    })
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
