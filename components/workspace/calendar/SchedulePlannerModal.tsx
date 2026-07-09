'use client'

/**
 * Interactive "Schedule a call" planner.
 *
 * Replaces the plain form with a Google-Calendar-style day view: the other
 * party's calendar (and yours) is shown as busy blocks, and the proposed
 * meeting is a draggable + resizable block you position to a slot that works
 * for both. Live conflict detection turns the block red when it overlaps either
 * calendar. On submit it hands the same ScheduleMeetingRequest to the parent.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, CalendarClock, Check, ChevronLeft, ChevronRight, Loader2, Video, X } from 'lucide-react'
import { BUTTON_SKEUO } from '@/components/workspace/WorkspaceShell'
import type { ScheduleMeetingRequest, WorkspaceMeeting } from '@/features/workspace/types'
import { buildDayAvailability, type BusyBlock, type MockParty } from '@/lib/service-apis/meetings-mock'

// ── Timeline geometry ──────────────────────────────────────────────────────
const DAY_START_MIN = 7 * 60 // 7:00 AM
const DAY_END_MIN = 20 * 60 // 8:00 PM
const HOUR_PX = 48
const PX_PER_MIN = HOUR_PX / 60
const SNAP_MIN = 15
const MIN_DURATION = 15
const TOTAL_PX = ((DAY_END_MIN - DAY_START_MIN) / 60) * HOUR_PX

const OTHER_PARTY = '__other__'

const minToPx = (min: number) => (min - DAY_START_MIN) * PX_PER_MIN
const snap = (min: number) => Math.round(min / SNAP_MIN) * SNAP_MIN
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

function minLabel(min: number): string {
  const h = Math.floor(min / 60)
  const m = ((min % 60) + 60) % 60
  const period = h >= 12 ? 'PM' : 'AM'
  const hr = ((h + 11) % 12) + 1
  return `${hr}:${String(m).padStart(2, '0')} ${period}`
}
function hourLabel(h: number): string {
  const period = h >= 12 ? 'PM' : 'AM'
  const hr = ((h + 11) % 12) + 1
  return `${hr} ${period}`
}

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd
}

/** First slot (15-min grid) of the given length where neither calendar is busy. */
function firstFreeSlot(busy: BusyBlock[], durationMin: number): number {
  for (let s = DAY_START_MIN; s + durationMin <= DAY_END_MIN; s += SNAP_MIN) {
    const clash = busy.some((b) => overlaps(s, s + durationMin, b.startMin, b.endMin))
    if (!clash) return s
  }
  return 9 * 60 // fallback: 9:00 AM
}

type DragMode = 'move' | 'resize-top' | 'resize-bottom'
interface DragState {
  mode: DragMode
  startY: number
  origStartMin: number
  origDurMin: number
}

