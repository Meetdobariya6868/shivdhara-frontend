import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import type { ApiError } from '@/types'

import { authService } from '../services/auth.service'
import { useAuthStore } from '../store/auth.store'
import type { AuthTokenData, LoginPayload } from '../types'

/**
 * Mutation hook for authenticating with mobile number and password.
 *
 * Responsibilities (separation of concerns):
 *   - This hook: calls the API, stores the token + user in auth store.
 *   - The calling component: handles navigation and UI error display.
 */
export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation<AuthTokenData, AxiosError<ApiError>, LoginPayload>({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.token, data.user)
    },
  })
}
