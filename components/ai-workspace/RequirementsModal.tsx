'use client'

import { ArrowUpRight, Check, Plus, SlidersHorizontal, Sparkles, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { AiWorkspaceProfile, RequirementsDraft } from '@/features/ai-workspace'
import { requirementCoverage, VERDICT_COPY } from '@/features/ai-workspace/requirement-prompts'

export interface RequirementsModalProps {
  open: boolean
  onClose: () => void
  profile?: AiWorkspaceProfile | null
  requirements?: RequirementsDraft | null
  missingCritical?: string[]
  onAsk?: (prompt: string) => void
}

export function RequirementsModal({
  open,
  onClose,
  profile,
  requirements,
  missingCritical = [],
  onAsk,
}: RequirementsModalProps) {
  const dialogRef = useRef<HTMLElement | null>(null)
  const { matrix, gaps, percent, verdict } = requirementCoverage(profile, requirements)
  const captured = matrix.rows.filter((row) => !row.missing)

  const critical = new Set(missingCritical.map((signal) => signal.toLowerCase()))
  const isCritical = (gap: { key: string; label: string }) =>
    critical.has(gap.key) || critical.has(gap.label.toLowerCase())

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const handleGapClick = (prompt: string) => {
    if (onAsk) {
      onAsk(prompt)
      onClose()
    }
  }

  const handleRefineClick = () => {
    if (onAsk) {
      onAsk('I want to update these requirements: ')
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0d12]/45 p-4 backdrop-blur-[2px] sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="requirements-modal-title"
        data-testid="requirements-modal"
        className="flex max-h-[min(820px,calc(100vh-40px))] w-[min(680px,100%)] flex-col overflow-hidden rounded-[22px] border border-border bg-white shadow-[0_24px_48px_-12px_rgba(10,13,18,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border/80 bg-paper/60 px-6 py-5 sm:px-8">
          <div className="flex items-start gap-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cobalt-soft text-cobalt-deep">
              <SlidersHorizontal size={18} aria-hidden />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="requirements-modal-title" className="text-[1.15rem] font-semibold text-ink">
                  Decision Inputs & Requirements
                </h2>
              </div>
              <p className="mt-0.5 text-[0.8rem] text-ink-soft">
                Criteria SAM uses to score fit and discover matching solutions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-border bg-white px-2.5 py-1 text-[0.72rem] font-medium text-ink-soft sm:flex">
              <span className="flex gap-0.5" role="img" aria-label={`${percent}% captured`}>
                {matrix.rows.map((row) => (
                  <span
                    key={row.key}
                    className={`h-2.5 w-1 rounded-full ${row.missing ? 'bg-paper-deep' : 'bg-cobalt'}`}
                  />
                ))}
              </span>
              <span>{matrix.known}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close requirements dialog"
              className="grid size-8 place-items-center rounded-full border border-border text-ink-soft transition-colors hover:bg-paper-deep hover:text-ink"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-y-contain px-6 py-5 sm:px-8">
          {/* Progress & Verdict Card */}
          <div className="rounded-xl border border-border/80 bg-paper/50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="rounded-full bg-cobalt-soft px-2.5 py-0.5 font-mono text-[0.75rem] font-medium text-cobalt-deep">
                  {percent}% captured
                </span>
                <span className="text-[0.82rem] font-semibold text-ink">
                  {matrix.known} captured
                </span>
              </div>
              <div className="flex gap-0.5 rounded-full bg-white px-2 py-1 shadow-2xs sm:hidden" role="img" aria-label={`${percent}% captured`}>
                {matrix.rows.map((row) => (
                  <span
                    key={row.key}
                    className={`h-2.5 w-1 rounded-full ${row.missing ? 'bg-paper-deep' : 'bg-cobalt'}`}
                  />
                ))}
              </div>
            </div>
            <p className="mt-2 text-[0.82rem] leading-relaxed text-ink-soft">
              {VERDICT_COPY[verdict]}
            </p>
          </div>

          {/* Missing critical details / Add context */}
          {gaps.length && onAsk ? (
            <div className="rounded-xl border border-border/80 bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[0.82rem] font-semibold text-ink">
                  Add context to sharpen matches
                </p>
                <span className="text-[0.72rem] text-ink-soft">Click to answer in chat</span>
              </div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {gaps.map((gap) => {
                  const urgent = isCritical(gap)
                  return (
                    <li key={gap.key}>
                      <button
                        type="button"
                        onClick={() => handleGapClick(gap.prompt)}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[0.78rem] font-medium transition-colors ${
                          urgent
                            ? 'border-cobalt/40 bg-cobalt-soft text-cobalt-deep hover:bg-cobalt/20'
                            : 'border-border bg-paper/60 text-ink hover:border-cobalt/35 hover:bg-paper'
                        }`}
                      >
                        <Plus size={12} aria-hidden strokeWidth={2.4} />
                        {gap.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : null}

          {/* Captured Requirements */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[0.85rem] font-semibold text-ink">
                Captured Requirements ({captured.length})
              </h3>
              <span className="text-[0.72rem] text-ink-soft">
                Updated in real-time from conversation
              </span>
            </div>

            {captured.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {captured.map((row) => (
                  <div
                    key={row.key}
                    className="flex flex-col rounded-xl border border-border/70 bg-white p-3.5 shadow-2xs"
                  >
                    <div className="flex items-center gap-2 text-ink">
                      <span className="grid size-4 shrink-0 place-items-center rounded-full bg-cobalt-soft text-cobalt-deep">
                        <Check size={10} aria-hidden strokeWidth={3} />
                      </span>
                      <span className="text-[0.78rem] font-semibold tracking-wide text-ink-soft uppercase">
                        {row.label}
                      </span>
                    </div>
                    <ul className="mt-2.5 space-y-1.5 text-[0.84rem] text-ink">
                      {row.values.map((val) => (
                        <li key={val} className="flex items-start gap-2 leading-snug">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cobalt" aria-hidden />
                          <span className="break-words">{val}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-paper/40 p-6 text-center">
                <p className="text-[0.85rem] font-medium text-ink">No requirements captured yet</p>
                <p className="mt-1 text-[0.78rem] text-ink-soft">
                  Tell SAM about your team size, workflow, integrations, or tool needs to populate criteria.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex flex-col-reverse items-stretch justify-between gap-3 border-t border-border bg-paper/40 px-6 py-4 sm:flex-row sm:items-center sm:px-8">
          <p className="text-[0.75rem] text-ink-soft">
            Tell SAM to modify or refine any requirement anytime.
          </p>
          <div className="flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded-xl border border-border bg-white px-4 text-[0.8125rem] font-medium text-ink transition-colors hover:bg-paper"
            >
              Close
            </button>
            {onAsk ? (
              <button
                type="button"
                onClick={handleRefineClick}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-ink px-4 text-[0.8125rem] font-medium text-paper transition-colors hover:bg-cobalt"
              >
                <Sparkles size={13} aria-hidden />
                Refine with SAM
                <ArrowUpRight size={13} aria-hidden />
              </button>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}
