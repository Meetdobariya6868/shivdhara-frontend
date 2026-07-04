import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  LayoutIcon,
  LogOutIcon,
  ShieldIcon,
  UserIcon,
} from '@/components/icons'
import { Avatar } from '@/components/ui/Avatar'
import { MenuListItem } from '@/components/ui/MenuListItem'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { paths } from '@/routes/paths'

interface ProfileMenuItem {
  icon: ReactNode
  label: string
  onClick?: () => void
  isLoading?: boolean
}

/**
 * Profile screen, shared by both roles. The menu is composed from a common
 * base; admins additionally see the catalogue item ("Show products").
 * Defining each row once keeps the variants DRY.
 */
export default function ProfilePage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()

  const isAdmin = user?.is_admin ?? false

  const editProfile: ProfileMenuItem = {
    icon: <UserIcon />,
    label: 'Edit Profile',
    onClick: () => void navigate(paths.profileEdit),
  }

  // Admin-only: design / catalogue screen.
  const showProducts: ProfileMenuItem = {
    icon: <LayoutIcon />,
    label: 'Show products',
    onClick: () => {},
  }

  const privacyPolicy: ProfileMenuItem = {
    icon: <ShieldIcon />,
    label: 'Privacy & Policy',
    onClick: () => {},
  }

  const logoutItem: ProfileMenuItem = {
    icon: <LogOutIcon />,
    label: 'Logout',
    onClick: () => { logout.mutate() },
    isLoading: logout.isPending,
  }

  const menuItems: ProfileMenuItem[] = isAdmin
    ? [editProfile, showProducts, privacyPolicy, logoutItem]
    : [editProfile, privacyPolicy, logoutItem]

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
