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

/** Workflow state — mirrors the backend OrderStatus enum. */
export type OrderStatus = 'pending' | 'confirmed'

export interface Order {
  id: number
  customer: OrderCustomer
  creator: OrderCreator
  category: OrderCategory
  type: OrderType
  status: OrderStatus
  status_label: string
  advance_payment: string
  transportation_charge: string
  grand_total: string
  notes: string | null
  architect_name: string | null
  created_at: string
}

/** Order list filter state — sent to the API as query params. */
export interface OrderFilters {
  search?: string
  date_from?: string
  date_to?: string
  order_category_id?: number
  order_type_id?: number
  creator_id?: number
}

/** Query params for the paginated order list (filters + pagination). */
export interface OrderListParams extends OrderFilters {
  page?: number
  per_page?: number
}

/** A salesman option for the order list's salesman filter (GET /orders/salesmen). */
export interface SalesmanOption {
  id: number
  name: string
}

// ── Catalogue autocomplete ───────────────────────────────────────────────────

/**
 * One selectable variant returned by GET /design-variants/search.
 * Selecting a row auto-fills the Add-Item product fields and links the order
 * item to this exact variant (so no duplicate catalogue rows are created).
 */
export interface DesignVariantOption {
  id: number
  size: string
  finish: string
  thickness: string
  purchase_rate: string
  sell_rate: string
  design: {
    id: number | null
    design_name: string | null
    design_code: string | null
    company: {
      id: number | null
      company_name: string | null
    }
  }
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
  /** Set when picked from the autocomplete → backend links to this exact variant. */
  design_variant_id?: number | null
  company_name: string
  design_name: string
  size: string
  finish: string
  thickness: string
  product_image_path?: string | null
  item_type: ItemType
  /** Boxes ordered (box items) or pieces ordered (piece items). */
  quantity: number
  /** Box items only; omitted for piece items. */
  pieces_per_box?: number | null
  measurement_unit: MeasurementUnit
  height: number
  width: number
  purchase_rate: number
  sell_rate: number
  /** Per-item price (editable); product_total is derived server-side. */
  price_per_item: number
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
  /** Sent only for "Architect" order types; null otherwise. */
  architect_name?: string | null
  rooms: CreateOrderRoomPayload[]
}

// ── Update order item (PATCH /order-items/{id}) ─────────────────────────────

export interface UpdateOrderItemPayload {
  /**
   * Omit to keep the existing image; send null to clear it; send a storage path
   * (from POST /order-item-images) to replace it.
   */
  product_image_path?: string | null
  item_type: ItemType
  /** Boxes ordered (box items) or pieces ordered (piece items). */
  quantity: number
  /** Box items only; omitted for piece items. */
  pieces_per_box?: number | null
  measurement_unit: MeasurementUnit
  height: number
  width: number
  sqft_rate: number
  /** Per-item price (editable); product_total is derived server-side. */
  price_per_item: number
}

// ── Order detail (GET /orders/{id}) ──────────────────────────────────────────

/** Catalogue identity of an item, as returned by OrderItemResource. */
export interface OrderItemProduct {
  company_name: string | null
  design_name: string | null
  size: string | null
  finish: string | null
  thickness: string | null
}

/** One persisted product line within a room (decimal fields arrive as strings). */
export interface OrderDetailItem {
  id: number
  product: OrderItemProduct
  product_image_url: string | null
  item_type: ItemType
  quantity: number
  pieces_per_box: number | null
  measurement_unit: MeasurementUnit
  height: string
  width: string
  sqft_rate: string
  /** Per-item price. */
  price_per_item: string
  /** Line total = price_per_item × quantity (× pieces_per_box for box items). */
  product_total: string
}

/** A room with its items, ordered by sort_order. */
export interface OrderDetailRoom {
  id: number
  room_name: string
  sort_order: number
  items: OrderDetailItem[]
}

/** Full order detail: the list-row Order plus its room/item graph. */
export interface OrderDetail extends Order {
  rooms: OrderDetailRoom[]
}
