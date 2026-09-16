'use client'

import { Check, CircleDashed, Minus, X } from 'lucide-react'
import { useState } from 'react'
import { fitScore, type BattleCardData, type FitStatus } from '@/features/ai-workspace/brief-types'
import { RequirementFitChart } from './RequirementFitChart'

/**
 * The comparison tool: Sam's battle card rendered as a requirements matrix.
 * Columns are the products, rows are the buyer's requirements, cells say
 * whether each product meets the requirement with the evidence Sam found.
 */

const FIT_META: Record<FitStatus, { label: string; tone: string; Icon: typeof Check }> = {
  yes: { label: 'Meets', tone: 'bg-cobalt-soft text-cobalt-deep', Icon: Check },
  partial: { label: 'Partial', tone: 'bg-[color-mix(in_oklab,var(--signal)_28%,white)] text-ink', Icon: CircleDashed },
  no: { label: 'Missing', tone: 'bg-paper-deep text-ink-soft', Icon: X },
  unknown: { label: 'Not assessed', tone: 'bg-white text-ink-soft border border-border', Icon: Minus },
}

type Section = 'matrix' | 'overview' | 'signals'

export function BattleCardView({ card }: { card: BattleCardData }) {
  const [section, setSection] = useState<Section>('matrix')
  const recommendedId = card.recommendation.product_id
  const recommended = card.products.find((p) => p.product_id === recommendedId)

  return (
    <div className="text-ink" data-testid="battle-card-view">
      {/* Fit summary strip */}
      <div className="grid gap-3 border-b border-border px-5 py-4 sm:grid-cols-2 lg:grid-cols-4">
        {card.products.map((product) => {
          const score = fitScore(card, product.product_id)
          const isRec = product.product_id === recommendedId
          return (
            <div
              key={product.product_id}
              className={`rounded-xl border p-3 ${isRec ? 'border-cobalt/40 bg-cobalt-soft/40' : 'border-border bg-white'}`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-[0.9rem] font-semibold">{product.product_name}</p>
                {isRec ? (
                  <span className="label !text-[0.6rem] shrink-0 rounded-full bg-cobalt px-2 py-0.5 !text-white">
                    Sam&apos;s pick
                  </span>
                ) : null}
              </div>
              <p className="mt-2 font-mono text-[1.4rem] leading-none text-ink">
                {score.percent}
                <span className="text-[0.8rem] text-ink-soft">%</span>
              </p>
              <p className="label mt-1 !tracking-[0.08em]">requirements met</p>
              <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-paper-deep" aria-hidden>
                {score.met > 0 ? <span className="bg-cobalt" style={{ flex: score.met }} /> : null}
                {score.partial > 0 ? <span className="bg-[var(--signal)]" style={{ flex: score.partial }} /> : null}
                {score.missing + score.unknown > 0 ? <span className="bg-transparent" style={{ flex: score.missing + score.unknown }} /> : null}
              </div>
              <p className="mt-1.5 text-[0.72rem] text-ink-soft">
                {score.met} met · {score.partial} partial · {score.missing} missing
              </p>
            </div>
          )
        })}
      </div>

      {/* Section switch */}
      <div role="tablist" aria-label="Comparison sections" className="flex gap-1 border-b border-border px-5 pt-3">
        {(
          [
            ['matrix', 'Requirements fit'],
            ['overview', 'Overview & pricing'],
            ['signals', 'Strengths & weaknesses'],
          ] as Array<[Section, string]>
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={section === id}
            onClick={() => setSection(id)}
            className={`relative px-3 pb-2.5 text-[0.8125rem] font-medium transition-colors ${
              section === id ? 'text-cobalt' : 'text-ink-soft hover:text-ink'
            }`}
          >
            {label}
            <span
              aria-hidden
              className={`absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-cobalt transition-opacity ${section === id ? 'opacity-100' : 'opacity-0'}`}
            />
          </button>
        ))}
      </div>

      {section === 'matrix' ? (
        <>
        {/* The battle card stores fit requirement-first; the chart reads it
            product-first, the same way the workspace matrix does. */}
        <RequirementFitChart
          rows={card.requirements.map((requirement, index) => ({
            key: String(index),
            label: requirement.requirement,
          }))}
          columns={card.products.map((product) => ({
            id: product.product_id,
            name: product.product_name,
            cells: Object.fromEntries(
              card.requirements.map((requirement, index) => [
                String(index),
                requirement.fit[product.product_id] ?? { status: 'unknown' as const },
              ]),
            ),
          }))}
          recommendedId={card.recommendation.product_id}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left" aria-label="Requirements fit matrix">
            <thead>
              <tr>
                <th scope="col" className="label border-b border-border px-5 py-3 font-normal">Requirement</th>
                {card.products.map((product) => (
                  <th
                    key={product.product_id}
                    scope="col"
                    className={`border-b border-border px-3 py-3 text-[0.8125rem] font-semibold ${product.product_id === recommendedId ? 'bg-cobalt-soft/40 text-cobalt-deep' : 'text-ink'}`}
                  >
                    {product.product_name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {card.requirements.length === 0 ? (
                <tr>
                  <td colSpan={card.products.length + 1} className="px-5 py-6 text-sm text-ink-soft">
                    Sam did not return a requirements matrix for this comparison.
                  </td>
                </tr>
              ) : null}
              {card.requirements.map((requirement, index) => (
                <tr key={`${requirement.requirement}-${index}`}>
                  <th scope="row" className="border-b border-border/70 px-5 py-3 text-left align-top font-normal">
                    <p className="text-[0.875rem] font-medium text-ink">
                      <span className="mr-1.5 font-mono text-[0.72rem] text-ink-soft">{index + 1}</span>
                      {requirement.requirement}
                    </p>
                    {requirement.why_it_matters ? (
                      <p className="mt-0.5 text-[0.75rem] leading-5 text-ink-soft">{requirement.why_it_matters}</p>
                    ) : null}
                  </th>
                  {card.products.map((product) => {
                    const cell = requirement.fit[product.product_id] ?? { status: 'unknown' as FitStatus }
                    const meta = FIT_META[cell.status]
                    return (
                      <td
                        key={product.product_id}
                        className={`border-b border-border/70 px-3 py-3 align-top ${product.product_id === recommendedId ? 'bg-cobalt-soft/25' : ''}`}
                      >
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.72rem] font-semibold ${meta.tone}`}>
                          <meta.Icon size={12} aria-hidden strokeWidth={2.4} />
                          {meta.label}
                        </span>
                        {cell.note ? <p className="mt-1 text-[0.75rem] leading-5 text-ink-soft">{cell.note}</p> : null}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      ) : null}

      {section === 'overview' ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left" aria-label="Product overview">
            <tbody>
              {(
                [
                  ['What it is', (p) => p.tagline],
                  ['Best for', (p) => p.best_for],
                  ['Pricing', (p) => p.pricing_summary],
                  ['Rating', (p) => (p.avg_rating ? `${p.avg_rating} · ${p.total_reviews ?? 0} reviews` : null)],
                  ['Trial', (p) => `${p.free_trial ? 'Free trial' : 'No trial'} · ${p.free_plan ? 'Free plan' : 'No free plan'}`],
                  ['Deployment', (p) => (p.deployment_models?.length ? p.deployment_models.join(', ') : null)],
                  ['Compliance', (p) => (p.compliance_labels?.length ? p.compliance_labels.join(', ') : null)],
                ] as Array<[string, (p: BattleCardData['products'][number]) => string | null | undefined]>
              ).map(([label, read]) => (
                <tr key={label}>
                  <th scope="row" className="label border-b border-border/70 px-5 py-3 text-left align-top font-normal">{label}</th>
                  {card.products.map((product) => (
                    <td
                      key={product.product_id}
                      className={`border-b border-border/70 px-3 py-3 align-top text-[0.8125rem] leading-5 text-ink ${product.product_id === recommendedId ? 'bg-cobalt-soft/25' : ''}`}
                    >
                      {read(product) || <span className="text-ink-soft">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {section === 'signals' ? (
        <div className="grid gap-4 px-5 py-4 sm:grid-cols-2 lg:grid-cols-4">
          {card.products.map((product) => (
            <div key={product.product_id} className="rounded-xl border border-border bg-white p-4">
              <p className="text-[0.9rem] font-semibold">{product.product_name}</p>
              <p className="label mt-3">Strengths</p>
              <ul className="mt-1.5 space-y-1.5">
                {(card.strengths[product.product_id] ?? []).map((item) => (
                  <li key={item} className="flex gap-2 text-[0.8125rem] leading-5">
                    <Check size={14} className="mt-0.5 shrink-0 text-cobalt" aria-hidden />
                    {item}
                  </li>
                ))}
                {(card.strengths[product.product_id] ?? []).length === 0 ? <li className="text-[0.8125rem] text-ink-soft">—</li> : null}
              </ul>
              <p className="label mt-3">Weaknesses</p>
              <ul className="mt-1.5 space-y-1.5">
                {(card.weaknesses[product.product_id] ?? []).map((item) => (
                  <li key={item} className="flex gap-2 text-[0.8125rem] leading-5 text-ink-soft">
                    <Minus size={14} className="mt-0.5 shrink-0" aria-hidden />
                    {item}
                  </li>
                ))}
                {(card.weaknesses[product.product_id] ?? []).length === 0 ? <li className="text-[0.8125rem] text-ink-soft">—</li> : null}
              </ul>
              {card.community[product.product_id] ? (
                <blockquote className="mt-3 border-l-2 border-border pl-3 text-[0.8125rem] italic leading-5 text-ink-soft">
                  {card.community[product.product_id]}
                </blockquote>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {/* Recommendation + next steps */}
      {recommended ? (
        <div className="border-t border-border bg-paper px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="label">Sam recommends</p>
              <p className="mt-1 text-[1rem] font-semibold">{recommended.product_name}</p>
              {card.recommendation.reason ? (
                <p className="mt-1 max-w-[60ch] text-[0.875rem] leading-6 text-ink-soft">{card.recommendation.reason}</p>
              ) : null}
            </div>
            {card.next_steps.length ? (
              <ol className="shrink-0 space-y-1.5 sm:max-w-[40%]">
                {card.next_steps.map((step, i) => (
                  <li key={step} className="flex gap-2 text-[0.8125rem] leading-5">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-ink font-mono text-[0.65rem] text-paper">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
