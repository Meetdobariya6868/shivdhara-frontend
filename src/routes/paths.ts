/**
 * Single source of truth for application route paths.
 *
 * Referencing `paths.home` instead of the literal string `'/'` keeps routes
 * refactor-safe and discoverable. Feature paths are added here as they appear.
 */
export const paths = {
  home: '/',
} as const

export type AppPath = (typeof paths)[keyof typeof paths]
