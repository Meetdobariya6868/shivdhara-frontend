import { useRef } from 'react'

import { ImageIcon, SpinnerIcon, XIcon } from '@/components/icons'

interface PhotoPickerProps {
  /** Public URL of the already-uploaded image, or null when none chosen. */
  imageUrl: string | null
  isUploading: boolean
  error?: string | null
  /** Fired when the user picks a file (parent performs the upload). */
  onSelect: (file: File) => void
  onRemove: () => void
}

/**
 * Square "Choose Photo" tile with preview, upload spinner, error and remove.
 * Stateless about the upload itself — the parent owns the upload mutation and
 * passes `imageUrl` / `isUploading` / `error` back in.
 */
export function PhotoPicker({ imageUrl, isUploading, error, onSelect, onRemove }: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const openPicker = () => inputRef.current?.click()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onSelect(file)
    // Reset so selecting the same file again re-triggers change.
    e.target.value = ''
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />

      {imageUrl && !isUploading ? (
        <div className="relative h-28 w-28">
          <img
            src={imageUrl}
            alt="Selected product"
            className="h-28 w-28 rounded-2xl object-cover ring-1 ring-border"
          />
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove photo"
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <XIcon size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={isUploading}
          className="flex h-28 w-28 flex-col items-center justify-center gap-2 rounded-2xl bg-surface text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
        >
          {isUploading ? (
            <SpinnerIcon size={22} />
          ) : (
            <>
              <ImageIcon size={24} />
              <span className="text-xs font-medium">Choose Photo</span>
            </>
          )}
        </button>
      )}

      {error && <p role="alert" className="text-center text-xs text-error">{error}</p>}
    </div>
  )
}
