'use client'

import { Menu, PanelRight, Save, Share2 } from 'lucide-react'
import type { EvaluationDetail } from '@/features/ai-workspace'

const ICON_BUTTON =
  'inline-flex h-9 items-center gap-2 rounded-full border border-border bg-white px-3 text-[0.8125rem] font-medium text-ink transition-colors hover:border-cobalt/50 disabled:cursor-not-allowed disabled:opacity-50'

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
}) {
  return (
    <header className="flex min-h-[80px] items-center justify-between gap-4 border-b border-border bg-paper/85 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenEvaluations}
          aria-label="Open evaluations"
          className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-ink lg:hidden"
        >
          <Menu size={17} />
        </button>
        <div className="min-w-0">
          <p className="label flex items-center gap-2">
            <span className="pulse-dot size-1.5 rounded-full bg-cobalt" aria-hidden />
            Ask Sam
          </p>
          <h1 className="mt-1 truncate text-[1.05rem] font-semibold text-ink">
            {evaluation ? evaluation.title : 'New evaluation'}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onShare}
          disabled={!evaluation || sharing}
          aria-label={sharing ? 'Sharing evaluation' : shared ? 'Evaluation link copied' : 'Share evaluation'}
          className={ICON_BUTTON}
        >
          <Share2 size={15} />
          <span className="hidden sm:inline">{sharing ? 'Sharing…' : shared ? 'Link copied' : 'Share'}</span>
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!evaluation || !canSave || saving}
          aria-label={saving ? 'Saving evaluation' : saved ? 'Evaluation saved' : 'Save evaluation'}
          className={ICON_BUTTON}
        >
          <Save size={15} />
          <span className="hidden sm:inline">{saving ? 'Saving…' : saved ? 'Saved' : 'Save evaluation'}</span>
        </button>
        <button
          type="button"
          onClick={onOpenResults}
          aria-label="Open agent results"
          className="grid size-9 place-items-center rounded-full border border-border text-ink xl:hidden"
        >
          <PanelRight size={17} />
        </button>
      </div>
    </header>
  )
}
