import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/ui/SearchBar'
import { paths } from '@/routes/paths'

import { SalesmenGrid } from '../components/SalesmenGrid'
import { useSalesmen } from '../hooks/useSalesmen'
import { filterSalesmen } from '../utils/filterSalesmen'

/**
 * Salesman management screen ("Manage salesman" tab) — a page header, search,
 * and a grid of salesman cards.
 *
 * The roster is fetched once (useSalesmen) and filtered entirely in-memory,
 * so typing in the search box is instant and never hits the network.
 */
export default function SalesmenHomePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const { data, isLoading, isError, refetch } = useSalesmen()

  const salesmen = useMemo(
    () => filterSalesmen(data?.data ?? [], search),
    [data, search],
  )

  return (
    <div className="mx-auto flex max-w-2xl flex-col">
      <PageHeader title="Manage salesman" />

      <div className="px-5 pt-5 pb-6">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search salesmen"
        />

        <div className="mt-5">
          <SalesmenGrid
            salesmen={salesmen}
            isLoading={isLoading}
            isError={isError}
            searchActive={search.trim().length > 0}
            onRetry={() => void refetch()}
            onCardClick={(salesman) => {
              void navigate(paths.salesmanDetail(salesman.id))
            }}
          />
        </div>
      </div>
    </div>
  )
}
