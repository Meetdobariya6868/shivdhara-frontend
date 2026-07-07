import { useEffect, useState } from 'react'

import { DownloadCloudIcon, FileTextIcon, SpinnerIcon } from '@/components/icons'
import { Modal } from '@/components/ui/Modal'
import { sanitizeFilename, saveBlob } from '@/utils/file'

import {
  useDownloadQuotation,
  type QuotationAction,
} from '../hooks/useDownloadQuotation'
import type { QuotationFormat } from '../types'

interface QuotationActionsProps {
  orderId: number
  /** Used to name the downloaded file, e.g. "Ravi Sharma Quotation.pdf". */
  customerName: string
}

const FORMATS: ReadonlyArray<{ format: QuotationFormat; label: string }> = [
  { format: 'name', label: 'Name' },
  { format: 'code', label: 'Code' },
]

/**
 * Quotation toolbar for an order: two icon buttons open the PDF in an in-app
 * viewer (by design name / code), two buttons download it. Same backend
 * endpoint (`?format=`); the PDF is fetched through the authenticated API
 * client as a blob, then viewed or saved client-side.
 */
export function QuotationActions({ orderId, customerName }: QuotationActionsProps) {
  const mutation = useDownloadQuotation()
  const [viewerUrl, setViewerUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Revoke the object URL when it changes or the component unmounts.
  useEffect(() => {
    return () => {
      if (viewerUrl) URL.revokeObjectURL(viewerUrl)
    }
  }, [viewerUrl])

  const isBusy = (format: QuotationFormat, action: QuotationAction): boolean =>
    mutation.isPending &&
    mutation.variables?.format === format &&
    mutation.variables?.action === action

  const run = (format: QuotationFormat, action: QuotationAction): void => {
    setError(null)
    mutation.mutate(
      { orderId, format, action },
      {
        onSuccess: (blob) => {
          if (action === 'download') {
            const base = sanitizeFilename(customerName) || `Order-${orderId}`
            saveBlob(blob, `${base} Quotation.pdf`)
          } else {
            setViewerUrl(URL.createObjectURL(blob))
          }
        },
        onError: () =>
          setError("Couldn't generate the quotation. Please try again."),
      },
    )
  }

  return (
    <div className="rounded-2xl bg-card p-3">
      {/* View in the in-app PDF viewer */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-auto text-xs font-semibold uppercase tracking-wide text-muted">
          Quotation
        </span>
        {FORMATS.map(({ format, label }) => (
          <button
            key={`view-${format}`}
            type="button"
            onClick={() => run(format, 'view')}
            disabled={mutation.isPending}
            aria-label={`View quotation by design ${label.toLowerCase()}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isBusy(format, 'view') ? <SpinnerIcon size={14} /> : <FileTextIcon size={14} />}
            {label}
          </button>
        ))}
      </div>

      {/* Download */}
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        {FORMATS.map(({ format, label }) => (
          <button
            key={`download-${format}`}
            type="button"
            onClick={() => run(format, 'download')}
            disabled={mutation.isPending}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isBusy(format, 'download') ? (
              <SpinnerIcon size={16} />
            ) : (
              <DownloadCloudIcon size={16} />
            )}
            Download {label}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-2 text-xs text-error">
          {error}
        </p>
      )}

      {viewerUrl && (
        <Modal isOpen title="Quotation" size="xl" onClose={() => setViewerUrl(null)}>
          <iframe
            title="Quotation PDF"
            src={viewerUrl}
            className="h-[70vh] w-full rounded-lg border border-border"
          />
        </Modal>
      )}
    </div>
  )
}
