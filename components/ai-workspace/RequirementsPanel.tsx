'use client'

import { ArrowUpRight, Check, ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { useState } from 'react'
import type { AiWorkspaceProfile, RequirementsDraft } from '@/features/ai-workspace'
import { requirementCoverage, VERDICT_COPY } from '@/features/ai-workspace/requirement-prompts'
import { RequirementsModal } from './RequirementsModal'

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
  requirements,
  missingCritical = [],
  onAsk,
  onOpenModal: externalOpenModal,
}: {
  profile: AiWorkspaceProfile | null | undefined
  requirements?: RequirementsDraft | null
  /** `missing_critical_signals` — gaps Sam itself flagged as blocking. */
  missingCritical?: string[]
  /** Prefills the conversation composer. Absent = chips are not offered. */
  onAsk?: (prompt: string) => void
  /** Optional handler to trigger an external requirements modal. */
  onOpenModal?: () => void
}) {
  const { matrix, gaps, percent, verdict } = requirementCoverage(profile, requirements)
  const [open, setOpen] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  // Only what Sam actually captured gets a row. An empty requirement is not a
  // fact about the buyer, so it reads as a chip they can answer rather than a
  // list of blanks — the meter above already says how much is still missing.
  const captured = matrix.rows.filter((row) => !row.missing)

  const critical = new Set(missingCritical.map((signal) => signal.toLowerCase()))
  const isCritical = (gap: { key: string; label: string }) =>
    critical.has(gap.key) || critical.has(gap.label.toLowerCase())

  const openModal = () => {
    if (externalOpenModal) {
      externalOpenModal()
    } else {
      setModalOpen(true)
    }
  }

  return (
    <>
      <section
        aria-label="Requirements"
        data-testid="requirements-panel"
        className="pp-card pp-card--flat mb-3.5 overflow-hidden !p-0 shadow-[var(--shadow-glass)]"
      >
        <div className="flex w-full items-center justify-between gap-3 bg-white px-4 py-3.5 transition-colors hover:bg-paper/70">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-[var(--r-control)] bg-cobalt-soft text-cobalt-deep">
              <Check size={16} aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="pp-label block">Decision inputs</span>
              <span className="mt-0.5 block truncate text-[0.9375rem] font-semibold text-ink">
                {matrix.known} captured
              </span>
            </span>
          </button>
          <div className="flex shrink-0 items-center gap-2">
            {/* Segmented rather than a continuous bar: each notch is one
                requirement, so the meter reads as countable progress. */}
            <span className="flex gap-0.5 rounded-full bg-paper px-1.5 py-1" role="img" aria-label={`${percent}% captured`}>
              {matrix.rows.map((row) => (
                <span
                  key={row.key}
                  className={`h-3 w-1 rounded-full ${row.missing ? 'bg-paper-deep' : 'bg-cobalt'}`}
                />
              ))}
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Collapse requirements' : 'Expand requirements'}
              className="grid size-7 place-items-center rounded-lg text-ink-soft hover:bg-paper"
            >
              {open ? (
                <ChevronUp size={15} aria-hidden />
              ) : (
                <ChevronDown size={15} aria-hidden />
              )}
            </button>
          </div>
        </div>

        {open ? (
          <>
            <div className="border-t border-border bg-paper/60 px-4 py-2.5">
              <div className="flex w-full items-start gap-2.5 text-[0.78rem] leading-5 text-ink-soft">
                <span className="shrink-0 rounded-full bg-cobalt-soft px-2 py-0.5 font-mono text-[0.7rem] font-medium text-cobalt-deep">
                  {percent}%
                </span>
                <p>{VERDICT_COPY[verdict]}</p>
              </div>
            </div>

            {gaps.length && onAsk ? (
              <div className="border-t border-border bg-white px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="pp-label">Add context</p>
                  <span className="text-[0.72rem] text-ink-soft">Improves ranking</span>
                </div>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {gaps.slice(0, 5).map((gap) => {
                    const urgent = isCritical(gap)
                    return (
                      <li key={gap.key}>
                        <button
                          type="button"
                          onClick={() => onAsk(gap.prompt)}
                          className={`pp-tag inline-flex cursor-pointer items-center gap-1 transition-colors ${
                            urgent
                              ? 'pp-tag--cobalt border-cobalt/45 hover:bg-cobalt-soft'
                              : 'hover:border-cobalt/40 hover:bg-white hover:text-ink'
                          }`}
                        >
                          <Plus size={11} aria-hidden strokeWidth={2.6} />
                          {gap.label}
                        </button>
                      </li>
                    )
                  })}
                  {gaps.length > 5 ? (
                    <li>
                      <button
                        type="button"
                        onClick={openModal}
                        className="pp-tag inline-flex cursor-pointer items-center gap-1 border-border/80 text-ink-soft hover:border-cobalt/40 hover:text-ink"
                      >
                        +{gaps.length - 5} more
                      </button>
                    </li>
                  ) : null}
                </ul>
              </div>
            ) : null}

            {captured.length ? (
              <div className="max-h-40 overflow-y-auto overscroll-contain border-t border-border bg-white px-4 py-1">
                <dl>
                  {captured.map((row) => (
                    <div
                      key={row.key}
                      className="grid grid-cols-[88px_1fr] gap-3 border-b border-border/60 py-2.5 text-[0.8rem] last:border-0"
                    >
                      <dt className="pt-0.5 text-[0.72rem] font-medium leading-5 text-ink-soft">{row.label}</dt>
                      <dd className="min-w-0 text-[0.8rem] leading-5 text-ink">
                        <ul className="space-y-1">
                          {row.values.map((value) => (
                            <li key={value} className="flex gap-2">
                              <span className="mt-2 size-1 shrink-0 rounded-full bg-cobalt" aria-hidden />
                              <span>{value}</span>
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            {onAsk ? (
              <div className="flex items-center justify-end border-t border-border bg-paper/40 px-4 py-2.5">
                <button
                  type="button"
                  onClick={() => onAsk('I want to update these requirements: ')}
                  className="pp-link-arrow text-[0.75rem]"
                >
                  Refine requirements <ArrowUpRight size={13} aria-hidden />
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </section>

      <RequirementsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        profile={profile}
        requirements={requirements}
        missingCritical={missingCritical}
        onAsk={onAsk}
      />
    </>
  )
}
