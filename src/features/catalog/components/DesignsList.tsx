import { LayoutIcon } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { StateMessage } from '@/components/ui/StateMessage'

import type { DesignListItem } from '../types'
import { DesignCard } from './DesignCard'

interface DesignsListProps {
  designs: DesignListItem[]
  /** Total matching the current filters (from the server), across all pages. */
  total: number
  isLoading: boolean
  isError: boolean
  hasFilters: boolean
  onRetry: () => void
  onDesignClick: (design: DesignListItem) => void
}

const SKELETON_COUNT = 6

/** The catalogue design list across all states (loading · error · empty · success). */
export function DesignsList({
  designs,
  total,
  isLoading,
  isError,
  hasFilters,
  onRetry,
  onDesignClick,
}: DesignsListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading designs">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <div key={i} className="h-[86px] animate-pulse rounded-2xl bg-card" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <StateMessage
        icon={<LayoutIcon size={40} />}
        title="Couldn't load designs"
        description="Something went wrong. Please try again."
        action={
          <Button onClick={onRetry} className="mt-2">
            Retry
          </Button>
        }
      />
    )
  }

  if (designs.length === 0) {
    return (
      <StateMessage
        icon={<LayoutIcon size={40} />}
        title={hasFilters ? 'No matching designs' : 'No designs yet'}
        description={
          hasFilters
            ? 'Try a different search or clear the company filter.'
            : 'Designs will appear here once they are added.'
        }
      />
    )
  }

  return (
    <div>
      <p className="mb-3 text-xs text-muted">
        {total} design{total !== 1 ? 's' : ''}
      </p>

      <div className="flex flex-col gap-3">
        {designs.map((design) => (
          <DesignCard key={design.id} design={design} onClick={onDesignClick} />
        ))}
      </div>
    </div>
  )
}
