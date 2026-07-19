import { useState } from 'react'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { apiClient } from '../lib/apiClient'

interface FileWithPreview {
    file: File
    id: string
}

export function EmailMultiplePage() {
    const [formData, setFormData] = useState({
        to: 'dummmy3011@gmail.com',
        subject: 'test subject',
        title: 'test title',
        body: 'test body'
    })
    const [files, setFiles] = useState<FileWithPreview[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
                file,
                id: Math.random().toString(36).substring(7)
            }))
            setFiles(prev => [...prev, ...newFiles])
            // Reset input value to allow selecting the same file again
            e.target.value = ''
        }
    }

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const formDataToSend = new FormData()
            formDataToSend.append('to', formData.to)
            formDataToSend.append('subject', formData.subject)
            formDataToSend.append('title', formData.title)
            formDataToSend.append('body', formData.body)

            // Append all files
            files.forEach(({ file }) => {
                formDataToSend.append('files', file)
            })

            await apiClient.post('/email/test/multipart/multiple', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            setSuccess(true)
            setFormData({
                to: '',
                subject: '',
                title: '',
                body: ''
            })
            setFiles([])
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send email')
        } finally {
            setLoading(false)
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                    Send Email with Multiple Attachments
                </h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Send emails with multiple file attachments
                </p>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4 mb-6">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
                        </div>
                    </div>
                </div>
            )}

            {success && (
                <div className="rounded-md bg-green-50 dark:bg-green-900/30 p-4 mb-6">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Email sent successfully!</h3>
                        </div>
                    </div>
                </div>
            )}

            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="To"
                        type="email"
                        value={formData.to}
                        onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                        placeholder="recipient@example.com"
                        required
                    />

                    <Input
                        label="Subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Email subject"
                        required
                    />

                    <Input
                        label="Email from title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Email from title"
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Body
                        </label>
                        <textarea
                            value={formData.body}
                            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                            rows={6}
                            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="Email body content"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Attachments (Optional)
                        </label>

                        {/* File Upload Button */}
                        <div className="mb-4">
                            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200">
                                <svg className="h-5 w-5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                Choose Files
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                            <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                                {files.length > 0 ? `${files.length} file(s) selected` : 'No files selected'}
                            </span>
                        </div>

                        {/* File List */}
                        {files.length > 0 && (
                            <div className="space-y-2">
                                {files.map(({ file, id }) => (
                                    <div
                                        key={id}
                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700"
                                    >
                                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                                            <svg className="h-5 w-5 text-gray-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                            </svg>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {file.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatFileSize(file.size)}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(id)}
                                            className="ml-4 flex-shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            title="Remove file"
                                        >
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

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
