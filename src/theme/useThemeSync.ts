import { useEffect } from 'react'

import { applyTheme } from './applyTheme'
import { useThemeStore } from './theme.store'

/**
 * Keeps the DOM theme in sync. Mount once at the app root (AppProviders).
 *
 *  - Applies the current theme on mount.
 *  - When mode is 'system', re-applies whenever the OS preference changes
 *    live (e.g. the user flips their device to dark mode while the app is open).
 */
export function useThemeSync(): void {
  const mode = useThemeStore((s) => s.mode)

  useEffect(() => {
    applyTheme(mode)

    if (mode !== 'system') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => applyTheme('system')
    media.addEventListener('change', handleChange)

    return () => media.removeEventListener('change', handleChange)
  }, [mode])
}
