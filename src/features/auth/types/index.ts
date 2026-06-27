/** Mirrors UserRole enum values from the backend. */
export type UserRole = 'admin' | 'salesman'

/** Mirrors UserStatus enum values from the backend. */
export type UserStatus = 'active' | 'blocked'

/** Shape returned by UserResource on the backend. */
export interface AuthUser {
  id: number
  name: string
  mobile_number: string
  role: UserRole
  role_label: string
  status: UserStatus
  status_label: string
  can_create_orders: boolean
  is_admin: boolean
  created_at: string
}

/** Shape returned by AuthResource (login response data). */
export interface AuthTokenData {
  token: string
  token_type: string
  user: AuthUser
}

/** Payload sent to POST /api/v1/auth/login. */
export interface LoginPayload {
  mobile_number: string
  password: string
}
