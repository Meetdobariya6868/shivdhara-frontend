import { Button } from '@/components/ui/Button'

import { formatINR } from '../utils/formatters'

export interface OrderTotals {
  totalSell: number
  totalProfit: number
  transportation: number
  advance: number
  grandTotal: number
  balanceDue: number
}

interface OrderTotalsBarProps {
  totals: OrderTotals
  onSave: () => void
  isSaving: boolean
  disabled: boolean
}

/** Order financial summary + the primary Save action. */
export function OrderTotalsBar({ totals, onSave, isSaving, disabled }: OrderTotalsBarProps) {
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5">
      <dl className="flex flex-col gap-2 text-sm">
        <Row label="Total Product Price" value={totals.totalSell} />
        <Row label="Transportation" value={totals.transportation} />
        <Row label="Advance Paid" value={totals.advance} />
        <Row label="Profit" value={totals.totalProfit} accent />
        <div className="my-1 border-t border-border" />
        <Row label="Grand Total" value={totals.grandTotal} strong />
        <Row label="Balance Due" value={totals.balanceDue} strong />
      </dl>

      <Button onClick={onSave} isLoading={isSaving} disabled={disabled} fullWidth>
        Save Order
      </Button>
    </section>
  )
}

function Row({
  label,
  value,
  strong = false,
  accent = false,
}: {
  label: string
  value: number
  strong?: boolean
  accent?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className={strong ? 'font-semibold text-card-foreground' : 'text-muted'}>{label}</dt>
      <dd
        className={[
          'tabular-nums',
          accent ? 'text-success' : 'text-card-foreground',
          strong ? 'text-base font-bold' : 'font-medium',
        ].join(' ')}
      >
        ₹{formatINR(value)}
      </dd>
    </div>
  )
}
