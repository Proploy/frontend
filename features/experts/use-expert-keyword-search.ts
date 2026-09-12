import { useCallback, useEffect, useRef, useState } from 'react'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import type { ExpertListItem } from './types'

interface ExpertKeywordSearchResponse {
  results: ExpertListItem[]
  count: number
}

export interface ExpertKeywordSearchOptions {
  platform?: string
  industry?: string
  projectType?: string
  location?: string
  minimumYears?: number
  entityType?: string
  sort?: 'relevance' | 'experience' | 'projects' | 'name'
}

const client = new ServiceApisBrowserClient()

/** Server contract: `ExpertKeywordSearchRequest.limit` is `le=100`, the same ceiling as `GET /experts`. */
export const EXPERT_KEYWORD_SEARCH_MAX_LIMIT = 100

export function useExpertKeywordSearch(
  query: string,
  limit = 6,
  options: ExpertKeywordSearchOptions = {},
) {
  const trimmedQuery = query.trim()
  const boundedLimit = Math.min(Math.max(1, Math.floor(limit)), EXPERT_KEYWORD_SEARCH_MAX_LIMIT)
  const requestKey = [
    trimmedQuery,
    options.platform,
    options.industry,
    options.projectType,
    options.location,
    options.minimumYears ?? 0,
    options.entityType,
    options.sort ?? 'relevance',
  ].join('\u0000')
  const [experts, setExperts] = useState<ExpertListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<NormalizedError | null>(null)
  const [resolvedRequestKey, setResolvedRequestKey] = useState('')
  const requestId = useRef(0)
  // Aborts a superseded request that's already past the debounce and mid-flight,
  // so a slow backend response doesn't keep holding a connection after the user
  // has typed past it.
  const abortRef = useRef<AbortController | null>(null)

  const search = useCallback(async () => {
    const trimmed = trimmedQuery
    abortRef.current?.abort()
    if (!trimmed) {
      setExperts([])
      setLoading(false)
      setError(null)
      setResolvedRequestKey('')
      return
    }
    const current = ++requestId.current
    setLoading(true)
    setError(null)
    const controller = new AbortController()
    abortRef.current = controller
    try {
      const result = await client.post<ExpertKeywordSearchResponse>('/api/v1/experts/search/keyword', {
        query: trimmed,
        limit: boundedLimit,
        filters: {
          platform: options.platform || undefined,
          industry: options.industry || undefined,
          projectType: options.projectType || undefined,
          location: options.location || undefined,
          minimumYears: options.minimumYears ?? 0,
          entityType: options.entityType || undefined,
        },
        sort: options.sort ?? 'relevance',
      }, { requireAuth: false, signal: controller.signal })
      if (current !== requestId.current) return
      if (!result.ok) {
        setExperts([])
        setError(result)
        setResolvedRequestKey(requestKey)
        return
      }
      setExperts(result.data.results)
      setResolvedRequestKey(requestKey)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      throw err
    } finally {
      if (current === requestId.current) {
        setLoading(false)
      }
    }
  }, [
    boundedLimit,
    options.entityType,
    options.industry,
    options.location,
    options.minimumYears,
    options.platform,
    options.projectType,
    options.sort,
    requestKey,
    trimmedQuery,
  ])

  useEffect(() => {
    const timer = setTimeout(() => void search(), 200)
    return () => {
      clearTimeout(timer)
      abortRef.current?.abort()
      requestId.current += 1
    }
  }, [search])

  const waitingForCurrentQuery = Boolean(trimmedQuery) && resolvedRequestKey !== requestKey

  return { experts, loading: loading || waitingForCurrentQuery, error, refetch: search }
}
