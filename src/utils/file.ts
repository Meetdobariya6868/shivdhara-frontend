/**
 * Make a string safe to use as a filename: drop characters invalid on common
 * filesystems and collapse whitespace. Returns '' if nothing usable remains.
 */
export function sanitizeFilename(name: string): string {
  return name.replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim()
}

/**
 * Trigger a browser download of a Blob under the given filename.
 * Creates a temporary object URL, clicks a hidden anchor, then revokes it.
 */
export function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
