import { Navigate, useNavigate } from 'react-router-dom'

import { PageHeader } from '@/components/PageHeader'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { ProfileForm } from '@/features/users/components/ProfileForm'
import { applyProfileFormErrors } from '@/features/users/utils/profileFormErrors'
import { paths } from '@/routes/paths'

import { useUpdateProfile } from '../hooks/useUpdateProfile'

/**
 * Self-service "Edit Profile" screen for both admins and salesmen. Seeds the
 * shared ProfileForm from the authenticated user and updates their own name +
 * mobile via PUT /v1/profile; the auth store is refreshed on success.
 */
export default function EditProfilePage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const mutation = useUpdateProfile()

  // AuthGuard guarantees a user; this is a defensive fallback for type-safety.
  if (!user) {
    return <Navigate to={paths.dashboard} replace />
  }

  return (
    <div className="mx-auto max-w-2xl pb-24">
      <PageHeader title="Edit Profile" onBack={() => void navigate(-1)} />

      <ProfileForm
        defaultValues={{ name: user.name, mobile_number: user.mobile_number }}
        submitLabel="Save changes"
        isSubmitting={mutation.isPending}
        onSubmit={(values, helpers) => {
          mutation.mutate(
            { name: values.name.trim(), mobile_number: values.mobile_number },
            {
              onSuccess: () => {
                void navigate(paths.profile)
              },
              onError: (error) => applyProfileFormErrors(error, helpers),
            },
          )
        }}
      />
    </div>
  )
}
