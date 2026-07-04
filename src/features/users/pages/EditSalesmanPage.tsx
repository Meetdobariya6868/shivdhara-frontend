import { useNavigate, useParams } from 'react-router-dom'

import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/Button'
import { StateMessage } from '@/components/ui/StateMessage'
import { paths } from '@/routes/paths'

import { ProfileForm } from '../components/ProfileForm'
import { useSalesman } from '../hooks/useSalesman'
import { useUpdateSalesman } from '../hooks/useSalesmanActions'
import type { Salesman } from '../types'
import { applyProfileFormErrors } from '../utils/profileFormErrors'

/**
 * Admin-only edit form for a salesman's profile (name + mobile). Fetches the
 * salesman first, then hands a loaded record to the inner form so it can seed
 * its defaults synchronously. Permission and account-status controls live on
 * the detail screen — this form intentionally covers profile only.
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

function EditSalesmanForm({
  salesman,
  onBack,
}: {
  salesman: Salesman
  onBack: () => void
}) {
  const navigate = useNavigate()
  const mutation = useUpdateSalesman()

  return (
    <div className="mx-auto max-w-2xl pb-24">
      <PageHeader title="Edit salesman" onBack={onBack} />

      <ProfileForm
        defaultValues={{ name: salesman.name, mobile_number: salesman.mobile_number }}
        submitLabel="Save changes"
        isSubmitting={mutation.isPending}
        onSubmit={(values, helpers) => {
          mutation.mutate(
            {
              id: salesman.id,
              payload: { name: values.name.trim(), mobile_number: values.mobile_number },
            },
            {
              onSuccess: () => {
                void navigate(paths.salesmanDetail(salesman.id))
              },
              onError: (error) => applyProfileFormErrors(error, helpers),
            },
          )
        }}
      />
    </div>
  )
}
