import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Menu,
  LayoutDashboard,
  Package,
  Folder,
  ShoppingBag,
  Info,
  Settings,
  UserCircle,
  ShieldCheck,
  User,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'

const mainItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Products',
    path: '/products',
    icon: Package,
  },
  {
    label: 'Categories',
    path: '/categories',
    icon: Folder,
  },
  {
    label: 'Orders',
    path: '/orders',
    icon: ShoppingBag,
  },
]

const bottomItems = [
  {
    label: 'Info',
    path: '/info',
    icon: Info,
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: Settings,
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: UserCircle,
  },
]

function Sidebar() {
  const [expanded, setExpanded] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const isAdmin = user?.role === 'admin'

  const renderItem = ({ label, path, icon: Icon, badge }) => (
    <NavLink
      key={path}
      to={path}
      className={({ isActive }) => `
        group relative flex h-10 items-center rounded-[3px]
        transition-colors duration-150
        ${
          isActive
            ? 'bg-[var(--color-bg)] text-[var(--color-text)]'
            : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]'
        }
      `}
    >
      <span className="flex h-10 w-14 shrink-0 items-center justify-center">
        <Icon size={18} strokeWidth={1.7} />
      </span>

      <span
        className={`
          flex flex-1 items-center justify-between pr-3
          whitespace-nowrap text-[13px] font-medium
          transition-all duration-150
          ${
            expanded
              ? 'translate-x-0 opacity-100'
              : 'pointer-events-none -translate-x-2 opacity-0'
          }
        `}
      >
        <span>{label}</span>
        {badge && (
          <span className="rounded-[3px] border border-[var(--color-border)] px-1.5 py-0.2 text-[9px] uppercase tracking-wider text-[var(--color-text-muted)]">
            {badge}
          </span>
        )}
      </span>

      {/* Tooltip ketika collapsed */}
      {!expanded && (
        <span
          className="
            pointer-events-none absolute left-[58px] z-50
            flex items-center gap-1.5
            whitespace-nowrap rounded-[3px]
            border border-[var(--color-border)]
            bg-[var(--color-surface)]
            px-2.5 py-1.5
            text-xs font-medium
            text-[var(--color-text)]
            opacity-0 shadow-sm
            transition-opacity duration-150
            group-hover:opacity-100
          "
        >
          <span>{label}</span>
          {badge && (
            <span className="text-[10px] text-[var(--color-text-muted)]">({badge})</span>
          )}
        </span>
      )}
    </NavLink>
  )

  return (
    <aside
      className={`
        fixed left-0 top-0 z-50 h-screen
        border-r border-[var(--color-border)]
        bg-[var(--color-surface)]
        transition-[width] duration-200 ease-out
        ${expanded ? 'w-[220px]' : 'w-16'}
      `}
    >
      <div className="flex h-full flex-col">

        {/* Logo / Toggle */}
        <div className="flex h-16 shrink-0 items-center border-b border-[var(--color-border)]">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="
              flex h-16 w-16 shrink-0 items-center justify-center
              text-[var(--color-text)]
              transition-colors
              hover:bg-[var(--color-bg)]
            "
            aria-label={
              expanded ? 'Collapse sidebar' : 'Expand sidebar'
            }
          >
            <Menu size={19} strokeWidth={1.7} />
          </button>

          <span
            className={`
              overflow-hidden whitespace-nowrap
              text-sm font-semibold
              tracking-[-0.03em]
              text-[var(--color-text)]
              transition-all duration-200
              ${
                expanded
                  ? 'max-w-[130px] translate-x-0 opacity-100'
                  : 'max-w-0 -translate-x-2 opacity-0'
              }
            `}
          >
            Stocky
          </span>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          {expanded && (
            <div className="px-3 pb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Store
            </div>
          )}
          <div className="space-y-1">
            {mainItems.map(renderItem)}
          </div>
        </nav>

        {/* User Role Badge in Sidebar */}
        <div className="border-t border-[var(--color-border)] px-2 py-2">
          <div
            className={`
              flex h-10 items-center rounded-[3px] bg-[var(--color-bg)]
              transition-colors duration-150
            `}
            title={isAuthenticated ? `Logged in as ${user?.name} (${isAdmin ? 'Admin' : 'User'})` : 'Guest Visitor'}
          >
            <span className="flex h-10 w-12 shrink-0 items-center justify-center text-[var(--color-text)]">
              {isAdmin ? (
                <ShieldCheck size={18} strokeWidth={1.8} className="text-purple-600 dark:text-purple-400" />
              ) : isAuthenticated ? (
                <User size={18} strokeWidth={1.8} className="text-emerald-600 dark:text-emerald-400" />
              ) : (
                <UserCircle size={18} strokeWidth={1.7} className="text-[var(--color-text-muted)]" />
              )}
            </span>

            <div
              className={`
                min-w-0 flex-1 pr-2
                transition-all duration-150
                ${
                  expanded
                    ? 'translate-x-0 opacity-100'
                    : 'pointer-events-none -translate-x-2 opacity-0'
                }
              `}
            >
              <p className="truncate text-xs font-medium text-[var(--color-text)]">
                {isAuthenticated ? user?.name : 'Guest'}
              </p>
              <p className="truncate text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">
                {isAdmin ? 'Admin' : isAuthenticated ? 'Customer' : 'Visitor'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Navigation: Info, Settings, Profile */}
        <nav className="border-t border-[var(--color-border)] px-2 py-3">
          {expanded && (
            <div className="px-3 pb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              General
            </div>
          )}
          <div className="space-y-1">
            {bottomItems.map((item) =>
              renderItem({
                ...item,
                badge: item.label === 'Profile' && isAuthenticated ? (isAdmin ? 'Admin' : 'User') : null,
              })
            )}
          </div>
        </nav>

      </div>
    </aside>
  )
}

export default Sidebar
