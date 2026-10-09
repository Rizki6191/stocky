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
} from 'lucide-react'

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

  const renderItem = ({ label, path, icon: Icon }) => (
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
          whitespace-nowrap text-[13px] font-medium
          transition-all duration-150
          ${
            expanded
              ? 'translate-x-0 opacity-100'
              : 'pointer-events-none -translate-x-2 opacity-0'
          }
        `}
      >
        {label}
      </span>

      {/* Tooltip ketika collapsed */}
      {!expanded && (
        <span
          className="
            pointer-events-none absolute left-[58px] z-50
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
          {label}
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
        <nav className="flex-1 px-2 py-3">
          <div className="space-y-1">
            {mainItems.map(renderItem)}
          </div>
        </nav>

        {/* Bottom Navigation */}
        <nav className="border-t border-[var(--color-border)] px-2 py-3">
          <div className="space-y-1">
            {bottomItems.map(renderItem)}
          </div>
        </nav>

      </div>
    </aside>
  )
}

export default Sidebar
