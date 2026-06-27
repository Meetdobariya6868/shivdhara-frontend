import { Outlet } from 'react-router-dom'

import { BottomNav } from '@/components/navigation/BottomNav'

/**
 * Authenticated app shell: scrollable content region above a fixed,
 * role-aware bottom navigation bar. Used for all post-login screens.
 */
export function AppLayout() {
  return (
    <div className="flex h-full flex-col bg-background">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
