import type { ItemType, MeasurementUnit } from '../types'

/** Item-type choices for the box/piece selector. */
export const ITEM_TYPE_OPTIONS: ReadonlyArray<{ value: ItemType; label: string }> = [
  { value: 'box', label: 'Boxes' },
  { value: 'piece', label: 'Pieces' },
]

/** Measurement-unit choices for the dimensions selector. */
export const MEASUREMENT_UNIT_OPTIONS: ReadonlyArray<{ value: MeasurementUnit; label: string }> = [
  { value: 'mm', label: 'mm' },
  { value: 'inch', label: 'inch' },
  { value: 'feet', label: 'feet' },
]
