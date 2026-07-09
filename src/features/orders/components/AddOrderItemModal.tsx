import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Combobox } from '@/components/ui/Combobox'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { PhotoPicker } from '@/components/ui/PhotoPicker'
import { RadioGroup } from '@/components/ui/RadioGroup'
import { Select } from '@/components/ui/Select'
import { sanitizeDecimalInput, sanitizeIntegerInput } from '@/utils/numericInput'

import { useDesignVariantSearch } from '../hooks/useDesignVariantSearch'
import { useUploadOrderItemImage } from '../hooks/useUploadOrderItemImage'
import type { CreateOrderItemPayload, DesignVariantOption, ItemType, MeasurementUnit } from '../types'
import { calculateItem, lineTotal } from '../utils/calculateItem'
import { ITEM_TYPE_OPTIONS, MEASUREMENT_UNIT_OPTIONS } from '../utils/orderOptions'

interface AddOrderItemModalProps {
  isOpen: boolean
  roomName: string
  isSaving: boolean
  error?: string | null
  onClose: () => void
  onSave: (payload: CreateOrderItemPayload) => void
}

/** All fields held as strings while editing; parsed on submit. */
interface ItemFormState {
  /** Exact-reuse link set when a row is chosen from the autocomplete; null if typed. */
  designVariantId: number | null
  companyName: string
  designName: string
  size: string
  finish: string
  thickness: string
  itemType: ItemType
  /** Boxes ordered (box items) or pieces ordered (piece items). */
  quantity: string
  /** Box items only. */
  piecesPerBox: string
  measurementUnit: MeasurementUnit
  height: string
  width: string
  purchaseRate: string
  /** Catalogue sell rate (auto-filled reference; not persisted on the order). */
  sellRate: string
  /** "Product Sq Ft Rate" — the rate actually charged; maps to sqft_rate. */
  sqftRate: string
  /** Per-item price (price_per_item) — auto-filled from area × sqft_rate, but editable. */
  pricePerItem: string
  productImagePath: string | null
  productImageUrl: string | null
}

type FormErrors = Partial<Record<keyof ItemFormState, string>>

const FORM_ID = 'add-order-item-form'

function num(value: string): number {
  const n = parseFloat(value)
  return Number.isFinite(n) ? n : 0
}

const INITIAL_STATE: ItemFormState = {
  designVariantId: null,
  companyName: '',
  designName: '',
  size: '',
  finish: '',
  thickness: '',
  itemType: 'box',
  quantity: '',
  piecesPerBox: '',
  measurementUnit: 'mm',
  height: '',
  width: '',
  purchaseRate: '',
  sellRate: '',
  sqftRate: '',
  pricePerItem: '',
  productImagePath: null,
  productImageUrl: null,
}

/**
 * Adds a new product line to an existing room on an existing order. Mirrors the
 * create-order "Add Detail" popup (same fields, same live calculation, same
 * catalogue autocomplete) — the only difference is that saving hits the order
 * detail API directly instead of staging into the draft store, since the order
 * already exists server-side.
 */
