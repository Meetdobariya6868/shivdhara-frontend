import type { ReactNode } from 'react'

import { SpinnerIcon } from '@/components/icons'

export interface MenuListItemProps {
  /** Leading glyph (a central icon component instance). */
  icon: ReactNode
  label: string
  onClick?: () => void
  /** Swaps the icon for a spinner and disables the row. */
  isLoading?: boolean
  disabled?: boolean
}

/**
 * Full-width tappable row used for settings / profile menus.
 * Icon on the left, label on the right; consistent hover, active,
 * focus and disabled states across every screen that lists options.
 */
export function MenuListItem({
  icon,
  label,
  onClick,
  isLoading = false,
  disabled = false,
}: MenuListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className="flex w-full items-center gap-4 rounded-2xl bg-card px-5 py-[18px] text-left text-card-foreground
        transition-opacity hover:opacity-80 active:opacity-60
        disabled:cursor-not-allowed disabled:opacity-60
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <span className="shrink-0">{isLoading ? <SpinnerIcon /> : icon}</span>
      <span className="text-base font-medium">{label}</span>
    </button>
  )
}
