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
  order_number: string
  order_date: string
  customer: OrderCustomer
  creator: OrderCreator
  category: OrderCategory
  type: OrderType
  advance_payment: string
  transportation_charge: string
  total_purchase_amount: string
  total_sell_amount: string
  total_profit: string
  grand_total: string
  balance_due: string
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
