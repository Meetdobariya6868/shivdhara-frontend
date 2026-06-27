import { useMemo, useState } from 'react'

import { GreetingHeader } from '@/components/GreetingHeader'
import { SearchBar } from '@/components/ui/SearchBar'

import { SalesmenGrid } from '../components/SalesmenGrid'
import { useSalesmen } from '../hooks/useSalesmen'
import { filterSalesmen } from '../utils/filterSalesmen'

/**
 * Admin home screen — greeting header, search, and a grid of salesman cards.
 *
 * The roster is fetched once (useSalesmen) and filtered entirely in-memory,
 * so typing in the search box is instant and never hits the network.
 */
export default function SalesmenHomePage() {
  const [search, setSearch] = useState('')
  const { data, isLoading, isError, refetch } = useSalesmen()

  const salesmen = useMemo(
    () => filterSalesmen(data?.data ?? [], search),
    [data, search],
  )

  return (
    <div className="mx-auto flex max-w-2xl flex-col">
      <GreetingHeader />

      <div className="px-5 pb-6">
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
          />
        </div>
      </div>
    </div>
  )
}
