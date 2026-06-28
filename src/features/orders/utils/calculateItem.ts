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

export interface ItemCalcInput {
  itemType: ItemType
  piecesPerBox?: number | null
  numberOfBoxes?: number | null
  numberOfPieces?: number | null
  measurementUnit: MeasurementUnit
  height: number
  width: number
  purchaseRate: number
  sellRate: number
}

export interface ItemCalcResult {
  areaSqft: number
  totalPieces: number
  totalSqft: number
  purchaseAmount: number
  sellAmount: number
  profit: number
}

/**
 * Pure, framework-free item calculation. The server recomputes these values on
 * submit, so this is preview-only — but kept byte-for-byte aligned with the
 * backend formula.
 */
export function calculateItem(input: ItemCalcInput): ItemCalcResult {
  const factor = FEET_FACTOR[input.measurementUnit]
  const areaSqft = round(input.height * factor * (input.width * factor), 4)

  const totalPieces =
    input.itemType === 'box'
      ? (input.numberOfBoxes ?? 0) * (input.piecesPerBox ?? 0)
      : (input.numberOfPieces ?? 0)

  const totalSqft = round(areaSqft * totalPieces, 4)
  const purchaseAmount = round(totalSqft * input.purchaseRate, 2)
  const sellAmount = round(totalSqft * input.sellRate, 2)
  const profit = round(sellAmount - purchaseAmount, 2)

  return { areaSqft, totalPieces, totalSqft, purchaseAmount, sellAmount, profit }
}
