import { Button } from '@/components/ui/Button'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useAuthStore } from '@/features/auth/store/auth.store'

/**
 * Placeholder dashboard — replaced with the real ERP dashboard in Phase 2.
 * Verifies the full auth flow: login → token stored → user displayed → logout.
 */
export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const logoutMutation = useLogout()

  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-6 bg-white p-8">
      <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-brand-50 p-6 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
          Welcome back
        </p>
        <h1 className="mt-1 text-2xl font-bold text-brand-900">
          {user?.name ?? '—'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{user?.role_label}</p>

        <div className="mt-6 grid grid-cols-2 gap-3 text-left">
          <Stat label="Mobile" value={user?.mobile_number ?? '—'} />
          <Stat label="Status" value={user?.status_label ?? '—'} />
          <Stat label="Can create orders" value={user?.can_create_orders ? 'Yes' : 'No'} />
          <Stat label="Admin" value={user?.is_admin ? 'Yes' : 'No'} />
        </div>
      </div>

      <Button
        onClick={() => logoutMutation.mutate()}
        isLoading={logoutMutation.isPending}
        className="min-w-32"
      >
        Sign Out
      </Button>

      <p className="text-xs text-gray-400">
        Phase 2 dashboard coming next →
      </p>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white px-3 py-2 shadow-xs">
      <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-gray-800">{value}</p>
    </div>
  )
}
