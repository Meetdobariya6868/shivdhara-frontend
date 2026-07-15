/**
 * Centralised, typed access to runtime environment variables.
 *
 * Reading `import.meta.env` in exactly one place keeps the rest of the codebase
 * free of stringly-typed env lookups and gives a single source of truth (and a
 * single place to add validation as the app grows).
 */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL,
  appName: import.meta.env.VITE_APP_NAME,
  /**
   * Default country calling code (no "+") prepended to customer mobile numbers
   * when building WhatsApp links, since numbers are stored as bare local digits.
   * Defaults to India (91).
   */
  whatsappCountryCode: import.meta.env.VITE_WHATSAPP_COUNTRY_CODE ?? '91',
} as const

export type Env = typeof env
