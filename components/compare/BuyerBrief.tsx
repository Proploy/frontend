'use client'

// components/compare/BuyerBrief.tsx — "Proploy buyer brief" AI insight panel
// Ported from the design prototype (brief.jsx); derives insights from compared entities.

import React from 'react'
import { Icon, Pill, SKEUO, type IconName } from './CompareUI'
import { PATH_META, type Entity, type Complexity } from '@/lib/compare/data'

const ORDER: Record<Complexity, number> = { Low: 1, Medium: 2, High: 3 }

export function deriveBrief(entities: Entity[]) {
  if (entities.length === 0) return null
  const complexities = entities.map((e) => e.implComplexity)
  const easiest = [...entities].sort(
    (a, b) =>
      ORDER[a.implComplexity] - ORDER[b.implComplexity],
  )[0]
  const cheapest = [...entities].sort(
    (a, b) => parseFloat(a.entryPrice.replace(/[^0-9.]/g, '')) - parseFloat(b.entryPrice.replace(/[^0-9.]/g, '')),
  )[0]
  const riskiest = [...entities].sort((a, b) => ORDER[b.migrationRisk] - ORDER[a.migrationRisk])[0]
  const allSame = complexities.every((c) => c === complexities[0])
  const minComplexity = Math.min(...entities.map((e) => ORDER[e.implComplexity]))
  return {
    complexity: {
      v: allSame
        ? `All ${complexities[0].toLowerCase()}`
        : `${minComplexity === 1 ? 'Low' : 'Mixed'} → ${complexities.includes('High') ? 'High' : 'Medium'}`,
      d: allSame
        ? 'The selected products report the same implementation complexity.'
        : `${easiest.name} has the lightest implementation complexity among the selected products.`,
    },
    budget: { v: `From ${cheapest.entryPrice}`, d: `${cheapest.name} has the lowest entry price; implementation cost varies by scope.` },
    risk: {
      v: riskiest.migrationRisk === 'Low' ? 'Low overall' : `Highest on ${riskiest.name}`,
      d: `${riskiest.name} carries the most migration / admin risk.`,
    },
    action: { v: easiest.recommendedPath, d: `Recommended for ${easiest.name}: ${PATH_META[easiest.recommendedPath].blurb}` },
  }
}

function BriefRow({ icon, label, value, detail }: { icon: IconName; label: string; value: string; detail: string }) {
  return (
    <div className="flex gap-[12px] items-start" style={{ padding: '14px 0', borderBottom: '1px solid #eef0f3' }}>
      <div
        className="shrink-0 flex items-center justify-center"
        style={{ width: 34, height: 34, borderRadius: 9, background: '#eff4ff', border: '1px solid #d1e0ff', marginTop: 2 }}
      >
        <Icon name={icon} size={17} color="#155eef" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-[family-name:var(--font-dm-sans)] font-semibold uppercase" style={{ fontSize: 11.5, color: '#a4a7ae', letterSpacing: '0.05em', lineHeight: '16px' }}>{label}</div>
        <div className="font-[family-name:var(--font-dm-sans)] font-bold" style={{ fontSize: 15.5, color: '#181d27', lineHeight: '22px', marginTop: 1 }}>{value}</div>
        <p style={{ margin: '2px 0 0', fontSize: 13.5, lineHeight: '20px', color: '#535862' }}>{detail}</p>
      </div>
    </div>
  )
}

export function BuyerBrief({ entities, loading }: { entities: Entity[]; loading?: boolean }) {
  const brief = deriveBrief(entities)
  return (
    <section style={{ maxWidth: 1440, margin: '28px auto 0', padding: '0 32px' }}>
      <div
        className="relative overflow-hidden"
        style={{ borderRadius: 16, border: '1px solid #d1e0ff', background: 'linear-gradient(180deg,#f5f8ff 0%, #ffffff 46%)', boxShadow: 'var(--shadow-sm)' }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#155eef,#2970ff,#528bff)' }} />
        <div style={{ padding: '22px 24px' }}>
          <div className="flex items-center justify-between gap-[16px] flex-wrap" style={{ marginBottom: 6 }}>
            <div className="flex items-center gap-[11px]">
              <div
                className="flex items-center justify-center"
                style={{ width: 38, height: 38, borderRadius: 10, background: '#155eef', boxShadow: SKEUO, border: '2px solid rgba(255,255,255,0.12)' }}
              >
                <Icon name="sparkle" size={20} color="#fff" />
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-dm-sans)] font-semibold" style={{ margin: 0, fontSize: 20, lineHeight: '26px', letterSpacing: '-0.01em', color: '#181d27' }}>Proploy buyer brief</h2>
                <p style={{ margin: 0, fontSize: 13.5, color: '#717680' }}>Practical differences across your {entities.length} options — not just star ratings.</p>
              </div>
            </div>
            <Pill tone="brand" dot>Auto-generated</Pill>
          </div>

          {loading ? (
            <div className="flex flex-col gap-[12px]" style={{ padding: '28px 0' }}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="compare-shimmer"
                  style={{ height: 16, borderRadius: 6, width: ['72%', '94%', '60%', '85%'][i] }}
                />
              ))}
            </div>
          ) : brief ? (
            <>
              <div className="brief-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', columnGap: 28, marginTop: 6 }}>
                <BriefRow icon="wrench" label="Implementation" value={brief.complexity.v} detail={brief.complexity.d} />
                <BriefRow icon="info" label="Budget signal" value={brief.budget.v} detail={brief.budget.d} />
                <BriefRow icon="shield" label="Support / quality risk" value={brief.risk.v} detail={brief.risk.d} />
                <BriefRow icon="arrowRight" label="Recommended next step" value={brief.action.v} detail={brief.action.d} />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  )
}
