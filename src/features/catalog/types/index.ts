/** A company as returned for the catalogue filter (GET /companies). */
export interface Company {
  id: number
  company_name: string
}

/** A design row in the catalogue list (GET /designs). */
export interface DesignListItem {
  id: number
  design_code: string
  design_name: string
  is_active: boolean
  variants_count: number
  company: Company
}

/**
 * A design variant for the management view. Rate fields arrive as strings
 * (decimal:2 cast) and are the only editable attributes.
 */
export interface DesignVariantRate {
  id: number
  size: string
  finish: string
  thickness: string
  purchase_rate: string
  sell_rate: string
  is_active: boolean
}

/** A design with its variants (GET /designs/{id}). */
export interface DesignDetail {
  id: number
  design_code: string
  design_name: string
  is_active: boolean
  company: Company
  variants: DesignVariantRate[]
}

/** User-controlled filters for the designs list. */
export interface DesignFilters {
  /** Matches design name, design code, or company name. */
  search?: string
}

/** Query params for the paginated designs list (filters + pagination). */
export interface DesignListParams extends DesignFilters {
  page?: number
  per_page?: number
}

/** Payload for PATCH /design-variants/{id} — only the two rate fields. */
export interface UpdateVariantRatesPayload {
  purchase_rate: number
  sell_rate: number
}
