// src/App.tsx
import React, { useEffect, useState } from 'react'
import './App.css'
import { Route, Routes, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { SmsPage } from './pages/SmsPage'
import { AiPage } from './pages/AiPage'
import { EmailMultiplePage } from './pages/EmailMultiplePage'
import { HomePage } from './pages/HomePage'
import { ProfilePage } from './pages/ProfilePage'
import { ApiFilterPage } from './pages/ApiFilterPage'
import { VerifyEmailPage } from './pages/VerifyEmailPage'
import { MfaVerificationPage } from './pages/MfaVerificationPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { AuthProvider, useAuth } from './auth/AuthContext'
import { Layout } from './components/Layout'
import { Toast } from './components/ui/Toast'
import { ThemeProvider } from './context/ThemeContext'

function Spinner() {
  return (
    <div className="flex justify-center items-center h-full">
      <svg className="animate-spin h-10 w-10 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  )
}

function ApiCallTracker() {
  const [calls, setCalls] = useState<{id: number, url: string, method: string, dependency: string}[]>([])

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      const id = Date.now() + Math.random()
      setCalls(prev => [...prev, { id, ...detail }])
      
      setTimeout(() => {
        setCalls(prev => prev.filter(c => c.id !== id))
      }, 4000)
    }
    window.addEventListener('api-call-tracker', handler)
    return () => window.removeEventListener('api-call-tracker', handler)
  }, [])

  if (calls.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2 pointer-events-none w-80">
      {calls.map(call => (
        <div key={call.id} className="bg-gray-900/90 dark:bg-white/90 text-white dark:text-gray-900 px-4 py-3 rounded-lg shadow-xl animate-slide-in-right border border-gray-700 dark:border-gray-200 backdrop-blur-sm flex flex-col gap-1 w-full pointer-events-auto transition-all duration-300 transform origin-top">
          <div className="flex items-center justify-between gap-4">
             <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary-600 text-white flex-shrink-0">{call.method}</span>
             <span className="text-sm font-mono truncate">{call.url}</span>
          </div>
          <div className="text-xs text-gray-300 dark:text-gray-600 font-medium border-t border-gray-700/50 dark:border-gray-200/50 pt-1 mt-1">
             ⚡ Powered by: <span className="text-primary-400 dark:text-primary-600 font-semibold truncate">{call.dependency}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, checkedSession } = useAuth()
  if (!checkedSession)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner />
      </div>
    )
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppContent() {
  const { isAuthenticated, user, authType } = useAuth()
  const [showLoginToast, setShowLoginToast] = useState(false)
  const [showLogoutToast, setShowLogoutToast] = useState(false)
  const [rateLimitMsg, setRateLimitMsg] = useState<string | null>(null)
  const [previousAuth, setPreviousAuth] = useState(false)

  useEffect(() => {
    // Show login toast when user becomes authenticated
    if (isAuthenticated && !previousAuth && user) {
      setShowLoginToast(true)
    }
    // Show logout toast when user becomes unauthenticated
    if (!isAuthenticated && previousAuth) {
      setShowLogoutToast(true)
    }
    setPreviousAuth(isAuthenticated)
  }, [isAuthenticated, user, previousAuth])

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      const retryAfter = detail?.retryAfter
      const msg = retryAfter
        ? `Slow down! You've been rate limited. Try again in ${retryAfter} seconds.`
        : `Slow down! You've been rate limited. Please wait a moment.`
      setRateLimitMsg(msg)
    }
    window.addEventListener('rate-limited', handler)
    return () => window.removeEventListener('rate-limited', handler)
  }, [])

  const getLoginMessage = () => {
    if (authType === 'OAUTH2') {
      return `Welcome back, ${user?.name || user?.attributes?.name || 'User'}! You've successfully signed in with OAuth2.`
    }
    return `Welcome back, ${user?.attributes?.name || user?.name || user?.username || 'User'}! You've successfully logged in.`
  }

  return (
    <>
      {showLoginToast && (
        <Toast
          message={getLoginMessage()}
          type="success"
          onClose={() => setShowLoginToast(false)}
          duration={4000}
        />
      )}
      {rateLimitMsg && (
        <Toast
          message={rateLimitMsg}
          type="warning"
          onClose={() => setRateLimitMsg(null)}
          duration={6000}
        />
      )}
      {showLogoutToast && (
        <Toast
          message="You've been successfully logged out. See you next time!"
          type="info"
          onClose={() => setShowLogoutToast(false)}
          duration={4000}
        />
      )}
      <ApiCallTracker />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/verify-mfa" element={<MfaVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sms"
            element={
              <ProtectedRoute>
                <SmsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai"
            element={
              <ProtectedRoute>
                <AiPage />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/email"
            element={
              <ProtectedRoute>
                <EmailPage />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/email/multiple"
            element={
              <ProtectedRoute>
                <EmailMultiplePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/api/filter"
            element={
              <ApiFilterPage />
            }
          />
        </Route>
      </Routes>
    </>
  )
}



export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  )
}
