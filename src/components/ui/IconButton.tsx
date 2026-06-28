import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  icon: ReactNode
  /** Required for accessibility — describes the action (e.g. "Delete room"). */
  label: string
  variant?: 'default' | 'danger'
}

const VARIANT: Record<NonNullable<IconButtonProps['variant']>, string> = {
  default: 'text-muted hover:bg-surface hover:text-foreground',
  danger: 'text-muted hover:bg-error-bg hover:text-error',
}

/**
 * Compact icon-only button with an accessible label and consistent
 * hover/focus states. Used for row actions like delete and edit.
 */
export function IconButton({
  icon,
  label,
  variant = 'default',
  className = '',
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={[
        'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        VARIANT[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {icon}
    </button>
  )
}
