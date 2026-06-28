import { Button } from '@/components/ui/Button'

import { formatINR } from '../utils/formatters'

export interface OrderTotals {
  totalSell: number
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
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">Total product price</span>
        <span className="font-bold tabular-nums text-card-foreground">
          ₹{formatINR(totals.totalSell)}
        </span>
      </div>

      <Button onClick={onSave} isLoading={isSaving} disabled={disabled} fullWidth>
        Save Order
      </Button>
    </section>
  )
}
