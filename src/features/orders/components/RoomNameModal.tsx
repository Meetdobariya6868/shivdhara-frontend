import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'

interface RoomNameModalProps {
  isOpen: boolean
  title: string
  submitLabel: string
  /** Pre-fills the field (e.g. the current name when renaming). */
  initialName?: string
  isSaving: boolean
  onClose: () => void
  onSave: (name: string) => void
}

const FORM_ID = 'room-name-form'

/** Modal to add or rename a room within an order (shared name form). */
export function RoomNameModal({
  isOpen,
  title,
  submitLabel,
  initialName = '',
  isSaving,
  onClose,
  onSave,
}: RoomNameModalProps) {
  const [name, setName] = useState(initialName)
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
      title={title}
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
            {submitLabel}
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
