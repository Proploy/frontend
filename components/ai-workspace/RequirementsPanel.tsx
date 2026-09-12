'use client'

import { ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { useState } from 'react'
import type { AiWorkspaceProfile } from '@/features/ai-workspace'
import { requirementCoverage, VERDICT_COPY } from '@/features/ai-workspace/requirement-prompts'

/**
 * What Sam knows about the buyer so far, and — the part that moves the
 * conversation — what it still does not.
 *
 * The gaps render as chips that prefill the composer instead of sending a
 * message, so the buyer answers in their own words. Sam guesses less, and the
 * shortlist gets better, without the panel ever taking a turn on their behalf.
 */
export function RequirementsPanel({
  profile,
  missingCritical = [],
  onAsk,
}: {
  profile: AiWorkspaceProfile | null | undefined
  /** `missing_critical_signals` — gaps Sam itself flagged as blocking. */
  missingCritical?: string[]
  /** Prefills the conversation composer. Absent = chips are not offered. */
  onAsk?: (prompt: string) => void
}) {
  const { matrix, gaps, percent, verdict } = requirementCoverage(profile)
  const [open, setOpen] = useState(true)
  // Only what Sam actually captured gets a row. An empty requirement is not a
  // fact about the buyer, so it reads as a chip they can answer rather than a
  // list of blanks — the meter above already says how much is still missing.
  const captured = matrix.rows.filter((row) => !row.missing)

  const critical = new Set(missingCritical.map((signal) => signal.toLowerCase()))
  const isCritical = (gap: { key: string; label: string }) =>
    critical.has(gap.key) || critical.has(gap.label.toLowerCase())

  return (
    <section
      aria-label="Requirements"
      data-testid="requirements-panel"
      className="mb-3 rounded-2xl border border-border bg-white"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="min-w-0">
          <span className="label block">Your requirements</span>
          <span className="mt-0.5 block text-[0.85rem] font-medium text-ink">
            {matrix.known} of {matrix.total} captured
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-3">
          {/* Segmented rather than a continuous bar: each notch is one
              requirement, so the meter reads as countable progress. */}
          <span className="flex gap-0.5" role="img" aria-label={`${percent}% captured`}>
            {matrix.rows.map((row) => (
              <span
                key={row.key}
                className={`h-3 w-1 rounded-full ${row.missing ? 'bg-paper-deep' : 'bg-cobalt'}`}
              />
            ))}
          </span>
          {open ? (
            <ChevronUp size={15} className="text-ink-soft" aria-hidden />
          ) : (
            <ChevronDown size={15} className="text-ink-soft" aria-hidden />
          )}
        </span>
      </button>

      {open ? (
        <>
          <p className="border-t border-border px-4 pb-3 pt-2.5 text-[0.78rem] leading-5 text-ink-soft">
            {VERDICT_COPY[verdict]}
          </p>

          {gaps.length && onAsk ? (
            <div className="border-t border-border px-4 py-3">
              <p className="label !text-[0.6rem]">Tell Sam more</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {gaps.map((gap) => {
                  const urgent = isCritical(gap)
                  return (
                    <li key={gap.key}>
                      <button
                        type="button"
                        onClick={() => onAsk(gap.prompt)}
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.75rem] font-medium transition-colors ${
                          urgent
                            ? 'border-cobalt/45 bg-cobalt-soft/60 text-cobalt-deep hover:bg-cobalt-soft'
                            : 'border-border bg-paper text-ink-soft hover:border-cobalt/40 hover:text-ink'
                        }`}
                      >
                        <Plus size={11} aria-hidden strokeWidth={2.6} />
                        {gap.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : null}

          {captured.length ? (
            <dl className="border-t border-border px-4 py-2">
              {captured.map((row) => (
                <div
                  key={row.key}
                  className="grid grid-cols-[104px_1fr] gap-3 border-b border-border/60 py-2 last:border-0"
                >
                  <dt className="text-[0.75rem] leading-5 text-ink-soft">{row.label}</dt>
                  <dd className="min-w-0 text-[0.8125rem] leading-5">
                    {row.values.length === 1 ? (
                      <span className="text-ink">{row.values[0]}</span>
                    ) : (
                      <ul className="flex flex-wrap gap-1">
                        {row.values.map((value) => (
                          <li
                            key={value}
                            className="rounded-full border border-border bg-paper px-2 py-0.5 text-[0.72rem] text-ink"
                          >
                            {value}
                          </li>
                        ))}
                      </ul>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </>
      ) : null}
    </section>
  )
}
