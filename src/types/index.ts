/**
 * Shared, app-wide TypeScript types live here. Feature-specific types should
 * stay inside their feature module; only genuinely cross-cutting contracts
 * belong in this barrel.
 */

/** Standard success envelope returned by the API. */
export interface ApiResponse<TData> {
  data: TData
}

/** Shape of a validation/error payload returned by Laravel. */
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
