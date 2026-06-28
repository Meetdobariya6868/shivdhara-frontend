export interface OrderCustomer {
  id: number
  name: string
  contact: string
}

export interface OrderCreator {
  id: number
  name: string
}

export interface OrderCategory {
  id: number
  name: string
}

export interface OrderType {
  id: number
  name: string
}

export interface Order {
  id: number
  order_date: string
  customer: OrderCustomer
  creator: OrderCreator
  category: OrderCategory
  type: OrderType
  advance_payment: string
  transportation_charge: string
  grand_total: string
  notes: string | null
  created_at: string
}

/** Client-side filter state — nothing is sent to the API. */
export interface OrderFilters {
  search?: string
  date_from?: string
  date_to?: string
  order_category_id?: number
  order_type_id?: number
  creator_id?: number
}

// ── Create Order ────────────────────────────────────────────────────────────

/** Mirrors the backend ItemType enum. */
export type ItemType = 'box' | 'piece'

/** Mirrors the backend MeasurementUnit enum. */
export type MeasurementUnit = 'mm' | 'inch' | 'feet'

/** Result of POST /order-item-images. */
export interface UploadedImage {
  path: string
  url: string
}

/** A single item in the create-order payload (snake_case = API contract). */
export interface CreateOrderItemPayload {
  company_name: string
  design_name: string
  size: string
  finish: string
  thickness: string
  product_image_path?: string | null
  item_type: ItemType
  pieces_per_box?: number | null
  number_of_boxes?: number | null
  number_of_pieces?: number | null
  measurement_unit: MeasurementUnit
  height: number
  width: number
  purchase_rate: number
  sell_rate: number
  product_total: number
}

/** A room with its items in the create-order payload. */
export interface CreateOrderRoomPayload {
  room_name: string
  sort_order: number
  items: CreateOrderItemPayload[]
}

/** Full body sent to POST /orders. */
export interface CreateOrderPayload {
  customer_name: string
  customer_contact: string
  order_category_id: number
  order_type_id: number
  advance_payment: number
  transportation_charge: number
  notes?: string | null
  rooms: CreateOrderRoomPayload[]
}
