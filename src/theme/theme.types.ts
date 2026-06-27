/** User-selectable theme mode. 'system' follows the OS preference. */
export type ThemeMode = 'light' | 'dark' | 'system'

/** The concrete theme actually applied to the DOM (never 'system'). */
export type ResolvedTheme = 'light' | 'dark'
