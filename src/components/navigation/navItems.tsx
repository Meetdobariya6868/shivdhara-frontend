import type { ComponentType, SVGProps } from 'react'

import {
  HomeIcon,
  PlusCircleIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
} from '@/components/icons'
import type { UserRole } from '@/features/auth/types'
import { paths } from '@/routes/paths'

export interface NavItem {
  label: string
  path: string
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>
  /** Center action items are visually emphasised (e.g. Create Order). */
  emphasized?: boolean
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
  { label: 'Home',        path: paths.dashboard,    icon: HomeIcon,    end: true },
  { label: 'Manage',    path: paths.salesmen,     icon: UsersIcon,   end: true },
  { label: 'Add Salesman', path: paths.addSalesman, icon: UserPlusIcon },
  { label: 'Create',      path: paths.ordersCreate, icon: PlusCircleIcon, emphasized: true },
  { label: 'Profile',     path: paths.profile,      icon: UserIcon },
]

const SALESMAN_NAV: readonly NavItem[] = [
  { label: 'Home',   path: paths.dashboard,   icon: HomeIcon, end: true },
  { label: 'Create', path: paths.ordersCreate, icon: PlusCircleIcon, emphasized: true },
  { label: 'Profile', path: paths.profile,     icon: UserIcon },
]

export function getNavItems(role: UserRole): readonly NavItem[] {
  return role === 'admin' ? ADMIN_NAV : SALESMAN_NAV
}
