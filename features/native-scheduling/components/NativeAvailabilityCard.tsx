'use client'

import { useMemo, useState } from 'react'
import { CalendarDays, CheckCircle2, Loader2, RefreshCw } from 'lucide-react'
import { BUTTON_SKEUO, CARD_SHADOW } from '@/components/workspace/WorkspaceShell'
import { formatNativeSlot } from '@/features/native-scheduling/presentation'
import { useNativeAvailability, useNativeBookingRequests } from '@/features/native-scheduling/hooks'

function localDate(offsetDays: number): string {
  const value = new Date()
  value.setDate(value.getDate() + offsetDays)
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
}

function browserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
}

export function NativeAvailabilityCard({ engagementId }: { engagementId: string }) {
  const [fromDate, setFromDate] = useState(localDate(0))
  const [toDate, setToDate] = useState(localDate(14))
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [requested, setRequested] = useState(false)
  const viewerTimezone = useMemo(() => browserTimezone(), [])
  const availability = useNativeAvailability(engagementId)
  const requests = useNativeBookingRequests()

  async function loadAvailability() {
    const from = new Date(`${fromDate}T00:00:00`)
    const to = new Date(`${toDate}T23:59:59`)
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || to <= from) return
    await availability.load(from.toISOString(), to.toISOString(), viewerTimezone)
    setSelectedSlot(null)
    setRequested(false)
  }

  async function requestSlot() {
    const slot = availability.slots.find((item) => item.startsAt === selectedSlot)
    if (!slot) return
    const result = await requests.create(engagementId, {
      startsAt: slot.startsAt,
      endsAt: slot.endsAt,
      timezone: viewerTimezone,
    })
    if (result.ok) {
      setRequested(true)
      setSelectedSlot(null)
    }
  }

  const error = availability.error ?? requests.error

  return (
    <section className={`flex flex-col gap-[16px] rounded-[16px] border border-[#e9eaeb] bg-white p-[24px] ${CARD_SHADOW}`}>
      <div className="flex flex-wrap items-start justify-between gap-[12px]">
        <div className="flex items-start gap-[10px]">
          <span className="flex size-[40px] items-center justify-center rounded-[10px] bg-[#eff4ff] text-[#155eef]"><CalendarDays size={18} /></span>
          <div>
            <h3 className="text-[16px] font-semibold leading-[24px] text-[#181d27]">Book a Google Meet</h3>
            <p className="mt-[2px] text-[13px] leading-[20px] text-[#535862]">Choose a free period from the expert&rsquo;s primary Google Calendar. The expert approves the request before Google creates the event.</p>
          </div>
        </div>
        <span className="rounded-full bg-[#f5f8ff] px-[10px] py-[4px] text-[12px] font-semibold text-[#155eef]">Your timezone: {viewerTimezone}</span>
      </div>

      {error && <p className="rounded-[10px] border border-[#fda29b] bg-[#fef3f2] px-[12px] py-[10px] text-[13px] leading-[20px] text-[#b42318]">{error.error.message}</p>}
      {requested && <p className="flex items-center gap-[8px] rounded-[10px] border border-[#a6f4c5] bg-[#ecfdf3] px-[12px] py-[10px] text-[13px] leading-[20px] text-[#067647]"><CheckCircle2 size={16} /> Request sent. The expert will receive an email and can accept, decline, or propose another slot.</p>}

      <div className="grid grid-cols-1 gap-[12px] rounded-[10px] border border-[#e9eaeb] bg-[#fcfcfd] p-[16px] md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label className="flex flex-col gap-[6px]"><span className="text-[13px] font-semibold text-[#414651]">From</span><input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="rounded-[8px] border border-[#d5d7da] px-[12px] py-[10px] text-[14px]" /></label>
        <label className="flex flex-col gap-[6px]"><span className="text-[13px] font-semibold text-[#414651]">Through</span><input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="rounded-[8px] border border-[#d5d7da] px-[12px] py-[10px] text-[14px]" /></label>
        <button type="button" onClick={() => void loadAvailability()} disabled={availability.loading} className={`inline-flex items-center justify-center gap-[8px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_SKEUO}`}>
          {availability.loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} Show free slots
        </button>
      </div>

      {availability.data && (
        <div className="flex flex-col gap-[12px]">
          <p className="text-[12px] leading-[18px] text-[#717680]">Showing {availability.slots.length} free {availability.data.durationMinutes}-minute slots. Expert calendar timezone: {availability.data.calendarTimezone}.</p>
          {availability.slots.length === 0 ? (
            <p className="rounded-[10px] border border-[#e9eaeb] bg-[#fcfcfd] px-[14px] py-[18px] text-center text-[13px] leading-[20px] text-[#535862]">No free periods were found in this window. Try a different date range.</p>
          ) : (
            <div className="grid grid-cols-1 gap-[8px] md:grid-cols-2">
              {availability.slots.map((slot) => {
                const selected = slot.startsAt === selectedSlot
                return (
                  <button key={slot.startsAt} type="button" onClick={() => setSelectedSlot(slot.startsAt)} className={`rounded-[10px] border px-[14px] py-[12px] text-left transition-colors ${selected ? 'border-[#155eef] bg-[#eff4ff]' : 'border-[#e9eaeb] hover:border-[#98a2b3] hover:bg-[#fcfcfd]'}`}>
                    <span className="block text-[13px] font-semibold leading-[20px] text-[#181d27]">{formatNativeSlot(slot.viewerStartsAt, slot.viewerEndsAt, slot.viewerTimezone)}</span>
                    <span className="mt-[2px] block text-[12px] leading-[18px] text-[#717680]">Expert calendar: {formatNativeSlot(slot.startsAt, slot.endsAt, slot.calendarTimezone)}</span>
                  </button>
                )
              })}
            </div>
          )}
          {selectedSlot && (
            <div className="flex flex-wrap items-center justify-between gap-[12px] border-t border-[#e9eaeb] pt-[12px]">
              <span className="text-[13px] leading-[20px] text-[#535862]">Selected slot is held only for this request flow; it is not reserved until the expert approves.</span>
              <button type="button" onClick={() => void requestSlot()} disabled={requests.loading} className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold text-white disabled:opacity-50 ${BUTTON_SKEUO}`}>
                {requests.loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} Request this slot
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
