import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async (authToken) => {
    if (!authToken) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const res = await api.getMe()
      if (res?.user) {
        setUser(res.user)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.warn('Failed to fetch authenticated user:', err)
      // If token expired / invalid, remove it
      if (err.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        setToken(null)
        setUser(null)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser(token)
  }, [token, fetchUser])

  const login = async (email, password) => {
    const res = await api.login({ email, password })
    if (res?.tokens?.access_token) {
      const accessToken = res.tokens.access_token
      const refreshToken = res.tokens.refresh_token
      localStorage.setItem('token', accessToken)
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken)
      }
      setToken(accessToken)
      if (res.user) {
        setUser(res.user)
      } else {
        await fetchUser(accessToken)
      }
    }
    return res
  }

  const register = async (name, email, password) => {
    const res = await api.register({ name, email, password })
    if (res?.tokens?.access_token) {
      const accessToken = res.tokens.access_token
      const refreshToken = res.tokens.refresh_token
      localStorage.setItem('token', accessToken)
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken)
      }
      setToken(accessToken)
      if (res.user) {
        setUser(res.user)
      } else {
        await fetchUser(accessToken)
      }
    }
    return res
  }

  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token')
    if (refreshToken) {
      try {
        await api.logout(refreshToken)
      } catch {
        // ignore logout errors
      }
    }
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    loading,
    login,
    register,
    logout,
    refreshUser: () => fetchUser(token),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
