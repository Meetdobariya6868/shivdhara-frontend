import axios, { AxiosError } from 'axios'

import { env } from '@/config/env'

/**
 * Pre-configured Axios instance — the single HTTP client for the whole app.
 *
 * - `baseURL` points at the Laravel API (env-driven).
 * - `withCredentials` + `withXSRFToken` make the client send the session and
 *   XSRF-TOKEN cookies, which is what Laravel Sanctum's SPA (cookie) auth
 *   expects. Auth itself is wired up in a later phase; the transport is ready.
 */
export const httpClient = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// A single place to normalise transport errors. Feature code can rely on the
// rejection always being an AxiosError; richer handling (auth refresh, toast
// notifications, logging) is layered in here as the app grows.
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(error),
)
