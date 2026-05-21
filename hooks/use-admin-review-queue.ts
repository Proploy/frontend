// use-admin-review-queue.ts
// Hook for /api/v1/admin/review-queue endpoints via Next proxies.

import { useCallback, useEffect, useState } from 'react'

export interface ReviewQueueEntry {
  entry_id: string
  status: string
  priority?: string
  queue_type?: string
  payload?: Record<string, unknown>
  created_at?: string
  [k: string]: unknown
}

export interface ReviewQueueListParams {
  status?: string
  priority?: string
  queue_type?: string
  page?: number
  limit?: number
}

interface UseAdminReviewQueueResult {
  entries: ReviewQueueEntry[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  resolve: (
    entryId: string,
    status: 'approved' | 'rejected',
    extra?: { notes?: string; action?: string },
  ) => Promise<boolean>
}

export function useAdminReviewQueue(params: ReviewQueueListParams = {}): UseAdminReviewQueueResult {
  const [entries, setEntries] = useState<ReviewQueueEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    const qs = new URLSearchParams()
    if (params.status) qs.set('status', params.status)
    if (params.priority) qs.set('priority', params.priority)
    if (params.queue_type) qs.set('queue_type', params.queue_type)
    if (params.page) qs.set('page', String(params.page))
    if (params.limit) qs.set('limit', String(params.limit))
    const url = `/api/admin/review-queue${qs.toString() ? `?${qs}` : ''}`
    const res = await fetch(url, { credentials: 'include' })
    const json = await res.json().catch(() => null)
    if (!res.ok) {
      setError(json?.error?.message || 'Failed to load review queue')
      setEntries([])
    } else {
      const list = json?.data?.entries ?? json?.data?.items ?? json?.data ?? []
      setEntries(Array.isArray(list) ? list : [])
    }
    setLoading(false)
  }, [params.status, params.priority, params.queue_type, params.page, params.limit])

  useEffect(() => {
    refetch()
  }, [refetch])

  const resolve = useCallback(
    async (
      entryId: string,
      status: 'approved' | 'rejected',
      extra: { notes?: string; action?: string } = {},
    ) => {
      const res = await fetch(
        `/api/admin/review-queue/${encodeURIComponent(entryId)}/resolve`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status, ...extra }),
        },
      )
      if (res.ok) await refetch()
      return res.ok
    },
    [refetch],
  )

  return { entries, loading, error, refetch, resolve }
}

export async function fetchReviewQueueStats() {
  const res = await fetch('/api/admin/review-queue/stats', { credentials: 'include' })
  if (!res.ok) return null
  const json = await res.json().catch(() => null)
  return json?.data ?? null
}

export async function fetchReviewQueueEntry(entryId: string) {
  const res = await fetch(`/api/admin/review-queue/${encodeURIComponent(entryId)}`, {
    credentials: 'include',
  })
  if (!res.ok) return null
  const json = await res.json().catch(() => null)
  return json?.data ?? null
}
