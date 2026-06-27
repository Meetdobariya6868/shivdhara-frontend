import type { ReactNode } from 'react'

interface StateMessageProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

/**
 * Centered message block for empty / error / no-results states.
 * Keeps these states visually consistent across every list screen.
 */
export function StateMessage({
  icon,
  title,
  description,
  action,
}: StateMessageProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center"
    >
      {icon && <div className="text-muted">{icon}</div>}
      <p className="text-base font-semibold text-foreground">{title}</p>
      {description && (
        <p className="max-w-xs text-sm text-muted">{description}</p>
      )}
      {action}
    </div>
  )
}
