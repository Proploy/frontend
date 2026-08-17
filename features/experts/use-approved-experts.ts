/**
 * Approved experts hook.
 * Calls service-apis directly from the browser — no Next.js proxy routes.
 *
 * Uses ServiceApisBrowserClient with requireAuth: false (public endpoint).
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import type { ExpertListItem, ExpertListResponse } from '@/features/experts/types'

interface UseApprovedExpertsOptions {
  platform?: string
  industry?: string
  projectType?: string
  country?: string
  timezone?: string
  limit?: number
}

interface UseApprovedExpertsResult {
  experts: ExpertListItem[]
  loading: boolean
  error: NormalizedError | null
  refetch: () => void
}

const client = new ServiceApisBrowserClient()

export function useApprovedExperts(
  { platform, industry, projectType, country, timezone, limit }: UseApprovedExpertsOptions = {},
): UseApprovedExpertsResult {
  const [experts, setExperts] = useState<ExpertListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<NormalizedError | null>(null)

  const mountedRef = useRef(true)

  const fetch_ = useCallback(async () => {
    mountedRef.current = true
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()
    if (platform) params.set('platform', platform)
    if (industry) params.set('industry', industry)
    if (projectType) params.set('project_type', projectType)
    if (country) params.set('country', country)
    if (timezone) params.set('timezone', timezone)
    if (limit) params.set('limit', String(limit))
    const query = params.toString()

    try {
      const result = await client.get<ExpertListResponse>(`/api/v1/experts${query ? `?${query}` : ''}`, {
        requireAuth: false,
      })

      if (!mountedRef.current) return

      if (!result.ok) {
        setError(result)
        return
      }

      setExperts(result.data.experts)
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [platform, industry, projectType, country, timezone, limit, client])

  useEffect(() => {
    mountedRef.current = true
    fetch_() // eslint-disable-line react-hooks/set-state-in-effect
    return () => {
      mountedRef.current = false
    }
  }, [fetch_])

  return { experts, loading, error, refetch: fetch_ }
}
