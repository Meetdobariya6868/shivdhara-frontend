import type { ItemType, MeasurementUnit } from '../types'

/**
 * Conversion factor from each unit to feet. Mirrors the backend
 * MeasurementUnit::toFeetFactor() so the live preview matches the
 * server-authoritative figures exactly.
 */
const FEET_FACTOR: Record<MeasurementUnit, number> = {
  mm: 1 / 304.8,
  inch: 1 / 12,
  feet: 1,
}

/** Round to `decimals` places, matching PHP's round() half-up behaviour closely. */
function round(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round((value + Number.EPSILON) * factor) / factor
}

/** Pieces billed for a line: boxes × piecesPerBox (box) or the piece count (piece). */
export function totalPieces(
  itemType: ItemType,
  quantity: number,
  piecesPerBox?: number | null,
): number {
  return itemType === 'box' ? quantity * (piecesPerBox ?? 0) : quantity
}

/**
 * Line total from a (possibly hand-overridden) per-item price. Mirrors the
 * server-side OrderService::computeProductTotal exactly, so the preview and the
 * persisted total agree.
 */
export function lineTotal(
  itemType: ItemType,
  quantity: number,
  piecesPerBox: number | null | undefined,
  pricePerItem: number,
): number {
  return round(pricePerItem * totalPieces(itemType, quantity, piecesPerBox), 2)
}

export interface ItemCalcInput {
  itemType: ItemType
  /** Boxes ordered (box items) or pieces ordered (piece items). */
  quantity: number
  /** Box items only. */
  piecesPerBox?: number | null
  measurementUnit: MeasurementUnit
  height: number
  width: number
  /** "Product Sq Ft Rate" — the rate actually charged. */
  sqftRate: number
}

export interface ItemCalcResult {
  totalPieces: number
  /** Total billed area across all pieces (sqft). */
  totalSqft: number
  /** Per-piece price = single-piece area × sqft rate (the editable default). */
  pricePerItem: number
  /** Line total = pricePerItem × totalPieces (auto; mirrors the server product_total). */
  productTotal: number
}

/**
 * Pure, framework-free item calculation for the live preview. Kept aligned with
 * the backend: price_per_item = area × sqft_rate; product_total =
 * price_per_item × pieces (× pieces_per_box for box items). The server recomputes
 * product_total on submit, so this is preview-only.
 */
export function calculateItem(input: ItemCalcInput): ItemCalcResult {
  const factor = FEET_FACTOR[input.measurementUnit]
  const areaSqft = round(input.height * factor * (input.width * factor), 4)

  const pieces = totalPieces(input.itemType, input.quantity, input.piecesPerBox)
  const pricePerItem = round(areaSqft * input.sqftRate, 2)

  return {
    totalPieces: pieces,
    totalSqft: round(areaSqft * pieces, 4),
    pricePerItem,
    productTotal: round(pricePerItem * pieces, 2),
  }
}
