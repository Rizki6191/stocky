import {
  CheckCircle2,
  Database,
  Layers,
  Server,
  ShieldCheck,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'

function Info() {
  const { user, isAuthenticated } = useAuth()
  const isAdmin = user?.role === 'admin'

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
          System
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
          Store Information & Architecture
        </h1>

        <p
          className="
            mt-1
            max-w-xl
            text-sm
            text-[var(--color-text-muted)]
          "
        >
          Overview of Stocky platform capabilities, backend connections, and your current permissions.
        </p>
      </div>

      {/* Role Badge Card */}
      <div className="rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg)] text-[var(--color-text)]">
              <ShieldCheck size={20} strokeWidth={1.7} />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Active Session Role</p>
              <h2 className="text-base font-medium text-[var(--color-text)]">
                {isAuthenticated ? (
                  isAdmin ? 'Administrator (Full Access)' : `Customer User (${user?.name || 'Registered'})`
                ) : (
                  'Guest Visitor (Browse Mode)'
                )}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-[4px] px-2.5 py-1 text-xs font-medium ${
                isAdmin
                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                  : isAuthenticated
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-[var(--color-bg)] text-[var(--color-text-muted)]'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isAdmin ? 'bg-purple-500' : isAuthenticated ? 'bg-emerald-500' : 'bg-stone-400'
                }`}
              />
              {isAdmin ? 'ROLE: ADMIN' : isAuthenticated ? 'ROLE: USER' : 'ROLE: GUEST'}
            </span>
          </div>
        </div>

        <div className="mt-4 border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-text-muted)]">
          {isAdmin
            ? 'As an Admin, you have access to product management, category configuration, banner updates, and system admin endpoints.'
            : isAuthenticated
            ? 'As an Authenticated User, you can manage your persistent cart, checkout orders, and track your order history.'
            : 'As a Guest, you can browse all catalog products, banners, and categories without needing to sign in. Authentication is only required when checking out.'}
        </div>
      </div>

      {/* Grid of features */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center gap-2">
            <Server size={17} strokeWidth={1.7} className="text-[var(--color-text-muted)]" />
            <h3 className="text-sm font-medium">Backend Go & Gin</h3>
          </div>
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            High performance REST API written in Golang, utilizing GORM ORM and Gin routing at port 8000.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={13} />
            <span>Connected & Live</span>
          </div>
        </div>

        <div className="rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center gap-2">
            <Database size={17} strokeWidth={1.7} className="text-[var(--color-text-muted)]" />
            <h3 className="text-sm font-medium">PostgreSQL 17</h3>
          </div>
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            Containerized relational database storage for products, categories, users, carts, and order snapshots.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={13} />
            <span>Dockerized (stocky_postgres)</span>
          </div>
        </div>

        <div className="rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center gap-2">
            <Layers size={17} strokeWidth={1.7} className="text-[var(--color-text-muted)]" />
            <h3 className="text-sm font-medium">Security & JWT</h3>
          </div>
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            Stateless JWT access tokens with refresh token rotation and bcrypt hashing for credentials.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={13} />
            <span>Role-based protection active</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Info
