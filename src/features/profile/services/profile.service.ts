import type { AuthUser } from '@/features/auth/types'
import { httpClient } from '@/lib/axios'
import type { ApiResponse } from '@/types'

import type { UpdateProfilePayload } from '../types'

export const profileService = {
  /**
   * Update the authenticated user's own profile. The server acts on the current
   * user (never an id), so this is safe for any role.
   */
  update: async (payload: UpdateProfilePayload): Promise<ApiResponse<AuthUser>> => {
    const { data } = await httpClient.put<ApiResponse<AuthUser>>('/v1/profile', payload)
    return data
  },
}
