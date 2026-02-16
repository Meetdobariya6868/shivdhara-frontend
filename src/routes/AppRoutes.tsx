import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '@/pages/Login';
import { Unauthorized } from '@/pages/Unauthorized';
import { AdminDashboard } from '@/pages/admin/Dashboard';
import { Orders } from '@/pages/admin/Orders';
import { AddSalesman } from '@/pages/admin/AddSalesman';
import { AddDetail } from '@/pages/admin/AddDetail';
import { Profile } from '@/pages/admin/Profile';
import { SalesmanDashboard } from '@/pages/salesman/Dashboard';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';
import { getDashboardPath } from '@/utils/helpers';

const RootRedirect: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <Navigate to={ROUTES.LOGIN} replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
        <Route path={ROUTES.ADMIN_ORDERS} element={<Orders />} />
        <Route path={ROUTES.ADMIN_ADD_SALESMAN} element={<AddSalesman />} />
        <Route path={ROUTES.ADMIN_DETAILS} element={<AddDetail />} />
        <Route path={ROUTES.ADMIN_PROFILE} element={<Profile />} />
      </Route>

      {/* Salesman routes */}
      <Route element={<ProtectedRoute allowedRoles={['salesman']} />}>
        <Route path={ROUTES.SALESMAN_DASHBOARD} element={<SalesmanDashboard />} />
      </Route>

      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
