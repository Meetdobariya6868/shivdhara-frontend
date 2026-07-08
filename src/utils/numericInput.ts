/**
 * Strip everything except digits — for integer-only fields (phone numbers,
 * quantities, counts). Applied on every change so letters/symbols never stick
 * regardless of how they arrived (typed, pasted, autofilled).
 */
export function sanitizeIntegerInput(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Strip everything except digits and a single decimal point — for decimal
 * fields (rates, prices, dimensions). Extra dots beyond the first are dropped
 * rather than blocking input, so typing "12..5" settles to "12.5".
 */
export function sanitizeDecimalInput(value: string): string {
  const cleaned = value.replace(/[^0-9.]/g, '')
  const firstDot = cleaned.indexOf('.')
  if (firstDot === -1) return cleaned
  return cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, '')
}
