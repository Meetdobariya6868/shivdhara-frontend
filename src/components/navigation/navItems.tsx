import type { ComponentType, SVGProps } from 'react'

import {
  HomeFilledIcon,
  HomeIcon,
  PlusCircleFilledIcon,
  PlusCircleIcon,
  UserFilledIcon,
  UserIcon,
  UserPlusFilledIcon,
  UserPlusIcon,
  UsersFilledIcon,
  UsersIcon,
} from '@/components/icons'
import type { UserRole } from '@/features/auth/types'
import { paths } from '@/routes/paths'

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>

export interface NavItem {
  label: string
  path: string
  /** Outline icon shown when the tab is inactive. */
  icon: IconComponent
  /** Solid/filled icon shown when the tab is the current page. */
  activeIcon: IconComponent
  /** Match the route exactly (no descendant highlighting). */
  end?: boolean
}

/**
 * Bottom-navigation destinations per role.
 *   • Admin    — 5 items: Home (orders), Salesmen, Add Salesman, Create Order, Profile
 *   • Salesman — 3 items: Home, Create Order, Profile
 *
 * The Home tab (/dashboard) shows the admin's order list; salesman management
 * lives on the Salesmen tab (/salesmen). Both are exact-match so descendant
 * routes (e.g. /salesmen/add) don't light up the parent tab.
 */
const ADMIN_NAV: readonly NavItem[] = [
  { label: 'Home',         path: paths.dashboard,    icon: HomeIcon,       activeIcon: HomeFilledIcon,       end: true },
  { label: 'Manage',       path: paths.salesmen,     icon: UsersIcon,      activeIcon: UsersFilledIcon,      end: true },
  { label: 'Add Salesman', path: paths.addSalesman,  icon: UserPlusIcon,   activeIcon: UserPlusFilledIcon },
  { label: 'Create',       path: paths.ordersCreate, icon: PlusCircleIcon, activeIcon: PlusCircleFilledIcon },
  { label: 'Profile',      path: paths.profile,      icon: UserIcon,       activeIcon: UserFilledIcon },
]

const SALESMAN_NAV: readonly NavItem[] = [
  { label: 'Home',    path: paths.dashboard,    icon: HomeIcon,       activeIcon: HomeFilledIcon, end: true },
  { label: 'Create',  path: paths.ordersCreate, icon: PlusCircleIcon, activeIcon: PlusCircleFilledIcon },
  { label: 'Profile', path: paths.profile,      icon: UserIcon,       activeIcon: UserFilledIcon },
]

export function getNavItems(role: UserRole): readonly NavItem[] {
  return role === 'admin' ? ADMIN_NAV : SALESMAN_NAV
}
