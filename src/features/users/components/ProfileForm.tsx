import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

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
          placeholder="Enter full name"
          autoComplete="off"
          autoFocus
          leftIcon={<PersonIcon />}
          error={errors.name?.message}
          aria-label="Full name"
        />

        <Input
          {...register('mobile_number')}
          type="tel"
          label="Mobile Number"
          placeholder="Enter 10-digit mobile number"
          inputMode="numeric"
          maxLength={10}
          autoComplete="off"
          leftIcon={<PhoneIcon />}
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

// ── Inline icons ──────────────────────────────────────────────────────────────

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 15.8a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 5h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 12.4a16 16 0 0 0 6.29 6.29l1.77-1.77a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 18.92z" />
    </svg>
  )
}
