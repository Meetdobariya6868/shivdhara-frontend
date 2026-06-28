export interface RadioOption<T extends string> {
  value: T
  label: string
}

interface RadioGroupProps<T extends string> {
  /** Group name (shared by the underlying radio inputs). */
  name: string
  value: T
  onChange: (value: T) => void
  options: ReadonlyArray<RadioOption<T>>
  label?: string
  /** 'segmented' = pill toggle (default); 'list' = stacked radios. */
  variant?: 'segmented' | 'list'
}

/**
 * Accessible single-choice control. Generic over the value union so callers get
 * exact typing (e.g. 'box' | 'piece'). Renders as a segmented pill by default.
 */
export function RadioGroup<T extends string>({
  name,
  value,
  onChange,
  options,
  label,
  variant = 'segmented',
}: RadioGroupProps<T>) {
  if (variant === 'list') {
    return (
      <fieldset className="flex flex-col gap-2">
        {label && (
          <legend className="mb-1 text-sm font-medium text-foreground">{label}</legend>
        )}
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-3 text-sm text-foreground"
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="h-4 w-4 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {opt.label}
          </label>
        ))}
      </fieldset>
    )
  }

  return (
    <fieldset>
      {label && <legend className="mb-1.5 text-sm font-medium text-foreground">{label}</legend>}
      <div
        role="radiogroup"
        aria-label={label}
        className="flex gap-1 rounded-2xl bg-surface p-1"
      >
        {options.map((opt) => {
          const selected = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt.value)}
              className={[
                'flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                selected
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted hover:text-foreground',
              ].join(' ')}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
