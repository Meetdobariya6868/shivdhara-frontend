/**
 * Composes the WhatsApp message body sent alongside a quotation share link.
 * Kept separate from the wa.me link plumbing (src/utils/whatsapp) so the wording
 * lives in one place and is easy to tweak or localise.
 */
export function buildQuotationWhatsAppMessage(params: {
  customerName: string
  companyName: string
  shareUrl: string
}): string {
  const { customerName, companyName, shareUrl } = params
  const name = customerName.trim()
  const greeting = name ? `Hello ${name},` : 'Hello,'

  return [
    greeting,
    '',
    `Please find your quotation from ${companyName} at the link below:`,
    shareUrl,
    '',
    'Thank you.',
  ].join('\n')
}
