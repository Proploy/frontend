'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Clock3, Gauge, Star } from 'lucide-react'
import { BusinessPage, BusinessPageHeader, BUTTON_SKEUO } from '@/components/business/dashboard/BusinessDashboardFrame'
import { Avatar, SectionCard } from '@/components/business/dashboard/ui'
import {
  CATEGORIES,
  SCOPES,
  TIMELINES,
  estimate,
  formatUsd,
} from '@/lib/hiring-estimator'

const SHORTLIST = [
  { name: 'Avery Mock', initial: 'A', brand: '#155eef', headline: 'Salesforce & HubSpot lead', rating: 4.9, projects: 42, rate: '$140/hr', tags: ['CRM', 'Fintech'] },
  { name: 'Daniel Okafor', initial: 'D', brand: '#7f56d9', headline: 'NetSuite ERP architect', rating: 4.8, projects: 31, rate: '$165/hr', tags: ['ERP', 'Finance ops'] },
  { name: 'Mei Lin', initial: 'M', brand: '#dd2590', headline: 'Snowflake + dbt specialist', rating: 5.0, projects: 27, rate: '$155/hr', tags: ['Data', 'Analytics'] },
  { name: 'Carlos Mendez', initial: 'C', brand: '#0e9384', headline: 'iPaaS / integrations engineer', rating: 4.7, projects: 38, rate: '$130/hr', tags: ['Workato', 'MuleSoft'] },
]

function OptionGrid<T extends { id: string }>({
  options,
  value,
  onChange,
  render,
  columns,
}: {
  options: T[]
  value: string
  onChange: (id: string) => void
  render: (opt: T, active: boolean) => React.ReactNode
  columns: string
}) {
  return (
    <div className={`grid gap-[10px] ${columns}`}>
      {options.map((opt) => {
        const active = opt.id === value
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.id)}
            className={`text-left rounded-[10px] border px-[14px] py-[12px] transition-colors ${
              active ? 'border-[#155eef] bg-[#f5f8ff] ring-1 ring-[#155eef]' : 'border-[#e9eaeb] bg-white hover:bg-[#fafafa]'
            }`}
          >
            {render(opt, active)}
          </button>
        )
      })}
    </div>
  )
}

