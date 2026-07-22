'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Sparkles, Star } from 'lucide-react'
import { BusinessPage, BusinessPageHeader, BUTTON_SKEUO } from '@/components/business/dashboard/BusinessDashboardFrame'
import { Avatar, SectionCard } from '@/components/business/dashboard/ui'
import { CATEGORIES, SCOPES, TIMELINES, estimate, formatUsd } from '@/lib/hiring-estimator'
import { addLead, notify } from '@/lib/demo/demo-store'

const STEPS = ['Project', 'Requirements', 'Budget & timeline', 'Review']

const REQUIREMENTS = [
  'Data migration', 'Custom integrations', 'Reporting & dashboards', 'User training',
  'Change management', 'Ongoing support', 'Security review', 'Phased rollout',
]

const MATCHES = [
  { name: 'Avery Mock', initial: 'A', brand: '#155eef', headline: 'Salesforce & HubSpot lead', rating: 4.9, match: 96 },
  { name: 'Daniel Okafor', initial: 'D', brand: '#7f56d9', headline: 'NetSuite ERP architect', rating: 4.8, match: 91 },
  { name: 'Mei Lin', initial: 'M', brand: '#dd2590', headline: 'Snowflake + dbt specialist', rating: 5.0, match: 88 },
]

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-[12px] py-[6px] text-[13px] font-medium leading-[18px] transition-colors ${
        active ? 'border-[#155eef] bg-[#eff4ff] text-[#004eeb]' : 'border-[#d5d7da] bg-white text-[#414651] hover:bg-[#fafafa]'
      }`}
    >
      {children}
    </button>
  )
}

export default function BriefBuilderPage() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id)
  const [scopeId, setScopeId] = useState('standard')
  const [timelineId, setTimelineId] = useState('standard')
  const [reqs, setReqs] = useState<Set<string>>(new Set(['Data migration', 'Reporting & dashboards']))

  const category = CATEGORIES.find((c) => c.id === categoryId)!
  const scope = SCOPES.find((s) => s.id === scopeId)!
  const timeline = TIMELINES.find((t) => t.id === timelineId)!
  const est = estimate(category, scope, timeline)

  const toggleReq = (r: string) =>
    setReqs((prev) => {
      const next = new Set(prev)
      if (next.has(r)) next.delete(r)
      else next.add(r)
      return next
    })

  const postBrief = () => {
    const briefTitle = title.trim() || `${category.label.split(' (')[0]} implementation`
    addLead({
      title: briefTitle,
      category: category.label.split(' (')[0],
      scope: scope.label,
      timeline: timeline.label,
      budget: `${formatUsd(est.costLow)} – ${formatUsd(est.costHigh)}`,
    })
    notify({
      role: 'expert',
      kind: 'project',
      title: 'New brief matched to you',
      body: `${briefTitle} · ${scope.label} · est. ${formatUsd(est.costLow)}–${formatUsd(est.costHigh)}`,
      href: '/workspace/requests',
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <BusinessPage>
        <BusinessPageHeader title="Brief posted" subtitle="Matched experts are notified. You’ll get proposals as they respond — usually within two business days." />
        <div className="mt-[24px] flex flex-col gap-[24px]">
          <div className="flex items-center gap-[12px] rounded-[12px] border border-[#abefc6] bg-[#ecfdf3] px-[20px] py-[16px]">
            <span className="flex size-[40px] items-center justify-center rounded-full bg-[#dcfae6] text-[#067647]">
              <Check size={22} />
            </span>
            <div>
              <p className="font-semibold text-[15px] leading-[22px] text-[#181d27]">{title || `${category.label.split(' (')[0]} implementation`}</p>
              <p className="text-[13px] leading-[18px] text-[#535862]">
                {scope.label} · {timeline.label} · est. {formatUsd(est.costLow)}–{formatUsd(est.costHigh)} · {est.weeks} weeks
              </p>
            </div>
          </div>

          <SectionCard title="Top matches" action={{ label: 'Browse all', href: '/discover-experts' }}>
            <ul className="divide-y divide-[#f0f0f1]">
              {MATCHES.map((m) => (
                <li key={m.name} className="flex items-center gap-[12px] px-[20px] py-[16px]">
                  <Avatar initial={m.initial} color={m.brand} size={44} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-[8px]">
                      <p className="font-semibold text-[15px] leading-[22px] text-[#181d27]">{m.name}</p>
                      <span className="flex items-center gap-[3px] text-[13px] font-semibold text-[#181d27]">
                        <Star size={13} className="fill-[#f79009] text-[#f79009]" />
                        {m.rating}
                      </span>
                    </div>
                    <p className="truncate text-[13px] leading-[18px] text-[#717680]">{m.headline}</p>
                  </div>
                  <div className="flex items-center gap-[12px]">
                    <span className="inline-flex items-center gap-[4px] rounded-full bg-[#eff4ff] px-[10px] py-[3px] text-[12px] font-semibold text-[#004eeb]">
                      <Sparkles size={12} />
                      {m.match}% match
                    </span>
                    <Link href="/discover-experts" className="text-[13px] font-semibold text-[#004eeb] hover:text-[#155eef]">
                      Invite
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          <div>
            <Link
              href="/business/dashboard/projects"
              className={`inline-flex items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
            >
              Go to projects
            </Link>
          </div>
        </div>
      </BusinessPage>
    )
  }

  return (
    <BusinessPage>
      <BusinessPageHeader title="Post a brief" subtitle="Describe the work once. We match it to vetted experts who return fixed-bid proposals." />

      {/* Stepper */}
      <div className="mt-[20px] flex flex-wrap items-center gap-[8px]">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-[8px]">
            <span
              className={`flex size-[24px] items-center justify-center rounded-full text-[12px] font-semibold ${
                i < step ? 'bg-[#155eef] text-white' : i === step ? 'bg-[#eff4ff] text-[#004eeb] ring-1 ring-[#155eef]' : 'bg-[#f0f0f1] text-[#717680]'
              }`}
            >
              {i < step ? <Check size={13} /> : i + 1}
            </span>
            <span className={`text-[13px] font-medium ${i === step ? 'text-[#181d27]' : 'text-[#717680]'}`}>{s}</span>
            {i < STEPS.length - 1 && <span className="mx-[4px] hidden h-px w-[24px] bg-[#e9eaeb] sm:block" />}
          </div>
        ))}
      </div>

      <div className="mt-[20px]">
        <SectionCard className="p-[24px]">
          <div className="flex flex-col gap-[20px] p-[24px]">
            {step === 0 && (
              <>
                <label className="flex flex-col gap-[6px]">
                  <span className="text-[13px] font-medium text-[#414651]">Project title</span>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Salesforce rollout for the sales org"
                    className={`rounded-[8px] border border-[#d5d7da] px-[12px] py-[10px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`}
                  />
                </label>
                <div className="flex flex-col gap-[8px]">
                  <span className="text-[13px] font-medium text-[#414651]">Software category</span>
                  <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2">
                    {CATEGORIES.map((c) => {
                      const Icon = c.icon
                      const active = c.id === categoryId
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setCategoryId(c.id)}
                          className={`flex items-center gap-[12px] rounded-[10px] border px-[14px] py-[12px] text-left transition-colors ${
                            active ? 'border-[#155eef] bg-[#f5f8ff] ring-1 ring-[#155eef]' : 'border-[#e9eaeb] bg-white hover:bg-[#fafafa]'
                          }`}
                        >
                          <span className={`flex size-[32px] items-center justify-center rounded-[8px] ${active ? 'bg-[#155eef] text-white' : 'bg-[#f5f8ff] text-[#155eef]'}`}>
                            <Icon size={17} />
                          </span>
                          <span className="text-[14px] font-medium text-[#252b37]">{c.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="flex flex-col gap-[8px]">
                  <span className="text-[13px] font-medium text-[#414651]">Project scope</span>
                  <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2">
                    {SCOPES.map((s) => {
                      const active = s.id === scopeId
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setScopeId(s.id)}
                          className={`flex flex-col gap-[2px] rounded-[10px] border px-[14px] py-[12px] text-left transition-colors ${
                            active ? 'border-[#155eef] bg-[#f5f8ff] ring-1 ring-[#155eef]' : 'border-[#e9eaeb] bg-white hover:bg-[#fafafa]'
                          }`}
                        >
                          <span className="text-[14px] font-medium text-[#252b37]">{s.label}</span>
                          <span className="text-[13px] text-[#717680]">{s.blurb}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="flex flex-col gap-[8px]">
                  <span className="text-[13px] font-medium text-[#414651]">Must-haves</span>
                  <div className="flex flex-wrap gap-[8px]">
                    {REQUIREMENTS.map((r) => (
                      <Chip key={r} active={reqs.has(r)} onClick={() => toggleReq(r)}>{r}</Chip>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="flex flex-col gap-[8px]">
                  <span className="text-[13px] font-medium text-[#414651]">Timeline</span>
                  <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-3">
                    {TIMELINES.map((t) => {
                      const active = t.id === timelineId
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTimelineId(t.id)}
                          className={`flex flex-col gap-[2px] rounded-[10px] border px-[14px] py-[12px] text-left transition-colors ${
                            active ? 'border-[#155eef] bg-[#f5f8ff] ring-1 ring-[#155eef]' : 'border-[#e9eaeb] bg-white hover:bg-[#fafafa]'
                          }`}
                        >
                          <span className="text-[14px] font-medium text-[#252b37]">{t.label}</span>
                          <span className="text-[13px] text-[#717680]">{t.blurb}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] p-[16px]">
                  <p className="text-[13px] text-[#717680]">Estimated budget</p>
                  <p className="font-semibold text-[28px] leading-[36px] text-[#181d27] tracking-[-0.02em]">
                    {formatUsd(est.costLow)} – {formatUsd(est.costHigh)}
                  </p>
                  <p className="text-[13px] text-[#717680]">{est.weeks} weeks to live · fixed-bid or milestone billing</p>
                </div>
              </>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-[12px]">
                <Row label="Title" value={title || `${category.label.split(' (')[0]} implementation`} />
                <Row label="Category" value={category.label} />
                <Row label="Scope" value={scope.label} />
                <Row label="Timeline" value={timeline.label} />
                <Row label="Must-haves" value={[...reqs].join(', ') || '—'} />
                <Row label="Estimated budget" value={`${formatUsd(est.costLow)} – ${formatUsd(est.costHigh)}`} />
                <Row label="Time to live" value={`${est.weeks} weeks`} />
              </div>
            )}
          </div>

          {/* Footer nav */}
          <div className="flex items-center justify-between border-t border-[#f0f0f1] px-[24px] py-[16px]">
            <button
              type="button"
              onClick={() => (step === 0 ? null : setStep(step - 1))}
              disabled={step === 0}
              className={`inline-flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] disabled:opacity-40 ${BUTTON_SKEUO}`}
            >
              <ArrowLeft size={16} />
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className={`inline-flex items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
              >
                Continue
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={postBrief}
                className={`inline-flex items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
              >
                <Check size={16} />
                Post brief
              </button>
            )}
          </div>
        </SectionCard>
      </div>
    </BusinessPage>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-[16px] border-b border-[#f0f0f1] pb-[10px] last:border-0">
      <span className="text-[13px] text-[#717680]">{label}</span>
      <span className="max-w-[70%] text-right text-[14px] font-medium text-[#181d27]">{value}</span>
    </div>
  )
}
