/** A company as returned for the catalogue filter (GET /companies). */
export interface Company {
  id: number
  company_name: string
}

/** A design row in the catalogue list (GET /designs). */
export interface DesignListItem {
  id: number
  design_name: string
  is_active: boolean
  variants_count: number
  /** The sole variant's code, present only when the design has exactly one variant. */
  code: string | null
  company: Company
}

/**
 * A design variant for the management view. Rate fields arrive as strings
 * (decimal:2 cast) and are the only editable attributes.
 */
export interface DesignVariantRate {
  id: number
  /** This variant's own unique code (company + design + size/finish/thickness). */
  code: string
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
  design_name: string
  is_active: boolean
  company: Company
  variants: DesignVariantRate[]
}

/** User-controlled filters for the designs list. */
export interface DesignFilters {
  /** Matches design name, company name, or a variant's code. */
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
