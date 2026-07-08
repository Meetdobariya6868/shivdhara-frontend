import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { DetailRow } from '@/components/ui/DetailRow'
import { StateMessage } from '@/components/ui/StateMessage'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { paths } from '@/routes/paths'

import { EditIcon, PlusIcon } from '@/components/icons'

import { AddOrderItemModal } from '../components/AddOrderItemModal'
import { EditOrderDetailsModal } from '../components/EditOrderDetailsModal'
import { MoveItemModal } from '../components/MoveItemModal'
import { OrderDetailSkeleton } from '../components/OrderDetailSkeleton'
import { OrderRoomSection } from '../components/OrderRoomSection'
import { QuotationActions } from '../components/QuotationActions'
import { OrderStatusBadge } from '../components/OrderStatusBadge'
import { RoomNameModal } from '../components/RoomNameModal'
import { useOrder } from '../hooks/useOrder'
import {
  useAddOrderItem,
  useAddRoom,
  useDeleteOrder,
  useDeleteRoom,
  useMoveOrderItem,
  useRenameRoom,
  useUpdateOrderDetails,
  useUpdateOrderStatus,
} from '../hooks/useOrderActions'
import type { OrderDetailItem, OrderDetailRoom } from '../types'
import { formatINR, formatOrderDate } from '../utils/formatters'

