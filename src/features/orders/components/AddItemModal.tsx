import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { PhotoPicker } from '@/components/ui/PhotoPicker'
import { RadioGroup } from '@/components/ui/RadioGroup'
import { Select } from '@/components/ui/Select'

import { useUploadOrderItemImage } from '../hooks/useUploadOrderItemImage'
import type { DraftItem, DraftItemInput, DraftRoom } from '../store/orderDraftStore'
import type { ItemType, MeasurementUnit } from '../types'
import { calculateItem } from '../utils/calculateItem'
import { formatINR } from '../utils/formatters'
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
  sellRate: string
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
      productImagePath: editingItem.productImagePath,
      productImageUrl: editingItem.productImageUrl,
    }
  }

  return {
    roomTempId: defaultRoomTempId,
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
        sellRate: num(form.sellRate),
      }),
    [form],
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
    return e
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const input: DraftItemInput = {
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

        {/* Product identity */}
        <Input
          label="Company Name"
          placeholder="e.g. Kajaria"
          value={form.companyName}
          error={errors.companyName}
          onChange={(e) => set('companyName', e.target.value)}
        />
        <Input
          label="Design Name"
          placeholder="e.g. Cambiar Bianco Carving"
          value={form.designName}
          error={errors.designName}
          onChange={(e) => set('designName', e.target.value)}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Size"
            placeholder="e.g. 2x4"
            value={form.size}
            error={errors.size}
            onChange={(e) => set('size', e.target.value)}
          />
          <Input
            label="Finish"
            placeholder="e.g. Glossy"
            value={form.finish}
            error={errors.finish}
            onChange={(e) => set('finish', e.target.value)}
          />
          <Input
            label="Thickness"
            placeholder="e.g. 9mm"
            value={form.thickness}
            error={errors.thickness}
            onChange={(e) => set('thickness', e.target.value)}
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
              value={form.sellRate}
              error={errors.sellRate}
              onChange={(e) => set('sellRate', e.target.value)}
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
              label="Product Sq Ft Rate (₹)"
              inputMode="decimal"
              placeholder="0"
              value={form.sellRate}
              error={errors.sellRate}
              onChange={(e) => set('sellRate', e.target.value)}
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

        {/* Live calculation */}
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-2xl bg-card p-4 text-sm sm:grid-cols-3">
          <CalcRow label="Total pieces" value={calc.totalPieces.toString()} />
          <CalcRow label="Area / piece" value={`${calc.areaSqft} ft²`} />
          <CalcRow label="Total sq ft" value={`${calc.totalSqft} ft²`} />
          <CalcRow label="Purchase" value={`₹${formatINR(calc.purchaseAmount)}`} />
          <CalcRow label="Sell" value={`₹${formatINR(calc.sellAmount)}`} />
          <CalcRow label="Profit" value={`₹${formatINR(calc.profit)}`} accent />
        </dl>
      </form>
    </Modal>
  )
}

function CalcRow({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col">
      <dt className="text-xs text-muted">{label}</dt>
      <dd
        className={[
          'font-semibold tabular-nums',
          accent ? 'text-success' : 'text-card-foreground',
        ].join(' ')}
      >
        {value}
      </dd>
    </div>
  )
}
