import { Navigate, Outlet } from 'react-router-dom'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { paths } from '@/routes/paths'

/**
 * Allows only unauthenticated users.
 * Authenticated users who navigate to /login are redirected to /dashboard.
 */
export function GuestGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())

  if (isAuthenticated) {
    return <Navigate to={paths.dashboard} replace />
  }

  return <Outlet />
}
