import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { apiClient } from '../lib/apiClient'

export function ForgotPasswordPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function onSubmit(e: FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await apiClient.post('/auth/forgot-password', { email })
            navigate('/reset-password', { state: { email } })
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to send reset code')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    Forgot Password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Enter your email address and we'll send you a code to reset your password
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
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => navigate('/login')}
                            >
                                Back to Login
                            </Button>
                            <Button
                                type="submit"
                                isLoading={loading}
                                className="w-full"
                            >
                                Send Reset Code
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}
