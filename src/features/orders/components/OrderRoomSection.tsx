import { EditIcon, ImageIcon } from '@/components/icons'

import { formatINR } from '../utils/formatters'
import type { OrderDetailItem, OrderDetailRoom } from '../types'

interface OrderRoomSectionProps {
  room: OrderDetailRoom
  /** Show rename / move controls (admin or the order's creator). */
  canEdit: boolean
  onRename: (room: OrderDetailRoom) => void
  onMoveItem: (item: OrderDetailItem) => void
  /** Navigate to the item detail screen. */
  onItemClick: (item: OrderDetailItem) => void
}

/** Human-readable quantity, mirroring the box/piece distinction. */
function quantityLabel(item: OrderDetailItem): string {
  return item.item_type === 'box'
    ? `${item.number_of_boxes ?? 0} box × ${item.pieces_per_box ?? 0} pcs`
    : `${item.number_of_pieces ?? 0} pcs`
}

/** One room card on the order detail screen: title, rename control and its items. */
export function OrderRoomSection({ room, canEdit, onRename, onMoveItem, onItemClick }: OrderRoomSectionProps) {
  return (
    <section className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4">
      {/* Header: room name + rename */}
      <div className="flex items-center gap-2">
        <h3 className="min-w-0 flex-1 truncate text-base font-bold text-card-foreground">
          {room.room_name}
        </h3>
        {canEdit && (
          <button
            type="button"
            onClick={() => onRename(room)}
            aria-label={`Rename ${room.room_name}`}
            className="shrink-0 rounded-full p-1.5 text-muted transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <EditIcon size={16} />
          </button>
        )}
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2">
        {room.items.map((item) => (
          <div
            key={item.id}
            role="button"
            tabIndex={0}
            onClick={() => onItemClick(item)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onItemClick(item) }}
            aria-label={`View details for ${item.product.design_name ?? 'product'}`}
            className="flex items-center gap-3 rounded-2xl bg-surface px-3 py-3 text-left transition-opacity hover:opacity-80 active:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {/* Thumbnail */}
            {item.product_image_url ? (
              <img
                src={item.product_image_url}
                alt={item.product.design_name ?? 'Product'}
                className="h-12 w-12 shrink-0 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-card text-muted">
                <ImageIcon size={20} />
              </div>
            )}

            {/* Details */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-surface-foreground">
                {item.product.design_name ?? '—'}
              </p>
              <p className="truncate text-xs text-muted">
                {[item.product.finish, item.product.size].filter(Boolean).join(' · ') || '—'}
              </p>
              <p className="mt-0.5 text-xs text-muted">{quantityLabel(item)}</p>
            </div>

            {/* Amount + move */}
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="text-sm font-semibold tabular-nums text-surface-foreground">
                ₹{formatINR(item.product_total)}
              </span>
              {canEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onMoveItem(item)
                  }}
                  className="text-xs font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Move
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
