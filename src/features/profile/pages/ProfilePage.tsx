import { Button } from '@/components/ui/Button'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { ThemeToggle } from '@/theme/ThemeToggle'

/**
 * Profile & settings screen: account details, theme selection, and logout.
 * Shared by both roles (present in every bottom-nav variant).
 */
export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-5 py-8">
      <h1 className="text-2xl font-bold text-foreground">Profile</h1>

      {/* Account card */}
      <section className="flex items-center gap-4 rounded-2xl bg-card p-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-avatar-bg text-xl font-semibold text-avatar-fg">
          {user?.name?.charAt(0).toUpperCase() ?? '?'}
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-card-foreground">
            {user?.name ?? '—'}
          </p>
          <p className="text-sm text-muted">{user?.mobile_number}</p>
          <span className="mt-1 inline-block rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted">
            {user?.role_label}
          </span>
        </div>
      </section>

      {/* Appearance */}
      <section className="flex flex-col gap-3 rounded-2xl bg-card p-5">
        <h2 className="text-sm font-semibold text-card-foreground">
          Appearance
        </h2>
        <ThemeToggle />
      </section>

      {/* Logout */}
      <Button
        onClick={() => logout.mutate()}
        isLoading={logout.isPending}
        fullWidth
      >
        Sign Out
      </Button>
    </div>
  )
}
