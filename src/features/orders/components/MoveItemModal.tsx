import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'

import type { OrderDetailRoom } from '../types'

interface MoveItemModalProps {
  isOpen: boolean
  rooms: OrderDetailRoom[]
  currentRoomId: number
  isSaving: boolean
  onClose: () => void
  onMove: (roomId: number) => void
}

/** Modal to move an item from its current room into another room of the order. */
export function MoveItemModal({
  isOpen,
  rooms,
  currentRoomId,
  isSaving,
  onClose,
  onMove,
}: MoveItemModalProps) {
  const targets = rooms.filter((room) => room.id !== currentRoomId)
  const [roomId, setRoomId] = useState<number | null>(targets[0]?.id ?? null)

  const hasTargets = targets.length > 0

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Move item to room"
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl px-5 py-3 text-sm font-semibold text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          >
            Cancel
          </button>
          <Button
            onClick={() => roomId !== null && onMove(roomId)}
            isLoading={isSaving}
            disabled={!hasTargets || roomId === null}
          >
            Move
          </Button>
        </div>
      }
    >
      {hasTargets ? (
        <Select
          label="Destination room"
          placeholder="Select a room"
          value={roomId}
          options={targets.map((room) => ({ value: room.id, label: room.room_name }))}
          onChange={setRoomId}
        />
      ) : (
        <p className="text-sm text-muted">
          This order has only one room. Add another room before moving items.
        </p>
      )}
    </Modal>
  )
}
