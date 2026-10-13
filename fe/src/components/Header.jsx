import {
    Search,
    Bell,
    ShoppingCart,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

function Header({
    storeName = 'Stocky',
    currentPage = 'Dashboard',
}) {
    const { totalItems } = useCart()
    const { user, isAuthenticated } = useAuth()

    return (
        <header
            className="
        sticky top-0 z-40
        h-16
        border-b border-[var(--color-border)]
        bg-[var(--color-surface)]
      "
        >
            <div className="flex h-full items-center">

                {/* Left - Store & Current Page */}
                <div className="flex min-w-0 items-center gap-2 px-6">
                    <span
                        className="
              whitespace-nowrap
              text-sm font-semibold
              tracking-[-0.025em]
              text-[var(--color-text)]
            "
                    >
                        {storeName}
                    </span>

                    <span className="text-[var(--color-text-muted)]">
                        /
                    </span>

                    <span
                        className="
              whitespace-nowrap
              text-sm
              text-[var(--color-text-muted)]
            "
                    >
                        {currentPage}
                    </span>
                </div>

                {/* Center - Search */}
                <div className="flex flex-1 justify-center px-6">
                    <div className="relative w-full max-w-[480px]">
                        <Search
                            size={16}
                            strokeWidth={1.7}
                            className="
                              pointer-events-none
                              absolute left-3 top-1/2
                              z-10
                              -translate-y-1/2
                              text-[var(--color-text-muted)]
                            "
                        />

                        <input
                            type="search"
                            placeholder="Search products..."
                            style={{
                                paddingLeft: '44px',
                            }}
                            className="
                              input-krauq
                              h-9
                              w-full
                              pr-3
                              placeholder:text-[var(--color-text-muted)]
                            "
                        />
                    </div>
                </div>

                {/* Right - Actions */}
                <div className="flex shrink-0 items-center gap-1 px-4">

                    {/* Notification */}
                    <button
                        type="button"
                        className="
              relative
              flex h-9 w-9
              items-center justify-center
              rounded-[3px]
              text-[var(--color-text-muted)]
              transition-colors
              hover:bg-[var(--color-bg)]
              hover:text-[var(--color-text)]
            "
                        aria-label="Notifications"
                    >
                        <Bell
                            size={18}
                            strokeWidth={1.7}
                        />

                        {/* Notification indicator */}
                        <span
                            className="
                absolute right-[7px] top-[7px]
                h-1.5 w-1.5
                rounded-full
                bg-[var(--color-text)]
              "
                        />
                    </button>

                    {/* Cart */}
                    <Link
                        to="/cart"
                        className="
              relative
              flex h-9 w-9
              items-center justify-center
              rounded-[3px]
              text-[var(--color-text-muted)]
              transition-colors
              hover:bg-[var(--color-bg)]
              hover:text-[var(--color-text)]
            "
                        aria-label={`Shopping cart, ${totalItems} items`}
                    >
                        <ShoppingCart
                            size={18}
                            strokeWidth={1.7}
                        />

                        {/* Cart count */}
                        {totalItems > 0 && (
                            <span
                                className="
                  absolute -right-0.5 -top-0.5
                  flex h-4 min-w-4
                  items-center justify-center
                  rounded-full
                  bg-[var(--color-accent)]
                  px-1
                  text-[9px]
                  font-medium
                  text-white
                "
                            >
                                {totalItems > 99
                                    ? '99+'
                                    : totalItems}
                            </span>
                        )}
                    </Link>

                    {/* Auth User / Sign In */}
                    {isAuthenticated ? (
                        <Link
                            to="/profile"
                            className="
                              ml-1
                              flex h-9 items-center gap-2
                              rounded-[3px]
                              px-2.5
                              text-xs
                              font-medium
                              text-[var(--color-text)]
                              transition-colors
                              hover:bg-[var(--color-bg)]
                            "
                            title={user?.email}
                        >
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-text)] text-[10px] font-medium text-[var(--color-surface)]">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </span>
                            <span className="max-w-[100px] truncate hidden sm:inline">
                                {user?.name || 'Account'}
                            </span>
                        </Link>
                    ) : (
                        <Link
                            to="/auth"
                            className="
                              ml-1
                              inline-flex
                              h-8
                              items-center
                              rounded-[3px]
                              bg-[var(--color-text)]
                              px-3
                              text-xs
                              font-medium
                              text-[var(--color-surface)]
                              transition-opacity
                              hover:opacity-85
                            "
                        >
                            Sign in
                        </Link>
                    )}

                </div>

            </div>
        </header>
    )
}

export default Header