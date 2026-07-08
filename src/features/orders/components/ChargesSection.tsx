import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { sanitizeDecimalInput } from '@/utils/numericInput'

import { useOrderMeta } from '../hooks/useOrderMeta'
import { useOrderDraftStore } from '../store/orderDraftStore'

interface ChargesSectionProps {
  errors: { orderCategoryId?: string; orderTypeId?: string; architectName?: string }
}

/** True when an order type's name marks it as an "Architect" order. */
function isArchitectType(name: string | undefined): boolean {
  return name?.trim().toLowerCase() === 'architect'
}

/** Category/type pickers plus advance, transportation and notes. */
export function ChargesSection({ errors }: ChargesSectionProps) {
  const { categories, types, isLoading } = useOrderMeta()

  const orderCategoryId = useOrderDraftStore((s) => s.orderCategoryId)
  const orderTypeId = useOrderDraftStore((s) => s.orderTypeId)
  const advancePayment = useOrderDraftStore((s) => s.advancePayment)
  const transportationCharge = useOrderDraftStore((s) => s.transportationCharge)
  const notes = useOrderDraftStore((s) => s.notes)
  const architectName = useOrderDraftStore((s) => s.architectName)
  const setField = useOrderDraftStore((s) => s.setField)

  const showArchitectName = isArchitectType(types.find((t) => t.id === orderTypeId)?.name)

  // Switching the order type away from "Architect" clears any entered name so a
  // stale value is never submitted for a Local/Retailer order.
  const handleTypeChange = (value: number | null) => {
    setField('orderTypeId', value)
    if (!isArchitectType(types.find((t) => t.id === value)?.name)) {
      setField('architectName', '')
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Category"
          placeholder="Select category"
          value={orderCategoryId}
          error={errors.orderCategoryId}
          disabled={isLoading}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          onChange={(v) => setField('orderCategoryId', v)}
        />

        <Select
          label="Order Type"
          placeholder="Select type"
          value={orderTypeId}
          error={errors.orderTypeId}
          disabled={isLoading}
          options={types.map((t) => ({ value: t.id, label: t.name }))}
          onChange={handleTypeChange}
        />
      </div>

      {showArchitectName && (
        <Input
          label="Architect Name"
          placeholder="Enter architect name"
          value={architectName}
          error={errors.architectName}
          onChange={(e) => setField('architectName', e.target.value)}
        />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Advance Payment (₹)"
          inputMode="decimal"
          placeholder="0"
          value={advancePayment}
          onChange={(e) => setField('advancePayment', sanitizeDecimalInput(e.target.value))}
        />
        <Input
          label="Transportation Charge (₹)"
          inputMode="decimal"
          placeholder="0"
          value={transportationCharge}
          onChange={(e) => setField('transportationCharge', sanitizeDecimalInput(e.target.value))}
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
