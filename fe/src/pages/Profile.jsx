import { useState } from 'react'
import {
  KeyRound,
  LogOut,
  Mail,
  Shield,
  User,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

function Profile() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout, refreshUser } = useAuth()

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' })
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' })
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <div className="rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
          <p className="text-sm font-medium">Please sign in to view your profile</p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            Manage your account credentials and personal information.
          </p>
          <Link
            to="/auth?redirect=/profile"
            className="
              mt-5
              inline-flex
              h-9
              items-center
              rounded-[4px]
              bg-[var(--color-text)]
              px-4
              text-xs
              font-medium
              text-[var(--color-surface)]
              transition-opacity
              hover:opacity-85
            "
          >
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setIsUpdatingProfile(true)
    setProfileMsg({ text: '', type: '' })

    try {
      await api.updateProfile({ name, email })
      await refreshUser()
      setProfileMsg({ text: 'Profile successfully updated', type: 'success' })
    } catch (err) {
      setProfileMsg({ text: err.message || 'Failed to update profile', type: 'error' })
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setIsUpdatingPassword(true)
    setPasswordMsg({ text: '', type: '' })

    try {
      await api.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      })
      setCurrentPassword('')
      setNewPassword('')
      setPasswordMsg({ text: 'Password changed successfully', type: 'success' })
    } catch (err) {
      setPasswordMsg({ text: err.message || 'Failed to change password', type: 'error' })
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/auth')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
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
            Account
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
            My Profile
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-[var(--color-text-muted)]
            "
          >
            Manage your account information and security.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="
            inline-flex
            h-9
            items-center
            gap-1.5
            rounded-[4px]
            border border-[var(--color-border)]
            bg-[var(--color-surface)]
            px-3.5
            text-xs
            font-medium
            text-red-500
            transition-colors
            hover:bg-red-500/10
          "
        >
          <LogOut size={14} strokeWidth={1.7} />
          Sign out
        </button>
      </div>

      {/* Account Info card */}
      <div className="rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="flex items-center gap-4 border-b border-[var(--color-border)] pb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-text)] text-base font-medium text-[var(--color-surface)]">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-base font-medium text-[var(--color-text)]">{user?.name}</h2>
            <p className="text-xs text-[var(--color-text-muted)]">{user?.email}</p>
            <span className="mt-1 inline-flex rounded-[3px] border border-[var(--color-border)] px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
              Role: {user?.role || 'user'}
            </span>
          </div>
        </div>

        {/* Update Profile Form */}
        <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4">
          <h3 className="text-sm font-medium">Personal Information</h3>

          {profileMsg.text && (
            <div
              className={`rounded-[4px] border px-3.5 py-2 text-xs ${
                profileMsg.type === 'success'
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600'
                  : 'border-red-500/20 bg-red-500/10 text-red-500'
              }`}
            >
              {profileMsg.text}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
              Full Name
            </label>
            <div className="relative mt-1.5">
              <User
                size={15}
                strokeWidth={1.7}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-krauq h-9 w-full pl-9 pr-3 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
              Email Address
            </label>
            <div className="relative mt-1.5">
              <Mail
                size={15}
                strokeWidth={1.7}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-krauq h-9 w-full pl-9 pr-3 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="
              inline-flex
              h-9
              items-center
              rounded-[4px]
              bg-[var(--color-text)]
              px-4
              text-xs
              font-medium
              text-[var(--color-surface)]
              transition-opacity
              hover:opacity-85
              disabled:opacity-50
            "
          >
            {isUpdatingProfile ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>

      {/* Security card */}
      <div className="rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-4">
          <Shield size={16} strokeWidth={1.7} className="text-[var(--color-text-muted)]" />
          <h2 className="text-sm font-medium">Security & Password</h2>
        </div>

        <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
          {passwordMsg.text && (
            <div
              className={`rounded-[4px] border px-3.5 py-2 text-xs ${
                passwordMsg.type === 'success'
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600'
                  : 'border-red-500/20 bg-red-500/10 text-red-500'
              }`}
            >
              {passwordMsg.text}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
              Current Password
            </label>
            <div className="relative mt-1.5">
              <KeyRound
                size={15}
                strokeWidth={1.7}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input-krauq h-9 w-full pl-9 pr-3 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
              New Password (min. 8 characters)
            </label>
            <div className="relative mt-1.5">
              <KeyRound
                size={15}
                strokeWidth={1.7}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />
              <input
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-krauq h-9 w-full pl-9 pr-3 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdatingPassword}
            className="
              inline-flex
              h-9
              items-center
              rounded-[4px]
              bg-[var(--color-text)]
              px-4
              text-xs
              font-medium
              text-[var(--color-surface)]
              transition-opacity
              hover:opacity-85
              disabled:opacity-50
            "
          >
            {isUpdatingPassword ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile
