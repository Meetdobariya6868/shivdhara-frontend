import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PhotoPicker } from '@/components/ui/PhotoPicker'
import { RadioGroup } from '@/components/ui/RadioGroup'
import { Select } from '@/components/ui/Select'
import { StateMessage } from '@/components/ui/StateMessage'
import { paths } from '@/routes/paths'
import { sanitizeDecimalInput, sanitizeIntegerInput } from '@/utils/numericInput'

import { useOrder } from '../hooks/useOrder'
import { useUpdateOrderItem } from '../hooks/useOrderActions'
import { useUploadOrderItemImage } from '../hooks/useUploadOrderItemImage'
import type {
  ItemType,
  MeasurementUnit,
  OrderDetailItem,
  UpdateOrderItemPayload,
} from '../types'
import { calculateItem, lineTotal } from '../utils/calculateItem'
import { ITEM_TYPE_OPTIONS, MEASUREMENT_UNIT_OPTIONS } from '../utils/orderOptions'

// ── Form state ────────────────────────────────────────────────────────────────

interface EditItemFormState {
  itemType: ItemType
  /** Boxes ordered (box items) or pieces ordered (piece items). */
  quantity: string
  /** Box items only. */
  piecesPerBox: string
  measurementUnit: MeasurementUnit
  height: string
  width: string
  sqftRate: string
  /** The displayed / overridden per-item price. Empty string means "use auto". */
  pricePerItem: string
  /**
   * undefined = keep existing (omit from payload)
   * null      = remove image
   * string    = new storage path from upload
   */
  productImagePath: string | null | undefined
  productImageUrl: string | null
}

type FormErrors = Partial<Record<keyof EditItemFormState, string>>

function num(s: string): number {
  const n = parseFloat(s)
  return Number.isFinite(n) ? n : 0
}

function buildInitialState(item: OrderDetailItem): EditItemFormState {
  return {
    itemType: item.item_type,
    quantity: item.quantity.toString(),
    piecesPerBox: item.pieces_per_box?.toString() ?? '',
    measurementUnit: item.measurement_unit,
    height: item.height,
    width: item.width,
    sqftRate: item.sqft_rate,
    pricePerItem: '',
    productImagePath: undefined,
    productImageUrl: item.product_image_url,
  }
}

// ── Inner form component ──────────────────────────────────────────────────────

interface EditItemFormProps {
  item: OrderDetailItem
  ordId: number
  itmId: number
}

