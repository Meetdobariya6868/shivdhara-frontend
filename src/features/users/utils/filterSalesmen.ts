import type { Salesman } from '../types'

/**
 * Case-insensitive, in-memory filter over the salesman roster.
 * Matches against name and mobile number. Pure → easy to unit-test.
 */
export function filterSalesmen(
  salesmen: readonly Salesman[],
  search: string,
): Salesman[] {
  const query = search.trim().toLowerCase()
  if (!query) {
    return [...salesmen]
  }

  return salesmen.filter(
    (s) =>
      s.name.toLowerCase().includes(query) ||
      s.mobile_number.includes(query),
  )
}
