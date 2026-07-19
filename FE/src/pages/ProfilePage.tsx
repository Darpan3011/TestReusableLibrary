import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { apiClient } from '../lib/apiClient'

export function ProfilePage() {
  const { user, fetchMe, logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(true)
      fetchMe()
        .catch(() => setError('Failed to fetch profile'))
        .finally(() => setLoading(false))
    }
    // run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Convert user object → array of formatted rows
  const formatted = user ? Object.entries(user) : []

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            Profile
          </h2>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && user && (
        <>
          <Card title="Account Details" className="mb-8">
            {/* Authentication Provider Badge */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Authentication Method:</span>
                {(() => {
                  // Check if OAuth2 by looking for attributes with iss field
                  const issuer = user.attributes?.iss?.toLowerCase() || ''

                  if (issuer.includes('google')) {
                    return (
                      <div className="flex items-center space-x-2">
                        <img src="/providers/google.svg" alt="Google" className="h-5 w-5" />
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          Google OAuth
                        </span>
                      </div>
                    )
                  } else if (issuer.includes('microsoft') || issuer.includes('microsoftonline')) {
                    return (
                      <div className="flex items-center space-x-2">
                        <img src="/providers/microsoft.svg" alt="Microsoft" className="h-5 w-5" />
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white">
                          Microsoft OAuth
                        </span>
                      </div>
                    )
                  } else if (issuer.includes('github')) {
                    return (
                      <div className="flex items-center space-x-2">
                        <img src="/providers/github.svg" alt="GitHub" className="h-5 w-5" />
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-800 text-white">
                          GitHub OAuth
                        </span>
                      </div>
                    )
                  } else if (user.attributes?.iss) {
                    // If has iss field but doesn't match known providers, assume GitHub
                    return (
                      <div className="flex items-center space-x-2">
                        <img src="/providers/github.svg" alt="GitHub" className="h-5 w-5" />
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-800 text-white">
                          GitHub OAuth
                        </span>
                      </div>
                    )
                  } else {
                    return (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        JWT Authentication
                      </span>
                    )
                  }
                })()}
              </div>
            </div>

            {/* MFA Toggle Section - Only for Standard Login Users */}
            {user.authType === 'USER_DETAILS' && (
              <>
                <div className="flex items-center justify-between py-4 border-b border-gray-200 mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Secure your account with verification codes via email or SMS.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const newStatus = !user.mfaEnabled
                          await apiClient.post('/auth/toggle-mfa', { enabled: newStatus })
                          fetchMe() // Refresh user data
                        } catch (err: any) {
                          setError(err.response?.data?.error || 'Failed to update MFA settings')
                        }
                      }}
                      className={`${user.mfaEnabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
                    >
                      <span
                        aria-hidden="true"
                        className={`${user.mfaEnabled ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                      {user.mfaEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>

                {/* Phone Number & MFA Delivery Method Section */}
                <PhoneNumberSection />
              </>
            )}

            {/* User Attributes */}
            <dl className="divide-y divide-gray-200">
              {formatted.map(([key, val]) => (
                <div key={key} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                    {key}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">
                    {typeof val === 'object' ? (
                      <pre className="bg-gray-50 dark:bg-gray-900 dark:text-gray-200 p-2 rounded text-xs overflow-auto">
                        {JSON.stringify(val, null, 2)}
                      </pre>
                    ) : (
                      String(val)
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex justify-end">
              <Button variant="danger" onClick={logout}>
                Logout
              </Button>
            </div>
          </Card >

          {
            user.authType === 'USER_DETAILS' && (
              <ChangePasswordForm />
            )
          }
        </>
      )
      }
    </div >
  )
}

function PhoneNumberSection() {
  const { } = useAuth()
  const [phoneStatus, setPhoneStatus] = useState<any>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [isEditingPhone, setIsEditingPhone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetchPhoneStatus()
  }, [])

  const fetchPhoneStatus = async () => {
    try {
      const response = await apiClient.get('/profile/phone-status')
      setPhoneStatus(response.data)
    } catch (err: any) {
      console.error('Failed to fetch phone status', err)
    }
  }

  const handleSetPhone = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      await apiClient.post('/profile/set-phone', { phoneNumber })
      setMessage({ type: 'success', text: 'Verification code sent to your phone' })
      setShowVerifyModal(true)
      setIsEditingPhone(false)
      fetchPhoneStatus()
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to set phone number' })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyPhone = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      await apiClient.post('/profile/verify-phone', { code: verificationCode })
      setMessage({ type: 'success', text: 'Phone number verified successfully' })
      setShowVerifyModal(false)
      setVerificationCode('')
      fetchPhoneStatus()
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Invalid verification code' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 py-4 border-b border-gray-200 mb-6">
      {message && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Phone Number Management */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Phone Number</h4>
        {phoneStatus?.phoneNumber && !isEditingPhone ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-700 dark:text-gray-300">{phoneStatus.phoneNumber}</span>
              {phoneStatus.phoneNumberVerified ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Not Verified
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              {!phoneStatus.phoneNumberVerified && (
                <Button onClick={() => setShowVerifyModal(true)}>
                  Verify
                </Button>
              )}
              <Button onClick={() => setIsEditingPhone(true)} variant="secondary">
                Change
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSetPhone} className="flex space-x-2">
            <Input
              type="tel"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" isLoading={loading}>
              {phoneStatus?.phoneNumber ? 'Update' : 'Add Phone'}
            </Button>
            {isEditingPhone && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditingPhone(false)}
              >
                Cancel
              </Button>
            )}
          </form>
        )}
      </div>

      {/* Verification Modal */}
      {
        showVerifyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Verify Phone Number</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Enter the 6-digit code sent to your phone number.
              </p>
              <form onSubmit={handleVerifyPhone} className="space-y-4">
                <Input
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                />
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowVerifyModal(false)
                      setVerificationCode('')
                      setMessage(null)
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={loading} className="flex-1">
                    Verify
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )
      }
    </div >
  )
}

function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // Assuming the endpoint is /auth/change-password based on other auth endpoints
      // If it's at root, we might need to adjust to /change-password
      await apiClient.post('/auth/change-password', formData)
      setMessage({ type: 'success', text: 'Password updated successfully' })
      setFormData({ email: '', currentPassword: '', newPassword: '' })
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update password'
      setMessage({ type: 'error', text: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="Change Password">
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200'}`}>
            {message.text}
          </div>
        )}
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <Input
          label="Current Password"
          type="password"
          value={formData.currentPassword}
          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          required
        />
        <Input
          label="New Password"
          type="password"
          value={formData.newPassword}
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          required
          minLength={8}
        />
        <div className="flex justify-end">
          <Button type="submit" isLoading={loading}>
            Update Password
          </Button>
        </div>
      </form>
    </Card>
  )
}
