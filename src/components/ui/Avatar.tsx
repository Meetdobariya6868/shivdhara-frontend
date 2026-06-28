import type { ReactNode } from 'react'

import { EditIcon } from '@/components/icons'

// ── Types ──────────────────────────────────────────────────────────────────────

export type AvatarSize = 'sm' | 'md' | 'lg'
export type AvatarTone = 'dark' | 'accent'

export interface AvatarProps {
  /** Display name — its first letter becomes the initial. Ignored when `icon` is set. */
  name?: string
  /** Custom glyph (e.g. <UserIcon />) shown instead of an initial. */
  icon?: ReactNode
  /** sm = 48px (header) · md = 64px (cards) · lg = 144px (profile). */
  size?: AvatarSize
  /** dark = neutral avatar token · accent = brand green. */
  tone?: AvatarTone
  /** Adds a contrasting ring (used on overlapping card avatars). */
  ring?: boolean
  /** When provided, renders an edit badge that calls this on click. */
  onEdit?: () => void
  className?: string
}

// ── Size + tone maps (token-only, no hardcoded values) ──────────────────────────

const SIZE: Record<AvatarSize, { box: string; text: string; badge: string; pen: number }> = {
  sm: { box: 'h-12 w-12', text: 'text-lg font-semibold',  badge: 'h-6 w-6',   pen: 12 },
  md: { box: 'h-16 w-16', text: 'text-2xl font-semibold', badge: 'h-7 w-7',   pen: 14 },
  lg: { box: 'h-36 w-36', text: 'text-5xl font-bold',     badge: 'h-10 w-10', pen: 16 },
}

const TONE: Record<AvatarTone, string> = {
  dark:   'bg-avatar-bg text-avatar-fg',
  accent: 'bg-brand-400 text-white',
}

// ── Component ──────────────────────────────────────────────────────────────────

/**
 * Circular user avatar showing an initial or a fallback icon.
 * Single source of truth for the avatar pattern across the app
 * (greeting header, salesman cards, profile screen).
 */
export function Avatar({
  name,
  icon,
  size = 'md',
  tone = 'dark',
  ring = false,
  onEdit,
  className = '',
}: AvatarProps) {
  const s = SIZE[size]
  const initial = name?.charAt(0).toUpperCase() ?? '?'

  return (
    <div className={['relative inline-flex', className].filter(Boolean).join(' ')}>
      {/* Visual circle — decorative; the name is always shown as text nearby. */}
      <span
        aria-hidden="true"
        className={[
          'flex shrink-0 select-none items-center justify-center rounded-full',
          s.box,
          TONE[tone],
          ring ? 'ring-2 ring-background' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {icon ?? <span className={s.text}>{initial}</span>}
      </span>

      {/* Optional edit badge */}
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit profile photo"
          className={[
            'absolute bottom-1 right-1 flex items-center justify-center rounded-full',
            s.badge,
            'bg-muted/30 text-foreground shadow-sm backdrop-blur-sm',
            'transition-colors hover:bg-muted/50',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          ].join(' ')}
        >
          <EditIcon size={s.pen} />
        </button>
      )}
    </div>
  )
}
