import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import type { ApiError } from '@/types'

import { ordersService } from '../services/orders.service'
import type { QuotationFormat } from '../types'

/** Whether a generated quotation is opened in the viewer or saved to disk. */
export type QuotationAction = 'view' | 'download'

export interface QuotationRequest {
  orderId: number
  format: QuotationFormat
  /** Carried through so the UI knows which control is in-flight / what to do on success. */
  action: QuotationAction
}

/**
 * Fetches an order's quotation PDF as a Blob. `action` doesn't change the
 * request — it rides along so the caller can branch (view vs save) in onSuccess
 * and show a spinner on the specific control (via mutation.variables).
 */
export function useDownloadQuotation() {
  return useMutation<Blob, AxiosError<ApiError>, QuotationRequest>({
    mutationFn: ({ orderId, format }) => ordersService.downloadQuotation(orderId, format),
  })
}
