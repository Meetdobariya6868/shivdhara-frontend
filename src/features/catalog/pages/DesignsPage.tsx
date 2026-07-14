import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { DownloadCloudIcon, SearchIcon, SpinnerIcon, XIcon } from '@/components/icons'
import { PageHeader } from '@/components/PageHeader'
import { useDebounce } from '@/hooks/useDebounce'
import { paths } from '@/routes/paths'
import { saveBlob } from '@/utils/file'

import { DesignsList } from '../components/DesignsList'
import { useDesigns } from '../hooks/useDesigns'
import { useExportDesigns } from '../hooks/useExportDesigns'

/**
 * Catalogue browse screen (admin "Show products"). A single search box matches
 * across design name, design code, and company name (server-side); rows load a
 * page at a time via infinite scroll. Tapping a design opens its variants for
 * rate editing.
 */
export default function DesignsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const debouncedSearch = useDebounce(search, 350)

  const filters = useMemo(
    () => ({ search: debouncedSearch.trim() || undefined }),
    [debouncedSearch],
  )

  const {
    data,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useDesigns(filters)

  const designs = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data])
  const total = data?.pages[0]?.meta.total ?? 0
  const hasFilters = Boolean(filters.search)

  // Download the full catalogue as an .xlsx.
  const exportDesigns = useExportDesigns()
  const handleDownload = (): void => {
    exportDesigns.mutate(undefined, {
      onSuccess: (blob) => saveBlob(blob, 'designs.xlsx'),
    })
  }

  // Infinite scroll: fetch the next page when the sentinel scrolls into view.
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = loadMoreRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { rootMargin: '300px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div className="mx-auto flex max-w-2xl flex-col">
      <PageHeader title="Products" onBack={() => void navigate(-1)} />

      {/* Unified search — matches design name, design code, or company name */}
      <div className="px-5 pt-4">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3">
          <SearchIcon size={18} className="shrink-0 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by design name, code, or company"
            aria-label="Search designs"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="shrink-0 text-muted transition-colors hover:text-foreground focus-visible:outline-none"
            >
              <XIcon size={16} />
            </button>
          )}
        </div>
      </div>

      {/* List — bottom padding clears the pinned Download bar so the last row is reachable */}
      <div className="px-5 pb-4 pt-5">
        <DesignsList
          designs={designs}
          total={total}
          isLoading={isLoading}
          isError={isError}
          hasFilters={hasFilters}
          onRetry={() => void refetch()}
          onDesignClick={(design) => void navigate(paths.designDetail(design.id))}
        />

        <div ref={loadMoreRef} aria-hidden="true" className="h-px" />
        {isFetchingNextPage && (
          <div className="flex justify-center py-4 text-muted" aria-label="Loading more designs">
            <SpinnerIcon size={20} />
          </div>
        )}
      </div>

      {/* Download bar — pinned just above the bottom navigation */}
      <div className="sticky bottom-0 z-30 border-t border-border bg-background px-5 py-3">
        {exportDesigns.isError && (
          <p role="alert" className="mb-2 text-center text-xs text-error">
            Couldn't generate the file. Please try again.
          </p>
        )}
        <button
          type="button"
          onClick={handleDownload}
          disabled={exportDesigns.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          {exportDesigns.isPending ? <SpinnerIcon size={18} /> : <DownloadCloudIcon size={18} />}
          {exportDesigns.isPending ? 'Preparing…' : 'Download'}
        </button>
      </div>
    </div>
  )
}
