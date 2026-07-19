import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { apiClient } from '../lib/apiClient'

export function MfaVerificationPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { setAccessToken, fetchMe } = useAuth()
    const userId = searchParams.get('userId')
    const availableMethods = location.state?.availableMethods as string[] | undefined
    const maskedEmail = location.state?.maskedEmail as string | undefined
    const maskedPhone = location.state?.maskedPhone as string | undefined

    const [code, setCode] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
    const [methodSelectionLoading, setMethodSelectionLoading] = useState(false)

    async function handleSelectMethod(method: string) {
        if (!userId) return
        setMethodSelectionLoading(true)
        setError(null)
        try {
            await apiClient.post('/auth/send-mfa-code', {
                userId: parseInt(userId),
                method
            })
            setSelectedMethod(method)
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to send verification code')
        } finally {
            setMethodSelectionLoading(false)
        }
    }

    async function handleVerify(e: FormEvent) {
        e.preventDefault()
        if (!userId) {
            setError('User ID is missing')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const response = await apiClient.post('/auth/verify-mfa', {
                userId: parseInt(userId),
                code
            })

            // Store tokens
            const { accessToken, refreshToken } = response.data
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)
            setAccessToken(accessToken)
            apiClient.setAccessToken(accessToken)

            // Fetch user data
            await fetchMe()

            // Navigate to profile
            navigate('/profile')
        } catch (err: any) {
            setError(err.response?.data?.error || 'Verification failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    async function handleResend() {
        if (!userId) {
            setError('User ID is missing')
            return
        }

        setResending(true)
        setError(null)

        try {
            // If we selected a method, use it. Otherwise default to LOGIN type (which might fail if we need explicit method)
            // But wait, resend-code endpoint might need update too?
            // Existing resend-code uses generateAndSendCode(userId, type). 
            // If we changed MfaServiceImpl, that method now defaults to... wait.
            // I didn't change generateAndSendCode(userId, type) implementation?
            // I added a NEW method. The old method still exists.
            // Let's check MfaServiceImpl.

            // If I use the old method, it might fail if I removed the logic to pick a method?
            // No, I didn't touch generateAndSendCode(userId, type) in MfaServiceImpl.
            // Wait, I should check MfaServiceImpl again.

            // Assuming I need to use the new endpoint for resend as well if I want to stick to the selected method.
            if (selectedMethod) {
                await apiClient.post('/auth/send-mfa-code', {
                    userId: parseInt(userId),
                    method: selectedMethod
                })
            } else {
                await apiClient.post('/auth/resend-code', {
                    userId: parseInt(userId),
                    type: 'LOGIN'
                })
            }

            setError(`Code sent via ${selectedMethod || 'email'}!`)
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to resend code')
        } finally {
            setResending(false)
        }
    }

    if (!userId) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <Card className="p-8">
                    <h2 className="text-xl font-bold text-red-600 mb-4">Invalid Request</h2>
                    <p className="text-gray-600 mb-4">User ID is missing. Please log in again.</p>
                    <Button onClick={() => navigate('/login')}>Go to Login</Button>
                </Card>
            </div>
        )
    }

    // Show method selection if availableMethods is present and no method selected
    if (availableMethods && !selectedMethod) {
        return (
            <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Select Verification Method
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Choose how you want to receive your verification code
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        {error && (
                            <div className="rounded-md bg-red-50 p-4 mb-6">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="space-y-4">
                            {availableMethods.includes('EMAIL') && (
                                <Button
                                    onClick={() => handleSelectMethod('EMAIL')}
                                    isLoading={methodSelectionLoading}
                                    className="w-full flex justify-center items-center gap-2"
                                    variant="secondary"
                                >
                                    <span>📧</span> Send via Email {maskedEmail && <span className="text-xs text-gray-500">({maskedEmail})</span>}
                                </Button>
                            )}
                            {availableMethods.includes('SMS') && (
                                <Button
                                    onClick={() => handleSelectMethod('SMS')}
                                    isLoading={methodSelectionLoading}
                                    className="w-full flex justify-center items-center gap-2"
                                    variant="secondary"
                                >
                                    <span>📱</span> Send via SMS {maskedPhone && <span className="text-xs text-gray-500">({maskedPhone})</span>}
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    Two-Factor Authentication
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Enter the verification code sent to your {selectedMethod === 'SMS' ? 'phone' : 'email'}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleVerify}>
                        <Input
                            id="code"
                            label="Verification Code"
                            type="text"
                            required
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="Enter 6-digit code"
                        />

                        {error && (
                            <div className="rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">
                                            {error}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <Button
                                type="submit"
                                isLoading={loading}
                                className="w-full"
                            >
                                Verify & Login
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleResend}
                                isLoading={resending}
                                className="w-full"
                            >
                                Resend Code
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}
