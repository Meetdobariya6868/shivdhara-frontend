import { useState } from 'react'

import { IndianRupeeIcon, SpinnerIcon } from '@/components/icons'
import { Input } from '@/components/ui/Input'

import { useUpdateVariantRates } from '../hooks/useUpdateVariantRates'
import type { DesignVariantRate } from '../types'

interface VariantRateCardProps {
  designId: number
  variant: DesignVariantRate
}

/**
 * One design variant: its immutable description (size / finish / thickness) plus
 * editable purchase and sell rates. Save is enabled only when a rate changes;
 * on success the value is confirmed inline. Everything else is read-only.
 */
export function VariantRateCard({ designId, variant }: VariantRateCardProps) {
  const [purchase, setPurchase] = useState(variant.purchase_rate)
  const [sell, setSell] = useState(variant.sell_rate)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const mutation = useUpdateVariantRates(designId)

  const dirty = purchase !== variant.purchase_rate || sell !== variant.sell_rate

  const onField = (setter: (v: string) => void) => (value: string) => {
    setter(value)
    setError(null)
    setSaved(false)
  }

  const handleSave = (): void => {
    setError(null)
    setSaved(false)

    const p = Number(purchase)
    const s = Number(sell)
    if (purchase.trim() === '' || sell.trim() === '' || Number.isNaN(p) || Number.isNaN(s)) {
      setError('Enter valid numbers for both rates.')
      return
    }
    if (p < 0 || s < 0) {
      setError('Rates cannot be negative.')
      return
    }

    mutation.mutate(
      { variantId: variant.id, payload: { purchase_rate: p, sell_rate: s } },
      {
        onSuccess: (res) => {
          // Sync to the canonical server-formatted values so the row reads as saved.
          setPurchase(res.data.purchase_rate)
          setSell(res.data.sell_rate)
          setSaved(true)
        },
        onError: (err) => {
          const data = err.response?.data
          if (err.response?.status === 422 && data?.errors) {
            setError(
              data.errors.purchase_rate?.[0] ??
                data.errors.sell_rate?.[0] ??
                'Could not update the rates.',
            )
          } else {
            setError(data?.message ?? 'Could not update the rates. Please try again.')
          }
        },
      },
    )
  }

  return (
    <div className="rounded-2xl bg-card p-4 shadow-sm">
      {/* Immutable description */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <span>Size: <span className="font-semibold text-card-foreground">{variant.size}</span></span>
        <span>Finish: <span className="font-semibold text-card-foreground">{variant.finish}</span></span>
        <span>Thickness: <span className="font-semibold text-card-foreground">{variant.thickness}</span></span>
      </div>

      {/* Editable rates */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          label="Purchase rate"
          type="text"
          inputMode="decimal"
          value={purchase}
          onChange={(e) => onField(setPurchase)(e.target.value)}
          leftIcon={<IndianRupeeIcon size={16} />}
          aria-label={`Purchase rate for ${variant.size} ${variant.finish}`}
        />
        <Input
          label="Sell rate"
          type="text"
          inputMode="decimal"
          value={sell}
          onChange={(e) => onField(setSell)(e.target.value)}
          leftIcon={<IndianRupeeIcon size={16} />}
          aria-label={`Sell rate for ${variant.size} ${variant.finish}`}
        />
      </div>

      {error && (
        <p role="alert" className="mt-2 text-xs text-error">
          {error}
        </p>
      )}

      <div className="mt-3 flex items-center justify-end gap-3">
        {saved && !dirty && (
          <span className="text-xs font-medium text-success">Saved</span>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || mutation.isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mutation.isPending && <SpinnerIcon size={16} />}
          Save
        </button>
      </div>
    </div>
  )
}
