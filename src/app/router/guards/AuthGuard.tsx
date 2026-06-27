import { Navigate, Outlet } from 'react-router-dom'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { paths } from '@/routes/paths'

/**
 * Protects routes that require authentication.
 * Unauthenticated users are redirected to /login and returned here after login.
 */
export function AuthGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())

  if (!isAuthenticated) {
    return <Navigate to={paths.auth.login} replace />
  }

  return <Outlet />
}
