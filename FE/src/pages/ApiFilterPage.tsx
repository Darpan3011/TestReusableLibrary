import { type FormEvent, useMemo, useState } from 'react'
import { apiClient } from '../lib/apiClient'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeaderSection, TableRow } from '../components/ui/Table'

type Result = {
  content: any[]
  currentPage: number
  totalItems: number
  totalPages: number
  pageSize: number
  sort: any
}

export function ApiFilterPage() {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [sortBy, setSortBy] = useState('id')
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc')
  const [filtersJson, setFiltersJson] = useState('{}')
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const body = JSON.parse(filtersJson || '{}')
      const { data } = await apiClient.post<Result>('/api/filter', body, {
        params: { page, size, sortBy, direction }
      })
      setResult(data)
    } catch (err: any) {
      setError(err?.response?.data || 'Request failed or invalid JSON body')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const columns = useMemo(() => {
    if (!result?.content?.length) return []
    // union keys of first item (safe, simple)
    return Object.keys(result.content[0])
  }, [result])

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            API Filter
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Endpoint: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800">POST /api/filter</code>
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-1">
              <Input
                label="Page"
                type="number"
                value={page}
                onChange={(e) => setPage(Number.isNaN(Number(e.target.value)) ? 0 : parseInt(e.target.value || '0'))}
              />
            </div>

            <div className="sm:col-span-1">
              <Input
                label="Size"
                type="number"
                value={size}
                onChange={(e) => setSize(Number.isNaN(Number(e.target.value)) ? 10 : parseInt(e.target.value || '10'))}
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as 'asc' | 'desc')}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md border shadow-sm"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Filters (JSON)</label>
              <div className="mt-1">
                <textarea
                  rows={6}
                  value={filtersJson}
                  onChange={(e) => setFiltersJson(e.target.value)}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setFiltersJson('{}')
                setResult(null)
                setError(null)
              }}
            >
              Reset
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                try {
                  setFiltersJson(JSON.stringify(JSON.parse(filtersJson || '{}'), null, 2))
                } catch {
                  setError('Invalid JSON — cannot pretty-print')
                }
              }}
            >
              Pretty JSON
            </Button>
            <Button
              type="submit"
              isLoading={loading}
            >
              Run Query
            </Button>
          </div>
        </form>
      </Card>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{String(error)}</h3>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page <span className="font-medium">{result.currentPage}</span> of <span className="font-medium">{result.totalPages}</span> (<span className="font-medium">{result.totalItems}</span> total items)
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'api-filter-result.json'
                a.click()
                URL.revokeObjectURL(url)
              }}
            >
              Download JSON
            </Button>
          </div>

          {result.content?.length ? (
            <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
              <Table>
                <TableHeaderSection>
                  <TableRow>
                    {columns.map((c) => (
                      <TableHead key={c}>{c}</TableHead>
                    ))}
                  </TableRow>
                </TableHeaderSection>
                <TableBody>
                  {result.content.map((row, ridx) => (
                    <TableRow key={ridx}>
                      {columns.map((c) => (
                        <TableCell key={c}>
                          {renderCell(row[c])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200 text-gray-500">
              No items returned.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function renderCell(value: any) {
  if (value == null) return <span className="text-gray-400">—</span>
  if (Array.isArray(value)) return <pre className="text-xs font-mono bg-gray-50 p-1 rounded">{JSON.stringify(value)}</pre>
  if (typeof value === 'object') return <pre className="text-xs font-mono bg-gray-50 p-1 rounded">{JSON.stringify(value)}</pre>
  return <span>{String(value)}</span>
}
