import type { AuthUser } from '@/features/auth/types'

/**
 * A salesman record as returned by GET /users (UserResource).
 * Structurally AuthUser plus an optional orders_count, which the backend
 * includes only on the single-salesman detail endpoint (GET /users/{id}).
 */
export type Salesman = AuthUser & {
  orders_count?: number
}

/** Query parameters accepted by the salesman list endpoint. */
export interface SalesmenQuery {
  status?: 'active' | 'blocked'
}

/** Payload for POST /users — create a new salesman account. */
export interface CreateSalesmanPayload {
  name: string
  mobile_number: string
  password: string
}

/** Payload for PUT /users/{id} — edit a salesman's profile. */
export interface UpdateSalesmanPayload {
  name: string
  mobile_number: string
}
