import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Combobox } from '@/components/ui/Combobox'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { PhotoPicker } from '@/components/ui/PhotoPicker'
import { RadioGroup } from '@/components/ui/RadioGroup'
import { Select } from '@/components/ui/Select'

import { useDesignVariantSearch } from '../hooks/useDesignVariantSearch'
import { useUploadOrderItemImage } from '../hooks/useUploadOrderItemImage'
import type { DraftItem, DraftItemInput, DraftRoom } from '../store/orderDraftStore'
import type { DesignVariantOption, ItemType, MeasurementUnit } from '../types'
import { calculateItem } from '../utils/calculateItem'
import { ITEM_TYPE_OPTIONS, MEASUREMENT_UNIT_OPTIONS } from '../utils/orderOptions'

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
  rooms: readonly DraftRoom[]
  /** Room pre-selected when adding a new item. */
  defaultRoomTempId: string
  /** Present when editing an existing item (enables room reassignment). */
  editingItem?: DraftItem | null
  onSubmit: (roomTempId: string, input: DraftItemInput, editingTempId: string | null) => void
}

/** All fields held as strings while editing; parsed on submit. */
interface ItemFormState {
  roomTempId: string
  /** Exact-reuse link set when a row is chosen from the autocomplete; null if typed. */
  designVariantId: number | null
  companyName: string
  designName: string
  size: string
  finish: string
  thickness: string
  itemType: ItemType
  piecesPerBox: string
  numberOfBoxes: string
  numberOfPieces: string
  measurementUnit: MeasurementUnit
  height: string
  width: string
  purchaseRate: string
  /** Catalogue sell rate (auto-filled reference; not persisted on the order). */
  sellRate: string
  /** "Product Sq Ft Rate" — the rate actually charged; maps to sqft_rate. Blank on selection. */
  sqftRate: string
  /** Line total (product_total) — auto-filled from the formula, but editable. */
  calculation: string
  productImagePath: string | null
  productImageUrl: string | null
}

type FormErrors = Partial<Record<keyof ItemFormState, string>>

const FORM_ID = 'add-item-form'

function num(value: string): number {
  const n = parseFloat(value)
  return Number.isFinite(n) ? n : 0
}

function buildInitialState(
  defaultRoomTempId: string,
  editingItem: DraftItem | null | undefined,
): ItemFormState {
  if (editingItem) {
    return {
      roomTempId: editingItem.roomTempId,
      designVariantId: editingItem.designVariantId,
      companyName: editingItem.companyName,
      designName: editingItem.designName,
      size: editingItem.size,
      finish: editingItem.finish,
      thickness: editingItem.thickness,
      itemType: editingItem.itemType,
      piecesPerBox: editingItem.piecesPerBox?.toString() ?? '',
      numberOfBoxes: editingItem.numberOfBoxes?.toString() ?? '',
      numberOfPieces: editingItem.numberOfPieces?.toString() ?? '',
      measurementUnit: editingItem.measurementUnit,
      height: editingItem.height.toString(),
      width: editingItem.width.toString(),
      purchaseRate: editingItem.purchaseRate.toString(),
      sellRate: editingItem.sellRate.toString(),
      sqftRate: editingItem.sqftRate ? editingItem.sqftRate.toString() : '',
      calculation: '',
      productImagePath: editingItem.productImagePath,
      productImageUrl: editingItem.productImageUrl,
    }
  }

  return {
    roomTempId: defaultRoomTempId,
    designVariantId: null,
    companyName: '',
    designName: '',
    size: '',
    finish: '',
    thickness: '',
    itemType: 'box',
    piecesPerBox: '',
    numberOfBoxes: '',
    numberOfPieces: '',
    measurementUnit: 'mm',
    height: '',
    width: '',
    purchaseRate: '',
    sellRate: '',
    sqftRate: '',
    calculation: '',
    productImagePath: null,
    productImageUrl: null,
  }
}

/**
 * "Add Detail" popup — captures a single order item (product text + box/piece
 * quantities + dimensions + rates) with a live, server-aligned calculation
 * preview. The room selector doubles as the "move item to another room" control
 * when editing.
 */
