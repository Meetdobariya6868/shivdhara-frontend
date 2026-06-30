import type { ReactNode } from 'react'

interface DetailRowProps {
  label: string
  value: ReactNode
  /** Render the value larger/bolder (e.g. a grand total). */
  emphasize?: boolean
}

/**
 * A label/value row for detail screens — label on the left, value on the right.
 * Token-only styling so it adapts to light/dark themes.
 */
export function DetailRow({ label, value, emphasize = false }: DetailRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm text-muted">{label}</span>
      <span
        className={[
          'text-right tabular-nums text-foreground',
          emphasize ? 'text-base font-bold' : 'text-sm font-semibold',
        ].join(' ')}
      >
        {value}
      </span>
    </div>
  )
}
