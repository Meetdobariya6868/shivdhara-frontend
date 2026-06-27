import { QueryClient } from '@tanstack/react-query'

/**
 * Application-wide TanStack Query client.
 *
 * Defaults are conservative and sensible for an enterprise SPA; individual
 * queries override them as needed. Defining the client once (here) keeps cache
 * configuration centralised and testable.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
