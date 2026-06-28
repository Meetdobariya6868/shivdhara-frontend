import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { PlusIcon } from '@/components/icons'
import { Alert } from '@/components/ui/Alert'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { paths } from '@/routes/paths'

import { AddItemModal } from '../components/AddItemModal'
import { ChargesSection } from '../components/ChargesSection'
import { CustomerSection } from '../components/CustomerSection'
import { OrderTotalsBar } from '../components/OrderTotalsBar'
import type { OrderTotals } from '../components/OrderTotalsBar'
import { RoomCard } from '../components/RoomCard'
import { useCreateOrder } from '../hooks/useCreateOrder'
import type { DraftItem, DraftItemInput } from '../store/orderDraftStore'
import { useOrderDraftStore } from '../store/orderDraftStore'
import type { CreateOrderPayload } from '../types'
import { calculateItem } from '../utils/calculateItem'

function num(value: string): number {
  const n = parseFloat(value)
  return Number.isFinite(n) ? n : 0
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

interface FieldErrors {
  customerName?: string
  customerContact?: string
  orderCategoryId?: string
  orderTypeId?: string
}

interface ModalState {
  open: boolean
  roomTempId: string
  editingItem: DraftItem | null
  key: number
}

export default function CreateOrderPage() {
  const navigate = useNavigate()
  const isAdmin = useAuthStore((s) => s.user?.is_admin ?? false)
  const createOrder = useCreateOrder()

  const draft = useOrderDraftStore()
  const { rooms, items } = draft

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalState>({
    open: false,
    roomTempId: '',
    editingItem: null,
    key: 0,
  })

  // Clear the draft when leaving the page so a fresh order starts next time.
  useEffect(() => () => draft.reset(), []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived totals ────────────────────────────────────────────────────────
  const totals: OrderTotals = useMemo(() => {
    let totalSell = 0
    let totalProfit = 0
    for (const item of items) {
      const calc = calculateItem({
        itemType: item.itemType,
        piecesPerBox: item.piecesPerBox,
        numberOfBoxes: item.numberOfBoxes,
        numberOfPieces: item.numberOfPieces,
        measurementUnit: item.measurementUnit,
        height: item.height,
        width: item.width,
        purchaseRate: item.purchaseRate,
        sellRate: item.sellRate,
      })
      totalSell += calc.sellAmount
      totalProfit += calc.profit
    }
    const transportation = num(draft.transportationCharge)
    const advance = num(draft.advancePayment)
    const grandTotal = round2(totalSell + transportation)
    return {
      totalSell: round2(totalSell),
      totalProfit: round2(totalProfit),
      transportation,
      advance,
      grandTotal,
      balanceDue: round2(grandTotal - advance),
    }
  }, [items, draft.transportationCharge, draft.advancePayment])

  // ── Modal control ─────────────────────────────────────────────────────────
  const openAddItem = (roomTempId: string) =>
    setModal((m) => ({ open: true, roomTempId, editingItem: null, key: m.key + 1 }))

  const openEditItem = (item: DraftItem) =>
    setModal((m) => ({ open: true, roomTempId: item.roomTempId, editingItem: item, key: m.key + 1 }))

  const closeModal = () => setModal((m) => ({ ...m, open: false }))

  const handleItemSubmit = (
    roomTempId: string,
    input: DraftItemInput,
    editingTempId: string | null,
  ) => {
    if (editingTempId) {
      draft.updateItem(editingTempId, roomTempId, input)
    } else {
      draft.addItem(roomTempId, input)
    }
    closeModal()
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  const validate = (): FieldErrors => {
    const e: FieldErrors = {}
    if (!draft.customerName.trim()) e.customerName = 'Customer name is required'
    if (!draft.customerContact.trim()) e.customerContact = 'Customer number is required'
    if (!draft.orderCategoryId) e.orderCategoryId = 'Select a category'
    if (!draft.orderTypeId) e.orderTypeId = 'Select a type'
    return e
  }

  const handleSave = () => {
    setFormError(null)
    const errs = validate()
    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) {
      setFormError('Please complete the highlighted fields.')
      return
    }
    if (rooms.length === 0) {
      setFormError('Add at least one room.')
      return
    }
    if (rooms.some((room) => items.every((it) => it.roomTempId !== room.tempId))) {
      setFormError('Every room must contain at least one product.')
      return
    }

    const payload: CreateOrderPayload = {
      customer_name: draft.customerName.trim(),
      customer_contact: draft.customerContact.trim(),
      order_category_id: draft.orderCategoryId as number,
      order_type_id: draft.orderTypeId as number,
      advance_payment: num(draft.advancePayment),
      transportation_charge: num(draft.transportationCharge),
      notes: draft.notes.trim() || null,
      rooms: rooms.map((room, index) => ({
        room_name: room.roomName.trim() || `Room ${index + 1}`,
        sort_order: index,
        items: items
          .filter((it) => it.roomTempId === room.tempId)
          .map((it) => ({
            company_name: it.companyName,
            design_name: it.designName,
            size: it.size,
            finish: it.finish,
            thickness: it.thickness,
            product_image_path: it.productImagePath,
            item_type: it.itemType,
            pieces_per_box: it.piecesPerBox,
            number_of_boxes: it.numberOfBoxes,
            number_of_pieces: it.numberOfPieces,
            measurement_unit: it.measurementUnit,
            height: it.height,
            width: it.width,
            purchase_rate: it.purchaseRate,
            sell_rate: it.sellRate,
          })),
      })),
    }

    createOrder.mutate(payload, {
      onSuccess: () => {
        draft.reset()
        void navigate(isAdmin ? paths.orders : paths.dashboard, { replace: true })
      },
      onError: (error) => {
        setFormError(
          error.response?.data?.message ?? 'Could not save the order. Please try again.',
        )
      },
    })
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 pb-28 pt-4">
      <h1 className="text-center text-xl font-bold text-foreground">Add Detail</h1>

      {formError && (
        <Alert variant="error" message={formError} onDismiss={() => setFormError(null)} />
      )}

      <CustomerSection errors={fieldErrors} />

      {/* Rooms */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Rooms</h2>
          <button
            type="button"
            onClick={() => draft.addRoom(`Room ${rooms.length + 1}`)}
            className="inline-flex items-center gap-1.5 rounded-full bg-card px-4 py-2 text-sm font-semibold text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <PlusIcon size={16} />
            Add Room
          </button>
        </div>

        {rooms.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
            No rooms yet. Tap <span className="font-semibold text-foreground">Add Room</span> to begin.
          </p>
        ) : (
          rooms.map((room, index) => (
            <RoomCard
              key={room.tempId}
              room={room}
              index={index}
              items={items.filter((it) => it.roomTempId === room.tempId)}
              onRename={draft.renameRoom}
              onDelete={draft.removeRoom}
              onAddItem={openAddItem}
              onEditItem={openEditItem}
              onDeleteItem={draft.removeItem}
            />
          ))
        )}
      </div>

      <ChargesSection errors={fieldErrors} />

      <OrderTotalsBar
        totals={totals}
        onSave={handleSave}
        isSaving={createOrder.isPending}
        disabled={createOrder.isPending}
      />

      {modal.open && (
        <AddItemModal
          key={modal.key}
          isOpen={modal.open}
          onClose={closeModal}
          rooms={rooms}
          defaultRoomTempId={modal.roomTempId}
          editingItem={modal.editingItem}
          onSubmit={handleItemSubmit}
        />
      )}
    </div>
  )
}