export function AddOrderItemModal({
  isOpen,
  roomName,
  isSaving,
  error,
  onClose,
  onSave,
}: AddOrderItemModalProps) {
  const [form, setForm] = useState<ItemFormState>(INITIAL_STATE)
  const [errors, setErrors] = useState<FormErrors>({})
  const upload = useUploadOrderItemImage()

  const set = <K extends keyof ItemFormState>(key: K, value: ItemFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  // Editing any product-identity field detaches a previously selected catalogue
  // variant, so the backend re-resolves (find-or-create) from the typed text and
  // never silently reuses the wrong variant.
  const setIdentity = <K extends keyof ItemFormState>(key: K, value: ItemFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value, designVariantId: null }))

  // Server-side search; idle once a catalogue variant is linked — typing in the
  // field clears the link and re-enables it.
  const variantSearch = useDesignVariantSearch(form.designName, isOpen && form.designVariantId === null)

  // Picking a row fills every product field and links the item to that exact
  // variant (no duplicate company/design/variant rows created on save).
  const handleVariantSelect = (option: DesignVariantOption) => {
    setForm((prev) => ({
      ...prev,
      designVariantId: option.id,
      companyName: option.design.company.company_name ?? '',
      designName: option.design.design_name ?? '',
      size: option.size,
      finish: option.finish,
      thickness: option.thickness,
      purchaseRate: option.purchase_rate,
      sellRate: option.sell_rate,
      // Catalogue rates are reference only; the actual Product Sq Ft Rate
      // (sqft_rate) stays the salesman's to enter per order.
      sqftRate: '',
    }))
    setErrors((prev) => ({
      ...prev,
      companyName: undefined,
      designName: undefined,
      size: undefined,
      finish: undefined,
      thickness: undefined,
    }))
  }

  const isBox = form.itemType === 'box'

  // Live preview — mirrors the server calculation exactly.
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

  // The editable "Calculation" field defaults to the formula result (area ×
  // sqft_rate) and live-updates as inputs change; once the user types a value,
  // that override sticks. The line total below always derives from the
  // effective per-item price × quantity.
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
    if (!form.companyName.trim()) e.companyName = 'Company is required'
    if (!form.designName.trim()) e.designName = 'Design name is required'
    if (!form.size.trim()) e.size = 'Size is required'
    if (!form.finish.trim()) e.finish = 'Finish is required'
    if (!form.thickness.trim()) e.thickness = 'Thickness is required'

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

    if (num(form.height) <= 0) e.height = 'Required'
    if (num(form.width) <= 0) e.width = 'Required'
    if (num(form.purchaseRate) < 0) e.purchaseRate = 'Invalid'
    if (num(form.sellRate) < 0) e.sellRate = 'Invalid'
    if (num(form.sqftRate) <= 0) e.sqftRate = 'Enter the product sq ft rate'
    return e
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const payload: CreateOrderItemPayload = {
      design_variant_id: form.designVariantId,
      company_name: form.companyName.trim(),
      design_name: form.designName.trim(),
      size: form.size.trim(),
      finish: form.finish.trim(),
      thickness: form.thickness.trim(),
      product_image_path: form.productImagePath,
      item_type: form.itemType,
      quantity: num(form.quantity),
      pieces_per_box: isBox ? num(form.piecesPerBox) : null,
      measurement_unit: form.measurementUnit,
      height: num(form.height),
      width: num(form.width),
      purchase_rate: num(form.purchaseRate),
      sell_rate: num(form.sellRate),
      price_per_item: num(pricePerItemValue),
    }

    onSave(payload)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add item to ${roomName}`}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl px-5 py-3 text-sm font-semibold text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          >Cancel
          </button>
          <Button type="submit" form={FORM_ID} isLoading={isSaving}>
            Add Item
          </Button>
        </div>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {/* Photo */}
        <div className="flex justify-center py-1">
          <PhotoPicker
            imageUrl={form.productImageUrl}
            isUploading={upload.isPending}
            error={upload.isError ? 'Upload failed. Try again.' : null}
            onSelect={handlePhotoSelect}
            onRemove={removePhoto}
          />
        </div>

        {/* Product identity — search the catalogue by design, code or company.
            Selecting a result auto-fills the fields below and links the exact
            variant; typing a new product leaves it unlinked (created on save). */}
        <Combobox<DesignVariantOption>
          label="Design Name"
          placeholder="Search design, code or company…"
          value={form.designName}
          error={errors.designName}
          onInputChange={(text) => setIdentity('designName', text)}
          options={variantSearch.options}
          isLoading={variantSearch.isLoading}
          isError={variantSearch.isError}
          isTooShort={variantSearch.isTooShort}
          isSearchable={variantSearch.isSearchable}
          getOptionKey={(o) => o.id}
          onSelect={handleVariantSelect}
          tooShortHint="Type at least 2 characters to search…"
          emptyHint="No match — keep typing to add a new design"
          errorHint="Couldn’t search the catalogue. Try again."
          renderOption={(o) => (
            <span className="flex w-full flex-col gap-0.5">
              <span className="flex items-center justify-between gap-2">
                <span className="truncate font-medium">{o.design.design_name}</span>
                <span className="shrink-0 text-xs opacity-80">{o.design.company.company_name}</span>
              </span>
              <span className="flex items-center justify-between gap-2 text-xs opacity-80">
                <span className="truncate">
                  {o.size} · {o.finish} · {o.thickness}
                </span>
                <span className="shrink-0">
                  Buy ₹{o.purchase_rate} · Sell ₹{o.sell_rate}
                </span>
              </span>
            </span>
          )}
        />
        <Input
          label="Company Name"
          placeholder="e.g. Kajaria"
          value={form.companyName}
          error={errors.companyName}
          onChange={(e) => setIdentity('companyName', e.target.value)}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Size"
            placeholder="e.g. 2x4"
            value={form.size}
            error={errors.size}
            onChange={(e) => setIdentity('size', e.target.value)}
          />
          <Input
            label="Finish"
            placeholder="e.g. Glossy"
            value={form.finish}
            error={errors.finish}
            onChange={(e) => setIdentity('finish', e.target.value)}
          />
          <Input
            label="Thickness"
            placeholder="e.g. 9mm"
            value={form.thickness}
            error={errors.thickness}
            onChange={(e) => setIdentity('thickness', e.target.value)}
          />
        </div>

        {/* Quantity mode */}
        <RadioGroup<ItemType>
          name="item-type"
          value={form.itemType}
          onChange={(v) => set('itemType', v)}
          options={ITEM_TYPE_OPTIONS}
        />

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

        {/* Dimensions — Height, Width and Unit always on one line */}
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

        {/* Purchase rate (drives profit) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Purchase rate"
            inputMode="decimal"
            placeholder="0"
            value={form.purchaseRate}
            error={errors.purchaseRate}
            onChange={(e) => set('purchaseRate', sanitizeDecimalInput(e.target.value))}
          />
          <Input
            label="Sell rate"
            inputMode="decimal"
            placeholder="0"
            value={form.sellRate}
            error={errors.sellRate}
            onChange={(e) => set('sellRate', sanitizeDecimalInput(e.target.value))}
          />
        </div>

        {/* Per-piece price — auto-filled from area × sqft rate, editable */}
        <Input
          label="Calculation"
          inputMode="decimal"
          placeholder="0"
          value={pricePerItemValue}
          onChange={(e) => set('pricePerItem', sanitizeDecimalInput(e.target.value))}
        />

        {/* Derived line total = price per piece × total pieces */}
        <div className="flex items-center justify-between rounded-2xl bg-surface px-4 py-3.5">
          <span className="text-sm text-muted">Product total</span>
          <span className="text-base font-bold tabular-nums text-foreground">
            ₹{productTotal.toFixed(2)}
          </span>
        </div>

        {error && (
          <p role="alert" className="text-xs text-error">
            {error}
          </p>
        )}
      </form>
    </Modal>
  )
}
