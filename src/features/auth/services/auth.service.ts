import { httpClient } from '@/lib/axios'
import type { ApiResponse } from '@/types'

import type { AuthTokenData, AuthUser, LoginPayload } from '../types'

export const authService = {
  /**
   * Authenticate with mobile number and password.
   * Returns the bearer token and authenticated user profile.
   */
  login: async (payload: LoginPayload): Promise<AuthTokenData> => {
    const { data } = await httpClient.post<ApiResponse<AuthTokenData>>(
      '/v1/auth/login',
      payload,
    )
    return data.data
  },

  /**
   * Revoke the current bearer token (device-level logout).
   */
  logout: async (): Promise<void> => {
    await httpClient.post('/v1/auth/logout')
  },

  /**
   * Fetch the currently authenticated user's profile.
   * Used to validate a stored token on app startup.
   */
  me: async (): Promise<AuthUser> => {
    const { data } = await httpClient.get<ApiResponse<AuthUser>>('/v1/auth/me')
    return data.data
  },
}
