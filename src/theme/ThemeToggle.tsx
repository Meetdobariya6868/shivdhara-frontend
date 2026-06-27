import { useThemeStore } from './theme.store'
import type { ThemeMode } from './theme.types'

interface ThemeOption {
  value: ThemeMode
  label: string
  icon: string
}

const OPTIONS: readonly ThemeOption[] = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'system', label: 'System', icon: '💻' },
]

/**
 * Segmented control for selecting Light / Dark / System theme.
 * Reads and writes the persisted theme store; the DOM updates reactively.
 */
export function ThemeToggle() {
  const mode = useThemeStore((s) => s.mode)
  const setMode = useThemeStore((s) => s.setMode)

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex gap-1 rounded-xl border border-border bg-card p-1"
    >
      {OPTIONS.map((option) => {
        const isActive = mode === option.value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setMode(option.value)}
            className={[
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted hover:text-foreground',
            ].join(' ')}
          >
            <span aria-hidden="true">{option.icon}</span>
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
