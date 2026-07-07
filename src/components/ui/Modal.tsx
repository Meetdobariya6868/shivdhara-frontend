import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { XIcon } from '@/components/icons'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** Sticky footer area (e.g. action buttons). */
  footer?: ReactNode
  /** Max width tier. */
  size?: 'md' | 'lg' | 'xl'
}

const SIZE: Record<NonNullable<ModalProps['size']>, string> = {
  md: 'max-w-md',
  lg: 'max-w-xl',
  xl: 'max-w-4xl',
}

/**
 * Accessible centered dialog rendered in a portal.
 *
 * - Closes on backdrop click and Escape.
 * - Locks body scroll while open.
 * - Scrolls its own body when content overflows; never scrolls the page.
 * - Fully responsive: near-full-width on mobile, capped by `size` on larger screens.
 */
export function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Lock page scroll + close on Escape while open.
  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    panelRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 animate-fade-in"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={[
          'relative z-10 flex max-h-[90dvh] w-full flex-col rounded-3xl bg-background shadow-2xl outline-none',
          'animate-slide-up',
          SIZE[size],
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-muted transition-colors hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="shrink-0 border-t border-border px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
