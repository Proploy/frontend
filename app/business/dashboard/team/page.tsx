'use client'

import { FileSignature, Plus } from 'lucide-react'
import { BusinessPage, BusinessPageHeader, BUTTON_SKEUO } from '@/components/business/dashboard/BusinessDashboardFrame'
import { Avatar, SectionCard } from '@/components/business/dashboard/ui'
import { MOCK_BUSINESS_DASHBOARD } from '@/lib/service-apis/business-dashboard-mock'
import type { BusinessContract, TeamMember } from '@/lib/service-apis/business-dashboard-mock'

const ROLE_STYLE: Record<TeamMember['role'], { text: string; bg: string }> = {
  Owner: { text: '#004eeb', bg: '#eff4ff' },
  Admin: { text: '#6941c6', bg: '#f4f3ff' },
  Member: { text: '#414651', bg: '#f5f5f5' },
  Billing: { text: '#b54708', bg: '#fffaeb' },
}

const CONTRACT_STYLE: Record<BusinessContract['status'], { text: string; bg: string }> = {
  Signed: { text: '#067647', bg: '#ecfdf3' },
  'Awaiting signature': { text: '#b54708', bg: '#fffaeb' },
  Draft: { text: '#414651', bg: '#f5f5f5' },
}

export default function BusinessTeamPage() {
  const d = MOCK_BUSINESS_DASHBOARD

  return (
    <BusinessPage>
      <BusinessPageHeader
        title="Team"
        subtitle="Manage who can view projects, approve spend, and message experts — plus every signed contract in one place."
        actions={
          <button
            type="button"
            className={`flex items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
          >
            <Plus size={16} />
            Invite member
          </button>
        }
      />

      <div className="mt-[24px] grid grid-cols-1 gap-[24px] lg:grid-cols-2">
        {/* Members */}
        <SectionCard title={`Members · ${d.team.length}`}>
          <ul className="divide-y divide-[#f0f0f1]">
            {d.team.map((m) => {
              const s = ROLE_STYLE[m.role]
              return (
                <li key={m.email} className="flex items-center gap-[12px] px-[20px] py-[14px]">
                  <Avatar initial={m.name.charAt(0)} color={m.brand} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-[14px] leading-[20px] text-[#181d27]">{m.name}</p>
                    <p className="truncate text-[13px] leading-[18px] text-[#717680]">{m.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-[4px]">
                    <span className="rounded-full px-[8px] py-[2px] text-[12px] font-semibold leading-[18px]" style={{ color: s.text, background: s.bg }}>
                      {m.role}
                    </span>
                    <span className="text-[12px] text-[#717680]">{m.projects} projects</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </SectionCard>

        {/* Contracts */}
        <SectionCard title="Contracts">
          <ul className="divide-y divide-[#f0f0f1]">
            {d.contracts.map((c) => {
              const s = CONTRACT_STYLE[c.status]
              return (
                <li key={c.id} className="flex items-center gap-[12px] px-[20px] py-[14px]">
                  <span className="flex size-[36px] shrink-0 items-center justify-center rounded-[8px] bg-[#f5f8ff] text-[#155eef]">
                    <FileSignature size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-[14px] leading-[20px] text-[#181d27]">{c.title}</p>
                    <p className="text-[12px] leading-[18px] text-[#717680]">{c.expert} · {c.value}</p>
                  </div>
                  <span className="rounded-full px-[8px] py-[2px] text-[12px] font-semibold leading-[18px]" style={{ color: s.text, background: s.bg }}>
                    {c.status}
                  </span>
                </li>
              )
            })}
          </ul>
        </SectionCard>
      </div>
    </BusinessPage>
  )
}