export function AddItemModal({
  isOpen,
  onClose,
  rooms,
  defaultRoomTempId,
  editingItem,
  onSubmit,
}: AddItemModalProps) {
  const [form, setForm] = useState<ItemFormState>(() =>
    buildInitialState(defaultRoomTempId, editingItem),
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const upload = useUploadOrderItemImage()

  const set = <K extends keyof ItemFormState>(key: K, value: ItemFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  // Editing any product-identity field detaches a previously selected catalogue
  // variant, so the backend re-resolves (find-or-create) from the typed text and
  // never silently reuses the wrong variant.
  const setIdentity = <K extends keyof ItemFormState>(key: K, value: ItemFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value, designVariantId: null }))

  // Server-side search; idle while a variant is already linked (e.g. editing an
  // existing item) — typing in the field clears the link and re-enables it.
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
        piecesPerBox: num(form.piecesPerBox),
        numberOfBoxes: num(form.numberOfBoxes),
        numberOfPieces: num(form.numberOfPieces),
        measurementUnit: form.measurementUnit,
        height: num(form.height),
        width: num(form.width),
        purchaseRate: num(form.purchaseRate),
        // sell_amount is driven by the actual charged rate (Product Sq Ft Rate),
        // not the catalogue sell rate.
        sellRate: num(form.sqftRate),
      }),
    [form],
  )

  // The editable "Calculation" field IS the line total (product_total). It shows
  // the formula result by default and live-updates as inputs change; once the
  // user types a value, that override sticks until they clear it.
  const autoCalculation = calc.sellAmount ? calc.sellAmount.toString() : ''
  const calculationValue = form.calculation !== '' ? form.calculation : autoCalculation

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
    if (!form.roomTempId) e.roomTempId = 'Select a room'
    if (!form.companyName.trim()) e.companyName = 'Company is required'
    if (!form.designName.trim()) e.designName = 'Design name is required'
    if (!form.size.trim()) e.size = 'Size is required'
    if (!form.finish.trim()) e.finish = 'Finish is required'
    if (!form.thickness.trim()) e.thickness = 'Thickness is required'

    if (isBox) {
      if (num(form.piecesPerBox) <= 0) e.piecesPerBox = 'Required'
      if (num(form.numberOfBoxes) <= 0) e.numberOfBoxes = 'Required'
    } else if (num(form.numberOfPieces) <= 0) {
      e.numberOfPieces = 'Required'
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

    const input: DraftItemInput = {
      designVariantId: form.designVariantId,
      companyName: form.companyName.trim(),
      designName: form.designName.trim(),
      size: form.size.trim(),
      finish: form.finish.trim(),
      thickness: form.thickness.trim(),
      productImagePath: form.productImagePath,
      productImageUrl: form.productImageUrl,
      itemType: form.itemType,
      piecesPerBox: isBox ? num(form.piecesPerBox) : null,
      numberOfBoxes: isBox ? num(form.numberOfBoxes) : null,
      numberOfPieces: isBox ? null : num(form.numberOfPieces),
      measurementUnit: form.measurementUnit,
      height: num(form.height),
      width: num(form.width),
      purchaseRate: num(form.purchaseRate),
      sellRate: num(form.sellRate),
      sqftRate: num(form.sqftRate),
      productTotal: num(calculationValue),
    }

    onSubmit(form.roomTempId, input, editingItem?.tempId ?? null)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingItem ? 'Edit Detail' : 'Add Detail'}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-5 py-3 text-sm font-semibold text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Cancel
          </button>
          <Button type="submit" form={FORM_ID}>
            {editingItem ? 'Save Item' : 'Add Item'}
          </Button>
        </div>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {/* Room assignment (also the "move to room" control) */}
        <Select
          label="Room"
          placeholder="Select room"
          value={form.roomTempId || null}
          error={errors.roomTempId}
          options={rooms.map((room) => ({
            value: room.tempId,
            label: room.roomName.trim() || 'Untitled room',
          }))}
          onChange={(v) => set('roomTempId', v)}
        />

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
          // label="Sold by"
          value={form.itemType}
          onChange={(v) => set('itemType', v)}
          options={ITEM_TYPE_OPTIONS}
        />

        {isBox ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="Pieces per box"
              inputMode="numeric"
              placeholder="0"
              value={form.piecesPerBox}
              error={errors.piecesPerBox}
              onChange={(e) => set('piecesPerBox', e.target.value)}
            />
            <Input
              label="Product Sq Ft Rate"
              inputMode="decimal"
              placeholder="0"
              value={form.sqftRate}
              error={errors.sqftRate}
              onChange={(e) => set('sqftRate', e.target.value)}
            />
            <Input
              label="Number of boxes"
              inputMode="numeric"
              placeholder="0"
              value={form.numberOfBoxes}
              error={errors.numberOfBoxes}
              onChange={(e) => set('numberOfBoxes', e.target.value)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Number of pieces"
              inputMode="numeric"
              placeholder="0"
              value={form.numberOfPieces}
              error={errors.numberOfPieces}
              onChange={(e) => set('numberOfPieces', e.target.value)}
            />
            <Input
              label="Product Sq Ft Rate"
              inputMode="decimal"
              placeholder="0"
              value={form.sqftRate}
              error={errors.sqftRate}
              onChange={(e) => set('sqftRate', e.target.value)}
            />
          </div>
        )}

        {/* Dimensions — Height, Width and Unit always on one line */}
        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Height"
            inputMode="decimal"
            placeholder="0"
            value={form.height}
            error={errors.height}
            onChange={(e) => set('height', e.target.value)}
          />
          <Input
            label="Width"
            inputMode="decimal"
            placeholder="0"
            value={form.width}
            error={errors.width}
            onChange={(e) => set('width', e.target.value)}
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
            onChange={(e) => set('purchaseRate', e.target.value)}
          />
          <Input
            label="Sell rate"
            inputMode="decimal"
            placeholder="0"
            value={form.sellRate}
            error={errors.sellRate}
            onChange={(e) => set('sellRate', e.target.value)}
          />
        </div>

        {/* Line total — auto-calculated from the formula, editable */}
        <Input
          label="Calculation"
          inputMode="decimal"
          placeholder="0"
          value={calculationValue}
          onChange={(e) => set('calculation', e.target.value)}
        />
      </form>
    </Modal>
  )
}
