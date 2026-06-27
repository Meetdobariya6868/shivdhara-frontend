import { useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'

import { router } from '@/app/router'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { registerAuthHandlers } from '@/lib/axios'
import { queryClient } from '@/lib/queryClient'

/**
 * Composition root for all global providers.
 *
 * Wires the auth store into the Axios client once on mount via
 * `registerAuthHandlers`. The getter calls `getState()` at request time,
 * so it always reads the latest token — no re-registration needed on login/logout.
 */
export function AppProviders() {
  const clearAuth = useAuthStore((s) => s.clearAuth)

  useEffect(() => {
    registerAuthHandlers(
      () => useAuthStore.getState().token,
      clearAuth,
    )
  }, [clearAuth])

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
