import { forwardRef } from 'react'
import type { ReactNode, SelectHTMLAttributes } from 'react'

import { ChevronDownIcon } from '@/components/icons'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  /** <option> elements. */
  children: ReactNode
}

/**
 * Styled wrapper around a native <select> — keeps full accessibility and form
 * compatibility (works with React Hook Form `register`) while matching the
 * app's input styling, with a custom chevron and optional label/error.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, className = '', children, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    const errorId = selectId ? `${selectId}-error` : undefined

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? errorId : undefined}
            className={[
              'w-full appearance-none rounded-2xl bg-surface py-4 pl-4 pr-11 text-sm text-surface-foreground',
              'border border-transparent transition-colors duration-150',
              'focus:border-ring focus:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-60',
              error ? 'border-error' : '',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          >
            {children}
          </select>

          <span className="pointer-events-none absolute right-4 text-muted">
            <ChevronDownIcon size={18} />
          </span>
        </div>

        {error && (
          <p id={errorId} role="alert" className="text-xs text-error">
            {error}
          </p>
        )}
      </div>
    )
  },
)

Select.displayName = 'Select'