export function SchedulePlannerModal({
  initialDate,
  parties,
  provider = 'cal_diy',
  providerName = 'Proploy Scheduling',
  onClose,
  onSubmit,
}: {
  initialDate: Date
  parties: MockParty[]
  provider?: WorkspaceMeeting['provider']
  providerName?: string
  onClose: () => void
  onSubmit: (payload: ScheduleMeetingRequest) => Promise<{ ok: boolean; message?: string }>
}) {
  const initialParty = parties[0]?.id ?? OTHER_PARTY
  const initialDay = new Date(initialDate.getFullYear(), initialDate.getMonth(), initialDate.getDate())

  const [title, setTitle] = useState('Intro call')
  const [partyId, setPartyId] = useState<string>(initialParty)
  const [otherName, setOtherName] = useState('')
  const [day, setDay] = useState<Date>(initialDay)
  // Open on the first slot where both calendars are free (computed once).
  const [startMin, setStartMin] = useState(() =>
    firstFreeSlot(buildDayAvailability(initialParty === OTHER_PARTY ? null : initialParty, initialDay), 30),
  )
  const [durationMin, setDurationMin] = useState(30)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canvasRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)

  const partyName = useMemo(() => {
    if (partyId === OTHER_PARTY) return otherName.trim()
    return parties.find((p) => p.id === partyId)?.name ?? ''
  }, [partyId, otherName, parties])

  const busy = useMemo(
    () => buildDayAvailability(partyId === OTHER_PARTY ? null : partyId, day),
    [partyId, day],
  )
  const youBusy = useMemo(() => busy.filter((b) => b.owner === 'you'), [busy])
  const partyBusy = useMemo(() => busy.filter((b) => b.owner === 'party'), [busy])

  // Scroll the timeline to business hours on open.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = minToPx(8 * 60)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !submitting) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, submitting])

  const endMin = startMin + durationMin
  const conflicts = useMemo(
    () => busy.filter((b) => overlaps(startMin, endMin, b.startMin, b.endMin)),
    [busy, startMin, endMin],
  )
  const hasConflict = conflicts.length > 0

  // ── Drag / resize ────────────────────────────────────────────────────────
  useEffect(() => {
    function onMove(e: PointerEvent) {
      const d = dragRef.current
      if (!d) return
      const deltaMin = (e.clientY - d.startY) / PX_PER_MIN
      if (d.mode === 'move') {
        const s = clamp(snap(d.origStartMin + deltaMin), DAY_START_MIN, DAY_END_MIN - d.origDurMin)
        setStartMin(s)
      } else if (d.mode === 'resize-top') {
        const origEnd = d.origStartMin + d.origDurMin
        const s = clamp(snap(d.origStartMin + deltaMin), DAY_START_MIN, origEnd - MIN_DURATION)
        setStartMin(s)
        setDurationMin(origEnd - s)
      } else {
        const end = clamp(snap(d.origStartMin + d.origDurMin + deltaMin), d.origStartMin + MIN_DURATION, DAY_END_MIN)
        setDurationMin(end - d.origStartMin)
      }
    }
    function onUp() {
      dragRef.current = null
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  function beginDrag(mode: DragMode, e: React.PointerEvent) {
    e.preventDefault()
    e.stopPropagation()
    dragRef.current = { mode, startY: e.clientY, origStartMin: startMin, origDurMin: durationMin }
  }

  // Click an empty part of the day to move the block there, then drag to fine-tune.
  function onCanvasPointerDown(e: React.PointerEvent) {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const clickedMin = snap(DAY_START_MIN + (e.clientY - rect.top) / PX_PER_MIN)
    const s = clamp(clickedMin - durationMin / 2, DAY_START_MIN, DAY_END_MIN - durationMin)
    const snapped = clamp(snap(s), DAY_START_MIN, DAY_END_MIN - durationMin)
    setStartMin(snapped)
    dragRef.current = { mode: 'move', startY: e.clientY, origStartMin: snapped, origDurMin: durationMin }
  }

  const canSubmit = title.trim().length > 0 && partyName.length > 0 && !submitting

  async function handleSubmit() {
    if (!canSubmit) {
      setError('Add a title and choose who you are meeting.')
      return
    }
    setError(null)
    const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), Math.floor(startMin / 60), startMin % 60, 0, 0)
    const end = new Date(start.getTime() + durationMin * 60_000)
    const payload: ScheduleMeetingRequest = {
      engagementId: partyId === OTHER_PARTY ? null : partyId,
      title: title.trim(),
      startsAt: start.toISOString(),
      endsAt: end.toISOString(),
      provider,
      attendeeName: partyName,
      notes: notes.trim() || null,
    }
    setSubmitting(true)
    const result = await onSubmit(payload)
    setSubmitting(false)
    if (!result.ok) setError(result.message ?? 'Could not schedule the call. Try again.')
  }

  const stepDay = (delta: number) =>
    setDay((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + delta))

  const fieldClass = `rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[9px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`
  const labelClass = 'text-[13px] font-medium leading-[20px] text-[#414651]'
  const hours = Array.from({ length: (DAY_END_MIN - DAY_START_MIN) / 60 + 1 }, (_, i) => DAY_START_MIN / 60 + i)

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-[16px]">
      <div className="absolute inset-0 bg-[#0a0d12]/40 backdrop-blur-[2px]" onClick={submitting ? undefined : onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-planner-title"
        className="relative flex max-h-[calc(100vh-32px)] w-full max-w-[760px] flex-col overflow-hidden rounded-[16px] border border-[#e9eaeb] bg-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)]"
      >
        {/* Header */}
        <div className="flex items-start gap-[12px] border-b border-[#e9eaeb] px-[24px] py-[18px]">
          <div className="flex size-[40px] shrink-0 items-center justify-center rounded-[8px] bg-[#eff4ff] text-[#155eef]">
            <CalendarClock size={20} />
          </div>
          <div className="flex-1">
            <h2 id="schedule-planner-title" className="font-semibold text-[18px] leading-[26px] text-[#181d27]">
              Schedule a call
            </h2>
            <p className="mt-[2px] text-[13px] leading-[18px] text-[#717680]">
              Drag the block to a time that works for both calendars, then resize to set the length.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="inline-flex size-[32px] items-center justify-center rounded-[8px] text-[#717680] hover:bg-[#fafafa] disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {/* Form fields */}
          <div className="grid grid-cols-1 gap-[12px] px-[24px] pt-[18px] sm:grid-cols-2">
            <label className="flex flex-col gap-[6px]">
              <span className={labelClass}>Title</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Intro call" className={fieldClass} />
            </label>
            <label className="flex flex-col gap-[6px]">
              <span className={labelClass}>With</span>
              <select value={partyId} onChange={(e) => setPartyId(e.target.value)} className={fieldClass}>
                {parties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
                <option value={OTHER_PARTY}>Someone else…</option>
              </select>
            </label>
            {partyId === OTHER_PARTY && (
              <label className="flex flex-col gap-[6px] sm:col-span-2">
                <span className={labelClass}>Name of client or business</span>
                <input
                  value={otherName}
                  onChange={(e) => setOtherName(e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  className={fieldClass}
                />
              </label>
            )}
          </div>

          {/* Day header + legend */}
          <div className="flex flex-wrap items-center justify-between gap-[12px] px-[24px] pt-[18px]">
            <div className="flex items-center gap-[8px]">
              <button
                type="button"
                onClick={() => stepDay(-1)}
                aria-label="Previous day"
                className={`inline-flex size-[32px] items-center justify-center rounded-[8px] border border-[#d5d7da] bg-white text-[#414651] hover:bg-[#fafafa] ${BUTTON_SKEUO}`}
              >
                <ChevronLeft size={16} />
              </button>
              <p className="min-w-[190px] text-center text-[15px] font-semibold leading-[22px] text-[#181d27]">
                {day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <button
                type="button"
                onClick={() => stepDay(1)}
                aria-label="Next day"
                className={`inline-flex size-[32px] items-center justify-center rounded-[8px] border border-[#d5d7da] bg-white text-[#414651] hover:bg-[#fafafa] ${BUTTON_SKEUO}`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="flex items-center gap-[14px] text-[12px] leading-[18px] text-[#717680]">
              <span className="inline-flex items-center gap-[5px]">
                <span className="size-[10px] rounded-[3px] bg-[#e9eaeb]" /> Busy
              </span>
              <span className="inline-flex items-center gap-[5px]">
                <span className={`size-[10px] rounded-[3px] ${hasConflict ? 'bg-[#f04438]' : 'bg-[#155eef]'}`} /> Your call
              </span>
            </div>
          </div>

          {/* Column headers */}
          <div className="flex px-[24px] pt-[12px]">
            <div className="w-[56px] shrink-0" />
            <div className="grid flex-1 grid-cols-2 gap-[6px]">
              <div className="rounded-t-[8px] bg-[#f5f8ff] px-[10px] py-[6px] text-[12px] font-semibold text-[#155eef]">You</div>
              <div className="truncate rounded-t-[8px] bg-[#fafafa] px-[10px] py-[6px] text-[12px] font-semibold text-[#414651]">
                {partyName || 'Other party'}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div ref={scrollRef} className="mx-[24px] mb-[8px] max-h-[340px] overflow-y-auto rounded-b-[8px] border border-[#e9eaeb]">
            <div className="flex" style={{ height: TOTAL_PX }}>
              {/* Hour gutter */}
              <div className="relative w-[56px] shrink-0 border-r border-[#e9eaeb] bg-[#fcfcfd]">
                {hours.map((h) => (
                  <div
                    key={h}
                    className="absolute right-[8px] -translate-y-1/2 text-[11px] leading-[14px] text-[#717680]"
                    style={{ top: minToPx(h * 60) }}
                  >
                    {hourLabel(h)}
                  </div>
                ))}
              </div>

              {/* Day canvas */}
              <div
                ref={canvasRef}
                onPointerDown={onCanvasPointerDown}
                className="relative flex-1 cursor-copy select-none"
              >
                {/* Hour grid lines + midpoints */}
                {hours.map((h) => (
                  <div key={h} className="absolute left-0 right-0 border-t border-[#f0f1f3]" style={{ top: minToPx(h * 60) }} />
                ))}
                {/* Center divider between the two people */}
                <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-[#f0f1f3]" />

                {/* Busy blocks (visual only) */}
                <div className="pointer-events-none absolute inset-0">
                  {youBusy.map((b, i) => (
                    <BusyBlockView key={`you-${i}`} block={b} side="left" />
                  ))}
                  {partyBusy.map((b, i) => (
                    <BusyBlockView key={`party-${i}`} block={b} side="right" />
                  ))}
                </div>

                {/* Proposed event block */}
                <div
                  role="button"
                  tabIndex={0}
                  onPointerDown={(e) => beginDrag('move', e)}
                  className={[
                    'absolute left-[6px] right-[6px] flex cursor-grab flex-col justify-center overflow-hidden rounded-[8px] border-2 px-[10px] shadow-sm active:cursor-grabbing',
                    hasConflict
                      ? 'border-[#f04438] bg-[#fef3f2] text-[#b42318]'
                      : 'border-[#155eef] bg-[#eff4ff] text-[#004eeb]',
                  ].join(' ')}
                  style={{ top: minToPx(startMin), height: Math.max(durationMin * PX_PER_MIN, 22) }}
                >
                  {/* top resize handle */}
                  <span
                    onPointerDown={(e) => beginDrag('resize-top', e)}
                    className="absolute inset-x-0 top-0 h-[8px] cursor-ns-resize"
                    aria-hidden
                  />
                  <p className="truncate text-[12px] font-semibold leading-[16px]">{title.trim() || 'New call'}</p>
                  <p className="truncate text-[11px] leading-[15px] opacity-80">
                    {minLabel(startMin)} – {minLabel(endMin)} · {durationMin}m
                  </p>
                  {/* bottom resize handle */}
                  <span
                    onPointerDown={(e) => beginDrag('resize-bottom', e)}
                    className="absolute inset-x-0 bottom-0 h-[8px] cursor-ns-resize"
                    aria-hidden
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status + notes */}
          <div className="flex flex-col gap-[12px] px-[24px] pb-[4px]">
            <div
              className={[
                'flex items-center gap-[8px] rounded-[8px] border px-[12px] py-[9px] text-[13px] leading-[18px]',
                hasConflict ? 'border-[#fecdca] bg-[#fef3f2] text-[#b42318]' : 'border-[#abefc6] bg-[#ecfdf3] text-[#067647]',
              ].join(' ')}
            >
              {hasConflict ? <AlertTriangle size={16} className="shrink-0" /> : <Check size={16} className="shrink-0" />}
              {hasConflict
                ? `Conflicts with ${conflicts.length} event${conflicts.length > 1 ? 's' : ''} (${conflicts
                    .map((c) => (c.owner === 'you' ? 'you' : partyName || 'them'))
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .join(' & ')}). Move the block to a free slot.`
                : `Both calendars are free at ${minLabel(startMin)}–${minLabel(endMin)}.`}
            </div>

            <label className="flex flex-col gap-[6px]">
              <span className={labelClass}>Notes (optional)</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Agenda, context, or anything the other party should know."
                className={`resize-none ${fieldClass}`}
              />
            </label>

            <div className="flex items-center gap-[8px] rounded-[8px] border border-[#e9eaeb] bg-[#fafafa] px-[12px] py-[9px]">
              <Video size={16} className="shrink-0 text-[#155eef]" />
              <p className="text-[12px] leading-[18px] text-[#535862]">
                Scheduled through <span className="font-medium text-[#414651]">{providerName}</span>. A video link is
                generated automatically once booked.
              </p>
            </div>

            {error && (
              <p className="text-[13px] leading-[18px] text-[#d92d20]" role="alert">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-[10px] border-t border-[#e9eaeb] px-[24px] py-[14px]">
          <p className="text-[13px] leading-[18px] text-[#717680]">
            {minLabel(startMin)} – {minLabel(endMin)} · {durationMin} min
          </p>
          <div className="flex gap-[10px]">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className={`rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] disabled:opacity-50 ${BUTTON_SKEUO}`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`inline-flex items-center gap-[6px] rounded-[8px] border-2 border-white/[0.12] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white disabled:cursor-not-allowed disabled:opacity-60 ${BUTTON_SKEUO}`}
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? 'Scheduling…' : 'Schedule call'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function BusyBlockView({ block, side }: { block: BusyBlock; side: 'left' | 'right' }) {
  const top = minToPx(block.startMin)
  const height = Math.max((block.endMin - block.startMin) * PX_PER_MIN, 16)
  return (
    <div
      className="absolute overflow-hidden rounded-[6px] border border-[#e9eaeb] bg-[repeating-linear-gradient(45deg,#f2f4f7_0px,#f2f4f7_6px,#eaecf0_6px,#eaecf0_12px)] px-[8px] py-[3px]"
      style={{
        top,
        height,
        left: side === 'left' ? '4px' : 'calc(50% + 4px)',
        width: 'calc(50% - 10px)',
      }}
    >
      <p className="truncate text-[11px] font-medium leading-[15px] text-[#535862]">{block.label}</p>
      {height > 30 && <p className="truncate text-[10px] leading-[14px] text-[#717680]">{minLabel(block.startMin)}</p>}
    </div>
  )
}
