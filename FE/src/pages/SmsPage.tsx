import { useState } from 'react'
import { apiClient } from '../lib/apiClient'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'

type Provider = 'TWILIO' | 'AWS' | 'MESSAGEBIRD' | 'MICROSOFT'

export function SmsPage() {
    const [provider, setProvider] = useState<Provider>('MICROSOFT')
    const [to, setTo] = useState('+919879880111')
    // const [from, setFrom] = useState('')
    const [message, setMessage] = useState('HI')
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setStatus(null)

        let endpoint = ''
        switch (provider) {
            case 'TWILIO':
                endpoint = '/smpp/twilio'
                break
            case 'AWS':
                endpoint = '/smpp/aws'
                break
            case 'MESSAGEBIRD':
                endpoint = '/smpp/messagebird'
                break
            case 'MICROSOFT':
                endpoint = '/smpp/microsoft'
                break
        }

        try {
            await apiClient.post(endpoint, { to, message })
            setStatus({ type: 'success', text: 'Message sent successfully!' })
            // Optional: Clear form
            setMessage('')
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to send message'
            setStatus({ type: 'error', text: msg })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate mb-8">
                Send SMS
            </h2>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {status && (
                        <div className={`p-4 rounded-md ${status.type === 'success' ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200'}`}>
                            {status.text}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label htmlFor="provider" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Provider
                        </label>
                        <select
                            id="provider"
                            value={provider}
                            onChange={(e) => setProvider(e.target.value as Provider)}
                            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                            <option value="TWILIO">Twilio</option>
                            <option value="AWS">AWS SNS</option>
                            <option value="MESSAGEBIRD">MessageBird</option>
                            <option value="MICROSOFT">Microsoft</option>
                        </select>
                    </div>

                    {/* {(provider != 'TWILIO' || provider != 'MICROSOFT') && <Input
                        label="From (Sender ID)"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        required
                        placeholder="e.g. MyCompany"
                    />} */}

                    <Input
                        label="To (Recipient)"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        required
                        placeholder="e.g. +1234567890"
                    />

                    <div className="space-y-1">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Message
                        </label>
                        <textarea
                            id="message"
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="Type your message here..."
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" isLoading={loading}>
                            Send Message
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
