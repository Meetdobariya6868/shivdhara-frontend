import type { ResolvedTheme, ThemeMode } from './theme.types'

const DARK_CLASS = 'dark'

/** Read the OS-level color-scheme preference. */
export function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/** Resolve a mode (which may be 'system') to a concrete light/dark theme. */
export function resolveTheme(mode: ThemeMode): ResolvedTheme {
  return mode === 'system' ? getSystemTheme() : mode
}

/** Toggle the `.dark` class on <html> to match the resolved theme. */
export function applyTheme(mode: ThemeMode): void {
  const resolved = resolveTheme(mode)
  const root = document.documentElement
  root.classList.toggle(DARK_CLASS, resolved === 'dark')
}