function EditItemForm({ item, ordId, itmId }: EditItemFormProps) {
  const navigate = useNavigate()
  const [form, setForm] = useState<EditItemFormState>(() => buildInitialState(item))
  const [errors, setErrors] = useState<FormErrors>({})
  const [formError, setFormError] = useState<string | null>(null)

  const upload = useUploadOrderItemImage()
  const updateItem = useUpdateOrderItem()

  const set = <K extends keyof EditItemFormState>(key: K, value: EditItemFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const isBox = form.itemType === 'box'

  // Live calculation — mirrors server formula exactly.
  const calc = useMemo(
    () =>
      calculateItem({
        itemType: form.itemType,
        quantity: num(form.quantity),
        piecesPerBox: num(form.piecesPerBox),
        measurementUnit: form.measurementUnit,
        height: num(form.height),
        width: num(form.width),
        sqftRate: num(form.sqftRate),
      }),
    [form],
  )

  const autoPricePerItem = calc.pricePerItem ? calc.pricePerItem.toString() : ''
  const pricePerItemValue = form.pricePerItem !== '' ? form.pricePerItem : autoPricePerItem
  const productTotal = lineTotal(
    form.itemType,
    num(form.quantity),
    num(form.piecesPerBox),
    num(pricePerItemValue),
  )

  const handlePhotoSelect = (file: File) => {
    upload.mutate(file, {
      onSuccess: (img) => {
        set('productImagePath', img.path)
        set('productImageUrl', img.url)
      },
    })
  }

  const removePhoto = () => {
    set('productImagePath', null)
    set('productImageUrl', null)
  }

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    // Quantity and pieces-per-box accept 0; only a blank (or negative) is rejected.
    if (form.quantity.trim() === '') {
      e.quantity = isBox ? 'Enter the number of boxes' : 'Enter the number of pieces'
    } else if (num(form.quantity) < 0) {
      e.quantity = 'Cannot be negative'
    }
    if (isBox && form.piecesPerBox.trim() === '') {
      e.piecesPerBox = 'Required'
    } else if (isBox && num(form.piecesPerBox) < 0) {
      e.piecesPerBox = 'Cannot be negative'
    }
    if (num(form.sqftRate) <= 0) e.sqftRate = 'Enter the product sq ft rate'
    if (num(form.height) <= 0) e.height = 'Required'
    if (num(form.width) <= 0) e.width = 'Required'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const payload: UpdateOrderItemPayload = {
      item_type: form.itemType,
      quantity: num(form.quantity),
      pieces_per_box: isBox ? num(form.piecesPerBox) : null,
      measurement_unit: form.measurementUnit,
      height: num(form.height),
      width: num(form.width),
      sqft_rate: num(form.sqftRate),
      price_per_item: num(pricePerItemValue),
    }

    // Only send image path if it changed (undefined = keep existing on server).
    if (form.productImagePath !== undefined) {
      payload.product_image_path = form.productImagePath
    }

    updateItem.mutate(
      { id: itmId, payload },
      {
        onSuccess: () => {
          void navigate(paths.orderItemDetail(ordId, itmId))
        },
        onError: () => {
          setFormError('Failed to update item. Please try again.')
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 px-4 pb-28 pt-4">
      {/* Product identity — read-only summary so the user knows what they're editing */}
      <div className="rounded-2xl bg-card px-4 py-3">
        <p className="text-sm font-semibold text-card-foreground line-clamp-1">
          {item.product.design_name ?? '—'}
        </p>
        {(item.product.size ?? item.product.finish) && (
          <p className="mt-0.5 text-xs text-muted">
            {[item.product.size, item.product.finish, item.product.thickness]
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}
      </div>

      {/* Photo picker */}
      <div className="flex justify-center py-1">
        <PhotoPicker
          imageUrl={form.productImageUrl}
          isUploading={upload.isPending}
          error={upload.isError ? 'Upload failed. Try again.' : null}
          onSelect={handlePhotoSelect}
          onRemove={removePhoto}
        />
      </div>

      {/* Quantity mode */}
      <RadioGroup<ItemType>
        name="item-type"
        value={form.itemType}
        onChange={(v) => set('itemType', v)}
        options={ITEM_TYPE_OPTIONS}
      />

      {/* Conditional quantity fields */}
      {/* Quantity + rate; pieces-per-box shown only for box items */}
      <div className={`grid grid-cols-1 gap-4 ${isBox ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
        {isBox && (
          <Input
            label="Pieces per box"
            inputMode="numeric"
            placeholder="0"
            value={form.piecesPerBox}
            error={errors.piecesPerBox}
            onChange={(e) => set('piecesPerBox', sanitizeIntegerInput(e.target.value))}
          />
        )}
        <Input
          label={isBox ? 'Number of boxes' : 'Number of pieces'}
          inputMode="numeric"
          placeholder="0"
          value={form.quantity}
          error={errors.quantity}
          onChange={(e) => set('quantity', sanitizeIntegerInput(e.target.value))}
        />
        <Input
          label="Product Sq Ft Rate"
          inputMode="decimal"
          placeholder="0"
          value={form.sqftRate}
          error={errors.sqftRate}
          onChange={(e) => set('sqftRate', sanitizeDecimalInput(e.target.value))}
        />
      </div>

      {/* Dimensions */}
      <div className="grid grid-cols-3 gap-3">
        <Input
          label="Height"
          inputMode="decimal"
          placeholder="0"
          value={form.height}
          error={errors.height}
          onChange={(e) => set('height', sanitizeDecimalInput(e.target.value))}
        />
        <Input
          label="Width"
          inputMode="decimal"
          placeholder="0"
          value={form.width}
          error={errors.width}
          onChange={(e) => set('width', sanitizeDecimalInput(e.target.value))}
        />
        <Select
          label="Unit"
          value={form.measurementUnit}
          options={MEASUREMENT_UNIT_OPTIONS}
          onChange={(v) => set('measurementUnit', v)}
        />
      </div>

      {/* Per-piece price — auto-filled from area × sqft rate; user can override */}
      <Input
        label="Price per piece"
        inputMode="decimal"
        placeholder="0"
        value={pricePerItemValue}
        onChange={(e) => set('pricePerItem', sanitizeDecimalInput(e.target.value))}
      />

      {/* Product total — read-only, derived from price per piece × total pieces */}
      <div className="flex items-center justify-between rounded-2xl bg-card px-4 py-3.5">
        <span className="text-sm text-muted">Product total</span>
        <span className="text-base font-bold tabular-nums text-card-foreground">
          ₹{productTotal.toFixed(2)}
        </span>
      </div>

      {formError && (
        <p role="alert" className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error">
          {formError}
        </p>
      )}

      <Button type="submit" isLoading={updateItem.isPending} fullWidth>
        Update
      </Button>
    </form>
  )
}

// ── Page shell ────────────────────────────────────────────────────────────────

export default function EditOrderItemPage() {
  const navigate = useNavigate()
  const { orderId, itemId } = useParams<{ orderId: string; itemId: string }>()
  const ordId = Number(orderId)
  const itmId = Number(itemId)

  const { data, isLoading, isError, refetch } = useOrder(ordId)

  const goBack = () => {
    void navigate(-1)
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Edit Item" onBack={goBack} />
        <div className="flex flex-col gap-4 px-4 py-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-2xl bg-card" />
          ))}
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Edit Item" onBack={goBack} />
        <StateMessage
          title="Couldn't load item"
          description="Something went wrong. Please try again."
          action={
            <Button onClick={() => void refetch()} className="mt-2">
              Retry
            </Button>
          }
        />
      </div>
    )
  }

  const item = data.data.rooms.flatMap((r) => r.items).find((i) => i.id === itmId)

  if (!item) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Edit Item" onBack={goBack} />
        <StateMessage
          title="Item not found"
          description="This product item may have been removed."
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Edit Item" onBack={goBack} />
      <EditItemForm item={item} ordId={ordId} itmId={itmId} />
    </div>
  )
}
