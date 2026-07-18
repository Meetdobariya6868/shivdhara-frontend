import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'

import { catalogService } from '../services/catalog.service'
import type { DesignFilters } from '../types'

export const catalogKeys = {
  all: ['catalog'] as const,
  designs: () => [...catalogKeys.all, 'designs'] as const,
  design: (id: number) => [...catalogKeys.all, 'design', id] as const,
}

/** Page size for the designs list's infinite scroll. */
export const DESIGNS_PER_PAGE = 20

/**
 * Paginated, server-filtered designs list (infinite scroll). Search (design
 * name/code) and the company filter run server-side; filter changes start a
 * fresh query while the previous page stays on screen (keepPreviousData).
 */
export function useDesigns(filters: DesignFilters) {
  return useInfiniteQuery({
    queryKey: [...catalogKeys.designs(), filters],
    queryFn: ({ pageParam, signal }) =>
      catalogService.listDesigns(
        {
          search: filters.search?.trim() || undefined,
          page: pageParam,
          per_page: DESIGNS_PER_PAGE,
        },
        // Abort a superseded request instead of leaving it to clog the
        // connection pool while the user keeps typing.
        signal,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.last_page
        ? lastPage.meta.current_page + 1
        : undefined,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  })
}
