import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { applyTheme } from './applyTheme'
import type { ThemeMode } from './theme.types'

interface ThemeState {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      setMode: (mode) => {
        applyTheme(mode)
        set({ mode })
      },
    }),
    {
      name: 'shivdhara-theme',
      // Re-apply the persisted theme to the DOM as soon as the store rehydrates,
      // so there is no flash of the wrong theme on reload.
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.mode)
        }
      },
    },
  ),
)
