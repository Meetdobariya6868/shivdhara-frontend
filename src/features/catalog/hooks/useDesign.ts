import { useQuery } from '@tanstack/react-query'

import { catalogService } from '../services/catalog.service'
import { catalogKeys } from './useDesigns'

/** Fetch a single design with all its variants (detail screen). */
export function useDesign(id: number) {
  return useQuery({
    queryKey: catalogKeys.design(id),
    queryFn: () => catalogService.getDesign(id),
    enabled: Number.isFinite(id) && id > 0,
  })
}
