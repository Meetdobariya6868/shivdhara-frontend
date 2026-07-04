import { lazy, Suspense } from 'react'

import { ComingSoon } from '@/components/ComingSoon'
import { GreetingHeader } from '@/components/GreetingHeader'
import { PageLoader } from '@/components/PageLoader'
import { useAuthStore } from '@/features/auth/store/auth.store'

// Admin home (order list) is its own chunk — only loaded for admins.
const OrdersPage = lazy(() => import('@/features/orders/pages/OrdersPage'))

/**
 * Role-aware home screen behind /dashboard.
 *   • Admin    → order list (search + filter). Salesman management moved to
 *               the "Salesmen" tab (/salesmen).
 *   • Salesman → personal landing (orders summary arrives in a later phase).
 */
export default function HomePage() {
  const isAdmin = useAuthStore((s) => s.user?.is_admin ?? false)

  if (isAdmin) {
    return (
      <Suspense fallback={<PageLoader />}>
        <OrdersPage />
      </Suspense>
    )
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col">
      <GreetingHeader />
      <ComingSoon title="Your Orders" phase="a later phase" />
    </div>
  )
}
