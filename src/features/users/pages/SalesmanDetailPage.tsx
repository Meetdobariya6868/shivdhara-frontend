import { useNavigate, useParams } from 'react-router-dom'

import { UserIcon } from '@/components/icons'
import { PageHeader } from '@/components/PageHeader'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { StateMessage } from '@/components/ui/StateMessage'

import { useSalesman } from '../hooks/useSalesman'

export default function SalesmanDetailPage() {
  const navigate = useNavigate()
  const { salesmanId } = useParams<{ salesmanId: string }>()
  const id = Number(salesmanId)

  const salesmanQuery = useSalesman(id)
  const salesman = salesmanQuery.data?.data
  const totalOrders = salesman?.orders_count ?? 0

  if (salesmanQuery.isError) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader
          title="Salesman"
          onBack={() => {
            void navigate(-1)
          }}
        />
        <StateMessage
          title="Couldn't load this salesman"
          description="Something went wrong. Please try again."
          action={
            <Button onClick={() => void salesmanQuery.refetch()} className="mt-2">
              Retry
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl pb-24">
      <PageHeader
        title={salesman?.name ?? 'Salesman'}
        onBack={() => {
          void navigate(-1)
        }}
      />

      <div className="flex flex-col gap-5 px-5 py-4">
        {/* Profile header */}
        <div className="flex items-center gap-4">
          <Avatar icon={<UserIcon size={28} />} size="md" ring />
          <div className="min-w-0 flex-1">
            {salesmanQuery.isLoading ? (
              <div className="h-5 w-32 animate-pulse rounded bg-card" />
            ) : (
              <p className="truncate text-lg font-bold text-foreground">{salesman?.name}</p>
            )}
            <p className="text-sm text-muted">
              {totalOrders} {totalOrders === 1 ? 'order' : 'orders'}
            </p>
          </div>
        </div>

        {/* Meta */}
        {salesman && (
          <div className="rounded-2xl bg-card px-4 py-3 text-sm">
            <p className="text-muted">
              Salesman ID: <span className="font-semibold text-card-foreground">{salesman.id}</span>
            </p>
            <p className="mt-1 text-muted">
              Contact No:{' '}
              <span className="font-semibold text-card-foreground">{salesman.mobile_number}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
