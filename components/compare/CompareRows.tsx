'use client'

// components/compare/CompareRows.tsx — row definitions + special tab content
// Ported from the design prototype (rows.jsx).

import React from 'react'
import { Icon, LogoTile, Pill, Chip, YesNo, NoData, ScoreRing, Btn, type PillTone } from './CompareUI'
import { PATH_META, type Entity, type Complexity, type Tab, type AlternativeEntity } from '@/lib/compare/data'

export interface Row {
  label: string
  sub?: string
  cell: (e: Entity) => React.ReactNode
  best?: (es: Entity[]) => string | undefined
  full?: boolean
  note?: boolean
  highlight?: boolean
}

// helpers ------------------------------------------------------------------
export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-[6px]">
      <span className="inline-flex gap-px">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = rating - i
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              <Icon name="star" size={size} color="#e9eaeb" style={{ position: 'absolute', inset: 0 }} />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${Math.max(0, Math.min(1, fill)) * 100}%` }}
              >
                <Icon name="star" size={size} color="#fec84b" style={{ fill: '#fec84b' }} />
              </span>
            </span>
          )
        })}
      </span>
      <span className="font-[family-name:var(--font-dm-sans)] font-bold" style={{ fontSize: 14, color: '#181d27' }}>
        {rating.toFixed(1)}
      </span>
    </span>
  )
}

export function ChipList({ items, tone = 'neutral', max }: { items: string[]; tone?: PillTone; max?: number }) {
  const shown = max ? items.slice(0, max) : items
  const extra = max && items.length > max ? items.length - max : 0
  return (
    <div className="flex flex-wrap gap-[6px]">
      {shown.map((it, i) => <Chip key={i} tone={tone}>{it}</Chip>)}
      {extra > 0 && <Chip tone="neutral">+{extra} more</Chip>}
    </div>
  )
}

const complexityTone = (c: Complexity): PillTone => (({ Low: 'success', Medium: 'warning', High: 'error' } as const)[c] || 'neutral')
const riskTone = (r: Complexity): PillTone => (({ Low: 'success', Medium: 'warning', High: 'error' } as const)[r] || 'neutral')
const txt = (s: React.ReactNode) => <span style={{ fontSize: 14, lineHeight: '21px', color: '#414651' }}>{s}</span>
const priceNum = (e: Entity) => parseFloat(e.entryPrice.replace(/[^0-9.]/g, '')) || 9999

// pricing model badge
export function PriceBucket({ bucket }: { bucket: string }) {
  const filled = bucket.length
  return (
    <span className="inline-flex items-center gap-px font-[family-name:var(--font-dm-sans)] font-bold" style={{ fontSize: 15 }}>
      {[1, 2, 3, 4].map((i) => <span key={i} style={{ color: i <= filled ? '#155eef' : '#d5d7da' }}>$</span>)}
    </span>
  )
}

// recommended path card
export function PathCard({ entity }: { entity: Entity }) {
  const tiers = ['Self-serve', 'Guided setup', 'Expert-led implementation', 'White-glove project'] as const
  const active = entity.recommendedPath
  return (
    <div className="flex flex-col gap-[8px] w-full">
      <div className="flex flex-col gap-[4px]">
        {tiers.map((t) => {
          const on = t === active
          return (
            <div
              key={t}
              className="flex items-center gap-[8px]"
              style={{ padding: '7px 10px', borderRadius: 8, background: on ? '#eff4ff' : '#fff', border: `1px solid ${on ? '#b2ccff' : '#f0f0f0'}` }}
            >
              <span
                className="shrink-0"
                style={{ width: 16, height: 16, borderRadius: 9999, border: `${on ? 5 : 1.5}px solid ${on ? '#155eef' : '#d5d7da'}`, background: '#fff', transition: 'all 150ms' }}
              />
              <span
                className="font-[family-name:var(--font-dm-sans)] whitespace-nowrap"
                style={{ fontWeight: on ? 700 : 500, fontSize: 13.5, color: on ? '#004eeb' : '#717680' }}
              >
                {t}
              </span>
              {on && <Pill tone="brand">Recommended</Pill>}
            </div>
          )
        })}
      </div>
      <p style={{ margin: 0, fontSize: 12.5, lineHeight: '18px', color: '#717680' }}>{PATH_META[active].blurb}</p>
    </div>
  )
}

export function ImplCtas() {
  return (
    <div className="flex flex-col gap-[8px] w-full">
      <Btn variant="primary" size="sm" icon="users" full>View vetted experts</Btn>
      <Btn variant="secondary" size="sm" icon="msg" full>Request implementation help</Btn>
    </div>
  )
}

export function AltCard({ alt }: { alt: AlternativeEntity }) {
  const hasRating = typeof alt.rating === 'number' && alt.rating > 0

  return (
    <div className="flex items-center gap-[10px]" style={{ padding: '9px 10px', borderRadius: 10, border: '1px solid #e9eaeb', background: '#fff' }}>
      <LogoTile initial={alt.initial} tone="brand" size={32} logoUrl={alt.logoUrl} />
      <div className="min-w-0 flex-1">
        <div
          className="font-[family-name:var(--font-dm-sans)] font-semibold whitespace-nowrap overflow-hidden text-ellipsis"
          style={{ fontSize: 13.5, color: '#181d27' }}
        >
          {alt.name}
        </div>
        <div className="flex items-center gap-[6px]" style={{ fontSize: 12, color: '#717680' }}>
          <span className="whitespace-nowrap overflow-hidden text-ellipsis">{alt.category}</span>
          {hasRating && (
            <>
              <span>·</span>
              <span className="inline-flex items-center gap-[2px] font-semibold" style={{ color: '#414651' }}>
                <Icon name="star" size={11} color="#fec84b" style={{ fill: '#fec84b' }} />{alt.rating}
              </span>
            </>
          )}
        </div>
      </div>
      <button
        aria-label="Add to comparison"
        className="shrink-0 flex items-center justify-center cursor-pointer"
        style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid #d5d7da', background: '#fff', boxShadow: 'var(--shadow-xs)' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#eff4ff'; e.currentTarget.style.borderColor = '#b2ccff' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#d5d7da' }}
      >
        <Icon name="plus" size={15} color="#155eef" />
      </button>
    </div>
  )
}

// ---- ROW DEFINITIONS PER TAB ---------------------------------------------
export function buildRows(tab: Tab | string): Row[] {
  const order: Record<Complexity, number> = { Low: 1, Medium: 2, High: 3 }
  const lowestComplexity = (es: Entity[]) => [...es].sort((a, b) => order[a.implComplexity] - order[b.implComplexity])[0]?.id
  const map: Record<string, Row[]> = {
    'At a glance': [
      { label: 'Rating / reviews', cell: (e) => <div className="flex flex-col gap-[3px]"><Stars rating={e.rating} /><span style={{ fontSize: 12.5, color: '#717680' }}>{e.reviewCount.toLocaleString()} reviews</span></div>, best: (es) => [...es].sort((a, b) => b.rating - a.rating)[0]?.id },
      { label: 'Best for', cell: (e) => txt(e.bestFor) },
      { label: 'Not ideal for', cell: (e) => <span style={{ fontSize: 14, lineHeight: '21px', color: '#717680' }}>{e.notFor}</span> },
      { label: 'Market segment', cell: (e) => txt(e.segment) },
      { label: 'Category', cell: (e) => <Chip tone="neutral">{e.category}</Chip> },
      { label: 'Pricing', cell: (e) => <div className="flex items-center gap-[8px]"><PriceBucket bucket={e.pricingBucket} /><span style={{ fontSize: 13, color: '#717680' }}>from {e.entryPrice}{e.priceUnit}</span></div> },
      { label: 'Free trial / free plan', cell: (e) => <div className="flex flex-col gap-[6px]"><YesNo value={e.freeTrial} yes="Free trial" no="No trial" /><YesNo value={e.freePlan} yes="Free plan" no="No free plan" /></div> },
      { label: 'Implementation complexity', cell: (e) => <Pill tone={complexityTone(e.implComplexity)} dot>{e.implComplexity}</Pill>, best: lowestComplexity },
      { label: 'Proploy fit score', sub: 'Scored against your filters', cell: (e) => <ScoreRing value={e.fitScore} />, best: (es) => [...es].sort((a, b) => b.fitScore - a.fitScore)[0]?.id },
    ],
    Pricing: [
      { label: 'Entry price', cell: (e) => <div><span className="font-[family-name:var(--font-dm-sans)] font-bold" style={{ fontSize: 22, color: '#181d27', letterSpacing: '-0.01em' }}>{e.entryPrice}</span><span style={{ fontSize: 13, color: '#717680' }}> {e.priceUnit}</span></div>, best: (es) => [...es].sort((a, b) => priceNum(a) - priceNum(b))[0]?.id },
      { label: 'Pricing model', cell: (e) => txt(e.pricingModel) },
      { label: 'Free trial', cell: (e) => <YesNo value={e.freeTrial} /> },
      { label: 'Free plan', cell: (e) => <YesNo value={e.freePlan} /> },
      { label: 'Contact sales required', cell: (e) => <YesNo value={e.contactSales} yes="Required" no="Self-checkout" /> },
      { label: 'Key limits', cell: (e) => <span style={{ fontSize: 13.5, lineHeight: '20px', color: '#717680' }}>{e.keyLimits}</span> },
      { note: true, full: true, label: '', cell: () => <p className="flex items-center gap-[7px] italic" style={{ margin: 0, fontSize: 13, color: '#717680' }}><Icon name="info" size={14} color="#a4a7ae" />Pricing can vary by scope when expert implementation is involved. Listed prices are software-only.</p> },
    ],
    Fit: [
      { label: 'Team size', cell: (e) => txt(e.fit.teamSize) },
      { label: 'Industry fit', cell: (e) => txt(e.fit.industryFit) },
      { label: 'Workflows supported', cell: (e) => <ChipList items={e.fit.workflows} tone="brand" /> },
      { label: 'Integrations', cell: (e) => <ChipList items={e.fit.integrations} tone="neutral" max={4} /> },
      { label: 'Compliance / security', cell: (e) => <ChipList items={e.fit.compliance} tone="success" /> },
      { label: 'Deployment model', cell: (e) => txt(e.fit.deployment) },
      { label: 'Buyer fit verdict', highlight: true, cell: (e) => <span className="font-medium" style={{ fontSize: 14, lineHeight: '21px', color: '#181d27' }}>{e.fit.verdict}</span> },
    ],
    Implementation: [
      { label: 'Implementation difficulty', cell: (e) => <Pill tone={complexityTone(e.implComplexity)} dot>{e.implComplexity}</Pill>, best: lowestComplexity },
      { label: 'Onboarding effort', cell: (e) => txt(e.onboardingEffort) },
      { label: 'Admin skill required', cell: (e) => txt(e.adminSkill) },
      { label: 'Migration risk', cell: (e) => <Pill tone={riskTone(e.migrationRisk)} dot>{e.migrationRisk}</Pill>, best: (es) => [...es].sort((a, b) => order[a.migrationRisk] - order[b.migrationRisk])[0]?.id },
      { label: 'Recommended expert path', cell: (e) => <PathCard entity={e} /> },
      { label: 'Take action', cell: () => <ImplCtas /> },
    ],
    Reviews: [
      { label: 'Rating', cell: (e) => <Stars rating={e.rating} size={16} />, best: (es) => [...es].sort((a, b) => b.rating - a.rating)[0]?.id },
      { label: 'Review source', cell: (e) => <Chip tone="neutral">{e.reviewSource}</Chip> },
      { label: 'Review count', cell: (e) => <span className="font-[family-name:var(--font-dm-sans)] font-bold" style={{ fontSize: 16, color: '#181d27' }}>{e.reviewCount.toLocaleString()}</span> },
      { label: 'Reviewer company size', cell: (e) => txt(e.reviews.reviewerSegment) },
      { label: 'Reviewer industry', cell: (e) => txt(e.reviews.reviewerIndustry) },
      { label: 'Pros', cell: (e) => <ChipList items={e.reviews.pros} tone="success" /> },
      { label: 'Cons', cell: (e) => <ChipList items={e.reviews.cons} tone="warning" /> },
      { label: 'Verified outcomes', cell: (e) => e.reviews.outcomes ? <div className="flex flex-col gap-[6px]">{e.reviews.outcomes.map((o, i) => <span key={i} className="inline-flex items-center gap-[7px] font-medium" style={{ fontSize: 13.5, color: '#067647' }}><Icon name="check" size={14} color="#079455" strokeWidth={3} />{o}</span>)}</div> : <NoData /> },
    ],
  }
  return map[tab] || []
}
