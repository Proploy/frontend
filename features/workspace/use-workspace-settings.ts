'use client'

/**
 * Workspace settings hook (W10 — §8.W10).
 *
 * Owns three things:
 *  - Profile (display name)
 *  - Notification preferences (per-template toggles)
 *  - Scheduling profile (read-through to /me/scheduling-profile)
 *
 * TODO(backend): notification preferences and the display-name write are
 * persisted to localStorage only. Once service-apis exposes
 *   PATCH /api/v1/workspace/me/settings
 * and
 *   GET  /api/v1/workspace/me/notification-preferences
 * we wire those and remove the localStorage fallbacks. (See
 * docs/workspace-completion-harness.md §8.W10.)
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { useWorkspace } from '@/features/workspace/use-workspace'
import type {
  WorkspaceRole,
  WorkspaceSchedulingProfile,
} from '@/features/workspace/types'
import type { NormalizedError } from '@/lib/service-apis/error-utils'

type ApiResult<T> = { ok: true; data: T } | NormalizedError

const STORAGE_PREFIX = 'proploy.workspace.settings.v1'

export type NotificationTemplate =
  | 'proposal_sent'
  | 'proposal_accepted'
  | 'proposal_declined'
  | 'contract_sent'
  | 'contract_signed_by_buyer'
  | 'contract_signed_by_expert'
  | 'contract_completed'
  | 'invoice_sent'
  | 'invoice_paid'
  | 'invoice_overdue'
  | 'meeting_intent_created'

export const NOTIFICATION_TEMPLATES: readonly NotificationTemplate[] = [
  'proposal_sent',
  'proposal_accepted',
  'proposal_declined',
  'contract_sent',
  'contract_signed_by_buyer',
  'contract_signed_by_expert',
  'contract_completed',
  'invoice_sent',
  'invoice_paid',
  'invoice_overdue',
  'meeting_intent_created',
] as const

export type NotificationPreferences = Record<NotificationTemplate, boolean>

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  proposal_sent: true,
  proposal_accepted: true,
  proposal_declined: true,
  contract_sent: true,
  contract_signed_by_buyer: true,
  contract_signed_by_expert: true,
  contract_completed: true,
  invoice_sent: true,
  invoice_paid: true,
  invoice_overdue: true,
  meeting_intent_created: true,
}

export const NOTIFICATION_TEMPLATE_LABELS: Record<NotificationTemplate, string> = {
  proposal_sent: 'Proposal sent',
  proposal_accepted: 'Proposal accepted',
  proposal_declined: 'Proposal declined',
  contract_sent: 'Contract sent',
  contract_signed_by_buyer: 'Contract signed by buyer',
  contract_signed_by_expert: 'Contract counter-signed by expert',
  contract_completed: 'Contract fully signed',
  invoice_sent: 'Invoice sent',
  invoice_paid: 'Invoice paid',
  invoice_overdue: 'Invoice overdue',
  meeting_intent_created: 'New meeting request',
}

export type ProfileSettings = {
  displayName: string
  email: string
  role: WorkspaceRole | null
  timezone: string
}

export type ProfileSettingsUpdate = {
  displayName?: string
  timezone?: string
}

export type ProfileUpdateResult =
  | { ok: true; data: ProfileSettings }
  | NormalizedError

export type NotificationPreferencesResult =
  | { ok: true; data: NotificationPreferences }
  | NormalizedError

export type SchedulingProfileResult =
  | { ok: true; data: WorkspaceSchedulingProfile | null }
  | NormalizedError

export type SettingsHookState = {
  // Profile
  profile: ProfileSettings | null
  profileError: NormalizedError | null
  profilePending: boolean
  updateProfile: (update: ProfileSettingsUpdate) => Promise<ProfileUpdateResult>

  // Notifications
  notificationPreferences: NotificationPreferences
  notificationPreferencesLoaded: boolean
  notificationSaveState: 'idle' | 'saving' | 'saving-failed'
  notificationSaveError: NormalizedError | null
  setNotificationPreference: (
    template: NotificationTemplate,
    enabled: boolean,
  ) => Promise<NotificationPreferencesResult>
  toggleAllNotifications: (enabled: boolean) => Promise<NotificationPreferencesResult>

  // Scheduling
  schedulingProfile: WorkspaceSchedulingProfile | null
  schedulingProfileError: NormalizedError | null
  schedulingProfilePending: boolean
  refreshSchedulingProfile: () => Promise<SchedulingProfileResult>
}

const PROFILE_KEY = (userId: string) => `${STORAGE_PREFIX}.profile.${userId}`
const NOTIFICATION_KEY = (userId: string) =>
  `${STORAGE_PREFIX}.notifications.${userId}`
const TIMEZONE_KEY = `${STORAGE_PREFIX}.timezone`

function detectTimezone(): string {
  if (typeof Intl !== 'undefined') {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (tz) return tz
    } catch {
      // fall through to default
    }
  }
  return 'UTC'
}

function readJson<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage may be unavailable (private mode, quota); swallow.
  }
}

function storageAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function isNotificationTemplate(value: string): value is NotificationTemplate {
  return (NOTIFICATION_TEMPLATES as readonly string[]).includes(value)
}

function normalisePreferences(input: unknown): NotificationPreferences {
  const result: NotificationPreferences = { ...DEFAULT_NOTIFICATION_PREFERENCES }
  if (!input || typeof input !== 'object') return result
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (isNotificationTemplate(key) && typeof value === 'boolean') {
      result[key] = value
    }
  }
  return result
}

function normaliseProfileInput(input: {
  displayName?: string
  timezone?: string
}): { displayName?: string; error?: string } {
  if (input.displayName !== undefined) {
    const trimmed = input.displayName.trim()
    if (trimmed.length < 2 || trimmed.length > 80) {
      return { error: 'Display name must be between 2 and 80 characters.' }
    }
    return { displayName: trimmed }
  }
  return {}
}

function normalizeError(err: unknown): NormalizedError {
  if (
    err &&
    typeof err === 'object' &&
    'ok' in err &&
    (err as { ok: boolean }).ok === false
  ) {
    return err as NormalizedError
  }
  return {
    ok: false,
    status: 0,
    error: { code: 'UNKNOWN_ERROR', message: 'Unexpected error' },
  }
}

export function useWorkspaceSettings(): SettingsHookState {
  const { user } = useAuth()
  const workspace = useWorkspace()

  const userId = user?.id ?? null
  const fallbackTimezone = useMemo(() => detectTimezone(), [])

  const [profile, setProfile] = useState<ProfileSettings | null>(null)
  const [profileError, setProfileError] = useState<NormalizedError | null>(null)
  const [profilePending, setProfilePending] = useState<boolean>(true)

  const [notificationPreferences, setNotificationPreferences] =
    useState<NotificationPreferences>(DEFAULT_NOTIFICATION_PREFERENCES)
  const [notificationPreferencesLoaded, setNotificationPreferencesLoaded] =
    useState(false)
  const [notificationSaveState, setNotificationSaveState] = useState<
    'idle' | 'saving' | 'saving-failed'
  >('idle')
  const [notificationSaveError, setNotificationSaveError] =
    useState<NormalizedError | null>(null)

  const [schedulingProfile, setSchedulingProfile] =
    useState<WorkspaceSchedulingProfile | null>(null)
  const [schedulingProfileError, setSchedulingProfileError] =
    useState<NormalizedError | null>(null)
  const [schedulingProfilePending, setSchedulingProfilePending] = useState(true)
  const [schedulingProfileLoaded, setSchedulingProfileLoaded] = useState(false)

  // --- Profile loading --------------------------------------------------------

  useEffect(() => {
    if (!userId) {
      setProfile(null)
      setProfilePending(false)
      return
    }

    let cancelled = false
    setProfilePending(true)
    setProfileError(null)

    const stored = readJson<{ displayName?: string; timezone?: string }>(
      PROFILE_KEY(userId),
    )
    const storedTimezone = readJson<string>(TIMEZONE_KEY)

    const baseDisplayName = user?.name ?? user?.email ?? ''
    const resolved: ProfileSettings = {
      displayName: stored?.displayName ?? baseDisplayName,
      email: user?.email ?? '',
      role: null,
      timezone: storedTimezone ?? stored?.timezone ?? fallbackTimezone,
    }

    if (!cancelled) {
      setProfile(resolved)
      setProfilePending(false)
    }

    return () => {
      cancelled = true
    }
  }, [fallbackTimezone, user?.email, user?.name, userId])

  const updateProfile = useCallback(
    async (input: ProfileSettingsUpdate): Promise<ProfileUpdateResult> => {
      const validation = normaliseProfileInput(input)
      if (validation.error || validation.displayName === undefined && input.timezone === undefined) {
        const message = validation.error ?? 'No fields to update.'
        const err: NormalizedError = {
          ok: false,
          status: 400,
          error: { code: 'VALIDATION_ERROR', message, fields: { displayName: message } },
        }
        setProfileError(err)
        return err
      }

      // Optimistic local update
      setProfile((current) => {
        if (!current) return current
        const next: ProfileSettings = {
          ...current,
          displayName: validation.displayName ?? current.displayName,
          timezone: input.timezone ?? current.timezone,
        }
        if (userId && storageAvailable()) {
          writeJson(PROFILE_KEY(userId), {
            displayName: next.displayName,
            timezone: next.timezone,
          })
          if (input.timezone) writeJson(TIMEZONE_KEY, input.timezone)
        }
        return next
      })

      // TODO(backend): call PATCH /api/v1/workspace/me/settings with
      // `{ displayName, timezone }` and reconcile on success. For now we
      // surface a no-error result so the UI shows "saved" once localStorage
      // is updated.
      return {
        ok: true,
        data: {
          displayName: validation.displayName ?? profile?.displayName ?? '',
          email: profile?.email ?? '',
          role: profile?.role ?? null,
          timezone: input.timezone ?? profile?.timezone ?? fallbackTimezone,
        },
      }
    },
    [fallbackTimezone, profile, userId],
  )

  // --- Notification preferences ---------------------------------------------

  useEffect(() => {
    if (!storageAvailable()) {
      setNotificationPreferences(DEFAULT_NOTIFICATION_PREFERENCES)
      setNotificationPreferencesLoaded(true)
      return
    }
    if (!userId) {
      setNotificationPreferencesLoaded(false)
      return
    }

    const stored = readJson<Record<string, unknown>>(NOTIFICATION_KEY(userId))
    setNotificationPreferences(normalisePreferences(stored))
    setNotificationPreferencesLoaded(true)
  }, [userId])

  const saveNotificationPreferences = useCallback(
    async (next: NotificationPreferences): Promise<NotificationPreferencesResult> => {
      setNotificationSaveState('saving')
      setNotificationSaveError(null)
      if (userId && storageAvailable()) {
        writeJson(NOTIFICATION_KEY(userId), next)
      }
      // TODO(backend): POST /api/v1/workspace/me/notification-preferences
      setNotificationPreferences(next)
      setNotificationSaveState('idle')
      return { ok: true, data: next }
    },
    [userId],
  )

  const setNotificationPreference = useCallback(
    async (
      template: NotificationTemplate,
      enabled: boolean,
    ): Promise<NotificationPreferencesResult> => {
      let optimistic: NotificationPreferences = { ...notificationPreferences }
      optimistic = { ...optimistic, [template]: enabled }
      setNotificationPreferences(optimistic)

      try {
        const result = await saveNotificationPreferences(optimistic)
        if (!result.ok) {
          setNotificationSaveState('saving-failed')
          setNotificationSaveError(result)
          // Revert optimistic toggle on failure.
          setNotificationPreferences(notificationPreferences)
        }
        return result
      } catch (err) {
        const normalized = normalizeError(err)
        setNotificationSaveState('saving-failed')
        setNotificationSaveError(normalized)
        setNotificationPreferences(notificationPreferences)
        return normalized
      }
    },
    [notificationPreferences, saveNotificationPreferences],
  )

  const toggleAllNotifications = useCallback(
    async (enabled: boolean): Promise<NotificationPreferencesResult> => {
      const next: NotificationPreferences = NOTIFICATION_TEMPLATES.reduce(
        (acc, template) => {
          acc[template] = enabled
          return acc
        },
        {} as NotificationPreferences,
      )
      return saveNotificationPreferences(next)
    },
    [saveNotificationPreferences],
  )

  // --- Scheduling profile ----------------------------------------------------

  const refreshSchedulingProfile = useCallback(async (): Promise<SchedulingProfileResult> => {
    setSchedulingProfilePending(true)
    setSchedulingProfileError(null)

    const cancelled = false
    try {
      const result: ApiResult<WorkspaceSchedulingProfile | null> =
        await workspace.getMySchedulingProfile()

      if (cancelled) return { ok: false, status: 0, error: { code: 'CANCELLED', message: 'Cancelled' } }

      if (result.ok) {
        setSchedulingProfile(result.data)
        setSchedulingProfileLoaded(true)
        return { ok: true, data: result.data }
      }

      // 404 means no scheduling profile yet — treat as null with no error.
      if (result.status === 404) {
        setSchedulingProfile(null)
        setSchedulingProfileLoaded(true)
        return { ok: true, data: null }
      }

      setSchedulingProfileError(result)
      setSchedulingProfileLoaded(true)
      return result
    } finally {
      setSchedulingProfilePending(false)
    }
  }, [workspace])

  useEffect(() => {
    let cancelled = false
    setSchedulingProfilePending(true)
    void (async () => {
      if (cancelled) return
      await refreshSchedulingProfile()
      if (cancelled) return
    })()
    return () => {
      cancelled = true
    }
  }, [refreshSchedulingProfile, userId])

  return {
    profile,
    profileError,
    profilePending,
    updateProfile,
    notificationPreferences,
    notificationPreferencesLoaded,
    notificationSaveState,
    notificationSaveError,
    setNotificationPreference,
    toggleAllNotifications,
    schedulingProfile,
    schedulingProfileError,
    schedulingProfilePending,
    refreshSchedulingProfile,
  }
}
