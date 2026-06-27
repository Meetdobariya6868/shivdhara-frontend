import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AuthUser } from '../types'

interface AuthState {
  token: string | null
  user: AuthUser | null

  /** Store token + user after successful login. */
  setAuth: (token: string, user: AuthUser) => void

  /** Clear all auth state on logout or token expiry. */
  clearAuth: () => void

  /** Convenience getter — true when a token is present. */
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      setAuth: (token, user) => set({ token, user }),

      clearAuth: () => set({ token: null, user: null }),

      isAuthenticated: () => get().token !== null,
    }),
    {
      name: 'shivdhara-auth',
      // Only persist token and user — never persist derived state or methods.
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
)
