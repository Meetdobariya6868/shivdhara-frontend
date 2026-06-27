import { forwardRef } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: ReactNode
  rightElement?: ReactNode
}

/**
 * Styled text / tel / password input with optional icon slots.
 *
 * - `leftIcon`     — icon rendered inside the left edge (phone, lock, …).
 * - `rightElement` — interactive element on the right (eye toggle, clear).
 * - `error`        — validation message shown below the input in red.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightElement, id, className = '', ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    const errorId = inputId ? `${inputId}-error` : undefined

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-4 text-gray-400"
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? errorId : undefined}
            className={[
              'w-full rounded-2xl bg-surface py-4 text-sm text-gray-900',
              'placeholder:text-gray-400',
              'border border-transparent',
              'transition-colors duration-150',
              'focus:border-brand-400 focus:bg-white focus:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-60',
              error ? 'border-error' : '',
              leftIcon ? 'pl-11' : 'pl-4',
              rightElement ? 'pr-11' : 'pr-4',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          />

          {rightElement && (
            <span className="absolute right-3 flex items-center">
              {rightElement}
            </span>
          )}
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

Input.displayName = 'Input'
