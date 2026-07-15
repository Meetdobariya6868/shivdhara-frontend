/**
 * Helpers for building WhatsApp "click to chat" (wa.me) deep links.
 *
 * These are pure, framework-agnostic functions so they can be unit-tested and
 * reused anywhere a WhatsApp share is needed — not just for quotations.
 */

/**
 * Normalise a raw customer contact into a WhatsApp-ready number: digits only,
 * in international format (country code + national number), with no leading "+".
 *
 * Customer numbers are stored as bare 10-digit local numbers (the app validates
 * `^\d{10}$`), so we strip any punctuation / trunk zero, drop an existing
 * country-code prefix if present, and re-apply the configured code consistently.
 *
 * @returns the normalised number, or `null` if it isn't a valid 10-digit number.
 */
export function formatWhatsAppNumber(
  rawContact: string | null | undefined,
  countryCode: string,
): string | null {
  if (!rawContact) return null

  const cc = countryCode.replace(/\D/g, '')
  let digits = rawContact.replace(/\D/g, '').replace(/^0+/, '')
  if (!digits) return null

  // If the number already carries the country code, strip it so we can
  // re-apply it uniformly and validate the national part.
  if (cc && digits.length > 10 && digits.startsWith(cc)) {
    digits = digits.slice(cc.length)
  }

  // Expect exactly a 10-digit national number (matches the app's validation).
  if (digits.length !== 10) return null

  return cc + digits
}

/**
 * Build a wa.me deep link that opens WhatsApp with the given number selected and
 * the message pre-filled. The recipient/sender still taps Send.
 */
export function buildWhatsAppUrl(phone: string, text: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}
