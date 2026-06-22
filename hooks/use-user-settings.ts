'use client'

/**
 * @deprecated
 *
 * Reaches `GET /api/v1/users/me` and `PATCH /api/v1/users/me`, which are not
 * exposed by the deployed service-apis (both return 404). The avatar-upload
 * endpoint `/api/v1/users/me/avatar-url` is also not deployed yet.
 *
 * Per project policy, the only Supabase use allowed is the auth session; the
 * Supabase `user` table is NOT a valid substitute for `/api/v1/users/me`.
 * service-apis is the source of truth for user data.
 *
 * Replacement: a new hook under `features/users/` (TBD) that calls the
 * service-apis user-profile endpoints once those are deployed. Until then,
 * `/settings` renders in its broken/error state.
 *
 * Do NOT add `supabase.auth.updateUser` or direct `user` table reads as a
 * workaround. Do NOT reinstate the deleted `/api/users/me` proxy shim.
 */
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

    const result = await client.get<UserProfileResponse>('/api/v1/users/me', {
      requireAuth: true,
    })

    if (!mountedRef.current) return

    if (!result.ok) {
      setSettings(null)
      setError(result)
      setLoading(false)
      return
    }

    setSettings(mapUserProfileToAccountSettings(result.data))
    setLoading(false)
  }, [client, enabled])

  const updateSettings = useCallback(async (payload: UserProfileUpdateRequest): Promise<UpdateUserResult> => {
    setSaving(true)
    setError(null)

    const result = await client.patch<UserProfileResponse>('/api/v1/users/me', payload, {
      requireAuth: true,
    })

    if (!result.ok) {
      if (mountedRef.current) {
        setError(result)
        setSaving(false)
      }
      return result
    }

    const mapped = mapUserProfileToAccountSettings(result.data)
    if (mountedRef.current) {
      setSettings(mapped)
      setSaving(false)
    }
    return { ok: true, data: mapped }
  }, [client])

  useEffect(() => {
    mountedRef.current = true
    if (enabled) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void fetchSettings()
    } else {
      setLoading(false)
    }
    return () => {
      mountedRef.current = false
    }
  }, [enabled, fetchSettings])

  return {
    settings,
    loading,
    saving,
    error,
    refetch: fetchSettings,
    updateSettings,
  }
}
