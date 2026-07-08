import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { sanitizeIntegerInput } from '@/utils/numericInput'

import { useOrderMeta } from '../hooks/useOrderMeta'
import type { OrderDetail, UpdateOrderDetailsPayload } from '../types'
import { toDateInputValue } from '../utils/formatters'

interface EditOrderDetailsModalProps {
  isOpen: boolean
  order: OrderDetail
  isSaving: boolean
  error?: string | null
  onClose: () => void
  onSave: (payload: UpdateOrderDetailsPayload) => void
}

interface FormState {
  customerName: string
  customerContact: string
  categoryId: number | null
  typeId: number | null
  orderDate: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const FORM_ID = 'edit-order-details-form'

function buildInitialState(order: OrderDetail): FormState {
  return {
    customerName: order.customer.name,
    customerContact: order.customer.contact,
    categoryId: order.category.id,
    typeId: order.type.id,
    orderDate: toDateInputValue(order.created_at),
  }
}

/**
 * Edits an order's header fields: customer name/contact, category, type and
 * order date. Customer name/contact updates the shared Customer record — every
 * other order from the same customer reflects the correction too, since a
 * customer is a single deduped entity across all their orders.
 */
export function EditOrderDetailsModal({
  isOpen,
  order,
  isSaving,
  error,
  onClose,
  onSave,
}: EditOrderDetailsModalProps) {
  const { categories, types, isLoading: isMetaLoading } = useOrderMeta()
  const [form, setForm] = useState<FormState>(() => buildInitialState(order))
  const [errors, setErrors] = useState<FormErrors>({})

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!form.customerName.trim()) e.customerName = 'Customer name is required'
    if (!form.customerContact.trim()) e.customerContact = 'Contact number is required'
    if (form.categoryId === null) e.categoryId = 'Select a category'
    if (form.typeId === null) e.typeId = 'Select an order type'
    if (!form.orderDate) e.orderDate = 'Select a date'
    return e
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0 || form.categoryId === null || form.typeId === null) return

    onSave({
      customer_name: form.customerName.trim(),
      customer_contact: form.customerContact.trim(),
      order_category_id: form.categoryId,
      order_type_id: form.typeId,
      order_date: form.orderDate,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit order details"
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl px-5 py-3 text-sm font-semibold text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          >
            Cancel
          </button>
          <Button type="submit" form={FORM_ID} isLoading={isSaving}>
            Save
          </Button>
        </div>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Customer Name"
          value={form.customerName}
          error={errors.customerName}
          onChange={(e) => set('customerName', e.target.value)}
        />
        <Input
          label="Contact Number"
          type="tel"
          inputMode="numeric"
          value={form.customerContact}
          error={errors.customerContact}
          onChange={(e) => set('customerContact', sanitizeIntegerInput(e.target.value))}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Order Category"
            placeholder="Select category"
            value={form.categoryId}
            error={errors.categoryId}
            disabled={isMetaLoading}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            onChange={(v) => set('categoryId', v)}
          />
          <Select
            label="Order Type"
            placeholder="Select type"
            value={form.typeId}
            error={errors.typeId}
            disabled={isMetaLoading}
            options={types.map((t) => ({ value: t.id, label: t.name }))}
            onChange={(v) => set('typeId', v)}
          />
        </div>

        <Input
          label="Order Date"
          type="date"
          value={form.orderDate}
          error={errors.orderDate}
          onChange={(e) => set('orderDate', e.target.value)}
        />

        {error && (
          <p role="alert" className="text-xs text-error">
            {error}
          </p>
        )}
      </form>
    </Modal>
  )
}
