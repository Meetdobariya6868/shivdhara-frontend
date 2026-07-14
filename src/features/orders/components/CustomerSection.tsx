import { Input } from '@/components/ui/Input'
import { sanitizeIntegerInput } from '@/utils/numericInput'

import { useOrderDraftStore } from '../store/orderDraftStore'

interface CustomerSectionProps {
  errors: { customerName?: string; customerContact?: string }
}

/** Customer name + contact. Both are free text — a new customer record is always created, never reused. */
export function CustomerSection({ errors }: CustomerSectionProps) {
  const customerName = useOrderDraftStore((s) => s.customerName)
  const customerContact = useOrderDraftStore((s) => s.customerContact)
  const setField = useOrderDraftStore((s) => s.setField)

  return (
    <section className="flex flex-col gap-4">
      <Input
        label="Customer Name"
        required
        placeholder="Customer name"
        value={customerName}
        error={errors.customerName}
        onChange={(e) => setField('customerName', e.target.value)}
      />
      <Input
        label="Customer Number"
        required
        type="tel"
        inputMode="numeric"
        maxLength={10}
        placeholder="Customer number"
        value={customerContact}
        error={errors.customerContact}
        onChange={(e) => setField('customerContact', sanitizeIntegerInput(e.target.value))}
      />
    </section>
  )
}
