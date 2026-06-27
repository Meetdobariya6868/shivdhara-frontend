import type { AuthUser } from '@/features/auth/types'

/**
 * A salesman record as returned by GET /users (UserResource).
 * Structurally identical to AuthUser — aliased for domain clarity.
 */
export type Salesman = AuthUser

/** Query parameters accepted by the salesman list endpoint. */
export interface SalesmenQuery {
  status?: 'active' | 'blocked'
}