function Estimator() {
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id)
  const [scopeId, setScopeId] = useState('standard')
  const [timelineId, setTimelineId] = useState('standard')

  const category = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0]
  const scope = SCOPES.find((s) => s.id === scopeId) ?? SCOPES[1]
  const timeline = TIMELINES.find((t) => t.id === timelineId) ?? TIMELINES[0]
  const result = useMemo(() => estimate(category, scope, timeline), [category, scope, timeline])

  return (
    <div className="grid grid-cols-1 overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col gap-[24px] p-[20px] md:p-[24px]">
        <div className="flex flex-col gap-[12px]">
          <span className="font-semibold text-[14px] leading-[20px] text-[#181d27]">Software category</span>
          <OptionGrid
            options={CATEGORIES}
            value={categoryId}
            onChange={setCategoryId}
            columns="grid-cols-1"
            render={(opt, active) => {
              const Icon = opt.icon
              return (
                <span className="flex items-center gap-[12px]">
                  <span className={`flex size-[32px] shrink-0 items-center justify-center rounded-[8px] ${active ? 'bg-[#155eef] text-white' : 'bg-[#f5f8ff] text-[#155eef]'}`}>
                    <Icon size={17} />
                  </span>
                  <span className="text-[14px] font-medium leading-[20px] text-[#252b37]">{opt.label}</span>
                </span>
              )
            }}
          />
        </div>
        <div className="flex flex-col gap-[12px]">
          <span className="font-semibold text-[14px] leading-[20px] text-[#181d27]">Project scope</span>
          <OptionGrid
            options={SCOPES}
            value={scopeId}
            onChange={setScopeId}
            columns="grid-cols-1 sm:grid-cols-2"
            render={(opt) => (
              <span className="flex flex-col gap-[2px]">
                <span className="text-[14px] font-medium leading-[20px] text-[#252b37]">{opt.label}</span>
                <span className="text-[13px] leading-[18px] text-[#717680]">{opt.blurb}</span>
              </span>
            )}
          />
        </div>
        <div className="flex flex-col gap-[12px]">
          <span className="font-semibold text-[14px] leading-[20px] text-[#181d27]">Timeline</span>
          <OptionGrid
            options={TIMELINES}
            value={timelineId}
            onChange={setTimelineId}
            columns="grid-cols-1 sm:grid-cols-3"
            render={(opt) => (
              <span className="flex flex-col gap-[2px]">
                <span className="text-[14px] font-medium leading-[20px] text-[#252b37]">{opt.label}</span>
                <span className="text-[13px] leading-[18px] text-[#717680]">{opt.blurb}</span>
              </span>
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-[20px] border-t border-[#e9eaeb] bg-[#fafafa] p-[20px] md:p-[24px] lg:border-l lg:border-t-0">
        <div className="flex flex-col gap-[4px]">
          <p className="font-semibold text-[14px] leading-[20px] text-[#535862]">Estimated total cost</p>
          <p className="font-semibold text-[32px] leading-[40px] text-[#181d27] tracking-[-0.02em]" style={{ textWrap: 'balance' }}>
            {formatUsd(result.costLow)} – {formatUsd(result.costHigh)}
          </p>
          <p className="text-[13px] leading-[18px] text-[#717680]">
            Midpoint {formatUsd(Math.round(result.mid / 1000) * 1000)} · fixed-bid or milestone billing
          </p>
        </div>
        <div className="grid grid-cols-2 gap-[12px]">
          <div className="rounded-[10px] border border-[#e9eaeb] bg-white p-[16px]">
            <span className="flex items-center gap-[6px] text-[13px] leading-[18px] text-[#717680]"><Clock3 size={15} /> Time to live</span>
            <p className="mt-[6px] font-semibold text-[24px] leading-[32px] text-[#181d27]">{result.weeks} weeks</p>
          </div>
          <div className="rounded-[10px] border border-[#e9eaeb] bg-white p-[16px]">
            <span className="flex items-center gap-[6px] text-[13px] leading-[18px] text-[#717680]"><Gauge size={15} /> Timeline</span>
            <p className="mt-[6px] font-semibold text-[24px] leading-[32px] text-[#181d27]">{timeline.label}</p>
          </div>
        </div>
        <Link
          href="/business/dashboard/hire/brief"
          className={`flex items-center justify-center gap-[6px] rounded-[8px] bg-[#155eef] px-[14px] py-[11px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
        >
          Post this brief to matched experts
        </Link>
        <p className="text-[12px] leading-[18px] text-[#717680]">
          Estimates are directional. A vetted expert confirms scope and a fixed quote before any work begins.
        </p>
      </div>
    </div>
  )
}

export default function BusinessHirePage() {
  return (
    <BusinessPage>
      <BusinessPageHeader
        title="Find experts"
        subtitle="Scope the work, see a grounded estimate, and shortlist vetted implementation experts — then post one brief and let matches come to you."
      />

      <div className="mt-[24px] flex flex-col gap-[24px]">
        <SectionCard title="Estimate your rollout" className="overflow-hidden">
          <Estimator />
        </SectionCard>

        <SectionCard title="Matched experts" action={{ label: 'Browse all', href: '/discover-experts' }}>
          <ul className="grid grid-cols-1 gap-px bg-[#f0f0f1] sm:grid-cols-2">
            {SHORTLIST.map((e) => (
              <li key={e.name} className="flex flex-col gap-[12px] bg-white p-[20px]">
                <div className="flex items-start gap-[12px]">
                  <Avatar initial={e.initial} color={e.brand} size={44} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-[8px]">
                      <p className="truncate font-semibold text-[15px] leading-[22px] text-[#181d27]">{e.name}</p>
                      <span className="flex shrink-0 items-center gap-[3px] text-[13px] font-semibold text-[#181d27]">
                        <Star size={13} className="fill-[#f79009] text-[#f79009]" />
                        {e.rating}
                      </span>
                    </div>
                    <p className="truncate text-[13px] leading-[18px] text-[#717680]">{e.headline}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-[6px]">
                  {e.tags.map((t) => (
                    <span key={t} className="rounded-full border border-[#b2ccff] bg-[#eff4ff] px-[8px] py-[2px] text-[12px] font-medium text-[#004eeb]">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#717680]">{e.projects} projects · {e.rate}</span>
                  <Link href="/discover-experts" className="text-[13px] font-semibold text-[#004eeb] hover:text-[#155eef]">
                    View profile
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </BusinessPage>
  )
}
