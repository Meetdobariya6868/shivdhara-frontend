import { useQuery } from '@tanstack/react-query'

import { ordersService } from '../services/orders.service'
import type { QuotationFormat } from '../types'
import { ordersKeys } from './useOrders'

/**
 * Fetches a temporary signed share link for an order's quotation PDF.
 *
 * The link is prefetched (rather than fetched on click) so the "Share on
 * WhatsApp" action can open the wa.me deep link synchronously within the user's
 * click gesture — avoiding pop-up blockers that trip on a post-`await`
 * `window.open`. Cached for the session; the server-issued link is valid for
 * days, so refetching every render is unnecessary.
 */
export function useQuotationShareLink(
  orderId: number,
  format: QuotationFormat,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ordersKeys.quotationShareLink(orderId, format),
    queryFn: () => ordersService.getQuotationShareLink(orderId, format),
    enabled: enabled && Number.isFinite(orderId) && orderId > 0,
    select: (response) => response.data,
    staleTime: 5 * 60_000,
  })
}
