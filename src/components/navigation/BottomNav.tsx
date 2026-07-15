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
          const OutlineIcon = item.icon
          const ActiveIcon = item.activeIcon
          return (
            <li key={item.path} className="flex-1">
              <NavLink
                to={item.path}
                end={item.end ?? false}
                className="flex flex-col items-center gap-1 py-2 text-[11px] focus-visible:outline-none"
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={[
                        'flex items-center justify-center rounded-full px-5 py-1 transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted',
                      ].join(' ')}
                    >
                      {isActive ? (
                        <ActiveIcon size={22} className="shrink-0" />
                      ) : (
                        <OutlineIcon size={22} className="shrink-0" />
                      )}
                    </span>
                    <span
                      className={
                        isActive
                          ? 'font-semibold text-primary'
                          : 'font-medium text-muted'
                      }
                    >
                      {item.label}
                    </span>
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
