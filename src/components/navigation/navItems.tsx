import type { ComponentType, SVGProps } from 'react'

import {
  ClipboardIcon,
  HomeIcon,
  PlusCircleIcon,
  UserIcon,
  UserPlusIcon,
} from '@/components/icons'
import type { UserRole } from '@/features/auth/types'
import { paths } from '@/routes/paths'

export interface NavItem {
  label: string
  path: string
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>
  /** Center action items are visually emphasised (e.g. Create Order). */
  emphasized?: boolean
}

/**
 * Bottom-navigation destinations per role.
 *   • Admin    — 5 items: Home, Orders, Add Salesman, Create Order, Profile
 *   • Salesman — 3 items: Home, Create Order, Profile
 */
const ADMIN_NAV: readonly NavItem[] = [
  { label: 'Home',        path: paths.dashboard,   icon: HomeIcon },
  { label: 'Orders',      path: paths.orders,       icon: ClipboardIcon },
  { label: 'Add Salesman', path: paths.addSalesman, icon: UserPlusIcon },
  { label: 'Create',      path: paths.ordersCreate, icon: PlusCircleIcon, emphasized: true },
  { label: 'Profile',     path: paths.profile,      icon: UserIcon },
]

const SALESMAN_NAV: readonly NavItem[] = [
  { label: 'Home',   path: paths.dashboard,   icon: HomeIcon },
  { label: 'Create', path: paths.ordersCreate, icon: PlusCircleIcon, emphasized: true },
  { label: 'Profile', path: paths.profile,     icon: UserIcon },
]

export function getNavItems(role: UserRole): readonly NavItem[] {
  return role === 'admin' ? ADMIN_NAV : SALESMAN_NAV
}
