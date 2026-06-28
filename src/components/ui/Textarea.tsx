import { forwardRef } from 'react'
import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

/**
 * Styled multi-line text input matching the app's input design.
 * Works with React Hook Form `register` via the forwarded ref.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className = '', rows = 3, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    const errorId = textareaId ? `${textareaId}-error` : undefined

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          className={[
            'w-full resize-y rounded-2xl bg-surface px-4 py-3 text-sm text-surface-foreground',
            'placeholder:text-muted',
            'border border-transparent transition-colors duration-150',
            'focus:border-ring focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-60',
            error ? 'border-error' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />

        {error && (
          <p id={errorId} role="alert" className="text-xs text-error">
            {error}
          </p>
        )}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
