import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { paths } from '@/routes/paths'

import { useLogin } from '../hooks/useLogin'

// ── Validation schema ─────────────────────────────────────────────────────────

const loginSchema = z.object({
  mobile_number: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

// ── Inline icons ──────────────────────────────────────────────────────────────

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 15.8a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 5h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 12.4a16 16 0 0 0 6.29 6.29l1.77-1.77a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 18.92z" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function LoginForm() {
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const [showPassword, setShowPassword] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { mobile_number: '', password: '' },
  })

  const onSubmit = (data: LoginFormData): void => {
    setGeneralError(null)

    loginMutation.mutate(data, {
      onSuccess: () => {
        void navigate(paths.dashboard, { replace: true })
      },
      onError: (error) => {
        const responseData = error.response?.data
        const status = error.response?.status

        if (status === 422 && responseData?.errors) {
          // Field-level validation errors from backend
          Object.entries(responseData.errors).forEach(([field, messages]) => {
            setError(field as keyof LoginFormData, {
              type: 'server',
              message: messages[0],
            })
          })
        } else {
          // General errors: 401 wrong credentials, 403 blocked, 429 rate limit
          setGeneralError(
            responseData?.message ?? 'Something went wrong. Please try again.',
          )
        }
      },
    })
  }

  return (
    <form
      onSubmit={(e) => { void handleSubmit(onSubmit)(e) }}
      noValidate
      className="flex w-full flex-col gap-4"
    >
      {generalError && (
        <Alert variant="error" message={generalError} />
      )}

      {/* Mobile number */}
      <Input
        {...register('mobile_number')}
        type="tel"
        placeholder="Mobile Number"
        inputMode="numeric"
        maxLength={10}
        autoComplete="tel"
        autoFocus
        leftIcon={<PhoneIcon />}
        error={errors.mobile_number?.message}
        aria-label="Mobile number"
      />

      {/* Password */}
      <Input
        {...register('password')}
        type={showPassword ? 'text' : 'password'}
        placeholder="Password"
        autoComplete="current-password"
        leftIcon={<LockIcon />}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-muted hover:text-foreground focus-visible:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        }
        error={errors.password?.message}
        aria-label="Password"
      />

      {/* Submit */}
      <div className="mt-2 flex justify-center">
        <Button
          type="submit"
          isLoading={loginMutation.isPending}
          className="min-w-36"
        >
          Sign In
        </Button>
      </div>
    </form>
  )
}
