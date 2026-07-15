/// <reference types="vite/client" />

// Strongly-typed access to the `import.meta.env` variables this app reads.
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
  /** Country calling code (no "+") for WhatsApp links; defaults to "91" (India). */
  readonly VITE_WHATSAPP_COUNTRY_CODE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