/** Card wrapper with a section title (and an optional header action), used for the detail blocks. */
function Section({
  title,
  action,
  children,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

export default function OrderDetailPage() {
  const navigate = useNavigate()
  const { orderId } = useParams<{ orderId: string }>()
  const id = Number(orderId)

  const isAdmin = useAuthStore((s) => s.user?.is_admin ?? false)
  const currentUserId = useAuthStore((s) => s.user?.id)

  const { data, isLoading, isError, refetch } = useOrder(id)
  const updateStatus = useUpdateOrderStatus()
  const deleteOrder = useDeleteOrder()
  const addRoom = useAddRoom()
  const renameRoom = useRenameRoom()
  const deleteRoom = useDeleteRoom()
  const moveItem = useMoveOrderItem()
  const addItem = useAddOrderItem()
  const updateDetails = useUpdateOrderDetails()

  const [roomToRename, setRoomToRename] = useState<OrderDetailRoom | null>(null)
  const [roomToDelete, setRoomToDelete] = useState<OrderDetailRoom | null>(null)
  const [deleteRoomError, setDeleteRoomError] = useState<string | null>(null)
  const [itemToMove, setItemToMove] = useState<OrderDetailItem | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [addingRoom, setAddingRoom] = useState(false)
  const [roomForNewItem, setRoomForNewItem] = useState<OrderDetailRoom | null>(null)
  const [addItemError, setAddItemError] = useState<string | null>(null)
  const [editingDetails, setEditingDetails] = useState(false)
  const [editDetailsError, setEditDetailsError] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Order Detail" onBack={() => {
          void navigate(-1)
        }} />
        <OrderDetailSkeleton />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Order Detail" onBack={() => {
          void navigate(-1)
        }} />
        <StateMessage
          title="Couldn't load this order"
          description="It may have been removed, or something went wrong. Please try again."
          action={
            <Button onClick={() => void refetch()} className="mt-2">
              Retry
            </Button>
          }
        />
      </div>
    )
  }

  const order = data.data
  const canEdit = isAdmin || order.creator.id === currentUserId
  const remaining = Number(order.grand_total) - Number(order.advance_payment)

  return (
    <div className="mx-auto max-w-2xl pb-28">
      <PageHeader
        title="Order Detail"
        onBack={() => {
          void navigate(-1)
        }}
        right={<OrderStatusBadge status={order.status} label={order.status_label} />}
      />

      <div className="flex flex-col gap-4 px-4 py-4">
        {/* Customer */}
        <Section
          title="Customer detail"
          action={
            canEdit && (
              <button
                type="button"
                onClick={() => {
                  setEditDetailsError(null)
                  setEditingDetails(true)
                }}
                aria-label="Edit order details"
                className="shrink-0 rounded-full p-1.5 text-muted transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <EditIcon size={16} />
              </button>
            )
          }
        >
          <DetailRow label="Name" value={order.customer.name} />
          <DetailRow label="Mobile No." value={order.customer.contact} />
          <DetailRow label="Category" value={order.category.name} />
          <DetailRow label="Order Type" value={order.type.name} />
          {order.architect_name && (
            <DetailRow label="Architect" value={order.architect_name} />
          )}
          <DetailRow label="Order Date" value={formatOrderDate(order.created_at)} />
        </Section>

        {/* Payment */}
        <Section title="Payment detail">
          <DetailRow label="Transportation charge" value={`₹${formatINR(order.transportation_charge)}`} />
          <DetailRow label="Advance payment" value={`₹${formatINR(order.advance_payment)}`} />
          <DetailRow label="Remaining payment" value={`₹${formatINR(remaining)}`} />
          <DetailRow label="Total payment" value={`₹${formatINR(order.grand_total)}`} emphasize />
        </Section>

        {/* Products grouped by room */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted">Products</h2>
            {canEdit && (
              <button
                type="button"
                onClick={() => setAddingRoom(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <PlusIcon size={14} />
                Add room
              </button>
            )}
          </div>
          {order.rooms.length === 0 ? (
            <p className="rounded-2xl bg-card px-4 py-6 text-center text-sm text-muted">
              This order has no rooms.
            </p>
          ) : (
            <QuotationActions orderId={order.id} customerName={order.customer.name} />
          )}
          {order.rooms.length > 0 &&
            order.rooms.map((room) => (
              <OrderRoomSection
                key={room.id}
                room={room}
                canEdit={canEdit}
                onRename={setRoomToRename}
                onMoveItem={setItemToMove}
                onAddItem={(r) => {
                  setAddItemError(null)
                  setRoomForNewItem(r)
                }}
                onDeleteRoom={(r) => {
                  setDeleteRoomError(null)
                  setRoomToDelete(r)
                }}
                onItemClick={(item) => {
                  void navigate(paths.orderItemDetail(id, item.id))
                }}
              />
            ))}
        </div>

        {/* Actions */}
        {canEdit && (
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            {order.status === 'pending' && (
              <Button
                onClick={() => updateStatus.mutate({ id: order.id, status: 'confirmed' })}
                isLoading={updateStatus.isPending}
                fullWidth
                className="sm:w-auto"
              >
                Confirm Order
              </Button>
            )}
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center justify-center rounded-xl border border-error px-8 py-3.5 text-sm font-semibold text-error transition-colors hover:bg-error-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Delete Order
            </button>
          </div>
        )}
      </div>

      {/* Edit order details */}
      {editingDetails && (
        <EditOrderDetailsModal
          isOpen
          order={order}
          isSaving={updateDetails.isPending}
          error={editDetailsError}
          onClose={() => setEditingDetails(false)}
          onSave={(payload) => {
            setEditDetailsError(null)
            updateDetails.mutate(
              { id: order.id, payload },
              {
                onSuccess: () => setEditingDetails(false),
                onError: () =>
                  setEditDetailsError("Couldn't save these changes. Please try again."),
              },
            )
          }}
        />
      )}

      {/* Add room */}
      {addingRoom && (
        <RoomNameModal
          isOpen
          title="Add room"
          submitLabel="Add"
          isSaving={addRoom.isPending}
          onClose={() => setAddingRoom(false)}
          onSave={(name) =>
            addRoom.mutate(
              { orderId: order.id, roomName: name },
              { onSuccess: () => setAddingRoom(false) },
            )
          }
        />
      )}

      {/* Rename room */}
      {roomToRename && (
        <RoomNameModal
          isOpen
          title="Rename room"
          submitLabel="Save"
          initialName={roomToRename.room_name}
          isSaving={renameRoom.isPending}
          onClose={() => setRoomToRename(null)}
          onSave={(name) =>
            renameRoom.mutate(
              { roomId: roomToRename.id, roomName: name },
              { onSuccess: () => setRoomToRename(null) },
            )
          }
        />
      )}

      {/* Add item */}
      {roomForNewItem && (
        <AddOrderItemModal
          isOpen
          roomName={roomForNewItem.room_name}
          isSaving={addItem.isPending}
          error={addItemError}
          onClose={() => setRoomForNewItem(null)}
          onSave={(payload) => {
            setAddItemError(null)
            addItem.mutate(
              { roomId: roomForNewItem.id, payload },
              {
                onSuccess: () => setRoomForNewItem(null),
                onError: () => setAddItemError("Couldn't add the item. Please try again."),
              },
            )
          }}
        />
      )}

      {/* Delete room */}
      {roomToDelete && (
        <ConfirmDialog
          isOpen
          title="Delete this room?"
          message={`"${roomToDelete.room_name}" has no items and will be removed from this order. This action cannot be undone.`}
          confirmLabel="Delete"
          destructive
          isLoading={deleteRoom.isPending}
          error={deleteRoomError}
          onClose={() => setRoomToDelete(null)}
          onConfirm={() =>
            deleteRoom.mutate(roomToDelete.id, {
              onSuccess: () => setRoomToDelete(null),
              onError: () =>
                setDeleteRoomError(
                  "Couldn't delete this room — it may already have items. Please refresh and try again.",
                ),
            })
          }
        />
      )}

      {/* Move item */}
      {itemToMove && (
        <MoveItemModal
          isOpen
          rooms={order.rooms}
          currentRoomId={
            order.rooms.find((r) => r.items.some((i) => i.id === itemToMove.id))?.id ?? 0
          }
          isSaving={moveItem.isPending}
          onClose={() => setItemToMove(null)}
          onMove={(roomId) =>
            moveItem.mutate(
              { itemId: itemToMove.id, roomId },
              { onSuccess: () => setItemToMove(null) },
            )
          }
        />
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={confirmDelete}
        title="Delete this order?"
        message="This will remove the order and all its rooms and items. This action cannot be undone."
        confirmLabel="Delete"
        destructive
        isLoading={deleteOrder.isPending}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() =>
          deleteOrder.mutate(order.id, {
            onSuccess: () => {
              setConfirmDelete(false)
              void navigate(-1)
            },
          })
        }
      />
    </div>
  )
}
