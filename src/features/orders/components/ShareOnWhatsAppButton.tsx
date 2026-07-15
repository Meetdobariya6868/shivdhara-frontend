import { useState } from 'react'

import { SpinnerIcon, WhatsAppIcon } from '@/components/icons'
import { env } from '@/config/env'
import { buildWhatsAppUrl, formatWhatsAppNumber } from '@/utils/whatsapp'

import { useQuotationShareLink } from '../hooks/useQuotationShareLink'
import { buildQuotationWhatsAppMessage } from '../utils/quotationMessage'

interface ShareOnWhatsAppButtonProps {
  orderId: number
  customerName: string
  /** Raw customer contact (bare local number) used to build the wa.me link. */
  customerContact: string
}

/**
 * Shares the order's quotation on the customer's WhatsApp.
 *
 * Clicking opens WhatsApp pre-filled with a short message plus a link to the
 * (design-)code quotation PDF; the sender taps Send. The signed PDF link is
 * prefetched so the wa.me tab opens synchronously within the click (no pop-up
 * blocking). Renders nothing actionable when the customer has no valid number.
 */
export function ShareOnWhatsAppButton({
  orderId,
  customerName,
  customerContact,
}: ShareOnWhatsAppButtonProps) {
  const phone = formatWhatsAppNumber(customerContact, env.whatsappCountryCode)
  const hasValidNumber = phone !== null

  // Share the "code" quotation (prints design codes), per the product decision.
  const {
    data: shareLink,
    isLoading,
    isError,
    refetch,
  } = useQuotationShareLink(orderId, 'code', hasValidNumber)

  const [openError, setOpenError] = useState<string | null>(null)

  const share = (): void => {
    setOpenError(null)
    if (!phone || !shareLink) return

    const text = buildQuotationWhatsAppMessage({
      customerName,
      companyName: env.appName ?? 'Shivdhara',
      shareUrl: shareLink.url,
    })
    const win = window.open(buildWhatsAppUrl(phone, text), '_blank', 'noopener,noreferrer')
    if (!win) {
      setOpenError('Please allow pop-ups to open WhatsApp.')
    }
  }

  if (!hasValidNumber) {
    return (
      <p className="mt-2 text-xs text-muted">
        Add a valid 10-digit mobile number to share this quotation on WhatsApp.
      </p>
    )
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={share}
        disabled={isLoading || isError || !shareLink}
        aria-label="Share quotation on WhatsApp"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? <SpinnerIcon size={16} /> : <WhatsAppIcon size={18} />}
        Share on WhatsApp
      </button>

      {isError && (
        <p role="alert" className="mt-2 text-xs text-error">
          Couldn&apos;t prepare the share link.{' '}
          <button
            type="button"
            onClick={() => void refetch()}
            className="font-semibold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Retry
          </button>
        </p>
      )}

      {openError && (
        <p role="alert" className="mt-2 text-xs text-error">
          {openError}
        </p>
      )}
    </div>
  )
}
