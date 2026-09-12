'use client'

import { Check, ShieldAlert } from 'lucide-react'
import type { ProjectBriefData } from '@/features/ai-workspace/brief-types'

/**
 * Sam's implementation brief rendered as a plan: the use case up front, the
 * objectives and requirements it must satisfy, then the phased rollout,
 * risks and next steps around the chosen product.
 */
export function ImplementationBriefView({ brief }: { brief: ProjectBriefData }) {
  const product = brief.recommended_product
  return (
    <div className="text-ink" data-testid="implementation-brief-view">
      <div className="grid gap-4 border-b border-border px-5 py-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="label">Use case</p>
          <p className="mt-1.5 text-[1rem] leading-7">
            {brief.use_case || brief.executive_summary || 'Sam did not describe the use case.'}
          </p>
          {brief.use_case && brief.executive_summary ? (
            <p className="mt-3 text-[0.875rem] leading-6 text-ink-soft">{brief.executive_summary}</p>
          ) : null}
        </div>
        <div className="rounded-xl border border-cobalt/40 bg-cobalt-soft/40 p-4">
          <p className="label !text-cobalt-deep">Built around</p>
          <p className="mt-1 text-[1.125rem] font-semibold">{product.product_name}</p>
          {product.tagline ? <p className="mt-0.5 text-[0.8125rem] text-ink-soft">{product.tagline}</p> : null}
          {brief.recommendation.rationale ? (
            <p className="mt-3 text-[0.875rem] leading-6">{brief.recommendation.rationale}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 border-b border-border px-5 py-5 md:grid-cols-3">
        <ListBlock label="Objectives" items={brief.business_objectives} />
        <ListBlock label="Key requirements" items={brief.key_requirements} />
        <ListBlock label="Success criteria" items={brief.success_criteria} check />
      </div>

      {brief.implementation_plan.length ? (
        <div className="border-b border-border px-5 py-5">
          <p className="label">Implementation plan</p>
          <p className="mt-1 text-[0.8125rem] text-ink-soft">Indicative phases for {product.product_name}. Durations are estimates, not commitments.</p>
          <ol className="relative mt-4 space-y-4 border-l border-border pl-6">
            {brief.implementation_plan.map((phase, index) => (
              <li key={`${phase.phase}-${index}`} className="relative">
                <span className="absolute -left-[31px] grid size-6 place-items-center rounded-full border border-cobalt bg-cobalt font-mono text-[0.65rem] text-white">
                  {index + 1}
                </span>
                <div className="rounded-xl border border-border bg-white p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-[0.9375rem] font-semibold">{phase.phase}</p>
                    <p className="font-mono text-[0.7rem] tracking-[0.08em] text-ink-soft">
                      {[phase.duration, phase.owner].filter(Boolean).join(' · ').toUpperCase()}
                    </p>
                  </div>
                  {phase.activities.length ? (
                    <ul className="mt-2 space-y-1">
                      {phase.activities.map((activity) => (
                        <li key={activity} className="flex gap-2 text-[0.8125rem] leading-5 text-ink-soft">
                          <span className="mt-2 size-1 shrink-0 rounded-full bg-ink-soft" aria-hidden />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {brief.risks.length ? (
        <div className="border-b border-border px-5 py-5">
          <p className="label">Risks and mitigations</p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {brief.risks.map((risk) => (
              <li key={risk.risk} className="flex gap-3 rounded-xl border border-border bg-white p-3">
                <ShieldAlert size={16} className="mt-0.5 shrink-0 text-[var(--signal)]" aria-hidden />
                <div>
                  <p className="text-[0.875rem] font-medium">{risk.risk}</p>
                  {risk.mitigation ? <p className="mt-0.5 text-[0.8125rem] leading-5 text-ink-soft">{risk.mitigation}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-6 px-5 py-5 md:grid-cols-[1fr_1fr]">
        {brief.shortlist.length ? (
          <div>
            <p className="label">Considered</p>
            <ul className="mt-2 space-y-1.5">
              {brief.shortlist.map((item) => (
                <li key={item.product_id} className="flex items-center justify-between gap-3 text-[0.8125rem]">
                  <span className={item.is_recommended ? 'font-semibold text-cobalt-deep' : 'text-ink'}>{item.product_name}</span>
                  <span className="truncate text-ink-soft">{item.best_for ?? item.tagline ?? ''}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {brief.next_steps.length ? (
          <div>
            <p className="label">Next steps</p>
            <ol className="mt-2 space-y-1.5">
              {brief.next_steps.map((step, i) => (
                <li key={step} className="flex gap-2 text-[0.8125rem] leading-5">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-ink font-mono text-[0.65rem] text-paper">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function ListBlock({ label, items, check = false }: { label: string; items: string[]; check?: boolean }) {
  return (
    <div>
      <p className="label">{label}</p>
      {items.length ? (
        <ul className="mt-2 space-y-1.5">
          {items.map((item) => (
            <li key={item} className="flex gap-2 text-[0.8125rem] leading-5">
              {check ? (
                <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-cobalt-soft">
                  <Check size={10} className="text-cobalt-deep" aria-hidden strokeWidth={3} />
                </span>
              ) : (
                <span className="mt-2 size-1 shrink-0 rounded-full bg-cobalt" aria-hidden />
              )}
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-[0.8125rem] text-ink-soft">Not specified</p>
      )}
    </div>
  )
}
