import { MoonIcon, SunIcon } from '@/components/icons'

import { resolveTheme } from './applyTheme'
import { useThemeStore } from './theme.store'

interface ThemeToggleButtonProps {
  className?: string
}

/**
 * Compact icon button that flips between light and dark (for header quick
 * access, e.g. beside the notifications bell). Reads the currently resolved
 * theme — so it works whether the stored mode is light, dark, or system — and
 * writes an explicit choice. The full Light/Dark/System control lives in
 * settings (see ThemeToggle).
 */
export function ThemeToggleButton({ className }: ThemeToggleButtonProps) {
  const mode = useThemeStore((s) => s.mode)
  const setMode = useThemeStore((s) => s.setMode)

  const isDark = resolveTheme(mode) === 'dark'

  return (
    <button
      type="button"
      onClick={() => setMode(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={[
        'rounded-full p-2 text-foreground transition-colors hover:bg-card',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        className ?? '',
      ].join(' ')}
    >
      {isDark ? <SunIcon size={22} /> : <MoonIcon size={22} />}
    </button>
  )
}
