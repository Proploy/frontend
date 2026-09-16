'use client'

import { Menu, PanelRight, Save, Share2, SlidersHorizontal, Sparkles } from 'lucide-react'
import type { EvaluationDetail } from '@/features/ai-workspace'

const ICON_BUTTON =
  'inline-flex h-8.5 shrink-0 items-center gap-2 rounded-xl border border-border/80 bg-white px-3 text-[0.8125rem] font-medium text-ink transition-all hover:border-cobalt/50 hover:bg-paper-deep/50 hover:text-cobalt-deep disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap shadow-2xs'

export function EvaluationHeader({
  evaluation,
  onOpenEvaluations,
  onOpenResults,
  onShare,
  onSave,
  canSave,
  sharing,
  shared,
  saving,
  saved,
  onOpenRequirements,
  requirementsCount,
}: {
  evaluation: EvaluationDetail | null
  onOpenEvaluations: () => void
  onOpenResults: () => void
  onShare: () => void
  onSave: () => void
  canSave: boolean
  sharing: boolean
  shared: boolean
  saving: boolean
  saved: boolean
  activeView?: 'conversation' | 'board'
  onChangeView?: (view: 'conversation' | 'board') => void
  onOpenRequirements?: () => void
  requirementsCount?: { known: number; total: number }
  productsCount?: number
}) {
  return (
    <header className="flex h-16 min-h-16 items-center justify-between gap-4 border-b border-border/80 bg-white/95 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenEvaluations}
          aria-label="Open evaluations"
          className="grid size-8.5 shrink-0 place-items-center rounded-lg border border-border text-ink hover:bg-paper lg:hidden"
        >
          <Menu size={16} />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              data-testid="copilot-header-mark"
              className="inline-flex items-center gap-1.5 rounded-full border border-cobalt/20 bg-cobalt-soft/60 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-cobalt-deep uppercase"
              aria-label="SAM"
            >
              <Sparkles size={11} className="text-cobalt" />
              SAM
            </span>
          </div>
          <h1 className="mt-1 truncate text-[0.9375rem] font-semibold tracking-[-0.01em] text-ink">
            {evaluation ? evaluation.title : 'New evaluation'}
          </h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {onOpenRequirements && evaluation ? (
          <button
            type="button"
            onClick={onOpenRequirements}
            aria-label="View requirements in modal"
            title="Open requirements modal"
            className="inline-flex h-8.5 shrink-0 items-center gap-2 rounded-xl border border-border/80 bg-white px-3 text-[0.8125rem] font-medium text-ink shadow-2xs transition-all hover:border-cobalt/50 hover:text-cobalt whitespace-nowrap"
          >
            <SlidersHorizontal size={13} className="text-cobalt" />
            <span className="hidden sm:inline">Requirements</span>
            {requirementsCount ? (
              <span className="rounded-full bg-paper-deep px-1.5 py-0.2 font-mono text-[0.68rem] font-semibold text-ink-soft">
                {requirementsCount.known}/{requirementsCount.total}
              </span>
            ) : null}
          </button>
        ) : null}
        <button
          type="button"
          onClick={onShare}
          disabled={!evaluation || sharing}
          aria-label={sharing ? 'Sharing evaluation' : shared ? 'Evaluation link copied' : 'Share evaluation'}
          className={ICON_BUTTON}
        >
          <Share2 size={14} />
          <span className="hidden sm:inline">{sharing ? 'Sharing…' : shared ? 'Copied' : 'Share'}</span>
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!evaluation || !canSave || saving}
          aria-label={saving ? 'Saving evaluation' : saved ? 'Evaluation saved' : 'Save evaluation'}
          className={ICON_BUTTON}
        >
          <Save size={14} />
          <span className="hidden sm:inline">{saving ? 'Saving…' : saved ? 'Saved' : 'Save'}</span>
        </button>
        <button
          type="button"
          onClick={onOpenResults}
          aria-label="Open agent results"
          className="grid size-8.5 place-items-center rounded-lg border border-border text-ink xl:hidden hover:bg-paper"
        >
          <PanelRight size={16} />
        </button>
      </div>
    </header>
  )
}

