import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { useAuthStore } from '@/features/auth/store/auth.store'
import type { AuthUser } from '@/features/auth/types'
import type { ApiError, ApiResponse } from '@/types'

import { profileService } from '../services/profile.service'
import type { UpdateProfilePayload } from '../types'

/**
 * Update the authenticated user's own profile. On success the auth store is
 * refreshed with the returned user, so the greeting header, avatar and profile
 * screen reflect the change immediately (no refetch needed).
 */
export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation<ApiResponse<AuthUser>, AxiosError<ApiError>, UpdateProfilePayload>({
    mutationFn: (payload) => profileService.update(payload),
    onSuccess: (res) => setUser(res.data),
  })
}
