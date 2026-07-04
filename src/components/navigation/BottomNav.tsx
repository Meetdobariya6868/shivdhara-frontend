import { NavLink } from 'react-router-dom'

import { useAuthStore } from '@/features/auth/store/auth.store'

import { getNavItems } from './navItems'

/**
 * Role-aware bottom navigation bar.
 * Renders 5 destinations for admins and 3 for salesmen (see navItems).
 * Fixed to the viewport bottom; safe-area aware for notched devices.
 */
export function BottomNav() {
  const role = useAuthStore((s) => s.user?.role)

  if (!role) {
    return null
  }

  const items = getNavItems(role)

  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 z-40 border-t border-border bg-background pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-2xl items-center justify-around px-2">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.path} className="flex-1">
              <NavLink
                to={item.path}
                end={item.end ?? false}
                className={({ isActive }) =>
                  [
                    'flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                    isActive
                      ? 'text-primary'
                      : 'text-muted hover:text-foreground',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={item.emphasized ? 28 : 24}
                      className={
                        item.emphasized && !isActive ? 'text-foreground' : ''
                      }
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
