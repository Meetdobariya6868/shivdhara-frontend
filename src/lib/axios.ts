import axios from 'axios'
import type { AxiosError } from 'axios'

import { env } from '@/config/env'

/**
 * Pre-configured Axios instance — the single HTTP client for the whole app.
 *
 * Auth handlers (token getter + clear callback) are registered at app startup
 * via `registerAuthHandlers` to avoid a circular ESM dependency:
 *
 *   auth.store → types   (no loop)
 *   axios → auth.store   (would loop if auth.service is in the chain)
 *
 * By registering lazily, axios.ts has zero import-time dependency on the
 * auth store, while still injecting the Bearer token on every request.
 */
export const httpClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// ── Auth handler slots (populated by AppProviders at startup) ─────────────────
let _getToken: () => string | null = () => null
let _clearAuth: () => void = () => {}

/**
 * Called once during app bootstrap (AppProviders) to wire the auth store
 * into the HTTP client without creating a circular module dependency.
 */
export function registerAuthHandlers(
  getToken: () => string | null,
  clearAuth: () => void,
): void {
  _getToken = getToken
  _clearAuth = clearAuth
}

// ── Request: inject Bearer token ──────────────────────────────────────────────
httpClient.interceptors.request.use((config) => {
  const token = _getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response: handle expired / revoked token ──────────────────────────────────
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isLoginEndpoint = error.config?.url === '/v1/auth/login'

    // Token was issued but rejected by the server — clear local state and
    // force re-authentication. Login-endpoint 401s (wrong password) are
    // handled by the mutation's onError and must NOT trigger this branch.
    if (error.response?.status === 401 && !isLoginEndpoint && _getToken()) {
      _clearAuth()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)
