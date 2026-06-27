/**
 * Shared, app-wide TypeScript types live here. Feature-specific types should
 * stay inside their feature module; only genuinely cross-cutting contracts
 * belong in this barrel.
 */

/**
 * Standard success envelope returned by every Shivdhara API endpoint.
 * Matches Controller::success() → { success, message, data }.
 */
export interface ApiResponse<TData = unknown> {
  success: boolean
  message: string
  data: TData
}

/**
 * Shape of a validation / business-error payload returned by the API.
 * `errors` is only present on HTTP 422 (Validation failed).
 */
export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
}

/** Pagination metadata returned by list endpoints (Controller::paginated). */
export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

/** Standard paginated list envelope: data array + meta. */
export interface PaginatedResponse<TItem> {
  success: boolean
  message: string
  data: TItem[]
  meta: PaginationMeta
}
