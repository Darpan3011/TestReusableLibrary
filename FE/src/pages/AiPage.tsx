import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../lib/apiClient'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeaderSection, TableRow } from '../components/ui/Table'

type TabType = 'ask' | 'context'

export function AiPage() {
    const [activeTab, setActiveTab] = useState<TabType>('ask')
    const [question, setQuestion] = useState('')
    const [loading, setLoading] = useState(false)
    const [answerData, setAnswerData] = useState<{ answer: string, sql: string, rows: { columns: string[], rows: any[] } } | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [context, setContext] = useState<any[]>([])
    const [loadingContext, setLoadingContext] = useState(false)

    // Model selection state
    const [provider, setProvider] = useState<string>('')
    const [modelName, setModelName] = useState<string>('')
    const [customModel, setCustomModel] = useState(false)

    // Default models per provider
    const getModelsForProvider = (p: string) => {
        switch (p.toLowerCase()) {
            case 'openai': return [
                "gpt-5.2",
                "gpt-5.2-pro",
                "gpt-5.2-mini",
                "gpt-5-nano",
                "gpt-4.1",
                "gpt-4.1-mini",
                "gpt-4o",
                "gpt-4o-mini",
                "gpt-4-turbo",
                "gpt-3.5-turbo",
                "gpt-oss-120b",
                "gpt-oss-20b"
            ]
            case 'gemini': return [
                "gemini-2.5-flash-lite",
                "gemini-2.0-flash",
                "gemini-2.0-flash-lite",
                "gemini-2.5-flash-preview-09-2025",
                "gemini-2.5-flash-lite-preview-09-2025"
            ]

            case 'ollama': return [
                "deepseek-r1",
                "qwen3-coder",
                "gemma3",
                "phi3",           // available in Ollama library
                "llama3",
                "llava",          // multimodal LLaVA models
                "gpt-oss"         // OpenAI open-weight model available in some Ollama repos
            ]

            default: return []
        }
    }

    const fetchContext = useCallback(async () => {
        setLoadingContext(true)
        try {
            const { data } = await apiClient.get('/aidb/context')
            setContext(data.messages || [])
        } catch (err) {
            console.error('Failed to fetch context', err)
        } finally {
            setLoadingContext(false)
        }
    }, [])

    useEffect(() => {
        // Fetch config to get provider
        const fetchConfig = async () => {
            try {
                const { data } = await apiClient.get('/aidb/config')
                if (data.provider) {
                    setProvider(data.provider)
                    // Set default model if available
                    const models = getModelsForProvider(data.provider)
                    if (models.length > 0) setModelName(models[0])
                }
            } catch (err) {
                console.error('Failed to fetch config', err)
            }
        }
        fetchConfig()
    }, [])

    useEffect(() => {
        // Only fetch context when the context tab is active
        if (activeTab === 'context') {
            fetchContext()
        }
    }, [activeTab, fetchContext])

    const handleAsk = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setAnswerData(null)

        try {
            const { data } = await apiClient.post('/aidb/ask', {
                question,
                modelName
            })
            setAnswerData(data)
            fetchContext() // Refresh context after asking
        } catch (err: any) {
            console.error('Failed to get answer', err)
            let msg = err.response?.data?.message || 'Failed to get answer'
            // If the message is a JSON object string, try to parse it
            if (typeof msg === 'string' && msg.trim().startsWith('{')) {
                try {
                    const parsed = JSON.parse(msg)
                    if (parsed.error?.message) {
                        msg = parsed.error.message
                    }
                } catch (e) {
                    // Ignore parsing errors, keep original message
                }
            }
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    const handleClearContext = async () => {
        if (!confirm('Are you sure you want to clear the conversation history?')) return

        setLoadingContext(true)
        try {
            await apiClient.delete('/aidb/context')
            setContext([])
        } catch (err) {
            console.error('Failed to clear context', err)
        } finally {
            setLoadingContext(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-8 space-y-6">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                AI Assistant
            </h2>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('ask')}
                        className={`${activeTab === 'ask'
                            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                    >
                        Ask Question
                    </button>
                    <button
                        onClick={() => setActiveTab('context')}
                        className={`${activeTab === 'context'
                            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                    >
                        Chat Context
                    </button>
                </nav>
            </div>

            {/* Ask Tab Content */}
            {activeTab === 'ask' && (
                <div className="space-y-6">
                    <Card title="Ask a Question">
                        <form onSubmit={handleAsk} className="space-y-4">
                            <div className="space-y-1">
                                <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Question
                                </label>
                                <textarea
                                    id="question"
                                    rows={4}
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    required
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                    placeholder="Ask something..."
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                {!customModel ? (
                                    <select
                                        value={modelName}
                                        onChange={(e) => {
                                            if (e.target.value === 'custom') {
                                                setCustomModel(true)
                                                setModelName('')
                                            } else {
                                                setModelName(e.target.value)
                                            }
                                        }}
                                        className="w-64 rounded-md border-gray-300 dark:border-gray-500 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        {getModelsForProvider(provider).map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                        <option value="custom">Other...</option>
                                    </select>
                                ) : (
                                    <>
                                        <input
                                            type="text"
                                            value={modelName}
                                            onChange={(e) => setModelName(e.target.value)}
                                            placeholder="Model name"
                                            className="w-64 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                setCustomModel(false)
                                                const defaults = getModelsForProvider(provider)
                                                if (defaults.length > 0) setModelName(defaults[0])
                                            }}
                                        >
                                            Back
                                        </Button>
                                    </>
                                )}
                                <Button type="submit" isLoading={loading}>
                                    Ask
                                </Button>
                            </div>
                        </form>

                        {error && (
                            <div className="mt-4 p-4 rounded-md bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200">
                                {error}
                            </div>
                        )}

                        {answerData && (
                            <div className="mt-6 space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Answer</h4>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{answerData.answer}</p>
                                </div>
                                {answerData.sql && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Generated SQL</h4>
                                        <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-900 dark:text-gray-200 rounded text-xs overflow-x-auto">
                                            {answerData.sql}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>

                    {/* Data Rows Section */}
                    {answerData?.rows?.rows && answerData.rows.rows.length > 0 && (
                        <Card title="Query Results">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeaderSection>
                                        <TableRow>
                                            {answerData.rows.columns.map((column: string) => (
                                                <TableHead key={column}>{column}</TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeaderSection>
                                    <TableBody>
                                        {answerData.rows.rows.map((row: any, idx: number) => (
                                            <TableRow key={idx}>
                                                {answerData.rows.columns.map((column: string) => (
                                                    <TableCell key={column}>{String(row[column] ?? '')}</TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    )}
                </div>
            )}

            {/* Context Tab Content */}
            {activeTab === 'context' && (
                <div className="space-y-6">
                    <Card title="Chat Context">
                        <div className="flex justify-end mb-4">
                            <Button
                                variant="danger"
                                onClick={handleClearContext}
                                disabled={loadingContext || context.length === 0}
                                isLoading={loadingContext}
                            >
                                Clear History
                            </Button>
                        </div>
                        {loadingContext ? (
                            <div className="text-center py-4 text-gray-500 dark:text-gray-400">Loading context...</div>
                        ) : context.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No history yet. Ask a question to start!</p>
                        ) : (
                            <div className="space-y-4 max-h-[600px] overflow-y-auto">
                                {context.map((msg, idx) => {
                                    // Parse the message string to extract role and content
                                    const msgStr = typeof msg === 'string' ? msg : String(msg)
                                    let role = 'unknown'
                                    let content = msgStr

                                    if (msgStr.startsWith('SystemMessage')) {
                                        role = 'system'
                                        const match = msgStr.match(/text = "([^"]+)"/)
                                        content = match ? match[1] : msgStr
                                    } else if (msgStr.startsWith('UserMessage')) {
                                        role = 'user'
                                        const match = msgStr.match(/TextContent { text = "([^"]+)" }/)
                                        content = match ? match[1] : msgStr
                                    } else if (msgStr.startsWith('AiMessage')) {
                                        role = 'assistant'
                                        const match = msgStr.match(/text = "([^"]+)"/)
                                        content = match ? match[1] : msgStr
                                    }

                                    return (
                                        <div key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-2 last:border-0">
                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{role}</p>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{content}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </Card>
                </div>
            )}
        </div>
    )
}
