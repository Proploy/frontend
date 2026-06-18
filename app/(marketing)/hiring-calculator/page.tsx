'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Calculator, Clock3, Database, Gauge, Plug } from 'lucide-react'
import {
  CTABanner,
  Container,
  SectionHeading,
  ThreeUpCards,
  btnPrimary,
  btnSecondary,
} from '@/components/marketing'
import { CATEGORIES, SCOPES, TIMELINES, estimate, formatUsd } from '@/lib/hiring-estimator'

/**
 * Interactive hiring/implementation cost & timeline estimator.
 * All math runs client-side from the three inputs below — see `estimate()` in
 * `@/lib/hiring-estimator`, the shared model also used by the business dashboard.
 */

/* ----------------------------------------------------------------- ui bits */

function FieldLabel({ children, hint }: { children: string; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-[12px]">
      <span className="font-semibold text-[14px] leading-[20px] text-[#181d27]">{children}</span>
      {hint && <span className="text-[13px] leading-[18px] text-[#717680]">{hint}</span>}
    </div>
  )
}

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
              active
                ? 'border-[#155eef] bg-[#f5f8ff] ring-1 ring-[#155eef]'
                : 'border-[#e9eaeb] bg-white hover:bg-[#fafafa]'
            }`}
          >
            {render(opt, active)}
          </button>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------- calculator */

function CalculatorCard() {
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id)
  const [scopeId, setScopeId] = useState('standard')
  const [timelineId, setTimelineId] = useState('standard')

  const category = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0]
  const scope = SCOPES.find((s) => s.id === scopeId) ?? SCOPES[1]
  const timeline = TIMELINES.find((t) => t.id === timelineId) ?? TIMELINES[0]

  const result = useMemo(() => estimate(category, scope, timeline), [category, scope, timeline])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] overflow-hidden rounded-[16px] border border-[#e9eaeb] bg-white">
      {/* inputs */}
      <div className="flex flex-col gap-[28px] p-[28px] md:p-[36px]">
        <div className="flex flex-col gap-[16px]">
          <FieldLabel hint="What you're implementing">Software category</FieldLabel>
          <OptionGrid
            options={CATEGORIES}
            value={categoryId}
            onChange={setCategoryId}
            columns="grid-cols-1"
            render={(opt, active) => {
              const Icon = opt.icon
              return (
                <span className="flex items-center gap-[12px]">
                  <span
                    className={`flex size-[34px] shrink-0 items-center justify-center rounded-[8px] ${
                      active ? 'bg-[#155eef] text-white' : 'bg-[#f5f8ff] text-[#155eef]'
                    }`}
                  >
                    <Icon size={18} />
                  </span>
                  <span className="text-[14px] font-medium leading-[20px] text-[#252b37]">{opt.label}</span>
                </span>
              )
            }}
          />
        </div>

        <div className="flex flex-col gap-[16px]">
          <FieldLabel hint="Org size & footprint">Project scope</FieldLabel>
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

        <div className="flex flex-col gap-[16px]">
          <FieldLabel hint="How fast you need it live">Timeline</FieldLabel>
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

      {/* output */}
      <div className="flex flex-col gap-[24px] border-t border-[#e9eaeb] bg-[#fafafa] p-[28px] md:p-[36px] lg:border-l lg:border-t-0">
        <div className="flex flex-col gap-[6px]">
          <span className="inline-flex w-fit items-center gap-[6px] rounded-full bg-[#eff4ff] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#155eef]">
            <span className="size-[6px] rounded-full bg-[#155eef]" /> Estimated engagement
          </span>
          <p className="text-[13px] leading-[18px] text-[#717680]">
            {category.label.split(' (')[0]} · {scope.label.toLowerCase()}
          </p>
        </div>

        <div className="flex flex-col gap-[4px]">
          <p className="font-semibold text-[14px] leading-[20px] text-[#535862]">Total project cost</p>
          <p
            className="font-semibold text-[36px] leading-[44px] text-[#181d27] tracking-[-0.72px]"
            style={{ textWrap: 'balance' }}
          >
            {formatUsd(result.costLow)} – {formatUsd(result.costHigh)}
          </p>
          <p className="text-[13px] leading-[18px] text-[#717680]">
            Midpoint {formatUsd(Math.round(result.mid / 1000) * 1000)} · fixed-bid or milestone billing
          </p>
        </div>

        <div className="grid grid-cols-2 gap-[12px]">
          <div className="rounded-[10px] border border-[#e9eaeb] bg-white p-[16px]">
            <span className="flex items-center gap-[6px] text-[13px] leading-[18px] text-[#717680]">
              <Clock3 size={15} /> Time to live
            </span>
            <p className="mt-[6px] font-semibold text-[24px] leading-[32px] text-[#181d27]">{result.weeks} weeks</p>
          </div>
          <div className="rounded-[10px] border border-[#e9eaeb] bg-white p-[16px]">
            <span className="flex items-center gap-[6px] text-[13px] leading-[18px] text-[#717680]">
              <Gauge size={15} /> Timeline
            </span>
            <p className="mt-[6px] font-semibold text-[24px] leading-[32px] text-[#181d27]">{timeline.label}</p>
          </div>
        </div>

        <div className="rounded-[10px] border border-[#e9eaeb] bg-white p-[16px]">
          <p className="font-semibold text-[13px] leading-[18px] text-[#181d27]">How we estimate this</p>
          <ul className="mt-[10px] flex flex-col gap-[7px]">
            {[
              [`${category.label.split(' (')[0]} baseline`, formatUsd(category.base)],
              ['Scope multiplier', `×${scope.factor}`],
              ['Timeline premium', `×${timeline.costFactor}`],
              ['Estimate band', '±18%'],
            ].map(([label, val]) => (
              <li key={label} className="flex items-center justify-between gap-[12px]">
                <span className="text-[13px] leading-[18px] text-[#535862]">{label}</span>
                <span className="text-[13px] font-medium leading-[18px] text-[#252b37]">{val}</span>
              </li>
            ))}
          </ul>
        </div>

        <Link href="/discover-experts" className={`${btnPrimary} w-full`}>
          Match me with vetted experts
        </Link>
        <p className="text-[12px] leading-[18px] text-[#717680]">
          Estimates are directional, based on typical Proploy engagements. A vetted expert confirms scope and a fixed
          quote before any work begins.
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export default function HiringCalculatorPage() {
  return (
    <>
      <section className="pt-[96px] pb-[56px]">
        <Container className="flex flex-col items-center gap-[24px] text-center">
          <span className="inline-flex items-center gap-[8px] rounded-full border border-[#e9eaeb] bg-white px-[14px] py-[6px] text-[14px] font-medium leading-[20px] text-[#414651]">
            <Calculator size={16} className="text-[#155eef]" /> Implementation calculator
          </span>
          <div className="max-w-[768px] flex flex-col gap-[20px]">
            <h1
              className="font-semibold text-[48px] leading-[60px] text-[#181d27] tracking-[-0.96px]"
              style={{ textWrap: 'balance' }}
            >
              What will your software rollout actually cost?
            </h1>
            <p className="font-normal text-[20px] leading-[30px] text-[#535862]">
              Get a grounded cost range and time-to-live in seconds. Pick a category, scope, and timeline — the
              estimate updates live, with the math shown in full.
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-[96px]">
        <Container>
          <CalculatorCard />
        </Container>
      </section>

      <ThreeUpCards
        heading="What actually drives the number"
        body="Three levers move most implementation budgets. Understanding them up front makes scoping with an expert far faster."
        cards={[
          {
            icon: <Database size={24} className="text-white" />,
            title: 'Data & migration complexity',
            body: 'Legacy systems, dirty records, and custom objects are where rollouts overrun. Clean, well-mapped data is the single biggest cost lever.',
          },
          {
            icon: <Plug size={24} className="text-white" />,
            title: 'Integrations & customization',
            body: 'Every system you connect and every off-the-shelf workflow you bend adds build and test time. Standard configuration ships fastest.',
          },
          {
            icon: <Clock3 size={24} className="text-white" />,
            title: 'Pace & change management',
            body: 'Compressing the timeline means more parallel staffing and a premium. Adoption and training carry real, often-missed cost too.',
          },
        ]}
      />

      <section className="pb-[96px]">
        <Container>
          <div className="flex flex-col items-start gap-[28px] rounded-[16px] border border-[#e9eaeb] bg-[#fafafa] p-[40px] md:flex-row md:items-center md:justify-between">
            <SectionHeading
              title="Want a real quote instead of a range?"
              body="Share your estimate with Proploy and we'll match you with vetted experts who scope the work and return a fixed bid — usually within two business days."
            />
            <div className="flex shrink-0 flex-wrap gap-[12px]">
              <Link href="/contact" className={btnSecondary}>
                Talk to our team
              </Link>
              <Link href="/discover-experts" className={btnPrimary}>
                Find experts
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <CTABanner
        variant="dark"
        title="Scope it once. Hire experts who've shipped it before."
        body="Every Proploy expert is vetted on real implementation outcomes — so your estimate becomes a delivery plan, not a gamble."
        primary={{ label: 'Match with experts', href: '/discover-experts' }}
        secondary={{ label: 'How Proploy works', href: '/for-businesses' }}
      />
    </>
  )
}
