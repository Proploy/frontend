'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { ReactNode } from 'react'
import {
  Bell,
  Calendar,
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Mail,
  Save,
  Settings,
  ToggleLeft,
  ToggleRight,
  UserRound,
} from 'lucide-react'
import { ActionToast } from '@/components/ui/action-toast'
import { Skeleton } from '@/components/ui/Skeleton'
import {
  CARD_SHADOW,
  WorkspaceLoading,
  WorkspaceShell,
  WorkspaceSignInState,
} from '@/components/workspace/WorkspaceShell'
import { statusLabel } from '@/components/workspace/workspace-format'
import {
  clientRowsToRequestRows,
  NOTIFICATION_TEMPLATES,
  NOTIFICATION_TEMPLATE_LABELS,
  useCurrentUserRole,
  useWorkspace,
  useWorkspaceSettings,
} from '@/features/workspace'
import type { NotificationTemplate } from '@/features/workspace/use-workspace-settings'
import type { WorkspaceRole } from '@/features/workspace/types'
import { NativeGoogleCalendarSetup } from '@/features/native-scheduling/components/NativeGoogleCalendarSetup'
import { nativeSchedulingAccessForRole } from '@/features/native-scheduling/access'
import { parseWorkspaceSettingsTab } from '@/features/workspace/settings-navigation'

const DISPLAY_NAME_MIN = 2
const DISPLAY_NAME_MAX = 80

const TIMEZONE_OPTIONS: string[] = (() => {
  if (typeof Intl !== 'undefined') {
    try {
      const supported = (Intl as unknown as { supportedValuesOf?: (key: string) => string[] })
        .supportedValuesOf
      if (typeof supported === 'function') {
        const values = supported('timeZone')
        if (Array.isArray(values) && values.length > 0) return values
      }
    } catch {
      // Fall through to common list.
    }
  }
  return [
    'UTC',
    'America/Los_Angeles',
    'America/Denver',
    'America/Chicago',
    'America/New_York',
    'America/Sao_Paulo',
    'Europe/London',
    'Europe/Berlin',
    'Europe/Paris',
    'Africa/Lagos',
    'Asia/Dubai',
    'Asia/Kolkata',
    'Asia/Singapore',
    'Asia/Tokyo',
    'Australia/Sydney',
  ]
})()

type SettingsTab = 'profile' | 'notifications' | 'scheduling'

