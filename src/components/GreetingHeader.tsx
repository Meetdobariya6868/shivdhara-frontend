import { BellIcon } from '@/components/icons'
import { Avatar } from '@/components/ui/Avatar'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { ThemeToggleButton } from '@/theme/ThemeToggleButton'
import { getGreeting } from '@/utils/greeting'

/**
 * Top header for home screens: avatar + time-based greeting + the user's
 * name, with a notification bell on the right. Name is derived from the
 * authenticated user in the store — never hardcoded.
 */
export function GreetingHeader() {
  const user = useAuthStore((s) => s.user)
  const greeting = getGreeting()

  return (
    <header className="flex items-center gap-3 px-5 pt-6 pb-4">
      <Avatar name={user?.name} size="sm" />

      {/* Greeting + name */}
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-base font-medium text-foreground">
          {greeting} <span aria-hidden="true">🌆</span>
        </p>
        <p className="truncate text-lg font-bold tracking-wide text-foreground uppercase">
          {user?.name ?? '—'}
        </p>
      </div>

      {/* Theme toggle + notifications */}
      <div className="flex items-center gap-1">
        <ThemeToggleButton />
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-full p-2 text-foreground transition-colors hover:bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <BellIcon size={22} />
        </button>
      </div>
    </header>
  )
}
