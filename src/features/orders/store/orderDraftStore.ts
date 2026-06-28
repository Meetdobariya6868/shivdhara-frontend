import { create } from 'zustand'

import type { ItemType, MeasurementUnit } from '../types'

// Monotonic client-side ids for draft rows (never sent to the API).
let idSeq = 0
const nextId = (prefix: string): string => `${prefix}-${++idSeq}`

/** A product line being drafted, owned by a room via `roomTempId`. */
export interface DraftItem {
  tempId: string
  roomTempId: string
  companyName: string
  designName: string
  size: string
  finish: string
  thickness: string
  productImagePath: string | null
  productImageUrl: string | null
  itemType: ItemType
  piecesPerBox: number | null
  numberOfBoxes: number | null
  numberOfPieces: number | null
  measurementUnit: MeasurementUnit
  height: number
  width: number
  purchaseRate: number
  sellRate: number
  /** Editable line total persisted to the order_items.product_total column. */
  productTotal: number
}

/** Everything needed to build an item except its identity/room assignment. */
export type DraftItemInput = Omit<DraftItem, 'tempId' | 'roomTempId'>

export interface DraftRoom {
  tempId: string
  roomName: string
}

interface OrderDraftState {
  customerName: string
  customerContact: string
  orderCategoryId: number | null
  orderTypeId: number | null
  advancePayment: string
  transportationCharge: string
  notes: string
  rooms: DraftRoom[]
  items: DraftItem[]

  // Order-level field setters
  setField: <K extends keyof OrderDraftFields>(key: K, value: OrderDraftFields[K]) => void

  // Rooms
  addRoom: (roomName: string) => string
  renameRoom: (tempId: string, roomName: string) => void
  removeRoom: (tempId: string) => void

  // Items
  addItem: (roomTempId: string, input: DraftItemInput) => void
  updateItem: (tempId: string, roomTempId: string, input: DraftItemInput) => void
  removeItem: (tempId: string) => void
  moveItem: (tempId: string, roomTempId: string) => void

  reset: () => void
}

/** The plain editable fields (used by the typed `setField`). */
type OrderDraftFields = Pick<
  OrderDraftState,
  | 'customerName'
  | 'customerContact'
  | 'orderCategoryId'
  | 'orderTypeId'
  | 'advancePayment'
  | 'transportationCharge'
  | 'notes'
>

const INITIAL: OrderDraftFields & { rooms: DraftRoom[]; items: DraftItem[] } = {
  customerName: '',
  customerContact: '',
  orderCategoryId: null,
  orderTypeId: null,
  advancePayment: '',
  transportationCharge: '',
  notes: '',
  rooms: [],
  items: [],
}

/**
 * Draft state for the Create Order flow. Lives in Zustand (not component state)
 * because the page and the Add-Item modal both read and mutate the same draft.
 * Items are stored flat and keyed to a room by `roomTempId`, so moving an item
 * between rooms is a single field change.
 *
 * `reset()` must be called after a successful submit and when leaving the page.
 */
export const useOrderDraftStore = create<OrderDraftState>((set) => ({
  ...INITIAL,

  setField: (key, value) => set(() => ({ [key]: value })),

  addRoom: (roomName) => {
    const tempId = nextId('room')
    set((state) => ({ rooms: [...state.rooms, { tempId, roomName }] }))
    return tempId
  },

  renameRoom: (tempId, roomName) =>
    set((state) => ({
      rooms: state.rooms.map((r) => (r.tempId === tempId ? { ...r, roomName } : r)),
    })),

  removeRoom: (tempId) =>
    set((state) => ({
      rooms: state.rooms.filter((r) => r.tempId !== tempId),
      // Cascade: drop any items that belonged to the removed room.
      items: state.items.filter((i) => i.roomTempId !== tempId),
    })),

  addItem: (roomTempId, input) =>
    set((state) => ({
      items: [...state.items, { ...input, tempId: nextId('item'), roomTempId }],
    })),

  updateItem: (tempId, roomTempId, input) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.tempId === tempId ? { ...input, tempId, roomTempId } : i,
      ),
    })),

  removeItem: (tempId) =>
    set((state) => ({ items: state.items.filter((i) => i.tempId !== tempId) })),

  moveItem: (tempId, roomTempId) =>
    set((state) => ({
      items: state.items.map((i) => (i.tempId === tempId ? { ...i, roomTempId } : i)),
    })),

  reset: () => set(() => ({ ...INITIAL })),
}))
