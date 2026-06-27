/**
 * Single source of truth for all application route paths.
 * Always reference these constants — never use raw string literals in code.
 */
export const paths = {
  /** Splash screen shown on initial app load. */
  splash: '/',

  auth: {
    login: '/login',
  },

  /** Main dashboard — shown after successful login. */
  dashboard: '/dashboard',
} as const
