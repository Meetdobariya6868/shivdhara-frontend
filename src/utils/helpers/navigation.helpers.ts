// Navigation-related utility functions

import { UserRole } from '@/types/auth.types';
import { ROUTES } from '../constants';

export const getDashboardPath = (role: UserRole): string => {
  const roleRoutes: Record<UserRole, string> = {
    admin: ROUTES.ADMIN_DASHBOARD,
    salesman: ROUTES.SALESMAN_DASHBOARD,
  };
  return roleRoutes[role] || ROUTES.LOGIN;
};
