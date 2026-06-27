import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { paths } from '@/routes/paths'

import { authService } from '../services/auth.service'
import { useAuthStore } from '../store/auth.store'

/**
 * Mutation hook for logging out.
 *
 * Flow:
 *   1. mutationFn fires POST /auth/logout while the token is STILL present,
 *      so the Authorization header is attached and the server can revoke it.
 *   2. onSettled (runs after success OR failure) clears local auth state and
 *      navigates to /login.
 *
 * Clearing in onSettled — not onMutate — guarantees the request carries the
 * bearer token. Server-side failures are tolerated: the local session is
 * always cleared so the user is never stuck in a half-logged-in state.
 */
export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      clearAuth()
      void navigate(paths.auth.login, { replace: true })
    },
  })
}
