import { useQuery } from '@tanstack/react-query'

import { usersService } from '../services/users.service'
import { usersKeys } from './useSalesmen'

/** Fetch a single salesman (with orders_count) for the detail header. */
export function useSalesman(id: number) {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => usersService.getById(id),
    enabled: Number.isFinite(id) && id > 0,
  })
}
