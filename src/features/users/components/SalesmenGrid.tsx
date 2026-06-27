import { Button } from '@/components/ui/Button'
import { StateMessage } from '@/components/ui/StateMessage'

import type { Salesman } from '../types'
import { SalesmanCard } from './SalesmanCard'
import { SalesmanCardSkeleton } from './SalesmanCardSkeleton'

interface SalesmenGridProps {
  salesmen: Salesman[]
  isLoading: boolean
  isError: boolean
  searchActive: boolean
  onRetry: () => void
  onCardClick?: (salesman: Salesman) => void
}

const SKELETON_COUNT = 6

/**
 * Renders the salesman grid across all UI states:
 *   loading → skeletons · error → retry · empty → message · success → cards
 */
export function SalesmenGrid({
  salesmen,
  isLoading,
  isError,
  searchActive,
  onRetry,
  onCardClick,
}: SalesmenGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <SalesmanCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <StateMessage
        title="Couldn't load salesmen"
        description="Something went wrong while fetching the list. Please try again."
        action={
          <Button onClick={onRetry} className="mt-2">
            Retry
          </Button>
        }
      />
    )
  }

  if (salesmen.length === 0) {
    return (
      <StateMessage
        title={searchActive ? 'No matches found' : 'No salesmen yet'}
        description={
          searchActive
            ? 'Try a different name or mobile number.'
            : 'Salesmen you add will appear here.'
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {salesmen.map((salesman) => (
        <SalesmanCard
          key={salesman.id}
          salesman={salesman}
          onClick={onCardClick}
        />
      ))}
    </div>
  )
}
