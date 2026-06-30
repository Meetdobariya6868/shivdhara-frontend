import type { ReactNode } from 'react'

import { ChevronDownIcon } from '@/components/icons'

interface PageHeaderProps {
  title: string
  /** When provided, renders a back button on the left. */
  onBack?: () => void
  /** Optional trailing slot (e.g. a status badge or action). */
  right?: ReactNode
}

/**
 * Sticky top bar for detail screens: optional back button, centered title and
 * an optional trailing slot. Reused across the salesman- and order-detail pages.
 */
export function PageHeader({ title, onBack, right }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="shrink-0 rounded-full p-1 text-foreground transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronDownIcon size={22} className="rotate-90" />
        </button>
      )}

      <h1 className="min-w-0 flex-1 truncate text-lg font-bold text-foreground">{title}</h1>

      {right && <div className="shrink-0">{right}</div>}
    </header>
  )
}
