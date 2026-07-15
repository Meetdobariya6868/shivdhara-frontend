import { Button } from '@/components/ui/Button'

import { formatINR } from '../utils/formatters'

export interface OrderTotals {
  /** Sum of every product line total. */
  productSubtotal: number
  /** Transportation charge (added to the payable). */
  transportation: number
  /** Advance already paid (subtracted from the payable). */
  advance: number
  /** Amount payable = productSubtotal + transportation − advance. */
  payable: number
}

interface OrderTotalsBarProps {
  totals: OrderTotals
  onSave: () => void
  isSaving: boolean
  disabled: boolean
}

/** Order total summary + the primary Save action. */
export function OrderTotalsBar({ totals, onSave, isSaving, disabled }: OrderTotalsBarProps) {
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Product subtotal</span>
          <span className="tabular-nums text-card-foreground">
            ₹{formatINR(totals.productSubtotal)}
          </span>
        </div>

        {totals.transportation > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Transportation charge</span>
            <span className="tabular-nums text-card-foreground">
              + ₹{formatINR(totals.transportation)}
            </span>
          </div>
        )}

        {totals.advance > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Advance payment</span>
            <span className="tabular-nums text-card-foreground">
              − ₹{formatINR(totals.advance)}
            </span>
          </div>
        )}

        <div className="mt-1 flex items-center justify-between border-t border-border pt-2 text-sm">
          <span className="font-medium text-card-foreground">Total product price</span>
          <span className="font-bold tabular-nums text-card-foreground">
            ₹{formatINR(totals.payable)}
          </span>
        </div>
      </div>

      <Button onClick={onSave} isLoading={isSaving} disabled={disabled} fullWidth>
        Save Order
      </Button>
    </section>
  )
}
