import type { AxiosError } from 'axios'

import type { ApiError } from '@/types'

import type { ProfileFormHelpers } from '../components/ProfileForm'

/**
 * Map an API error onto a profile form: 422 field errors are attached to the
 * matching field; anything else becomes a general error. Shared by the
 * "edit salesman" and "edit profile" screens.
 */
export function applyProfileFormErrors(
  error: AxiosError<ApiError>,
  helpers: ProfileFormHelpers,
): void {
  const data = error.response?.data

  if (error.response?.status === 422 && data?.errors) {
    for (const [field, messages] of Object.entries(data.errors)) {
      if (field === 'name' || field === 'mobile_number') {
        helpers.setFieldError(field, messages[0])
      }
    }
  } else {
    helpers.setGeneralError(data?.message ?? 'Something went wrong. Please try again.')
  }
}
