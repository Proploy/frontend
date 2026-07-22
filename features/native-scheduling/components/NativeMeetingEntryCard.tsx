'use client'

import Link from 'next/link'
import { ArrowRight, CalendarDays, Settings2 } from 'lucide-react'
import { BUTTON_SKEUO, CARD_SHADOW } from '@/components/workspace/WorkspaceShell'
import type { WorkspaceRole } from '@/features/workspace/types'
import { buildWorkspaceSettingsHref } from '@/features/workspace/settings-navigation'
import { nativeSchedulingAccessForRole } from '@/features/native-scheduling/access'

export function NativeMeetingEntryCard({ role }: { role: WorkspaceRole | null }) {
  const isBuyer = role === 'buyer'
  const isAdminTest = nativeSchedulingAccessForRole(role) === 'test_only'
  const settingsHref = buildWorkspaceSettingsHref('scheduling')

  return (
    <section className={`flex flex-col gap-[16px] rounded-[16px] border border-[#dbe5ff] bg-[#f5f8ff] p-[20px] ${CARD_SHADOW}`}>
      <div className="flex items-start gap-[10px]">
        <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[10px] bg-white text-[#155eef]">
          <CalendarDays size={19} />
        </span>
        <div>
          <h2 className="text-[16px] font-semibold leading-[24px] text-[#181d27]">Native Google Calendar meetings</h2>
          <p className="mt-[2px] text-[13px] leading-[20px] text-[#535862]">
            {isBuyer
              ? 'Choose a free period from an active engagement and send the expert a booking request.'
              : isAdminTest
                ? 'Use this test-only entry point to review the expert-owned Google Calendar connection flow.'
                : 'Approve a request to create the Google Calendar event and Google Meet link.'}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-[8px]">
        <Link
          href={isBuyer ? '/workspace/engagements' : isAdminTest ? settingsHref : '/workspace/requests'}
          className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[13px] font-semibold text-white hover:bg-[#004eeb] ${BUTTON_SKEUO}`}
        >
          {isBuyer ? 'Choose a free slot' : isAdminTest ? 'Connect calendar (test only)' : 'Review booking requests'}
          <ArrowRight size={15} />
        </Link>
        {!isBuyer && !isAdminTest && (
          <Link
            href={settingsHref}
            className="inline-flex items-center gap-[8px] rounded-[8px] border border-[#c7d7fe] bg-white px-[14px] py-[10px] text-[13px] font-semibold text-[#155eef] hover:bg-[#eff4ff]"
          >
            <Settings2 size={15} /> Connect calendar
          </Link>
        )}
      </div>
    </section>
  )
}
