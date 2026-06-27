import { useQuery } from '@tanstack/react-query'

import { usersService } from '../services/users.service'

/** Stable query-key factory for the users feature. */
export const usersKeys = {
  all: ['users'] as const,
  list: () => [...usersKeys.all, 'list'] as const,
}

/**
 * Fetches the salesman roster ONCE and caches it. Search/filtering happens
 * client-side (see SalesmenHomePage) so typing never triggers a network call.
 *
 * The roster is a small, bounded set, so a single fetch is far cheaper and
 * snappier than a request per keystroke. The cache is invalidated on
 * create/update/block/delete mutations, which is the only time it must refetch.
 */
export function useSalesmen() {
  return useQuery({
    queryKey: usersKeys.list(),
    queryFn: () => usersService.list(),
    staleTime: 60_000,
  })
}