const TAB_DEFINITIONS: { id: SettingsTab; label: string; icon: ReactNode }[] = [
  { id: 'profile', label: 'Profile', icon: <UserRound size={16} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
  { id: 'scheduling', label: 'Scheduling', icon: <Calendar size={16} /> },
]

export default function WorkspaceSettingsPage() {
  return (
    <Suspense fallback={<WorkspaceLoading />}>
      <WorkspaceSettingsContent />
    </Suspense>
  )
}

function WorkspaceSettingsContent() {
  const state = useCurrentUserRole()
  const workspace = useWorkspace()
  const settings = useWorkspaceSettings()
  const searchParams = useSearchParams()
  const googleCalendarTestCompleted = searchParams.get('google_calendar') === 'test_connected'
  const [counts, setCounts] = useState({ engagements: 0, meetings: 0, requests: 0 })
  const [activeTab, setActiveTab] = useState<SettingsTab>(() => parseWorkspaceSettingsTab(searchParams.toString()))
  const [toast, setToast] = useState<{ kind: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    if (state.isPending || !state.user) return
    let cancelled = false

    async function loadCounts() {
      const requestCountPromise = state.expert?.id
        ? workspace.listClients().then((result) =>
            result.ok
              ? clientRowsToRequestRows(result.data.clients).filter(isOpenRequest).length
              : 0,
          )
        : workspace.listMeetingIntents().then((result) =>
            result.ok
              ? result.data.meetingIntents.filter(isOpenRequest).length
              : 0,
          )
      const [engagements, meetings, requestCount] = await Promise.all([
        workspace.listEngagements(),
        workspace.listMeetings(),
        requestCountPromise,
      ])
      if (cancelled) return
      setCounts({
        engagements: engagements.ok
          ? engagements.data.engagements.filter((e) => e.status === 'active').length
          : 0,
        meetings: meetings.ok
          ? meetings.data.meetings.filter((m) => m.status === 'scheduled').length
          : 0,
        requests: requestCount,
      })
    }

    void loadCounts()
    return () => {
      cancelled = true
    }
  }, [state.expert?.id, state.isPending, state.user, workspace])

  if (state.isPending) return <WorkspaceLoading role={state.role} />
  if (!state.user) return <WorkspaceSignInState redirect="/workspace/settings" />

  const onSaveProfile = async (): Promise<void> => {
    if (!settings.profile) return
    const displayName = settings.profile.displayName.trim()
    if (displayName.length < DISPLAY_NAME_MIN || displayName.length > DISPLAY_NAME_MAX) {
      setToast({
        kind: 'error',
        message: `Display name must be ${DISPLAY_NAME_MIN}–${DISPLAY_NAME_MAX} characters.`,
      })
      return
    }
    const result = await settings.updateProfile({ displayName })
    if (result.ok) {
      setToast({ kind: 'success', message: 'Profile saved.' })
    } else {
      setToast({
        kind: 'error',
        message: result.error.message ?? 'Failed to save profile.',
      })
    }
  }

  return (
    <WorkspaceShell role={state.role}>
      <main className="min-w-0 flex-1 bg-white px-[24px] py-[24px] md:px-[32px] md:py-[32px]">
        <div className="mx-auto flex max-w-[1040px] flex-col gap-[24px]">
          <header className="flex flex-col gap-[4px]">
            <h1 className="flex items-center gap-[10px] text-[24px] font-semibold leading-[32px] text-[#181d27]">
              <Settings size={22} className="text-[#155eef]" />
              Settings
            </h1>
          </header>

          <section className={`rounded-[16px] border border-[#e9eaeb] bg-white ${CARD_SHADOW}`}>
            <div className="flex flex-wrap items-start justify-between gap-[16px] border-b border-[#e9eaeb] px-[24px] py-[20px]">
              <div className="flex items-start gap-[12px]">
                <span className="flex size-[44px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#fde68a] to-[#c084fc] text-[14px] font-semibold text-white">
                  {(state.user.name ?? state.user.email ?? 'U').charAt(0).toUpperCase()}
                </span>
                <div>
                  <h2 className="text-[18px] font-semibold leading-[28px] text-[#181d27]">
                    {state.user.name ?? 'Workspace user'}
                  </h2>
                  <p className="text-[14px] leading-[20px] text-[#535862]">{state.user.email}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-[6px] rounded-full bg-[#ecfdf3] px-[10px] py-[4px] text-[12px] font-semibold leading-[18px] text-[#067647]">
                <CheckCircle2 size={14} />
                {statusLabel(state.role ?? 'user')}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-px bg-[#e9eaeb] md:grid-cols-3">
              <SettingFact icon={<UserRound size={18} />} label="Active engagements" value={String(counts.engagements)} />
              <SettingFact icon={<Calendar size={18} />} label="Upcoming meetings" value={String(counts.meetings)} />
              <SettingFact icon={<Settings size={18} />} label="Pending requests" value={String(counts.requests)} />
            </div>
          </section>

          <nav
            role="tablist"
            aria-label="Settings sections"
            className={`flex flex-wrap gap-[4px] rounded-[12px] border border-[#e9eaeb] bg-white p-[4px] ${CARD_SHADOW}`}
          >
            {TAB_DEFINITIONS.map((tab) => {
              const selected = tab.id === activeTab
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`tab-panel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={
                    selected
                      ? 'inline-flex flex-1 items-center justify-center gap-[8px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white transition'
                      : 'inline-flex flex-1 items-center justify-center gap-[8px] rounded-[8px] px-[14px] py-[10px] text-[14px] font-medium leading-[20px] text-[#535862] transition hover:bg-[#f5f7fa] hover:text-[#181d27]'
                  }
                >
                  {tab.icon}
                  {tab.label}
                </button>
              )
            })}
          </nav>

          <div
            role="tabpanel"
            id={`tab-panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            className={`rounded-[16px] border border-[#e9eaeb] bg-white ${CARD_SHADOW}`}
          >
            {activeTab === 'profile' && (
              <ProfileTab
                key={`${settings.profile?.displayName ?? ''}|${settings.profile?.timezone ?? ''}`}
                settings={settings}
                role={state.role}
                onSave={onSaveProfile}
              />
            )}
            {activeTab === 'notifications' && (
              <NotificationsTab
                settings={settings}
                onToast={setToast}
              />
            )}
            {activeTab === 'scheduling' && (
              <SchedulingTab
                settings={settings}
                role={state.role}
                googleCalendarTestCompleted={googleCalendarTestCompleted}
              />
            )}
          </div>

          <p className="text-center text-[12px] leading-[18px] text-[#717680]">
            Changes to notifications and profile are stored locally for now. Backend persistence will follow the W10 sign-off.
          </p>
        </div>

        <ActionToast
          show={!!toast}
          toast={toast ? { tone: toast.kind, title: toast.message } : null}
          onClose={() => setToast(null)}
        />
      </main>
    </WorkspaceShell>
  )
}

function isOpenRequest(request: { status: string }): boolean {
  return request.status === 'awaiting_acceptance' || request.status === 'scheduling_open'
}

function SettingFact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white px-[24px] py-[20px]">
      <p className="flex items-center gap-[6px] text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">
        <span className="text-[#717680]">{icon}</span>
        {label}
      </p>
      <p className="mt-[6px] text-[20px] font-semibold leading-[30px] text-[#181d27]">{value}</p>
    </div>
  )
}

function ProfileTab({
  settings,
  role,
  onSave,
}: {
  settings: ReturnType<typeof useWorkspaceSettings>
  role: WorkspaceRole | null
  onSave: () => Promise<void> | void
}) {
  const profile = settings.profile
  const [displayName, setDisplayName] = useState<string>(profile?.displayName ?? '')
  const [timezone, setTimezone] = useState<string>(profile?.timezone ?? 'UTC')
  const [saving, setSaving] = useState(false)

  const trimmed = displayName.trim()
  const isDisplayNameInvalid =
    trimmed.length < DISPLAY_NAME_MIN || trimmed.length > DISPLAY_NAME_MAX
  const dirty =
    profile !== null &&
    (trimmed !== profile.displayName.trim() || timezone !== profile.timezone)

  const handleSave = async (): Promise<void> => {
    if (isDisplayNameInvalid) return
    setSaving(true)
    if (trimmed !== profile?.displayName.trim()) {
      const result = await settings.updateProfile({ displayName: trimmed })
      if (!result.ok) {
        setSaving(false)
        return
      }
    }
    if (profile && timezone !== profile.timezone) {
      await settings.updateProfile({ timezone })
    }
    setSaving(false)
    await onSave()
  }

  if (settings.profilePending && !profile) {
    return <ProfileSkeleton />
  }
  if (!profile) {
    return (
      <EmptyState
        icon={<UserRound size={20} />}
        title="Profile unavailable"
        body={settings.profileError?.error.message ?? 'Could not load your profile.'}
      />
    )
  }

  return (
    <div className="flex flex-col gap-[20px] px-[24px] py-[24px]">
      <header className="flex items-center gap-[12px]">
        <span className="flex size-[40px] items-center justify-center rounded-[10px] bg-[#eff4ff] text-[#155eef]">
          <UserRound size={20} />
        </span>
        <div>
          <h2 className="text-[16px] font-semibold leading-[24px] text-[#181d27]">Profile</h2>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-[16px] md:grid-cols-[160px_1fr]">
        <FieldLabel htmlFor="profile-displayName">Display name</FieldLabel>
        <div>
          <input
            id="profile-displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={DISPLAY_NAME_MAX + 16}
            required
            aria-invalid={isDisplayNameInvalid}
            aria-describedby="profile-displayName-help"
            className={
              isDisplayNameInvalid
                ? 'w-full rounded-[10px] border border-[#fda29b] bg-white px-[14px] py-[10px] text-[14px] leading-[20px] text-[#181d27] outline-none focus:border-[#b42318] focus:ring-[2px] focus:ring-[#fef3f2]'
                : 'w-full rounded-[10px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] leading-[20px] text-[#181d27] outline-none focus:border-[#155eef] focus:ring-[2px] focus:ring-[#eff4ff]'
            }
          />
          <p
            id="profile-displayName-help"
            className={
              isDisplayNameInvalid
                ? 'mt-[6px] text-[12px] leading-[18px] text-[#b42318]'
                : 'mt-[6px] text-[12px] leading-[18px] text-[#717680]'
            }
          >
            {trimmed.length}/{DISPLAY_NAME_MAX} characters · required
          </p>
        </div>

        <FieldLabel htmlFor="profile-email">Email</FieldLabel>
        <div className="flex items-center gap-[10px] rounded-[10px] border border-[#e9eaeb] bg-white px-[14px] py-[10px]">
          <Mail size={16} className="text-[#717680]" />
          <span className="text-[14px] leading-[20px] text-[#181d27]">{profile.email || '—'}</span>
          <span className="ml-auto text-[11px] font-medium uppercase tracking-[0.04em] text-[#717680]">
            read-only
          </span>
        </div>

        <FieldLabel htmlFor="profile-role">Role</FieldLabel>
        <div>
          <span className="inline-flex items-center gap-[6px] rounded-full bg-[#ecfdf3] px-[10px] py-[4px] text-[12px] font-semibold leading-[18px] text-[#067647]">
            <CheckCircle2 size={14} />
            {statusLabel(role ?? profile.role ?? 'user')}
          </span>
        </div>

        <FieldLabel htmlFor="profile-timezone">Timezone</FieldLabel>
        <div>
          <select
            id="profile-timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full rounded-[10px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] leading-[20px] text-[#181d27] outline-none focus:border-[#155eef] focus:ring-[2px] focus:ring-[#eff4ff]"
          >
            {TIMEZONE_OPTIONS.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
          <p className="mt-[6px] text-[12px] leading-[18px] text-[#717680]">
            Used for meeting confirmations and scheduled notifications.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-[12px] border-t border-[#e9eaeb] pt-[16px]">
        <button
          type="button"
          onClick={() => {
            setDisplayName(profile.displayName)
            setTimezone(profile.timezone)
          }}
          disabled={!dirty || saving}
          className="rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[8px] text-[13px] font-semibold leading-[20px] text-[#181d27] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Discard
        </button>
        <button
          type="submit"
          onClick={() => void handleSave()}
          disabled={!dirty || saving || isDisplayNameInvalid}
          className="inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] text-white transition hover:bg-[#0e4dc7] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save profile
        </button>
      </div>
    </div>
  )
}

function NotificationsTab({
  settings,
  onToast,
}: {
  settings: ReturnType<typeof useWorkspaceSettings>
  onToast: (toast: { kind: 'success' | 'error'; message: string }) => void
}) {
  const [pendingTemplate, setPendingTemplate] = useState<NotificationTemplate | null>(null)

  const onToggle = async (template: NotificationTemplate, next: boolean) => {
    setPendingTemplate(template)
    const result = await settings.setNotificationPreference(template, next)
    setPendingTemplate(null)
    if (result.ok) {
      onToast({ kind: 'success', message: `${NOTIFICATION_TEMPLATE_LABELS[template]} ${next ? 'enabled' : 'paused'}.` })
    } else {
      onToast({ kind: 'error', message: result.error.message ?? 'Could not update notifications.' })
    }
  }

  const onToggleAll = async (enabled: boolean) => {
    const result = await settings.toggleAllNotifications(enabled)
    if (result.ok) {
      onToast({ kind: 'success', message: enabled ? 'All notifications enabled.' : 'All notifications paused.' })
    } else {
      onToast({ kind: 'error', message: result.error.message ?? 'Could not update notifications.' })
    }
  }

  if (!settings.notificationPreferencesLoaded && settings.notificationSaveState === 'idle') {
    return <NotificationsSkeleton />
  }

  const allEnabled = NOTIFICATION_TEMPLATES.every((t) => settings.notificationPreferences[t])
  const allDisabled = NOTIFICATION_TEMPLATES.every((t) => !settings.notificationPreferences[t])

  return (
    <div className="flex flex-col gap-[16px] px-[24px] py-[24px]">
      <header className="flex items-start justify-between gap-[12px]">
        <div className="flex items-center gap-[12px]">
          <span className="flex size-[40px] items-center justify-center rounded-[10px] bg-[#eff4ff] text-[#155eef]">
            <Bell size={20} />
          </span>
          <div>
            <h2 className="text-[16px] font-semibold leading-[24px] text-[#181d27]">Notifications</h2>
          </div>
        </div>
        <div className="flex shrink-0 gap-[8px]">
          <button
            type="button"
            onClick={() => void onToggleAll(true)}
            disabled={settings.notificationSaveState === 'saving'}
            className="rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[6px] text-[12px] font-semibold leading-[18px] text-[#181d27] hover:bg-[#f5f7fa] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Enable all
          </button>
          <button
            type="button"
            onClick={() => void onToggleAll(false)}
            disabled={settings.notificationSaveState === 'saving'}
            className="rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[6px] text-[12px] font-semibold leading-[18px] text-[#181d27] hover:bg-[#f5f7fa] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Pause all
          </button>
        </div>
      </header>

      <div className="rounded-[10px] border border-[#e9eaeb]">
        {NOTIFICATION_TEMPLATES.map((template, index) => {
          const enabled = settings.notificationPreferences[template]
          const pending = pendingTemplate === template
          const isLast = index === NOTIFICATION_TEMPLATES.length - 1
          return (
            <div
              key={template}
              className={
                isLast
                  ? 'flex items-center justify-between gap-[12px] px-[16px] py-[14px]'
                  : 'flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[16px] py-[14px]'
              }
            >
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">
                  {NOTIFICATION_TEMPLATE_LABELS[template]}
                </p>
                <p className="text-[12px] leading-[18px] text-[#717680]">{template}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={enabled}
                aria-label={`Toggle ${NOTIFICATION_TEMPLATE_LABELS[template]} notifications`}
                onClick={() => void onToggle(template, !enabled)}
                disabled={pending}
                className={
                  enabled
                    ? 'inline-flex items-center gap-[6px] rounded-full bg-[#ecfdf3] px-[10px] py-[4px] text-[12px] font-semibold leading-[18px] text-[#067647] disabled:cursor-not-allowed disabled:opacity-70'
                    : 'inline-flex items-center gap-[6px] rounded-full bg-[#f5f7fa] px-[10px] py-[4px] text-[12px] font-semibold leading-[18px] text-[#535862] disabled:cursor-not-allowed disabled:opacity-70'
                }
              >
                {pending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : enabled ? (
                  <ToggleRight size={14} />
                ) : (
                  <ToggleLeft size={14} />
                )}
                {enabled ? 'On' : 'Off'}
              </button>
            </div>
          )
        })}
      </div>

      <p className="text-[12px] leading-[18px] text-[#717680]">
        Preferences persist locally; per-user persistence arrives once service-apis exposes the endpoint.
        {allEnabled
          ? ' All templates are on.'
          : allDisabled
            ? ' Every template is paused.'
            : ''}
      </p>
    </div>
  )
}

function SchedulingTab({
  settings,
  role,
  googleCalendarTestCompleted,
}: {
  settings: ReturnType<typeof useWorkspaceSettings>
  role: WorkspaceRole | null
  googleCalendarTestCompleted: boolean
}) {
  const profile = settings.schedulingProfile
  return (
    <div className="flex flex-col gap-[24px] px-[24px] py-[24px]">
      {settings.schedulingProfilePending && !profile ? <SchedulingSkeleton /> : null}

      {settings.schedulingProfileError ? (
        <EmptyState
          icon={<CalendarClock size={20} />}
          title="External scheduling profile unavailable"
          body={settings.schedulingProfileError.error.message ?? 'Could not load your external scheduling profile.'}
          action={{
            label: 'Retry',
            onClick: () => {
              void settings.refreshSchedulingProfile()
            },
          }}
        />
      ) : profile ? (
        <div className="flex flex-col gap-[16px]">
          <header className="flex items-center gap-[12px]">
            <span className="flex size-[40px] items-center justify-center rounded-[10px] bg-[#ecfdf3] text-[#067647]">
              <CalendarClock size={20} />
            </span>
            <div>
              <h2 className="text-[16px] font-semibold leading-[24px] text-[#181d27]">External scheduling</h2>
              <p className="mt-[2px] text-[13px] leading-[18px] text-[#535862]">
                Your existing Calendly or Cal link remains available for legacy flows.
              </p>
            </div>
          </header>
          <dl className="grid grid-cols-1 gap-[12px] rounded-[10px] border border-[#e9eaeb] p-[16px] md:grid-cols-2">
            <DetailRow label="Display label" value={profile.displayLabel} />
            <DetailRow label="Provider" value={profile.provider} />
            <DetailRow label="Connection mode" value={profile.connectionMode} />
            <DetailRow label="Duration" value={`${profile.durationMinutes} min`} />
            <DetailRow label="Status" value={statusLabel(profile.status)} />
            <DetailRow label="Booking link" value={profile.externalLinkUrl ?? profile.staticMeetingUrl ?? '—'} isLink />
            {profile.providerAccountEmail ? <DetailRow label="Account email" value={profile.providerAccountEmail} /> : null}
            {profile.errorMessage ? <DetailRow label="Provider error" value={profile.errorMessage} tone="error" /> : null}
          </dl>
        </div>
      ) : (
        <div className="rounded-[12px] border border-[#fedf89] bg-[#fffaeb] px-[14px] py-[12px] text-[13px] leading-[20px] text-[#b54708]">
          No external scheduling profile is configured. You can use Proploy&rsquo;s native Google Calendar flow below.
        </div>
      )}

      {nativeSchedulingAccessForRole(role) === 'owner' ? <NativeGoogleCalendarSetup /> : null}
      {nativeSchedulingAccessForRole(role) === 'test_only' ? (
        <NativeGoogleCalendarSetup testOnly testCompleted={googleCalendarTestCompleted} />
      ) : null}
    </div>
  )
}

function DetailRow({
  label,
  value,
  isLink = false,
  tone,
}: {
  label: string
  value: string
  isLink?: boolean
  tone?: 'error'
}) {
  return (
    <div className="flex flex-col gap-[2px]">
      <dt className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">
        {label}
      </dt>
      <dd
        className={
          tone === 'error'
            ? 'text-[14px] leading-[20px] text-[#b42318]'
            : 'text-[14px] leading-[20px] text-[#181d27]'
        }
      >
        {isLink && value && value !== '—' ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-[6px] text-[#004eeb] hover:underline"
          >
            {value}
            <ExternalLink size={12} />
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  )
}

function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="pt-[10px] text-[13px] font-medium leading-[18px] text-[#535862]"
    >
      {children}
    </label>
  )
}

function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode
  title: string
  body: string
  action?: { label: string; onClick: () => void }
}) {
  return (
    <div className="flex flex-col items-start gap-[12px] px-[24px] py-[28px]">
      <span className="flex size-[40px] items-center justify-center rounded-[10px] bg-[#fef3f2] text-[#b42318]">
        {icon}
      </span>
      <div>
        <h2 className="text-[16px] font-semibold leading-[24px] text-[#181d27]">{title}</h2>
        <p className="mt-[2px] text-[13px] leading-[20px] text-[#535862]">{body}</p>
      </div>
      {action ? (
        <button
          type="button"
          onClick={action.onClick}
          className="inline-flex items-center gap-[8px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[8px] text-[13px] font-semibold leading-[20px] text-[#181d27] hover:bg-[#f5f7fa]"
        >
          {action.label}
        </button>
      ) : null}
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-[16px] px-[24px] py-[24px]">
      <div className="flex items-center gap-[12px]">
        <Skeleton className="size-[40px] rounded-[10px]" />
        <div className="flex flex-col gap-[6px]">
          <Skeleton className="h-[14px] w-[140px] rounded-[6px]" />
          <Skeleton className="h-[12px] w-[200px] rounded-[6px]" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-[12px]">
        {[0, 1, 2].map((row) => (
          <div key={row} className="flex flex-col gap-[6px]">
            <Skeleton className="h-[12px] w-[80px] rounded-[6px]" />
            <Skeleton className="h-[36px] rounded-[10px]" />
          </div>
        ))}
      </div>
    </div>
  )
}

function NotificationsSkeleton() {
  return (
    <div className="flex flex-col gap-[12px] px-[24px] py-[24px]">
      <div className="flex items-center gap-[12px]">
        <Skeleton className="size-[40px] rounded-[10px]" />
        <div className="flex flex-col gap-[6px]">
          <Skeleton className="h-[14px] w-[140px] rounded-[6px]" />
          <Skeleton className="h-[12px] w-[200px] rounded-[6px]" />
        </div>
      </div>
      {[0, 1, 2, 3].map((row) => (
        <div
          key={row}
          className="flex items-center justify-between gap-[12px] rounded-[10px] border border-[#e9eaeb] px-[16px] py-[14px]"
        >
          <div className="flex flex-col gap-[6px]">
            <Skeleton className="h-[12px] w-[180px] rounded-[6px]" />
            <Skeleton className="h-[10px] w-[120px] rounded-[6px]" />
          </div>
          <Skeleton shape="circle" className="size-[40px]" />
        </div>
      ))}
    </div>
  )
}

function SchedulingSkeleton() {
  return (
    <div className="flex flex-col gap-[12px] px-[24px] py-[24px]">
      <div className="flex items-center gap-[12px]">
        <Skeleton className="size-[40px] rounded-[10px]" />
        <div className="flex flex-col gap-[6px]">
          <Skeleton className="h-[14px] w-[140px] rounded-[6px]" />
          <Skeleton className="h-[12px] w-[200px] rounded-[6px]" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-[12px] rounded-[10px] border border-[#e9eaeb] p-[16px] md:grid-cols-2">
        {[0, 1, 2, 3, 4].map((row) => (
          <div key={row} className="flex flex-col gap-[6px]">
            <Skeleton className="h-[12px] w-[80px] rounded-[6px]" />
            <Skeleton className="h-[14px] w-[160px] rounded-[6px]" />
          </div>
        ))}
      </div>
    </div>
  )
}
