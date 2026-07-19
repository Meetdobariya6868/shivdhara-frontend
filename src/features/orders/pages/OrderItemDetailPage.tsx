import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { EditIcon, ImageIcon, TrashIcon } from '@/components/icons'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { StateMessage } from '@/components/ui/StateMessage'
import { paths } from '@/routes/paths'

import { useOrder } from '../hooks/useOrder'
import { useDeleteOrderItem } from '../hooks/useOrderActions'
import { formatINR } from '../utils/formatters'

export default function OrderItemDetailPage() {
  const navigate = useNavigate()
  const { orderId, itemId } = useParams<{ orderId: string; itemId: string }>()
  const ordId = Number(orderId)
  const itmId = Number(itemId)

  const { data, isLoading, isError, refetch } = useOrder(ordId)
  const deleteItem = useDeleteOrderItem()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const goBack = () => {
    void navigate(-1)
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Product details" onBack={goBack} />
        <div className="flex flex-col gap-4 px-4 py-4">
          <div className="h-64 animate-pulse rounded-3xl bg-card" />
          <div className="rounded-2xl bg-card px-4 py-4">
            <div className="h-5 w-2/3 animate-pulse rounded bg-surface" />
            <div className="mt-3 h-px bg-border" />
            <div className="mt-4 h-4 w-1/3 animate-pulse rounded bg-surface" />
            <div className="mt-3 h-8 w-full animate-pulse rounded-full bg-surface" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Product details" onBack={goBack} />
        <StateMessage
          title="Couldn't load this item"
          description="Something went wrong. Please try again."
          action={
            <Button onClick={() => void refetch()} className="mt-2">
              Retry
            </Button>
          }
        />
      </div>
    )
  }

  const item = data.data.rooms.flatMap((r) => r.items).find((i) => i.id === itmId)

  if (!item) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Product details" onBack={goBack} />
        <StateMessage
          title="Item not found"
          description="This product item may have been removed."
        />
      </div>
    )
  }

  const isBox = item.item_type === 'box'

  return (
    <div className="mx-auto max-w-2xl pb-28">
      <PageHeader title="Product details" onBack={goBack} />

      <div className="flex flex-col gap-4 px-4 py-4">
        {/* Hero image */}
        <div className="overflow-hidden rounded-3xl bg-card">
          {item.product_image_url ? (
            <img
              src={item.product_image_url}
              alt={item.product.design_name ?? 'Product'}
              className="h-64 w-full object-contain"
            />
          ) : (
            <div className="flex h-64 items-center justify-center text-muted">
              <ImageIcon size={56} />
            </div>
          )}
        </div>

        {/* Name, size + description */}
        <div className="rounded-2xl bg-card px-4 py-4">
          {/* Design name + size */}
          <div className="flex items-baseline justify-between gap-3">
            <p className="min-w-0 flex-1 text-base font-bold text-card-foreground line-clamp-2">
              {item.product.design_name ?? '—'}
            </p>
            {item.product.size && (
              <span className="shrink-0 text-sm font-medium text-muted">
                {item.product.size}
              </span>
            )}
          </div>

          <div className="my-3 h-px bg-border" />

          {/* Description section */}
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">
            Description
          </h2>

          {isBox ? (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Box :</span>
                <span className="rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold tabular-nums text-primary">
                  {item.quantity}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Piece in one box :</span>
                <span className="rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold tabular-nums text-primary">
                  {item.pieces_per_box ?? 0}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Piece :</span>
              <span className="rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold tabular-nums text-primary">
                {item.quantity}
              </span>
            </div>
          )}

          <div className="my-3 h-px bg-border" />

          {/* Rate + price */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between py-1.5">
              <span className="text-sm text-muted">Sq.Ft Rate :</span>
              <span className="text-sm font-semibold tabular-nums text-card-foreground">
                {formatINR(item.sqft_rate)}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-sm text-muted">Price per piece :</span>
              <span className="text-sm font-semibold tabular-nums text-card-foreground">
                ₹{Number(item.price_per_item).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-sm text-muted">Total :</span>
              <span className="text-base font-bold tabular-nums text-card-foreground">
                ₹{Number(item.product_total).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => { void navigate(paths.orderItemEdit(ordId, itmId)) }}
            aria-label="Edit item"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <EditIcon size={16} />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            aria-label="Delete item"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-error/50 bg-card px-4 py-3.5 text-sm font-semibold text-error transition-colors hover:bg-error/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <TrashIcon size={16} />
            Delete
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDelete}
        title="Delete this item?"
        message="This will permanently remove the product from the order and recalculate the order total. This action cannot be undone."
        confirmLabel="Delete"
        destructive
        isLoading={deleteItem.isPending}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() =>
          deleteItem.mutate(itmId, {
            onSuccess: () => {
              setConfirmDelete(false)
              void navigate(paths.orderDetail(ordId))
            },
          })
        }
      />
    </div>
  )
}
