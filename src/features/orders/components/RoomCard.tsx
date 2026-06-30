import { PlusIcon, TrashIcon } from '@/components/icons'
import { IconButton } from '@/components/ui/IconButton'

import type { DraftItem, DraftRoom } from '../store/orderDraftStore'
import { calculateItem } from '../utils/calculateItem'
import { formatINR } from '../utils/formatters'
import { OrderItemRow } from './OrderItemRow'

interface RoomCardProps {
  room: DraftRoom
  index: number
  items: DraftItem[]
  onRename: (tempId: string, name: string) => void
  onDelete: (tempId: string) => void
  onAddItem: (roomTempId: string) => void
  onEditItem: (item: DraftItem) => void
  onDeleteItem: (tempId: string) => void
}

/**
 * A room grouping: editable name, its product list, a per-room "Add product"
 * action, and a running sell subtotal.
 */
export function RoomCard({
  room,
  index,
  items,
  onRename,
  onDelete,
  onAddItem,
  onEditItem,
  onDeleteItem,
}: RoomCardProps) {
  const subtotal = items.reduce((sum, item) => {
    const calc = calculateItem({
      itemType: item.itemType,
      piecesPerBox: item.piecesPerBox,
      numberOfBoxes: item.numberOfBoxes,
      numberOfPieces: item.numberOfPieces,
      measurementUnit: item.measurementUnit,
      height: item.height,
      width: item.width,
      purchaseRate: item.purchaseRate,
      sellRate: item.sqftRate,
    })
    return sum + calc.sellAmount
  }, 0)

  return (
    <section className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4">
      {/* Header: index badge + editable name + delete */}
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {index + 1}
        </span>
        <input
          value={room.roomName}
          onChange={(e) => onRename(room.tempId, e.target.value)}
          placeholder="Room name"
          aria-label={`Room ${index + 1} name`}
          className="min-w-0 flex-1 bg-transparent text-base font-semibold text-card-foreground placeholder:text-muted focus:outline-none"
        />
        <IconButton
          icon={<TrashIcon size={18} />}
          label="Delete room"
          variant="danger"
          onClick={() => onDelete(room.tempId)}
        />
      </div>

      {/* Items */}
      {items.length > 0 ? (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <OrderItemRow
              key={item.tempId}
              item={item}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl bg-surface px-3 py-4 text-center text-xs text-muted">
          No products yet. Add the first one below.
        </p>
      )}

      {/* Footer: add + subtotal */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onAddItem(room.tempId)}
          className="inline-flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-primary transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <PlusIcon size={16} />
          Add product
        </button>
        {items.length > 0 && (
          <p className="text-sm font-semibold tabular-nums text-card-foreground">
            ₹{formatINR(subtotal)}
          </p>
        )}
      </div>
    </section>
  )
}
