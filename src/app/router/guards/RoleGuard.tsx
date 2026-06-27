import { Navigate, Outlet } from 'react-router-dom'

import { useAuthStore } from '@/features/auth/store/auth.store'
import type { UserRole } from '@/features/auth/types'
import { paths } from '@/routes/paths'

interface RoleGuardProps {
  allow: readonly UserRole[]
}

/**
 * Restricts a route subtree to specific roles. Users without an allowed
 * role are redirected to their home screen rather than shown a 403, since
 * the navigation never surfaces these links to them in the first place.
 */
export function RoleGuard({ allow }: RoleGuardProps) {
  const role = useAuthStore((s) => s.user?.role)

  if (!role || !allow.includes(role)) {
    return <Navigate to={paths.dashboard} replace />
  }

  return <Outlet />
}
