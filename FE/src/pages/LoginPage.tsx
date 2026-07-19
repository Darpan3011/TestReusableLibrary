import { type FormEvent, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { API_BASE_URL } from '../config'

export function LoginPage() {
  const { login, authType } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(username, password)
      navigate('/profile')
    } catch (err: any) {
      const response = err.response

      // Handle MFA Required
      if (response?.status === 202 && response.data.mfaRequired) {
        navigate(`/verify-mfa?userId=${response.data.userId}`, {
          state: {
            availableMethods: response.data.availableMethods,
            maskedEmail: response.data.maskedEmail,
            maskedPhone: response.data.maskedPhone
          }
        })
        return
      }

      // Handle Email Not Verified
      if (response?.status === 403 && response.data.error === 'EMAIL_NOT_VERIFIED') {
        navigate(`/verify-email?userId=${response.data.userId}`)
        return
      }

      setError(response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {authType !== 'OAUTH2' && (
            <>
              Or{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                create a new account
              </Link>
            </>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {authType !== 'OAUTH2' && (
            <form className="space-y-6" onSubmit={onSubmit}>
              <Input
                id="username"
                label="Username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <Input
                id="password"
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {String(error)}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end mb-4">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  Forgot your password?
                </Link>
              </div>

              <div className="flex items-center justify-between gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setUsername('')
                    setPassword('')
                    setError(null)
                  }}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  isLoading={loading}
                  className="w-full"
                >
                  Sign in
                </Button>
              </div>
            </form>
          )}

          {authType !== 'JWT' && (
            <div>
              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    {authType === 'OAUTH2' ? 'Sign in with' : 'Or continue with'}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={`${API_BASE_URL}/oauth2/authorization/azure`}
                  className="relative w-full inline-flex items-center justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <img src="/providers/microsoft.svg" alt="Microsoft" className="h-5 w-5 mr-3" />
                  <span>Continue with Microsoft</span>
                </a>

                <a
                  href={`${API_BASE_URL}/oauth2/authorization/google`}
                  className="relative w-full inline-flex items-center justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <img src="/providers/google.svg" alt="Google" className="h-5 w-5 mr-3" />
                  <span>Continue with Google</span>
                </a>

                <a
                  href={`${API_BASE_URL}/oauth2/authorization/github`}
                  className="relative w-full inline-flex items-center justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <img src="/providers/github.svg" alt="GitHub" className="h-5 w-5 mr-3" />
                  <span>Continue with GitHub</span>
                </a>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
