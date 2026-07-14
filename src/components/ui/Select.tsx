import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { ChevronDownIcon } from '@/components/icons'
import { RequiredMark } from '@/components/ui/RequiredMark'

export interface SelectOption<T extends string | number> {
  value: T
  label: string
}

interface SelectProps<T extends string | number> {
  label?: string
  error?: string
  placeholder?: string
  value: T | null
  onChange: (value: T) => void
  options: ReadonlyArray<SelectOption<T>>
  disabled?: boolean
  id?: string
  /** Show a red asterisk on the label and mark the control as required. */
  required?: boolean
}

interface PanelCoords {
  left: number
  width: number
  /** Max panel height, bounded to the available space so it never overflows the viewport. */
  maxHeight: number
  /** Set when the panel opens below the trigger. */
  top?: number
  /** Set when the panel flips open above the trigger (little room below). */
  bottom?: number
}

/**
 * Custom, theme-aware dropdown (a styled listbox) used app-wide.
 *
 * Unlike a native <select>, the open panel is fully styled for light/dark, is
 * responsive (matches the trigger width, scrolls when long), and is rendered in
 * a portal so it is never clipped by a scrollable parent such as a Modal body.
 * Keyboard accessible: Enter/Space/Arrow opens, Up/Down move, Enter selects,
 * Escape closes; closes on outside click.
 */
export function Select<T extends string | number>({
  label,
  error,
  placeholder = 'Select',
  value,
  onChange,
  options,
  disabled = false,
  id,
  required = false,
}: SelectProps<T>) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const errorId = `${fieldId}-error`
  const listId = `${fieldId}-list`

  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<PanelCoords | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const selectedIndex = options.findIndex((o) => o.value === value)
  const selectedLabel = selectedIndex >= 0 ? options[selectedIndex].label : null

  const updateCoords = useCallback(() => {
    const el = triggerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()

    const GAP = 4
    const MARGIN = 8 // keep the panel clear of the viewport edge
    const MAX_HEIGHT = 240 // preferred cap; the list scrolls beyond this
    const spaceBelow = window.innerHeight - rect.bottom - MARGIN
    const spaceAbove = rect.top - MARGIN

    // Prefer opening below; flip above only when the space below is too small
    // and there's more room above (e.g. a long list near a bottom-sheet's edge).
    const openUp = spaceBelow < 160 && spaceAbove > spaceBelow

    setCoords({
      left: rect.left,
      width: rect.width,
      maxHeight: Math.min(MAX_HEIGHT, openUp ? spaceAbove : spaceBelow),
      ...(openUp
        ? { bottom: window.innerHeight - rect.top + GAP }
        : { top: rect.bottom + GAP }),
    })
  }, [])

  const openPanel = () => {
    if (disabled) return
    updateCoords()
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
    setOpen(true)
  }

  const close = () => setOpen(false)

  const select = (index: number) => {
    const option = options[index]
    if (option) onChange(option.value)
    close()
    triggerRef.current?.focus()
  }

  // Reposition + outside-click + Escape while open.
  useEffect(() => {
    if (!open) return

    const reposition = () => updateCoords()
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return
      close()
    }
    document.addEventListener('mousedown', onPointerDown)

    // Capture-phase Escape so closing the dropdown does NOT also bubble up to a
    // parent Modal's Escape handler (which would close the whole dialog).
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

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        openPanel()
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      select(activeIndex)
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
          {label}
          {required && <RequiredMark />}
        </label>
      )}

      <button
        ref={triggerRef}
        id={fieldId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-required={required || undefined}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        disabled={disabled}
        onClick={() => (open ? close() : openPanel())}
        onKeyDown={onTriggerKeyDown}
        className={[
          'flex w-full items-center justify-between gap-2 rounded-2xl bg-surface py-4 pl-4 pr-4 text-left text-sm',
          'border border-transparent transition-colors duration-150',
          'focus:border-ring focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-60',
          error ? 'border-error' : '',
          selectedLabel ? 'text-surface-foreground' : 'text-muted',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="truncate">{selectedLabel ?? placeholder}</span>
        <ChevronDownIcon
          size={18}
          className={['shrink-0 text-muted transition-transform', open ? 'rotate-180' : ''].join(' ')}
        />
      </button>

      {error && (
        <p id={errorId} role="alert" className="text-xs text-error">
          {error}
        </p>
      )}

      {open &&
        coords &&
        createPortal(
          <div
            ref={panelRef}
            id={listId}
            role="listbox"
            style={{
              top: coords.top,
              bottom: coords.bottom,
              left: coords.left,
              width: coords.width,
              maxHeight: coords.maxHeight,
            }}
            className="fixed z-[60] overflow-y-auto rounded-2xl border border-border bg-card p-1 shadow-2xl"
          >
            {options.length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted">No options</p>
            ) : (
              options.map((option, index) => {
                const isSelected = option.value === value
                const isActive = index === activeIndex
                return (
                  <button
                    key={`${option.value}`}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => select(index)}
                    className={[
                      'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
                      isActive ? 'bg-primary text-primary-foreground' : 'text-card-foreground',
                    ].join(' ')}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && !isActive && (
                      <span className="ml-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    )}
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
