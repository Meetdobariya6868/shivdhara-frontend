export interface SwitchProps {
  /** Current on/off state (controlled). */
  checked: boolean
  /** Called with the next state when the user toggles. */
  onChange: (checked: boolean) => void
  disabled?: boolean
  id?: string
  /** Accessible name when there is no associated visible label. */
  'aria-label'?: string
  /** id of a visible label element, for screen-reader association. */
  'aria-labelledby'?: string
  className?: string
}

/**
 * Accessible on/off toggle switch (`role="switch"`), token-only so it reads
 * correctly in light and dark. The knob uses `bg-background` (the theme's
 * lightest/darkest extreme) against mid-tone tracks, so it stays legible in
 * both themes. Keyboard support (Enter/Space) comes free from the button.
 */
export function Switch({
  checked,
  onChange,
  disabled = false,
  id,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={[
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        checked ? 'bg-primary' : 'bg-border',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className ?? '',
      ].join(' ')}
    >
      <span
        aria-hidden="true"
        className={[
          'inline-block h-5 w-5 rounded-full bg-background shadow-sm transition-transform',
          checked ? 'translate-x-[22px]' : 'translate-x-0.5',
        ].join(' ')}
      />
    </button>
  )
}
