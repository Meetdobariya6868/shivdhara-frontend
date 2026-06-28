/** Format a decimal string as Indian rupees, no fraction for whole numbers. */
export function formatINR(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

/** Format an ISO date string as "12 Jan 2025". */
export function formatOrderDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** Count non-empty filter values (excludes page/per_page). */
export function countActiveFilters(filters: Record<string, unknown>): number {
  const ignored = new Set(['page', 'per_page'])
  return Object.entries(filters).filter(
    ([k, v]) => !ignored.has(k) && v !== undefined && v !== '' && v !== null,
  ).length
}
