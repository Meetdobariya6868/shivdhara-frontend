import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'

import { useOrderMeta } from '../hooks/useOrderMeta'
import { useOrderDraftStore } from '../store/orderDraftStore'

interface ChargesSectionProps {
  errors: { orderCategoryId?: string; orderTypeId?: string }
}

/** Category/type pickers plus advance, transportation and notes. */
export function ChargesSection({ errors }: ChargesSectionProps) {
  const { categories, types, isLoading } = useOrderMeta()

  const orderCategoryId = useOrderDraftStore((s) => s.orderCategoryId)
  const orderTypeId = useOrderDraftStore((s) => s.orderTypeId)
  const advancePayment = useOrderDraftStore((s) => s.advancePayment)
  const transportationCharge = useOrderDraftStore((s) => s.transportationCharge)
  const notes = useOrderDraftStore((s) => s.notes)
  const setField = useOrderDraftStore((s) => s.setField)

  return (
    <section className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Category"
          value={orderCategoryId ?? ''}
          error={errors.orderCategoryId}
          disabled={isLoading}
          onChange={(e) => setField('orderCategoryId', e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>

        <Select
          label="Order Type"
          value={orderTypeId ?? ''}
          error={errors.orderTypeId}
          disabled={isLoading}
          onChange={(e) => setField('orderTypeId', e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Select type</option>
          {types.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Advance Payment (₹)"
          inputMode="decimal"
          placeholder="0"
          value={advancePayment}
          onChange={(e) => setField('advancePayment', e.target.value)}
        />
        <Input
          label="Transportation Charge (₹)"
          inputMode="decimal"
          placeholder="0"
          value={transportationCharge}
          onChange={(e) => setField('transportationCharge', e.target.value)}
        />
      </div>

      <Textarea
        label="Notes (optional)"
        placeholder="Any extra details for this order"
        value={notes}
        onChange={(e) => setField('notes', e.target.value)}
      />
    </section>
  )
}
