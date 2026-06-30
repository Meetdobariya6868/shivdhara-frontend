import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { useDebounce } from '@/hooks/useDebounce'

import { ordersService } from '../services/orders.service'
import type { DesignVariantOption } from '../types'
import { ordersKeys } from './useOrders'

/** Below this length we don't hit the API (matches the backend's min). */
export const VARIANT_SEARCH_MIN_CHARS = 2

/**
 * Debounced server-side catalogue search for the Add-Item autocomplete.
 *
 * The catalogue is large (tens of thousands of variants), so search runs on the
 * server against a FULLTEXT index rather than shipping the whole table down.
 *
 * - Debounces the raw input (350ms) so typing never fires a request per keystroke.
 * - Only queries once the trimmed term reaches the minimum length.
 * - `enabled` lets the caller keep the query idle (e.g. until a variant link is cleared).
 * - Keeps the previous result on screen while the next term loads, and reports
 *   the debounce gap as "loading" so the panel never flashes an empty state.
 */
export function useDesignVariantSearch(term: string, enabled = true) {
  const liveTerm = term.trim()
  const debounced = useDebounce(liveTerm, 350)

  const isSearchable = liveTerm.length >= VARIANT_SEARCH_MIN_CHARS
  const isDebouncing = isSearchable && liveTerm !== debounced

  const query = useQuery({
    queryKey: [...ordersKeys.all, 'variant-search', debounced],
    queryFn: () => ordersService.searchDesignVariants(debounced),
    enabled: enabled && debounced.length >= VARIANT_SEARCH_MIN_CHARS,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  })

  const options: DesignVariantOption[] = query.data?.data ?? []
  const isFetching = isDebouncing || (isSearchable && query.isFetching)

  return {
    options,
    /** In-flight (debounce gap or network) — drives the skeleton + input spinner. */
    isLoading: enabled && isFetching,
    isError: enabled && query.isError,
    /** Typed something, but not yet enough characters to search. */
    isTooShort: liveTerm.length > 0 && !isSearchable,
    /** Term is long enough to expect results — gates the dropdown opening. */
    isSearchable,
  }
}
