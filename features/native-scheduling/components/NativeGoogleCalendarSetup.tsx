'use client'

import { useState } from 'react'
import { Calendar, CheckCircle2, ExternalLink, Loader2, Save, Unplug } from 'lucide-react'
import { BUTTON_SKEUO, CARD_SHADOW } from '@/components/workspace/WorkspaceShell'
import { nativeSchedulingOAuthReturnPath } from '@/features/native-scheduling/access'
import { useNativeGoogleCalendar } from '@/features/native-scheduling/hooks'

const DEFAULT_PROFILE = {
  displayLabel: 'Book a call',
  durationMinutes: 30,
  minimumNoticeMinutes: 1440,
  bookingHorizonDays: 60,
}

export function NativeGoogleCalendarSetup({
  testOnly = false,
  testCompleted = false,
  returnPath,
}: {
  testOnly?: boolean
  testCompleted?: boolean
  returnPath?: string
}) {
  const calendar = useNativeGoogleCalendar(!testOnly)
  const [form, setForm] = useState(DEFAULT_PROFILE)
  const [edited, setEdited] = useState(false)
  const [saved, setSaved] = useState(false)

  const profileForm = calendar.profile && !edited
    ? {
        displayLabel: calendar.profile.displayLabel,
        durationMinutes: calendar.profile.durationMinutes,
        minimumNoticeMinutes: calendar.profile.minimumNoticeMinutes,
        bookingHorizonDays: calendar.profile.bookingHorizonDays,
      }
    : form

  async function save() {
    const result = await calendar.saveProfile(profileForm)
    if (result.ok) {
      setEdited(false)
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2500)
    }
  }

  const connected = calendar.status?.connected === true

  function handleConnect() {
    void calendar.connect(returnPath || nativeSchedulingOAuthReturnPath(testOnly))
  }

  return (
    <section className={`flex flex-col gap-[20px] rounded-[16px] border border-[#e9eaeb] bg-white p-[24px] ${CARD_SHADOW}`}>
      <div className="flex flex-wrap items-start justify-between gap-[16px]">
        <div className="flex items-start gap-[12px]">
          <span className="flex size-[42px] shrink-0 items-center justify-center rounded-[10px] bg-[#eff4ff] text-[#155eef]">
            <Calendar size={20} />
          </span>
          <div>
            <h3 className="text-[16px] font-semibold leading-[24px] text-[#181d27]">Proploy Google scheduling</h3>
            <p className="mt-[2px] max-w-[620px] text-[13px] leading-[20px] text-[#535862]">
              Connect your primary Google Calendar. Proploy reads free/busy periods and creates a Google Meet event only after you approve a request.
            </p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-[6px] rounded-full px-[10px] py-[4px] text-[12px] font-semibold leading-[18px] ${testOnly ? 'bg-[#eff4ff] text-[#155eef]' : connected ? 'bg-[#ecfdf3] text-[#067647]' : 'bg-[#fffaeb] text-[#b54708]'}`}>
          <span className="size-[6px] rounded-full bg-current" />
          {testOnly ? 'Test only' : connected ? 'Connected' : 'Not connected'}
        </span>
      </div>

      {testOnly && (
        <p className="rounded-[10px] border border-[#c7d7fe] bg-[#eff4ff] px-[12px] py-[10px] text-[13px] leading-[20px] text-[#155eef]">
          This is a test-only admin view. You can exercise Google OAuth here, but only expert accounts can connect and own the scheduling calendar.
        </p>
      )}

      {testOnly && testCompleted && (
        <p role="status" className="rounded-[10px] border border-[#abefc6] bg-[#ecfdf3] px-[12px] py-[10px] text-[13px] leading-[20px] text-[#067647]">
          Google OAuth test completed. No admin calendar connection or scheduling profile was stored.
        </p>
      )}

      {calendar.error && (
        <p className="rounded-[10px] border border-[#fda29b] bg-[#fef3f2] px-[12px] py-[10px] text-[13px] leading-[20px] text-[#b42318]">
          {calendar.error.error.message}
        </p>
      )}

      {connected ? (
        <div className="flex flex-col gap-[16px]">
          <div className="grid grid-cols-1 gap-[12px] rounded-[10px] border border-[#e9eaeb] bg-[#fcfcfd] p-[16px] md:grid-cols-2">
            <Detail label="Google account" value={calendar.status?.providerAccountEmail ?? 'Connected account'} />
            <Detail label="Primary calendar timezone" value={calendar.status?.primaryCalendarTimezone ?? calendar.profile?.calendarTimezone ?? 'UTC'} />
            <Detail label="Calendar ID" value={calendar.status?.primaryCalendarId ?? 'Primary Google Calendar'} />
            <Detail label="Connected" value={calendar.status?.connectedAt ? new Date(calendar.status.connectedAt).toLocaleString() : 'Active'} />
          </div>

          <div className="grid grid-cols-1 gap-[12px] md:grid-cols-2">
            <label className="flex flex-col gap-[6px] md:col-span-2">
              <span className="text-[13px] font-semibold text-[#414651]">Booking label</span>
              <input
                value={profileForm.displayLabel}
                onChange={(event) => { setEdited(true); setForm((current) => ({ ...current, displayLabel: event.target.value })) }}
                maxLength={160}
                className="rounded-[8px] border border-[#d5d7da] px-[12px] py-[10px] text-[14px] text-[#181d27] outline-none focus:border-[#155eef]"
              />
            </label>
            <NumberField label="Meeting duration (minutes)" value={profileForm.durationMinutes} min={5} max={480} onChange={(value) => { setEdited(true); setForm((current) => ({ ...current, durationMinutes: value })) }} />
            <NumberField label="Minimum notice (minutes)" value={profileForm.minimumNoticeMinutes} min={0} max={43200} onChange={(value) => { setEdited(true); setForm((current) => ({ ...current, minimumNoticeMinutes: value })) }} />
            <NumberField label="Booking horizon (days)" value={profileForm.bookingHorizonDays} min={1} max={365} onChange={(value) => { setEdited(true); setForm((current) => ({ ...current, bookingHorizonDays: value })) }} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-[12px] border-t border-[#e9eaeb] pt-[16px]">
            <p className="text-[12px] leading-[18px] text-[#717680]">Availability comes entirely from your primary calendar. No separate working hours are used.</p>
            <div className="flex flex-wrap gap-[8px]">
              <button
                type="button"
                onClick={() => void calendar.disconnect()}
                disabled={calendar.loading}
                className={`inline-flex items-center gap-[8px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold text-[#414651] hover:bg-[#fef3f2] hover:text-[#b42318] disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_SKEUO}`}
              >
                <Unplug size={16} /> Disconnect
              </button>
              <button
                type="button"
                onClick={() => void save()}
                disabled={calendar.loading || !profileForm.displayLabel.trim()}
                className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold text-white hover:bg-[#004eeb] disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_SKEUO}`}
              >
                {calendar.loading ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
                {saved ? 'Saved' : 'Save scheduling settings'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-[16px] rounded-[10px] border border-[#fedf89] bg-[#fffaeb] p-[16px]">
          <p className="max-w-[640px] text-[13px] leading-[20px] text-[#b54708]">
            {testOnly
              ? 'Use this test flow to verify the Google account and Calendar permissions. The admin result is discarded; no calendar connection will be created.'
              : 'Connect the Google account that owns the calendar you want Proploy to check. Google will ask for Calendar free/busy and event permissions.'}
          </p>
          <button
            type="button"
            onClick={handleConnect}
            disabled={calendar.loading}
            className={`inline-flex shrink-0 items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold text-white hover:bg-[#004eeb] disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_SKEUO}`}
          >
            {calendar.loading ? <Loader2 size={16} className="animate-spin" /> : <ExternalLink size={16} />}
            {testOnly ? 'Run Google OAuth test' : 'Connect Google Calendar'}
          </button>
        </div>
      )}
    </section>
  )
}

function NumberField({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return (
    <label className="flex flex-col gap-[6px]">
      <span className="text-[13px] font-semibold text-[#414651]">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(Number(event.target.value))}
        className="rounded-[8px] border border-[#d5d7da] px-[12px] py-[10px] text-[14px] text-[#181d27] outline-none focus:border-[#155eef]"
      />
    </label>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#717680]">{label}</p>
      <p className="mt-[4px] break-words text-[13px] leading-[20px] text-[#181d27]">{value}</p>
    </div>
  )
}
