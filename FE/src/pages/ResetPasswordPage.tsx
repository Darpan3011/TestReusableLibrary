import { type FormEvent, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { apiClient } from '../lib/apiClient'

export function ResetPasswordPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const emailFromState = location.state?.email || ''

    const [email, setEmail] = useState(emailFromState)
    const [code, setCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function onSubmit(e: FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        try {
            await apiClient.post('/auth/reset-password', { email, code, newPassword })
            alert('Password reset successfully! You can now login with your new password.')
            navigate('/login')
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to reset password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    Reset Password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Enter the code sent to your email and your new password
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={onSubmit}>
                        <Input
                            id="email"
                            label="Email Address"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Input
                            id="code"
                            label="Verification Code"
                            type="text"
                            required
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter 6-digit code"
                        />

                        <Input
                            id="newPassword"
                            label="New Password"
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <Input
                            id="confirmPassword"
                            label="Confirm New Password"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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

                        <div className="flex items-center justify-between gap-4">
                            <Link
                                to="/forgot-password"
                                className="text-sm font-medium text-primary-600 hover:text-primary-500"
                            >
                                Resend Code
                            </Link>
                            <Button
                                type="submit"
                                isLoading={loading}
                                className="w-full"
                            >
                                Reset Password
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}
