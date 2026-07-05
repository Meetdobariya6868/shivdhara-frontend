import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import type { ApiError, ApiResponse } from '@/types'

import { catalogService } from '../services/catalog.service'
import type {
  DesignDetail,
  DesignVariantRate,
  UpdateVariantRatesPayload,
} from '../types'
import { catalogKeys } from './useDesigns'

/**
 * Update a variant's rates. On success the returned variant is patched straight
 * into the cached design detail, so the row reflects the saved value instantly
 * without a refetch.
 */
export function useUpdateVariantRates(designId: number) {
  const qc = useQueryClient()

  return useMutation<
    ApiResponse<DesignVariantRate>,
    AxiosError<ApiError>,
    { variantId: number; payload: UpdateVariantRatesPayload }
  >({
    mutationFn: ({ variantId, payload }) =>
      catalogService.updateVariantRates(variantId, payload),
    onSuccess: (res) => {
      qc.setQueryData<ApiResponse<DesignDetail>>(
        catalogKeys.design(designId),
        (prev) =>
          prev
            ? {
                ...prev,
                data: {
                  ...prev.data,
                  variants: prev.data.variants.map((v) =>
                    v.id === res.data.id ? res.data : v,
                  ),
                },
              }
            : prev,
      )
    },
  })
}
