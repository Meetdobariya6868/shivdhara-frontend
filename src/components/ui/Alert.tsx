import type { ReactElement, ReactNode } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────────

export type AlertVariant = 'success' | 'error' | 'warning'

export interface AlertProps {
  /** Visual and semantic meaning of the alert. */
  variant: AlertVariant
  /** Main content — accepts a string or any JSX (e.g. bold salesman name). */
  message: ReactNode
  /** Optional bold heading rendered above the message. */
  title?: string
  /** When provided, shows a dismiss (×) button that calls this handler. */
  onDismiss?: () => void
  className?: string
}

// ── Icons ──────────────────────────────────────────────────────────────────────

function CheckCircleIcon() {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function XCircleIcon() {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}

function TriangleAlertIcon() {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

// ── Variant config ─────────────────────────────────────────────────────────────

type VariantConfig = {
  role: 'alert' | 'status'
  container: string
  text: string
  IconComponent: () => ReactElement
}

const VARIANT_CONFIG: Record<AlertVariant, VariantConfig> = {
  success: {
    role: 'status',
    container: 'border-success/30 bg-success/10',
    text: 'text-success',
    IconComponent: CheckCircleIcon,
  },
  error: {
    role: 'alert',
    container: 'border-error/30 bg-error-bg',
    text: 'text-error',
    IconComponent: XCircleIcon,
  },
  warning: {
    role: 'alert',
    container: 'border-warning/30 bg-warning/10',
    text: 'text-warning',
    IconComponent: TriangleAlertIcon,
  },
}

// ── Component ──────────────────────────────────────────────────────────────────

/**
 * Reusable feedback banner for success, error, and warning states.
 *
 * Usage:
 *   <Alert variant="success" message="Saved!" />
 *   <Alert variant="error" message={error} onDismiss={() => setError(null)} />
 *   <Alert variant="success" title="Done" message={<>Created <b>{name}</b></>} />
 */
export function Alert({ variant, message, title, onDismiss, className = '' }: AlertProps) {
  const { role, container, text, IconComponent } = VARIANT_CONFIG[variant]

  return (
    <div
      role={role}
      className={[
        'flex w-full items-start gap-3 rounded-xl border px-4 py-3',
        container,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Leading icon */}
      <span className={['mt-0.5 shrink-0', text].join(' ')}>
        <IconComponent />
      </span>

      {/* Text content */}
      <div className={['min-w-0 flex-1 text-sm', text].join(' ')}>
        {title && <p className="font-semibold">{title}</p>}
        <div className={title ? 'mt-0.5 opacity-90' : 'font-medium'}>{message}</div>
      </div>

      {/* Optional dismiss button */}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={[
            'shrink-0 opacity-60 transition-opacity',
            'hover:opacity-100',
            'focus-visible:outline-none focus-visible:opacity-100',
            text,
          ].join(' ')}
          aria-label="Dismiss"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  )
}
