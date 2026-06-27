import { SearchIcon, SortIcon } from '@/components/icons'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onSortClick?: () => void
}

/**
 * Rounded search field with a leading search icon and an optional trailing
 * sort button — matches the home-screen design. Controlled component.
 */
export function SearchBar({
  value,
  onChange,
  placeholder = 'Search',
  onSortClick,
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3">
      <SearchIcon size={20} className="shrink-0 text-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
      />
      {onSortClick && (
        <button
          type="button"
          onClick={onSortClick}
          aria-label="Sort"
          className="shrink-0 text-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <SortIcon size={20} />
        </button>
      )}
    </div>
  )
}
