import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  isLoading?: boolean
  /** Style the confirm action as destructive (used for deletes). */
  destructive?: boolean
  /** Shown below the message when the last confirm attempt failed. */
  error?: string | null
  onConfirm: () => void
  onClose: () => void
}

/**
 * Reusable confirmation dialog built on Modal. Used for irreversible actions
 * such as deleting an order. The destructive variant renders an error-toned
 * confirm button (token-only) instead of the primary one.
 */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  destructive = false,
  error,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl px-5 py-3 text-sm font-semibold text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          >
            {cancelLabel}
          </button>

          {destructive ? (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              aria-busy={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-error px-8 py-3.5 text-sm font-semibold tracking-wide text-white transition-opacity hover:opacity-90 active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
            >
              {confirmLabel}
            </button>
          ) : (
            <Button onClick={onConfirm} isLoading={isLoading}>
              {confirmLabel}
            </Button>
          )}
        </div>
      }
    >
      <p className="text-sm text-muted">{message}</p>
      {error && (
        <p role="alert" className="mt-2 text-sm text-error">
          {error}
        </p>
      )}
    </Modal>
  )
}
