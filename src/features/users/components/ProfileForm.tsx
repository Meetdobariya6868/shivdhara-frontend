import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { PhoneIcon, UserIcon } from '@/components/icons'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

// ── Validation schema (mirrors the backend name + mobile rules) ───────────────

const schema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(120, 'Name must be at most 120 characters'),
  mobile_number: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
})

export type ProfileFormValues = z.infer<typeof schema>

export interface ProfileFormHelpers {
  /** Attach a server-side validation message to a specific field. */
  setFieldError: (field: keyof ProfileFormValues, message: string) => void
  /** Show a general (non-field) error above the form. */
  setGeneralError: (message: string) => void
}

interface ProfileFormProps {
  defaultValues: ProfileFormValues
  submitLabel: string
  isSubmitting: boolean
  onSubmit: (values: ProfileFormValues, helpers: ProfileFormHelpers) => void
}

/**
 * Reusable name + mobile form, shared by the admin "edit salesman" screen and
 * the self-service "edit profile" screen. It owns validation and error display;
 * the caller wires the mutation, success navigation, and (via helpers) mapping
 * of server-side errors back onto the fields.
 */
export function ProfileForm({
  defaultValues,
  submitLabel,
  isSubmitting,
  onSubmit,
}: ProfileFormProps) {
  const [generalError, setGeneralError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const submit = (values: ProfileFormValues): void => {
    setGeneralError(null)
    onSubmit(values, {
      setFieldError: (field, message) => setError(field, { type: 'server', message }),
      setGeneralError: (message) => setGeneralError(message),
    })
  }

  return (
    <div className="mx-5 mt-5 rounded-2xl bg-card p-6 shadow-sm">
      {generalError && (
        <Alert
          variant="error"
          message={generalError}
          onDismiss={() => setGeneralError(null)}
          className="mb-4"
        />
      )}

      <form
        onSubmit={(e) => {
          void handleSubmit(submit)(e)
        }}
        noValidate
        className="flex flex-col gap-4"
      >
        <Input
          {...register('name')}
          type="text"
          label="Full Name"
          required
          placeholder="Enter full name"
          autoComplete="off"
          autoFocus
          leftIcon={<UserIcon size={18} />}
          error={errors.name?.message}
          aria-label="Full name"
        />

        <Input
          {...register('mobile_number')}
          type="tel"
          label="Mobile Number"
          required
          placeholder="Enter 10-digit mobile number"
          inputMode="numeric"
          maxLength={10}
          autoComplete="off"
          leftIcon={<PhoneIcon size={18} />}
          error={errors.mobile_number?.message}
          aria-label="Mobile number"
        />

        <div className="mt-2">
          <Button type="submit" isLoading={isSubmitting} disabled={!isDirty} fullWidth>
            {submitLabel}
          </Button>
        </div>
      </form>
    </div>
  )
}
