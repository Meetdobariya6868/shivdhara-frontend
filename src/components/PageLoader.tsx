/**
 * Full-page loading indicator shown while a lazy route chunk is being fetched.
 */
export function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700" />
    </div>
  )
}
