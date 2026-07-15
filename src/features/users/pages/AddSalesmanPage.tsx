import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { EyeIcon, EyeOffIcon, LockIcon, PhoneIcon, UserIcon } from '@/components/icons'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

import { useCreateSalesman } from '../hooks/useCreateSalesman'
import type { CreateSalesmanPayload } from '../types'

// ── Validation schema (mirrors StoreUserRequest rules) ────────────────────────

const schema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(120, 'Name must be at most 120 characters'),
  mobile_number: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AddSalesmanPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [successName, setSuccessName] = useState<string | null>(null)

  const mutation = useCreateSalesman()

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', mobile_number: '', password: '' },
  })

  const onSubmit = (data: FormData): void => {
    setGeneralError(null)
    setSuccessName(null)

    const payload: CreateSalesmanPayload = {
      name:          data.name.trim(),
      mobile_number: data.mobile_number,
      password:      data.password,
    }

    mutation.mutate(payload, {
      onSuccess: () => {
        setSuccessName(payload.name)
        reset()
      },
      onError: (error) => {
        const responseData = error.response?.data
        const status = error.response?.status

        if (status === 422 && responseData?.errors) {
          Object.entries(responseData.errors).forEach(([field, messages]) => {
            setError(field as keyof FormData, {
              type: 'server',
              message: messages[0],
            })
          })
        } else {
          setGeneralError(
            responseData?.message ?? 'Something went wrong. Please try again.',
          )
        }
      },
    })
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col">
      {/* Page header */}
      <div className="px-5 pt-6 pb-2">
        <h1 className="text-xl font-bold text-foreground">Add Salesman</h1>
        <p className="mt-1 text-sm text-muted">
          Create a new salesman account for your team.
        </p>
      </div>

      {/* Form card */}
      <div className="mx-5 mt-5 rounded-2xl bg-card p-6 shadow-sm">
        {successName && (
          <Alert
            variant="success"
            message={<>Salesman <strong>{successName}</strong> created successfully.</>}
            onDismiss={() => setSuccessName(null)}
            className="mb-4"
          />
        )}

        {generalError && (
          <Alert
            variant="error"
            message={generalError}
            onDismiss={() => setGeneralError(null)}
            className="mb-4"
          />
        )}

        <form
          onSubmit={(e) => { void handleSubmit(onSubmit)(e) }}
          noValidate
          className="flex flex-col gap-4"
        >
          {/* Name */}
          <Input
            {...register('name')}
            type="text"
            label="Full Name"
            required
            placeholder="Enter salesman name"
            autoComplete="off"
            autoFocus
            leftIcon={<UserIcon size={18} />}
            error={errors.name?.message}
            aria-label="Salesman full name"
          />

          {/* Mobile number */}
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

          {/* Password */}
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            label="Password"
            required
            placeholder="Minimum 6 characters"
            autoComplete="new-password"
            leftIcon={<LockIcon size={18} />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-muted hover:text-foreground focus-visible:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
              </button>
            }
            error={errors.password?.message}
            aria-label="Password"
          />

          {/* Submit */}
          <div className="mt-2">
            <Button
              type="submit"
              isLoading={mutation.isPending}
              fullWidth
            >
              Create Salesman
            </Button>
          </div>
        </form>
      </div>

      {/* Bottom padding so content clears the fixed nav bar */}
      <div className="h-24" />
    </div>
  )
}
