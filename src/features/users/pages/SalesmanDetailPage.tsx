import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { UserIcon } from '@/components/icons'
import { PageHeader } from '@/components/PageHeader'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { SearchBar } from '@/components/ui/SearchBar'
import { StateMessage } from '@/components/ui/StateMessage'
import { useSalesmanOrders } from '@/features/orders/hooks/useOrder'
import type { Order } from '@/features/orders/types'
import { paths } from '@/routes/paths'

import { SalesmanOrdersList } from '../components/SalesmanOrdersList'
import { useSalesman } from '../hooks/useSalesman'

/** Filter orders by customer name or contact (case-insensitive). */
function filterByCustomer(orders: Order[], search: string): Order[] {
  const q = search.trim().toLowerCase()
  if (!q) return orders
  return orders.filter(
    (o) =>
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.contact.toLowerCase().includes(q),
  )
}

export default function SalesmanDetailPage() {
  const navigate = useNavigate()
  const { salesmanId } = useParams<{ salesmanId: string }>()
  const id = Number(salesmanId)

  const [search, setSearch] = useState('')

  const salesmanQuery = useSalesman(id)
  const ordersQuery = useSalesmanOrders(id)

  const salesman = salesmanQuery.data?.data
  const allOrders = useMemo(() => ordersQuery.data?.data ?? [], [ordersQuery.data])
  const orders = useMemo(() => filterByCustomer(allOrders, search), [allOrders, search])

  // The header count comes from the dedicated endpoint; fall back to the list.
  const totalOrders = salesman?.orders_count ?? allOrders.length

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

        {/* Search */}
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search order by customer name or number"
        />

        {/* Orders */}
        <SalesmanOrdersList
          orders={orders}
          isLoading={ordersQuery.isLoading}
          isError={ordersQuery.isError}
          searchActive={search.trim().length > 0}
          onRetry={() => void ordersQuery.refetch()}
          onOrderClick={(order) => {
            void navigate(paths.orderDetail(order.id))
          }}
        />
      </div>
    </div>
  )
}
