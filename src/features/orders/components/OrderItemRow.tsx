import { EditIcon, ImageIcon, TrashIcon } from '@/components/icons'
import { IconButton } from '@/components/ui/IconButton'

import type { DraftItem } from '../store/orderDraftStore'
import { calculateItem } from '../utils/calculateItem'
import { formatINR } from '../utils/formatters'

interface OrderItemRowProps {
  item: DraftItem
  onEdit: (item: DraftItem) => void
  onDelete: (tempId: string) => void
}

/** A single product line within a room card. */
export function OrderItemRow({ item, onEdit, onDelete }: OrderItemRowProps) {
  const calc = calculateItem({
    itemType: item.itemType,
    quantity: item.quantity,
    piecesPerBox: item.piecesPerBox,
    measurementUnit: item.measurementUnit,
    height: item.height,
    width: item.width,
    sqftRate: item.sqftRate,
  })

  const quantityLabel =
    item.itemType === 'box'
      ? `${item.quantity} box × ${item.piecesPerBox ?? 0} pcs`
      : `${item.quantity} pcs`

  const title = [item.designName, item.companyName].filter(Boolean).join(' · ')

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface px-3 py-3">
      {/* Thumbnail */}
      {item.productImageUrl ? (
        <img
          src={item.productImageUrl}
          alt={item.designName}
          className="h-12 w-12 shrink-0 rounded-xl object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-card text-muted">
          <ImageIcon size={20} />
        </div>
      )}

      {/* Details */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{title}</p>
        <p className="truncate text-xs text-muted">
          {quantityLabel} · {calc.totalSqft} ft²
        </p>
      </div>

      {/* Amount */}
      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold tabular-nums text-foreground">
          ₹{formatINR(item.productTotal)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center">
        <IconButton icon={<EditIcon size={18} />} label="Edit item" onClick={() => onEdit(item)} />
        <IconButton
          icon={<TrashIcon size={18} />}
          label="Delete item"
          variant="danger"
          onClick={() => onDelete(item.tempId)}
        />
      </div>
    </div>
  )
}
