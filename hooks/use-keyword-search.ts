// use-keyword-search.ts
// Hook for POST /catalog/keyword-search via Next proxy /api/keyword-search.

import { useCallback, useState } from 'react'

export interface KeywordSearchResultItem {
  product_id?: string
  id?: string
  product_name?: string
  name?: string
  score?: number
  snippet?: string
  [k: string]: unknown
}

interface UseKeywordSearchResult {
  results: KeywordSearchResultItem[]
  loading: boolean
  error: string | null
  search: (query: string, limit?: number) => Promise<void>
  clear: () => void
}

export function useKeywordSearch(): UseKeywordSearchResult {
  const [results, setResults] = useState<KeywordSearchResultItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: string, limit = 20) => {
    if (!query.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    setError(null)
    const res = await fetch('/api/keyword-search', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query, limit }),
    })
    const json = await res.json().catch(() => null)
    if (!res.ok) {
      setError(json?.error?.message || 'Search failed')
      setResults([])
    } else {
      const list = json?.data?.results ?? json?.data?.items ?? json?.data ?? []
      setResults(Array.isArray(list) ? list : [])
    }
    setLoading(false)
  }, [])

  const clear = useCallback(() => {
    setResults([])
    setError(null)
  }, [])

  return { results, loading, error, search, clear }
}
