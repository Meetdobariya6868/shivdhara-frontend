import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { EyeIcon, EyeOffIcon, LockIcon, PhoneIcon } from '@/components/icons'
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
        leftIcon={<PhoneIcon size={18} />}
        error={errors.mobile_number?.message}
        aria-label="Mobile number"
      />

      {/* Password */}
      <Input
        {...register('password')}
        type={showPassword ? 'text' : 'password'}
        placeholder="Password"
        autoComplete="current-password"
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
