import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiClient } from '../lib/apiClient'

type AuthContextValue = {
  isAuthenticated: boolean
  accessToken: string | null
  user: any | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string, email?: string) => Promise<{ userId?: number } | void>
  logout: () => void
  fetchMe: () => Promise<void>
  checkedSession: boolean
  authType: 'JWT' | 'OAUTH2' | 'BOTH' | null
  setAccessToken: (token: string | null) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function getStoredTokens() {
  const access = localStorage.getItem('accessToken')
  const refresh = localStorage.getItem('refreshToken')
  return { access, refresh }
}

function setStoredTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('refreshToken', refreshToken)
}

function clearStoredTokens() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(getStoredTokens().access)
  const [user, setUser] = useState<any | null>(null)
  const [checkedSession, setCheckedSession] = useState(false)

  const [authType, setAuthType] = useState<'JWT' | 'OAUTH2' | 'BOTH' | null>(null)

  useEffect(() => {
    // Fetch auth type on mount
    apiClient.get('/auth/auth-type')
      .then(({ data }) => {
        setAuthType(data['Auth Type'])
      })
      .catch((err) => {
        console.error('Failed to fetch auth type', err)
        // Default to JWT if fetch fails to avoid breaking UI completely, or handle as error
        setAuthType('JWT')
      })
  }, [])

  useEffect(() => {
    if (accessToken) apiClient.setAccessToken(accessToken)
  }, [accessToken])

  const isAuthenticated = !!accessToken || !!user

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/auth/me')
      setUser(data)
      setCheckedSession(true)
    } catch (e) {
      // apiClient interceptor will handle token refresh automatically
      // If refresh fails or user is not authenticated, just set user to null
      setUser(null)
      setCheckedSession(true)
    }
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const response = await apiClient.post('/auth/login', { username, password })

    // Handle MFA Required (202 Accepted)
    if (response.status === 202) {
      const error: any = new Error('MFA Required')
      error.response = response
      throw error
    }

    const { data } = response
    console.log('[AuthContext] Login response:', { hasAccessToken: !!data.accessToken, hasRefreshToken: !!data.refreshToken })
    // expecting AuthResponse: { accessToken, refreshToken }
    setAccessToken(data.accessToken)
    setStoredTokens(data.accessToken, data.refreshToken)
    apiClient.setAccessToken(data.accessToken)
    console.log('[AuthContext] Tokens stored in localStorage')
    await fetchMe().catch(() => { })
  }, [fetchMe])

  const register = useCallback(async (username: string, password: string, email?: string) => {
    try {
      const response = await apiClient.post('/auth/register', { username, password, email })
      return response.data // Return the response data which includes userId
    } catch (error: any) {
      // Extract error message from API response
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed'
      throw new Error(errorMessage)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      // Call Spring Security's logout endpoint
      // This handles session invalidation (OAuth2) and clears the SecurityContext
      await apiClient.post('/logout')
    } catch (e) {
      console.error('Logout request failed', e)
      // Continue with client-side cleanup even if server request fails
    }

    // Always clear JWT tokens and local state
    sessionStorage.setItem('justLoggedOut', '1')
    setUser(null)
    setAccessToken(null)
    clearStoredTokens()
    apiClient.setAccessToken(null)

    // Redirect to home
    window.location.replace('/')
  }, [])

  useEffect(() => {
    const skip = sessionStorage.getItem('justLoggedOut') === '1'
    if (skip) {
      sessionStorage.removeItem('justLoggedOut')
      setCheckedSession(true)
      return
    }
    // Always probe session once on load to support OAuth2 (server session)
    fetchMe().catch(() => setCheckedSession(true))
  }, [fetchMe])

  // Listen for token refresh events from apiClient
  useEffect(() => {
    const handleTokenRefreshed = (event: CustomEvent) => {
      console.log('[AuthContext] Received token-refreshed event')
      const { accessToken, refreshToken } = event.detail
      setAccessToken(accessToken)
      if (refreshToken) {
        setStoredTokens(accessToken, refreshToken)
      }
      // Optionally refetch user data to ensure it's up to date
      fetchMe().catch(() => { })
    }

    const handleTokenRefreshFailed = () => {
      console.log('[AuthContext] Received token-refresh-failed event')
      setAccessToken(null)
      setUser(null)
      clearStoredTokens()
      console.log('[AuthContext] Cleared user and tokens')
    }

    window.addEventListener('token-refreshed', handleTokenRefreshed as EventListener)
    window.addEventListener('token-refresh-failed', handleTokenRefreshFailed)

    return () => {
      window.removeEventListener('token-refreshed', handleTokenRefreshed as EventListener)
      window.removeEventListener('token-refresh-failed', handleTokenRefreshFailed)
    }
  }, [fetchMe])

  const value = useMemo(() => ({ isAuthenticated, accessToken, user, login, register, logout, fetchMe, checkedSession, authType, setAccessToken }), [isAuthenticated, accessToken, user, login, register, logout, fetchMe, checkedSession, authType])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


