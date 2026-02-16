import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '@/pages/auth/Login';
import { Unauthorized } from '@/pages/auth/Unauthorized';
import { AdminDashboard } from '@/pages/admin/Dashboard';
import { Orders } from '@/pages/admin/Orders';
import { AddSalesman } from '@/pages/admin/AddSalesman';
import { AddDetail } from '@/pages/admin/AddDetail';
import { ProfileMenu } from '@/pages/admin/ProfileMenu';
import { ProfileEdit } from '@/pages/admin/ProfileEdit';
import { PrivacyPolicy } from '@/pages/admin/PrivacyPolicy';
import { Products } from '@/pages/admin/Products';
import { MyProducts } from '@/pages/admin/MyProducts';
import { SalesmanDetail } from '@/pages/admin/SalesmanDetail';
import { OrderDetail as AdminOrderDetail } from '@/pages/shared/OrderDetail';
import { ProductDetail as AdminProductDetail } from '@/pages/shared/ProductDetail';
import { EditProduct as AdminEditProduct } from '@/pages/shared/EditProduct';
import { SalesmanDashboard } from '@/pages/salesman/Dashboard';
import { OrderDetail as SalesmanOrderDetail } from '@/pages/salesman/OrderDetail';
import { ProductDetail as SalesmanProductDetail } from '@/pages/salesman/ProductDetail';
import { EditProduct as SalesmanEditProduct } from '@/pages/salesman/EditProduct';
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
        <Route path={ROUTES.ADMIN_PROFILE} element={<ProfileMenu />} />
        <Route path={ROUTES.ADMIN_PROFILE_EDIT} element={<ProfileEdit />} />
        <Route path={ROUTES.ADMIN_PRIVACY_POLICY} element={<PrivacyPolicy />} />
        <Route path={ROUTES.ADMIN_PRODUCTS} element={<Products />} />
        <Route path={ROUTES.ADMIN_MY_PRODUCTS} element={<MyProducts />} />
        <Route path={ROUTES.ADMIN_SALESMAN_DETAIL} element={<SalesmanDetail />} />
        <Route path={ROUTES.ADMIN_ORDER_DETAIL} element={<AdminOrderDetail />} />
        <Route path={ROUTES.ADMIN_PRODUCT_DETAIL} element={<AdminProductDetail />} />
        <Route path={ROUTES.ADMIN_EDIT_PRODUCT} element={<AdminEditProduct />} />
      </Route>

      {/* Salesman routes */}
      <Route element={<ProtectedRoute allowedRoles={['salesman']} />}>
        <Route path={ROUTES.SALESMAN_DASHBOARD} element={<SalesmanDashboard />} />
        <Route path={ROUTES.SALESMAN_ORDER_DETAIL} element={<SalesmanOrderDetail />} />
        <Route path={ROUTES.SALESMAN_PRODUCT_DETAIL} element={<SalesmanProductDetail />} />
        <Route path={ROUTES.SALESMAN_EDIT_PRODUCT} element={<SalesmanEditProduct />} />
      </Route>

      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
