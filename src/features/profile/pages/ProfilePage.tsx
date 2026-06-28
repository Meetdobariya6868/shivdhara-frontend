import type { ReactNode } from 'react'

import {
  DownloadCloudIcon,
  LayoutIcon,
  LogOutIcon,
  ShieldIcon,
  ShoppingCartIcon,
  UserIcon,
} from '@/components/icons'
import { Avatar } from '@/components/ui/Avatar'
import { MenuListItem } from '@/components/ui/MenuListItem'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useAuthStore } from '@/features/auth/store/auth.store'

interface ProfileMenuItem {
  icon: ReactNode
  label: string
  onClick?: () => void
  isLoading?: boolean
}

/**
 * Profile screen, shared by both roles. The menu is composed from a common
 * base; admins additionally see the two catalogue items ("Show products",
 * "My products"). Defining each row once keeps the variants DRY.
 */
export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()

  const isAdmin = user?.is_admin ?? false

  const editProfile: ProfileMenuItem = {
    icon: <UserIcon />,
    label: 'Edit Profile',
    onClick: () => {},
  }

  // Admin-only: design / catalogue screen.
  const showProducts: ProfileMenuItem = {
    icon: <LayoutIcon />,
    label: 'Show products',
    onClick: () => {},
  }

  // Admin-only: the products this admin has added.
  const myProducts: ProfileMenuItem = {
    icon: <ShoppingCartIcon />,
    label: 'My products',
    onClick: () => {},
  }

  const privacyPolicy: ProfileMenuItem = {
    icon: <ShieldIcon />,
    label: 'Privacy & Policy',
    onClick: () => {},
  }

  const softwareUpdate: ProfileMenuItem = {
    icon: <DownloadCloudIcon />,
    label: 'Check for software update',
    onClick: () => {},
  }

  const logoutItem: ProfileMenuItem = {
    icon: <LogOutIcon />,
    label: 'Logout',
    onClick: () => { logout.mutate() },
    isLoading: logout.isPending,
  }

  const menuItems: ProfileMenuItem[] = isAdmin
    ? [editProfile, showProducts, myProducts, privacyPolicy, softwareUpdate, logoutItem]
    : [editProfile, privacyPolicy, softwareUpdate, logoutItem]

  return (
    <div className="flex flex-col pb-24">
      <h1 className="py-5 text-center text-xl font-bold text-foreground">
        Profile
      </h1>

      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-5 pb-8">
        <Avatar
          name={user?.name}
          size="lg"
          tone={isAdmin ? 'dark' : 'accent'}
          onEdit={() => {}}
        />

        <p
          className={[
            'text-3xl font-bold tracking-wide text-foreground',
            isAdmin ? 'uppercase' : '',
          ].join(' ')}
        >
          {user?.name ?? '—'}
        </p>
      </div>

      {/* Menu list */}
      <div className="flex flex-col gap-3 px-5">
        {menuItems.map((item) => (
          <MenuListItem key={item.label} {...item} />
        ))}
      </div>
    </div>
  )
}
