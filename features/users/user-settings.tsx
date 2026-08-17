'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import { mapUserProfileToAccountSettings } from '@/hooks/mappers/user-settings-mappers'
import type { UserProfileResponse, UserProfileUpdateRequest } from '@/hooks/types/user-contracts'
import type { AccountSettingsViewModel } from '@/hooks/types/settings-view-models'

type UpdateUserResult = { ok: true; data: AccountSettingsViewModel } | NormalizedError

interface UseUserSettingsOptions {
  enabled?: boolean
}

export function useUserSettings({ enabled = true }: UseUserSettingsOptions = {}) {
  const client = useMemo(() => new ServiceApisBrowserClient(), [])
  const mountedRef = useRef(true)
  const [settings, setSettings] = useState<AccountSettingsViewModel | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<NormalizedError | null>(null)

  const fetchSettings = useCallback(async () => {
    if (!enabled) {
      setLoading(false)
      return
    }

    mountedRef.current = true
    setLoading(true)
    setError(null)
    try {
      const result = await client.get<UserProfileResponse>('/api/v1/users/me', { requireAuth: true })

      if (!mountedRef.current) return
      if (!result.ok) {
        setSettings(null)
        setError(result)
        return
      }

      setSettings(mapUserProfileToAccountSettings(result.data))
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [client, enabled])

  const updateSettings = useCallback(async (payload: UserProfileUpdateRequest): Promise<UpdateUserResult> => {
    setSaving(true)
    setError(null)
    try {
      const result = await client.patch<UserProfileResponse>('/api/v1/users/me', payload, { requireAuth: true })

      if (!result.ok) {
        if (mountedRef.current) {
          setError(result)
        }
        return result
      }

      const mapped = mapUserProfileToAccountSettings(result.data)
      if (mountedRef.current) {
        setSettings(mapped)
      }
      return { ok: true, data: mapped }
    } finally {
      if (mountedRef.current) setSaving(false)
    }
  }, [client])

  useEffect(() => {
    mountedRef.current = true
    const timer = window.setTimeout(() => {
      if (enabled) void fetchSettings()
      else setLoading(false)
    }, 0)
    return () => {
      mountedRef.current = false
      window.clearTimeout(timer)
    }
  }, [enabled, fetchSettings])

  return { settings, loading, saving, error, refetch: fetchSettings, updateSettings }
}
