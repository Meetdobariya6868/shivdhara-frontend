import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { SearchIcon, SpinnerIcon } from '@/components/icons'
import { RequiredMark } from '@/components/ui/RequiredMark'

interface ComboboxProps<T> {
  label?: string
  error?: string
  /** Show a red asterisk on the label and mark the control as required. */
  required?: boolean
  placeholder?: string
  /** Controlled text in the input. */
  value: string
  /** Fired on every keystroke (drives the debounced search upstream). */
  onInputChange: (value: string) => void
  /** Current result set to render. */
  options: readonly T[]
  /** Stable key per option (e.g. its id). */
  getOptionKey: (option: T) => string | number
  /** Row content for an option. */
  renderOption: (option: T) => ReactNode
  /** Fired when an option is chosen (click or Enter). */
  onSelect: (option: T) => void

  // ── Async states (mutually exclusive in priority order) ──
  isLoading?: boolean
  isError?: boolean
  /** User typed something but not enough to trigger a search. */
  isTooShort?: boolean
  /** Term is long enough to expect results — keeps the panel open through empty. */
  isSearchable?: boolean
  tooShortHint?: string
  emptyHint?: string
  errorHint?: string

  disabled?: boolean
  id?: string
}

interface PanelCoords {
  top: number
  left: number
  width: number
}

const SKELETON_ROWS = 4

/**
 * Async autocomplete combobox: a text input whose results render in a
 * portal-mounted panel (never clipped by a scrollable Modal body).
 *
 * The parent owns the query text and the result set + async flags; this
 * component owns only open/active-row UI state. Surfaces all five data states
 * inline — too-short, loading skeleton, error, empty, and results — and is
 * keyboard accessible (Down/Up move, Enter selects, Escape closes) and
 * closes on outside click.
 */
export function Combobox<T>({
  label,
  error,
  required = false,
  placeholder = 'Search…',
  value,
  onInputChange,
  options,
  getOptionKey,
  renderOption,
  onSelect,
  isLoading = false,
  isError = false,
  isTooShort = false,
  isSearchable = false,
  tooShortHint = 'Keep typing to search…',
  emptyHint = 'No matches found',
  errorHint = 'Could not load results. Try again.',
  disabled = false,
  id,
}: ComboboxProps<T>) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const errorId = `${fieldId}-error`
  const listId = `${fieldId}-list`

  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<PanelCoords | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const hasOptions = options.length > 0

  // Reset the highlighted row whenever the result set changes — done during
  // render (not in an effect) per React's "adjust state on prop change" guidance.
  const [prevOptions, setPrevOptions] = useState(options)
  if (options !== prevOptions) {
    setPrevOptions(options)
    setActiveIndex(0)
  }

  const updateCoords = useCallback(() => {
    const el = inputRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setCoords({ top: rect.bottom + 4, left: rect.left, width: rect.width })
  }, [])

  const openPanel = useCallback(() => {
    if (disabled) return
    updateCoords()
    setOpen(true)
  }, [disabled, updateCoords])

  const close = () => setOpen(false)

  const select = (index: number) => {
    const option = options[index]
    if (!option) return
    onSelect(option)
    close()
  }

  // Reposition + outside-click + capture-phase Escape while open.
  useEffect(() => {
    if (!open) return

    const reposition = () => updateCoords()
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (inputRef.current?.contains(target) || panelRef.current?.contains(target)) return
      close()
    }
    document.addEventListener('mousedown', onPointerDown)

    // Capture Escape so it closes only the dropdown, not a parent Modal.
    const onEscapeCapture = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        close()
      }
    }
    document.addEventListener('keydown', onEscapeCapture, true)

    return () => {
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onEscapeCapture, true)
    }
  }, [open, updateCoords])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault()
      openPanel()
      return
    }
    if (!open) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (hasOptions) setActiveIndex((i) => Math.min(i + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (hasOptions) setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      // Only swallow Enter when we can act on it, so the form still submits
      // normally when the panel has no selectable row.
      if (hasOptions) {
        e.preventDefault()
        select(activeIndex)
      }
    }
  }

  const activeOptionId = hasOptions ? `${fieldId}-opt-${activeIndex}` : undefined
  const showPanel = open && (isTooShort || isLoading || isError || hasOptions || isSearchable)

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
          {label}
          {required && <RequiredMark />}
        </label>
      )}

      <div className="relative flex items-center">
        <span aria-hidden="true" className="pointer-events-none absolute left-4 text-muted">
          {isLoading ? <SpinnerIcon size={18} /> : <SearchIcon size={18} />}
        </span>

        <input
          ref={inputRef}
          id={fieldId}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={showPanel}
          aria-controls={showPanel ? listId : undefined}
          aria-activedescendant={open ? activeOptionId : undefined}
          aria-required={required || undefined}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onInputChange(e.target.value)
            if (!open) openPanel()
          }}
          onFocus={openPanel}
          onKeyDown={onKeyDown}
          className={[
            'w-full rounded-2xl bg-surface py-4 pl-11 pr-4 text-sm text-surface-foreground',
            'placeholder:text-muted border border-transparent transition-colors duration-150',
            'focus:border-ring focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-60',
            error ? 'border-error' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        />
      </div>

      {error && (
        <p id={errorId} role="alert" className="text-xs text-error">
          {error}
        </p>
      )}

      {showPanel &&
        coords &&
        createPortal(
          <div
            ref={panelRef}
            id={listId}
            role="listbox"
            style={{ top: coords.top, left: coords.left, width: coords.width }}
            className="fixed z-[60] max-h-72 overflow-y-auto rounded-2xl border border-border bg-card p-1 shadow-2xl"
          >
            {isTooShort ? (
              <p className="px-3 py-3 text-sm text-muted">{tooShortHint}</p>
            ) : isLoading && !hasOptions ? (
              <ul aria-hidden="true" className="flex flex-col gap-1">
                {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <li key={i} className="flex flex-col gap-2 rounded-xl px-3 py-2.5">
                    <span className="h-3.5 w-2/3 animate-pulse rounded bg-surface" />
                    <span className="h-3 w-1/2 animate-pulse rounded bg-surface" />
                  </li>
                ))}
              </ul>
            ) : isError && !hasOptions ? (
              <p role="alert" className="px-3 py-3 text-sm text-error">
                {errorHint}
              </p>
            ) : !hasOptions ? (
              <p className="px-3 py-3 text-sm text-muted">{emptyHint}</p>
            ) : (
              options.map((option, index) => {
                const isActive = index === activeIndex
                return (
                  <button
                    key={getOptionKey(option)}
                    id={`${fieldId}-opt-${index}`}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => select(index)}
                    className={[
                      'flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
                      isActive ? 'bg-primary text-primary-foreground' : 'text-card-foreground',
                    ].join(' ')}
                  >
                    {renderOption(option)}
                  </button>
                )
              })
            )}
          </div>,
          document.body,
        )}
    </div>
  )
}
