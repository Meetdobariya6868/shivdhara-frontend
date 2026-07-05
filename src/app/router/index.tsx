/* eslint-disable react-refresh/only-export-components */
/*
 * Router files by design export a non-component (the router object) alongside
 * lazy component references. Disabling the Fast Refresh rule here is intentional
 * and safe — changes to this file always trigger a full page reload anyway.
 */
import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { AuthGuard } from '@/app/router/guards/AuthGuard'
import { GuestGuard } from '@/app/router/guards/GuestGuard'
import { RoleGuard } from '@/app/router/guards/RoleGuard'
import { PageLoader } from '@/components/PageLoader'
import { AppLayout } from '@/layouts/AppLayout'
import NotFoundPage from '@/pages/NotFoundPage'
import { paths } from '@/routes/paths'

// ── Lazy-loaded pages (one JS chunk per route) ────────────────────────────────
const SplashPage = lazy(() => import('@/pages/SplashPage'))
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const HomePage = lazy(() => import('@/pages/HomePage'))
const SalesmenHomePage = lazy(
  () => import('@/features/users/pages/SalesmenHomePage'),
)
const OrderDetailPage = lazy(
  () => import('@/features/orders/pages/OrderDetailPage'),
)
const OrderItemDetailPage = lazy(
  () => import('@/features/orders/pages/OrderItemDetailPage'),
)
const EditOrderItemPage = lazy(
  () => import('@/features/orders/pages/EditOrderItemPage'),
)
const CreateOrderPage = lazy(
  () => import('@/features/orders/pages/CreateOrderPage'),
)
const AddSalesmanPage = lazy(
  () => import('@/features/users/pages/AddSalesmanPage'),
)
const SalesmanDetailPage = lazy(
  () => import('@/features/users/pages/SalesmanDetailPage'),
)
const EditSalesmanPage = lazy(
  () => import('@/features/users/pages/EditSalesmanPage'),
)
const CustomersPage = lazy(
  () => import('@/features/customers/pages/CustomersPage'),
)
const DesignsPage = lazy(() => import('@/features/catalog/pages/DesignsPage'))
const DesignDetailPage = lazy(
  () => import('@/features/catalog/pages/DesignDetailPage'),
)
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'))
const EditProfilePage = lazy(
  () => import('@/features/profile/pages/EditProfilePage'),
)

/** Wrap any route element with Suspense so lazy chunks never throw. */
function withSuspense(node: ReactNode): ReactNode {
  return <Suspense fallback={<PageLoader />}>{node}</Suspense>
}

/**
 * Application router (React Router v7).
 * All business pages are lazy-loaded so the initial JS bundle stays minimal.
 */
export const router = createBrowserRouter([
  // ── Splash — public, no guard ─────────────────────────────────────────────
  {
    path: paths.splash,
    element: withSuspense(<SplashPage />),
  },

  // ── Guest-only (authenticated users → /dashboard) ─────────────────────────
  {
    element: <GuestGuard />,
    children: [
      {
        path: paths.auth.login,
        element: withSuspense(<LoginPage />),
      },
    ],
  },

  // ── Protected app shell (unauthenticated users → /login) ──────────────────
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          // Shared (both roles)
          { path: paths.dashboard, element: withSuspense(<HomePage />) },
          { path: paths.ordersCreate, element: withSuspense(<CreateOrderPage />) },
          { path: paths.profile, element: withSuspense(<ProfilePage />) },
          { path: paths.profileEdit, element: withSuspense(<EditProfilePage />) },
          // Order detail — backend enforces admin-or-creator access (OrderPolicy@view)
          { path: '/orders/:orderId', element: withSuspense(<OrderDetailPage />) },
          { path: '/orders/:orderId/items/:itemId', element: withSuspense(<OrderItemDetailPage />) },
          { path: '/orders/:orderId/items/:itemId/edit', element: withSuspense(<EditOrderItemPage />) },

          // Admin-only
          {
            element: <RoleGuard allow={['admin']} />,
            children: [
              { path: paths.salesmen,     element: withSuspense(<SalesmenHomePage />) },
              { path: paths.addSalesman,  element: withSuspense(<AddSalesmanPage />) },
              { path: paths.customers,    element: withSuspense(<CustomersPage />) },
              { path: '/salesmen/:salesmanId', element: withSuspense(<SalesmanDetailPage />) },
              { path: '/salesmen/:salesmanId/edit', element: withSuspense(<EditSalesmanPage />) },
              { path: paths.designs, element: withSuspense(<DesignsPage />) },
              { path: '/designs/:designId', element: withSuspense(<DesignDetailPage />) },
            ],
          },
        ],
      },
    ],
  },

  // ── 404 ───────────────────────────────────────────────────────────────────
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
