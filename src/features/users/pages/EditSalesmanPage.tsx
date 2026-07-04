import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'

import { PageHeader } from '@/components/PageHeader'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { StateMessage } from '@/components/ui/StateMessage'
import { paths } from '@/routes/paths'

import { useSalesman } from '../hooks/useSalesman'
import { useUpdateSalesman } from '../hooks/useSalesmanActions'
import type { Salesman, UpdateSalesmanPayload } from '../types'

// ── Validation schema (mirrors UpdateUserRequest rules) ───────────────────────

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

type FormData = z.infer<typeof schema>

// ── Inline icons (match the Add Salesman form) ────────────────────────────────

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

// ── Page (fetch wrapper) ──────────────────────────────────────────────────────

/**
 * Admin-only edit form for a salesman's profile (name + mobile). Fetches the
 * salesman first, then hands a loaded record to the inner form so react-hook-form
 * seeds its defaults synchronously. The permission and account-status controls
 * live on the detail screen — this form intentionally covers profile only.
 */
export default function EditSalesmanPage() {
  const navigate = useNavigate()
  const { salesmanId } = useParams<{ salesmanId: string }>()
  const id = Number(salesmanId)

  const { data, isLoading, isError, refetch } = useSalesman(id)
  const salesman = data?.data

  const goBack = (): void => {
    void navigate(-1)
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Edit salesman" onBack={goBack} />
        <div
          className="mx-5 mt-5 flex flex-col gap-4 rounded-2xl bg-card p-6 shadow-sm"
          aria-busy="true"
          aria-label="Loading salesman"
        >
          <div className="h-14 animate-pulse rounded-xl bg-surface" />
          <div className="h-14 animate-pulse rounded-xl bg-surface" />
          <div className="h-12 animate-pulse rounded-xl bg-surface" />
        </div>
      </div>
    )
  }

  if (isError || !salesman) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Edit salesman" onBack={goBack} />
        <StateMessage
          title="Couldn't load this salesman"
          description="Something went wrong. Please try again."
          action={
            <Button onClick={() => void refetch()} className="mt-2">
              Retry
            </Button>
          }
        />
      </div>
    )
  }

  return <EditSalesmanForm salesman={salesman} onBack={goBack} />
}

// ── Inner form (receives a loaded salesman) ───────────────────────────────────

function EditSalesmanForm({
  salesman,
  onBack,
}: {
  salesman: Salesman
  onBack: () => void
}) {
  const navigate = useNavigate()
  const [generalError, setGeneralError] = useState<string | null>(null)

  const mutation = useUpdateSalesman()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: salesman.name,
      mobile_number: salesman.mobile_number,
    },
  })

  const onSubmit = (formData: FormData): void => {
    setGeneralError(null)

    const payload: UpdateSalesmanPayload = {
      name: formData.name.trim(),
      mobile_number: formData.mobile_number,
    }

    mutation.mutate(
      { id: salesman.id, payload },
      {
        onSuccess: () => {
          void navigate(paths.salesmanDetail(salesman.id))
        },
        onError: (error) => {
          const responseData = error.response?.data
          const status = error.response?.status

          if (status === 422 && responseData?.errors) {
            Object.entries(responseData.errors).forEach(([field, messages]) => {
              if (field === 'name' || field === 'mobile_number') {
                setError(field, { type: 'server', message: messages[0] })
              }
            })
          } else {
            setGeneralError(
              responseData?.message ?? 'Something went wrong. Please try again.',
            )
          }
        },
      },
    )
  }

  return (
    <div className="mx-auto max-w-2xl pb-24">
      <PageHeader title="Edit salesman" onBack={onBack} />

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
            void handleSubmit(onSubmit)(e)
          }}
          noValidate
          className="flex flex-col gap-4"
        >
          <Input
            {...register('name')}
            type="text"
            label="Full Name"
            placeholder="Enter salesman name"
            autoComplete="off"
            autoFocus
            leftIcon={<PersonIcon />}
            error={errors.name?.message}
            aria-label="Salesman full name"
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
            <Button
              type="submit"
              isLoading={mutation.isPending}
              disabled={!isDirty}
              fullWidth
            >
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
