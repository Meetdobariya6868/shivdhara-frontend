import { useQuery } from '@tanstack/react-query'

import { ordersService } from '../services/orders.service'
import { ordersKeys } from './useOrders'

// Categories and types are database-seeded constants — they never change at
// runtime. Infinity means TanStack Query will never background-refetch them.
const META_STALE = Infinity

/**
 * Fetches categories and order types in parallel for filter dropdowns.
 * Both are seeded reference data, so they're cached for 5 minutes.
 */
export function useOrderMeta() {
  const categories = useQuery({
    queryKey: [...ordersKeys.meta(), 'categories'],
    queryFn: () => ordersService.getCategories(),
    staleTime: META_STALE,
  })

  const types = useQuery({
    queryKey: [...ordersKeys.meta(), 'types'],
    queryFn: () => ordersService.getTypes(),
    staleTime: META_STALE,
  })

  return {
    categories: categories.data?.data ?? [],
    types: types.data?.data ?? [],
    isLoading: categories.isLoading || types.isLoading,
  }
}
