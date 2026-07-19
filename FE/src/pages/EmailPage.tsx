import { useState, type FormEvent } from 'react'
import { apiClient } from '../lib/apiClient'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'

export function EmailPage() {
    const [to, setTo] = useState('')
    const [subject, setSubject] = useState('')
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            const formData = new FormData()
            formData.append('to', to)
            formData.append('subject', subject)
            formData.append('body', body)
            formData.append('title', title)
            if (file) {
                formData.append('file', file)
            }

            const { data } = await apiClient.post('/email/test/multipart', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            setSuccess(data || 'Email queued successfully')
            // Reset form
            setTo('')
            setSubject('')
            setTitle('')
            setBody('')
            setFile(null)
            // Reset file input
            const fileInput = document.getElementById('file-upload') as HTMLInputElement
            if (fileInput) fileInput.value = ''
        } catch (err: any) {
            const errorMessage = err.response?.data || err.message || 'Failed to send email'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-6">
                Send Email with Attachment
            </h2>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="To (Email Address)"
                        type="email"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        required
                        placeholder="recipient@example.com"
                    />

                    <Input
                        label="Subject"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        placeholder="Email subject"
                    />

                    <Input
                        label="Title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Email title"
                    />

                    <div className="space-y-1">
                        <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                            Body
                        </label>
                        <textarea
                            id="body"
                            rows={6}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border"
                            placeholder="Email body content..."
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
                            Attachment
                        </label>
                        <div className="mt-1 flex items-center">
                            <input
                                id="file-upload"
                                type="file"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-primary-50 file:text-primary-700
                                    hover:file:bg-primary-100
                                    cursor-pointer"
                            />
                        </div>
                        {file && (
                            <p className="mt-2 text-sm text-gray-500">
                                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                            </p>
                        )}
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="rounded-md bg-green-50 p-4">
                            <p className="text-sm text-green-800">{success}</p>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button type="submit" isLoading={loading}>
                            Send Email
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
