'use client'

import { useMemo, useState } from 'react'
import { CalendarDays, CheckCircle2, Clock3, Loader2, RefreshCw, XCircle } from 'lucide-react'
import { BUTTON_SKEUO, CARD_SHADOW } from '@/components/workspace/WorkspaceShell'
import { useNativeBookingRequests } from '@/features/native-scheduling/hooks'
import {
  formatNativeSlot,
  nativeRequestStatusLabel,
} from '@/features/native-scheduling/presentation'
import type { WorkspaceRole } from '@/features/workspace/types'

function timezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
}

function toInputValue(value?: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  const pad = (part: number) => String(part).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

type Props = {
  role: WorkspaceRole | null
  selectedEngagementId?: string | null
  engagementLabel: (engagementId: string) => string
  onOpenCalendar: (engagementId: string) => void
}

export function NativeBookingRequestsPanel({
  role,
  selectedEngagementId,
  engagementLabel,
  onOpenCalendar,
}: Props) {
  const isExpert = role === 'expert' || role === 'admin'
  const native = useNativeBookingRequests()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [alternative, setAlternative] = useState({ startsAt: '', endsAt: '', reason: '' })
  const [error, setError] = useState<string | null>(null)

  const visible = useMemo(() => {
    if (!selectedEngagementId) return native.requests
    return native.requests.filter((request) => request.engagementId === selectedEngagementId)
  }, [native.requests, selectedEngagementId])

  async function decide(requestId: string, action: 'accept' | 'accept-alternative' | 'decline' | 'cancel') {
    setError(null)
    const result = await native.decide(requestId, action)
    if (!result.ok) setError(result.error.message)
  }

  async function propose(requestId: string) {
    const startsAt = new Date(alternative.startsAt)
    const endsAt = new Date(alternative.endsAt)
    if (
      !alternative.startsAt ||
      !alternative.endsAt ||
      Number.isNaN(startsAt.getTime()) ||
      Number.isNaN(endsAt.getTime()) ||
      endsAt <= startsAt
    ) {
      setError('Choose a valid alternative start and end time.')
      return
    }
    setError(null)
    const result = await native.proposeAlternative(requestId, {
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      timezone: timezone(),
      reason: alternative.reason.trim() || null,
    })
    if (result.ok) {
      setSelectedId(null)
      setAlternative({ startsAt: '', endsAt: '', reason: '' })
    } else {
      setError(result.error.message)
    }
  }

  return (
    <section
      className={`flex flex-col gap-[16px] border-b border-[#e9eaeb] bg-[#fcfcfd] px-[24px] py-[20px] ${CARD_SHADOW}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-[12px]">
        <div>
          <h2 className="text-[16px] font-semibold leading-[24px] text-[#181d27]">
            {isExpert ? 'Pending booking requests' : 'Your meeting requests'}
          </h2>
          <p className="mt-[2px] text-[13px] leading-[20px] text-[#535862]">
            {isExpert
              ? 'Accept a request to create the Google Calendar event and Meet link, propose a new time, or decline.'
              : 'Track approval and any alternative slot proposed by the expert.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void native.refresh()}
          disabled={native.loading}
          className="inline-flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[10px] py-[8px] text-[13px] font-semibold text-[#414651] disabled:opacity-50"
        >
          <RefreshCw size={14} className={native.loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {(native.error || error) && (
        <p className="rounded-[10px] border border-[#fda29b] bg-[#fef3f2] px-[12px] py-[10px] text-[13px] leading-[20px] text-[#b42318]">
          {error ?? native.error?.error.message}
        </p>
      )}

      {visible.length === 0 ? (
        <p className="rounded-[10px] border border-[#e9eaeb] bg-white px-[14px] py-[18px] text-center text-[13px] leading-[20px] text-[#535862]">
          {selectedEngagementId
            ? 'No booking requests yet for this engagement.'
            : 'No booking requests yet.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-[10px] lg:grid-cols-2">
          {visible.map((request) => {
            const expanded = selectedId === request.id
            const canExpertDecide = isExpert && request.status === 'pending_expert'
            const canBuyerAccept = !isExpert && request.status === 'pending_user'
            const canCancel = !isExpert && ['pending_expert', 'pending_user'].includes(request.status)
            return (
              <article
                key={request.id}
                className="rounded-[12px] border border-[#e9eaeb] bg-white p-[14px]"
              >
                <div className="flex items-start justify-between gap-[12px]">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold leading-[20px] text-[#181d27]">
                      {engagementLabel(request.engagementId)}
                    </p>
                    <p className="mt-[2px] text-[12px] leading-[18px] text-[#717680]">
                      {formatNativeSlot(request.requestedStartsAt, request.requestedEndsAt, request.requestedTimezone)}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-[5px] rounded-full bg-[#f5f8ff] px-[8px] py-[3px] text-[11px] font-semibold text-[#155eef]">
                    <Clock3 size={12} /> {nativeRequestStatusLabel(request.status)}
                  </span>
                </div>
                {request.proposedStartsAt && request.proposedEndsAt && (
                  <p className="mt-[8px] rounded-[8px] bg-[#fffaeb] px-[10px] py-[8px] text-[12px] leading-[18px] text-[#b54708]">
                    Alternative:{' '}
                    {formatNativeSlot(
                      request.proposedStartsAt,
                      request.proposedEndsAt,
                      request.proposedTimezone ?? timezone()
                    )}
                  </p>
                )}
                {request.providerError && (
                  <p className="mt-[8px] text-[12px] leading-[18px] text-[#b42318]">{request.providerError}</p>
                )}
                <div className="mt-[10px] flex items-center justify-between gap-[8px] border-t border-[#f1f2f4] pt-[10px]">
                  <button
                    type="button"
                    onClick={() => onOpenCalendar(request.engagementId)}
                    className="inline-flex items-center gap-[6px] text-[12px] font-semibold text-[#155eef] hover:underline"
                  >
                    <CalendarDays size={13} />
                    Open calendar for this engagement
                  </button>
                </div>
                {(canExpertDecide || canBuyerAccept || canCancel) && (
                  <div className="mt-[12px] flex flex-wrap gap-[8px]">
                    {canExpertDecide && (
                      <>
                        <button
                          type="button"
                          onClick={() => void decide(request.id, 'decline')}
                          disabled={native.loading}
                          className={`inline-flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[10px] py-[8px] text-[12px] font-semibold text-[#b42318] disabled:opacity-50 ${BUTTON_SKEUO}`}
                        >
                          <XCircle size={14} /> Decline
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedId(expanded ? null : request.id)
                            setAlternative(
                              expanded
                                ? { startsAt: '', endsAt: '', reason: '' }
                                : {
                                    startsAt: toInputValue(request.requestedStartsAt),
                                    endsAt: toInputValue(request.requestedEndsAt),
                                    reason: '',
                                  }
                            )
                          }}
                          disabled={native.loading}
                          className="inline-flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[10px] py-[8px] text-[12px] font-semibold text-[#414651] disabled:opacity-50"
                        >
                          Propose another time
                        </button>
                        <button
                          type="button"
                          onClick={() => void decide(request.id, 'accept')}
                          disabled={native.loading}
                          className={`inline-flex items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[10px] py-[8px] text-[12px] font-semibold text-white disabled:opacity-50 ${BUTTON_SKEUO}`}
                        >
                          <CheckCircle2 size={14} /> Accept
                        </button>
                      </>
                    )}
                    {canBuyerAccept && (
                      <button
                        type="button"
                        onClick={() => void decide(request.id, 'accept-alternative')}
                        disabled={native.loading}
                        className={`inline-flex items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[10px] py-[8px] text-[12px] font-semibold text-white disabled:opacity-50 ${BUTTON_SKEUO}`}
                      >
                        <CheckCircle2 size={14} /> Accept alternative
                      </button>
                    )}
                    {canCancel && (
                      <button
                        type="button"
                        onClick={() => void decide(request.id, 'cancel')}
                        disabled={native.loading}
                        className="inline-flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[10px] py-[8px] text-[12px] font-semibold text-[#414651] disabled:opacity-50"
                      >
                        <XCircle size={14} /> Cancel
                      </button>
                    )}
                  </div>
                )}
                {expanded && canExpertDecide && (
                  <div className="mt-[12px] grid grid-cols-1 gap-[8px] rounded-[8px] border-t border-[#e9eaeb] pt-[12px] md:grid-cols-2">
                    <label className="flex flex-col gap-[4px]">
                      <span className="text-[11px] font-semibold text-[#414651]">Alternative start</span>
                      <input
                        type="datetime-local"
                        value={alternative.startsAt || toInputValue(request.requestedStartsAt)}
                        onChange={(event) =>
                          setAlternative((current) => ({ ...current, startsAt: event.target.value }))
                        }
                        className="rounded-[7px] border border-[#d5d7da] px-[8px] py-[8px] text-[12px]"
                      />
                    </label>
                    <label className="flex flex-col gap-[4px]">
                      <span className="text-[11px] font-semibold text-[#414651]">Alternative end</span>
                      <input
                        type="datetime-local"
                        value={alternative.endsAt || toInputValue(request.requestedEndsAt)}
                        onChange={(event) =>
                          setAlternative((current) => ({ ...current, endsAt: event.target.value }))
                        }
                        className="rounded-[7px] border border-[#d5d7da] px-[8px] py-[8px] text-[12px]"
                      />
                    </label>
                    <input
                      value={alternative.reason}
                      onChange={(event) =>
                        setAlternative((current) => ({ ...current, reason: event.target.value }))
                      }
                      placeholder="Optional note"
                      className="rounded-[7px] border border-[#d5d7da] px-[8px] py-[8px] text-[12px] md:col-span-2"
                    />
                    <button
                      type="button"
                      onClick={() => void propose(request.id)}
                      disabled={native.loading}
                      className={`inline-flex items-center justify-center gap-[6px] rounded-[8px] bg-[#155eef] px-[10px] py-[8px] text-[12px] font-semibold text-white disabled:opacity-50 md:col-span-2 ${BUTTON_SKEUO}`}
                    >
                      {native.loading ? <Loader2 size={14} className="animate-spin" /> : null}
                      Send alternative slot
                    </button>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
