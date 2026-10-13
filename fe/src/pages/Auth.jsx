import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'

function Auth() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login, register, isAuthenticated } = useAuth()

  const defaultMode = searchParams.get('mode') === 'register' ? 'register' : 'login'
  const redirectPath = searchParams.get('redirect') || '/products'

  const [mode, setMode] = useState(defaultMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated) {
    navigate(redirectPath, { replace: true })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(name, email, password)
      }

      navigate(redirectPath, { replace: true })
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memproses autentikasi')
    } finally {
      setIsSubmitting(false)
    }
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setError('')
  }

  return (
    <div className="mx-auto max-w-md py-6 sm:py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/"
          className="
            inline-flex
            items-center
            gap-1.5
            text-xs
            text-[var(--color-text-muted)]
            transition-colors
            hover:text-[var(--color-text)]
          "
        >
          <ArrowLeft size={14} strokeWidth={1.7} />
          Back to store
        </Link>
      </div>

      {/* Auth Card */}
      <div
        className="
          rounded-[6px]
          border border-[var(--color-border)]
          bg-[var(--color-surface)]
          p-6 sm:p-8
          shadow-sm
        "
      >
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
            {mode === 'login' ? 'Sign in to Stocky' : 'Create an account'}
          </h1>

          <p
            className="
              mt-1.5
              text-xs
              text-[var(--color-text-muted)]
            "
          >
            {mode === 'login'
              ? 'Enter your credentials to access your cart, checkout, and orders.'
              : 'Register to start shopping and managing your orders.'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div
          className="
            mt-6
            flex
            rounded-[4px]
            border border-[var(--color-border)]
            bg-[var(--color-bg)]
            p-1
          "
        >
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`
              flex-1
              rounded-[3px]
              py-1.5
              text-xs
              font-medium
              transition-all
              ${
                mode === 'login'
                  ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-xs'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }
            `}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`
              flex-1
              rounded-[3px]
              py-1.5
              text-xs
              font-medium
              transition-all
              ${
                mode === 'register'
                  ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-xs'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }
            `}
          >
            Register
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div
            className="
              mt-5
              rounded-[4px]
              border border-red-500/20
              bg-red-500/10
              px-4
              py-2.5
              text-xs
              text-red-500
            "
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label
                htmlFor="auth-name"
                className="
                  block
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.08em]
                  text-[var(--color-text-muted)]
                "
              >
                Full Name
              </label>
              <div className="relative mt-1.5">
                <User
                  size={15}
                  strokeWidth={1.7}
                  className="
                    pointer-events-none
                    absolute left-3 top-1/2
                    -translate-y-1/2
                    text-[var(--color-text-muted)]
                  "
                />
                <input
                  id="auth-name"
                  type="text"
                  required
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="
                    input-krauq
                    h-10
                    w-full
                    pl-9 pr-3
                    placeholder:text-[var(--color-text-muted)]
                  "
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="auth-email"
              className="
                block
                text-[11px]
                font-medium
                uppercase
                tracking-[0.08em]
                text-[var(--color-text-muted)]
              "
            >
              Email Address
            </label>
            <div className="relative mt-1.5">
              <Mail
                size={15}
                strokeWidth={1.7}
                className="
                  pointer-events-none
                  absolute left-3 top-1/2
                  -translate-y-1/2
                  text-[var(--color-text-muted)]
                "
              />
              <input
                id="auth-email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  input-krauq
                  h-10
                  w-full
                  pl-9 pr-3
                  placeholder:text-[var(--color-text-muted)]
                "
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="
                block
                text-[11px]
                font-medium
                uppercase
                tracking-[0.08em]
                text-[var(--color-text-muted)]
              "
            >
              Password
            </label>
            <div className="relative mt-1.5">
              <Lock
                size={15}
                strokeWidth={1.7}
                className="
                  pointer-events-none
                  absolute left-3 top-1/2
                  -translate-y-1/2
                  text-[var(--color-text-muted)]
                "
              />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  input-krauq
                  h-10
                  w-full
                  pl-9 pr-10
                  placeholder:text-[var(--color-text-muted)]
                "
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute right-3 top-1/2
                  -translate-y-1/2
                  text-[var(--color-text-muted)]
                  transition-colors
                  hover:text-[var(--color-text)]
                "
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff size={15} strokeWidth={1.7} />
                ) : (
                  <Eye size={15} strokeWidth={1.7} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="
              mt-6
              flex
              h-10
              w-full
              items-center
              justify-center
              gap-2
              rounded-[4px]
              bg-[var(--color-text)]
              text-xs
              font-medium
              text-[var(--color-surface)]
              transition-opacity
              hover:opacity-85
              disabled:opacity-50
            "
          >
            <span>{isSubmitting ? 'Processing...' : mode === 'login' ? 'Sign in' : 'Create account'}</span>
            <ArrowRight size={14} strokeWidth={1.7} />
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-6 border-t border-[var(--color-border)] pt-4 text-center">
          <p className="text-[11px] text-[var(--color-text-muted)]">
            {mode === 'login' ? "Don't have an account yet? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              className="font-medium text-[var(--color-text)] underline underline-offset-2 hover:opacity-75"
            >
              {mode === 'login' ? 'Register now' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth
