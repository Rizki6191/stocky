import { useState } from 'react'
import {
  Shield,
  Sliders,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'

function Settings() {
  const { user, isAuthenticated } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [notifications, setNotifications] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [currency, setCurrency] = useState('IDR')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span
          className="
            text-[10px]
            font-medium
            uppercase
            tracking-[0.14em]
            text-[var(--color-text-muted)]
          "
        >
          Preferences
        </span>

        <h1
          className="
            mt-1
            text-2xl
            font-medium
            tracking-[-0.04em]
            text-[var(--color-text)]
          "
        >
          Store Settings
        </h1>

        <p
          className="
            mt-1
            max-w-xl
            text-sm
            text-[var(--color-text-muted)]
          "
        >
          Configure application preferences, interface options, and account permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* General Preferences */}
        <div className="rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
            <Sliders size={16} strokeWidth={1.7} className="text-[var(--color-text-muted)]" />
            <h2 className="text-sm font-medium">General Preferences</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[var(--color-text)]">Currency Display</p>
                <p className="text-[11px] text-[var(--color-text-muted)]">Default pricing unit across the store</p>
              </div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="input-krauq h-8 text-xs rounded-[3px]"
              >
                <option value="IDR">IDR (Rp)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>

            <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
              <div>
                <p className="text-xs font-medium text-[var(--color-text)]">Order Notifications</p>
                <p className="text-[11px] text-[var(--color-text-muted)]">Receive updates when order status changes</p>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="h-4 w-4 rounded-[3px] accent-[var(--color-text)]"
              />
            </div>

            <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
              <div>
                <p className="text-xs font-medium text-[var(--color-text)]">Email Alerts</p>
                <p className="text-[11px] text-[var(--color-text-muted)]">Receive receipts and promotional notices</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 rounded-[3px] accent-[var(--color-text)]"
              />
            </div>
          </div>
        </div>

        {/* Role & Access Controls */}
        <div className="rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
            <Shield size={16} strokeWidth={1.7} className="text-[var(--color-text-muted)]" />
            <h2 className="text-sm font-medium">Account & Role Permissions</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="rounded-[4px] bg-[var(--color-bg)] p-3">
              <p className="text-[11px] text-[var(--color-text-muted)]">Current Account Status</p>
              <p className="mt-1 text-sm font-medium text-[var(--color-text)]">
                {isAuthenticated ? (
                  <>
                    {user?.name} &bull; <span className="uppercase text-[11px] font-semibold">{user?.role || 'user'}</span>
                  </>
                ) : (
                  'Guest Session (Not Logged In)'
                )}
              </p>
            </div>

            {isAdmin ? (
              <div className="space-y-3 pt-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                  Admin Privileges Enabled
                </p>
                <ul className="space-y-1.5 text-[11px] text-[var(--color-text-muted)]">
                  <li className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Can create, edit, and delete store products
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Can manage catalog categories
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Can upload and publish promo banners
                  </li>
                </ul>
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                  Customer Privileges
                </p>
                <p className="text-[11px] text-[var(--color-text-muted)]">
                  Customer accounts are authorized to browse products, manage shopping carts, submit checkout transactions, and review personal order records.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
