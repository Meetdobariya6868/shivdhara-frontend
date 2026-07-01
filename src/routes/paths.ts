/**
 * Single source of truth for all application route paths.
 * Always reference these constants — never use raw string literals in code.
 */
export const paths = {
  /** Splash screen shown on initial app load. */
  splash: '/',

  auth: {
    login: '/login',
  },

  /** Home — admin: salesman list; salesman: their landing. */
  dashboard: '/dashboard',

  /** Order management (Phase 5). */
  orders: '/orders',
  ordersCreate: '/orders/create',
  /** Single order detail (admin, or the salesman who created it). */
  orderDetail: (id: number | string) => `/orders/${id}`,
  /** Order item (product) detail — nested under the parent order. */
  orderItemDetail: (orderId: number | string, itemId: number | string) =>
    `/orders/${orderId}/items/${itemId}`,

  /** Add salesman (admin only). */
  addSalesman: '/salesmen/add',
  /** Salesman detail — profile + their orders (admin only). */
  salesmanDetail: (id: number | string) => `/salesmen/${id}`,

  /** Customer management (Phase 4). */
  customers: '/customers',

  /** Current user's profile + settings (theme, logout). */
  profile: '/profile',
} as const
