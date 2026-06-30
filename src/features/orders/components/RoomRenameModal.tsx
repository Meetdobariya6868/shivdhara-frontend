import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'

interface RoomRenameModalProps {
  isOpen: boolean
  currentName: string
  isSaving: boolean
  onClose: () => void
  onSave: (name: string) => void
}

const FORM_ID = 'rename-room-form'

/** Modal to rename a room within an order. */
export function RoomRenameModal({
  isOpen,
  currentName,
  isSaving,
  onClose,
  onSave,
}: RoomRenameModalProps) {
  const [name, setName] = useState(currentName)
  const [error, setError] = useState<string | undefined>(undefined)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Room name is required')
      return
    }
    onSave(trimmed)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rename room"
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
          <Button type="submit" form={FORM_ID} isLoading={isSaving}>
            Save
          </Button>
        </div>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} noValidate>
        <Input
          label="Room name"
          placeholder="e.g. Main Cabin"
          value={name}
          error={error}
          autoFocus
          onChange={(e) => {
            setName(e.target.value)
            if (error) setError(undefined)
          }}
        />
      </form>
    </Modal>
  )
}
