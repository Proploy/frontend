'use client'

import Link from 'next/link'
import { ArrowRight, CalendarDays, ChevronDown, Settings2 } from 'lucide-react'
import { BUTTON_SKEUO, CARD_SHADOW } from '@/components/workspace/WorkspaceShell'
import type { WorkspaceEngagement, WorkspaceRole } from '@/features/workspace/types'
import { buildWorkspaceSettingsHref } from '@/features/workspace/settings-navigation'
import { nativeSchedulingAccessForRole } from '@/features/native-scheduling/access'

type Props = {
  role: WorkspaceRole | null
  engagement: WorkspaceEngagement | null
  counterpartyLabel: string
  isCalendarOpen: boolean
  onToggleCalendar: () => void
  onOpenChange: (engagementId: string) => void
  onConnectCalendar?: () => void
  pendingRequestCountForSelected?: number
}

export function NativeMeetingEntryCard({
  role,
  engagement,
  counterpartyLabel,
  isCalendarOpen,
  onToggleCalendar,
  onOpenChange,
  onConnectCalendar,
  pendingRequestCountForSelected = 0,
}: Props) {
  const isBuyer = role === 'buyer'
  const isExpert = role === 'expert'
  const isAdminTest = nativeSchedulingAccessForRole(role) === 'test_only'
  const settingsHref = buildWorkspaceSettingsHref('scheduling')
  const hasEngagement = Boolean(engagement)
  const isActiveEngagement = engagement?.status === 'active'

  const heading = isBuyer
    ? `Book a Google Meet with ${counterpartyLabel}`
    : isExpert
      ? `Schedule a Google Meet with ${counterpartyLabel}`
      : 'Native Google Calendar meetings'

  const subtitle = !hasEngagement
    ? 'Pick an engagement from the dropdown above to see who you are scheduling with.'
    : isBuyer
      ? isActiveEngagement
        ? `Browse free periods from ${counterpartyLabel}’s primary Google Calendar, then send a booking request for approval.`
        : `${counterpartyLabel} isn’t accepting new meeting requests on this engagement yet.`
      : isExpert
        ? pendingRequestCountForSelected > 0
          ? `${pendingRequestCountForSelected} pending request${pendingRequestCountForSelected === 1 ? '' : 's'} for ${counterpartyLabel}. Accept, propose another time, or decline below.`
          : `No pending requests from ${counterpartyLabel}. Approve incoming requests or propose an alternative slot when one arrives.`
        : 'Use this test-only entry point to review the expert-owned Google Calendar connection flow.'

  const primaryLabel = isBuyer
    ? isCalendarOpen
      ? 'Hide calendar'
      : 'Open calendar'
    : isExpert
      ? pendingRequestCountForSelected > 0
        ? `Review ${counterpartyLabel}’s requests`
        : `View ${counterpartyLabel}’s booking flow`
      : 'Connect calendar (test only)'

  const primaryDisabled = !hasEngagement || (!isAdminTest && !isActiveEngagement)

  return (
    <section
      className={`flex flex-col gap-[16px] rounded-[16px] border border-[#dbe5ff] bg-[#f5f8ff] p-[20px] ${CARD_SHADOW}`}
    >
      <div className="flex items-start gap-[10px]">
        <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[10px] bg-white text-[#155eef]">
          <CalendarDays size={19} />
        </span>
        <div className="min-w-0">
          <h2 className="text-[16px] font-semibold leading-[24px] text-[#181d27]">{heading}</h2>
          <p className="mt-[2px] text-[13px] leading-[20px] text-[#535862]">{subtitle}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-[8px]">
        {isAdminTest ? (
          onConnectCalendar ? (
            <button
              type="button"
              onClick={onConnectCalendar}
              className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[13px] font-semibold text-white hover:bg-[#004eeb] ${BUTTON_SKEUO}`}
            >
              {primaryLabel}
              <ArrowRight size={15} />
            </button>
          ) : (
            <Link
              href={settingsHref}
              className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[13px] font-semibold text-white hover:bg-[#004eeb] ${BUTTON_SKEUO}`}
            >
              {primaryLabel}
              <ArrowRight size={15} />
            </Link>
          )
        ) : (
          <button
            type="button"
            onClick={() => {
              if (!engagement) return
              if (isExpert) {
                onOpenChange(engagement.id)
              } else {
                onToggleCalendar()
              }
            }}
            disabled={primaryDisabled}
            title={!hasEngagement ? 'Select an engagement first' : undefined}
            className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[13px] font-semibold text-white hover:bg-[#004eeb] disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_SKEUO}`}
          >
            {primaryLabel}
            {isBuyer ? <ChevronDown size={15} className={isCalendarOpen ? 'rotate-180 transition-transform' : 'transition-transform'} /> : <ArrowRight size={15} />}
          </button>
        )}
        {!isBuyer && !isAdminTest && (
          onConnectCalendar ? (
            <button
              type="button"
              onClick={onConnectCalendar}
              className="inline-flex items-center gap-[8px] rounded-[8px] border border-[#c7d7fe] bg-white px-[14px] py-[10px] text-[13px] font-semibold text-[#155eef] hover:bg-[#eff4ff]"
            >
              <Settings2 size={15} /> Connect calendar
            </button>
          ) : (
            <Link
              href={settingsHref}
              className="inline-flex items-center gap-[8px] rounded-[8px] border border-[#c7d7fe] bg-white px-[14px] py-[10px] text-[13px] font-semibold text-[#155eef] hover:bg-[#eff4ff]"
            >
              <Settings2 size={15} /> Connect calendar
            </Link>
          )
        )}
        {isBuyer && hasEngagement && (
          <button
            type="button"
            onClick={() => engagement && onOpenChange(engagement.id)}
            disabled={!isActiveEngagement}
            title={!isActiveEngagement ? 'Engagement is not active' : 'Show pending requests for this engagement'}
            className="inline-flex items-center gap-[8px] rounded-[8px] border border-[#c7d7fe] bg-white px-[14px] py-[10px] text-[13px] font-semibold text-[#155eef] hover:bg-[#eff4ff] disabled:cursor-not-allowed disabled:opacity-50"
          >
            View pending requests
            <ArrowRight size={15} />
          </button>
        )}
      </div>
    </section>
  )
}
