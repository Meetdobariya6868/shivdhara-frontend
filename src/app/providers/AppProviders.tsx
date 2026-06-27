import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'

import { router } from '@/app/router'
import { queryClient } from '@/lib/queryClient'

/**
 * Composition root for all global providers.
 *
 * Keeping the provider tree in one component (rather than nesting it in
 * `main.tsx`) makes the app's cross-cutting concerns explicit and easy to test.
 * Order matters: data layer (Query) wraps the router so every route has cache
 * access.
 */
export function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
