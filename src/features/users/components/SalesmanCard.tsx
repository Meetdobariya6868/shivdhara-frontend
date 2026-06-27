import { UserIcon } from '@/components/icons'

import type { Salesman } from '../types'

interface SalesmanCardProps {
  salesman: Salesman
  onClick?: (salesman: Salesman) => void
}

/**
 * Tile showing a salesman's avatar, name and mobile number.
 * Blocked salesmen are dimmed with a status pill for at-a-glance scanning.
 */
export function SalesmanCard({ salesman, onClick }: SalesmanCardProps) {
  const isBlocked = salesman.status === 'blocked'

  return (
    <button
      type="button"
      onClick={() => onClick?.(salesman)}
      className={[
        'flex flex-col items-center gap-3 rounded-2xl bg-card p-6 text-center',
        'shadow-sm transition-transform duration-150',
        'hover:-translate-y-0.5 active:scale-[0.98]',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        isBlocked ? 'opacity-60' : '',
      ].join(' ')}
      aria-label={`${salesman.name}, ${salesman.mobile_number}${isBlocked ? ', blocked' : ''}`}
    >
      {/* Avatar */}
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-avatar-bg text-avatar-fg ring-2 ring-background">
        <UserIcon size={32} />
      </span>

      {/* Name */}
      <span className="line-clamp-1 text-base font-semibold text-card-foreground">
        {salesman.name}
      </span>

      {/* Mobile */}
      <span className="text-sm text-muted">{salesman.mobile_number}</span>

      {isBlocked && (
        <span className="rounded-full bg-error-bg px-2 py-0.5 text-[10px] font-semibold text-error uppercase">
          Blocked
        </span>
      )}
    </button>
  )
}
