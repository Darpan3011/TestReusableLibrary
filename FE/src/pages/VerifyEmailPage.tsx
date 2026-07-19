import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { apiClient } from '../lib/apiClient'

export function VerifyEmailPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const userId = searchParams.get('userId')

    const [code, setCode] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)

    async function handleVerify(e: FormEvent) {
        e.preventDefault()
        if (!userId) {
            setError('User ID is missing')
            return
        }

        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            const response = await apiClient.post('/auth/verify-email', {
                userId: parseInt(userId),
                code
            })

            setSuccess(response.data.message || 'Email verified successfully!')
            setTimeout(() => {
                navigate('/login')
            }, 2000)
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
        setSuccess(null)

        try {
            await apiClient.post('/auth/resend-code', {
                userId: parseInt(userId),
                type: 'REGISTRATION'
            })

            setSuccess('Verification code sent! Please check your email.')
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
                    <p className="text-gray-600 mb-4">User ID is missing. Please register again.</p>
                    <Button onClick={() => navigate('/register')}>Go to Register</Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Verify Your Email
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    We've sent a 6-digit code to your email address
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

                        {success && (
                            <div className="rounded-md bg-green-50 p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-green-800">
                                            {success}
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
                                Verify Email
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
