import { lazy, Suspense } from 'react'

import { PageLoader } from '@/components/PageLoader'

// The order list is its own chunk, shared by both roles.
const OrdersPage = lazy(() => import('@/features/orders/pages/OrdersPage'))

/**
 * Home screen behind /dashboard — the order list (search + filter + infinite
 * scroll), shared by both roles. Admins see every order; salesmen see only
 * their own (the backend scopes the result in OrderService@paginateOrders, so
 * no role branching is needed here — same component, same design, for both).
 */
export default function HomePage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <OrdersPage />
    </Suspense>
  )
}
