'use client'

import { Menu, PanelRight, Save, Share2 } from 'lucide-react'
import type { EvaluationDetail } from '@/features/ai-workspace'

export function EvaluationHeader({
  evaluation,
  onOpenEvaluations,
  onOpenDecisions,
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
  onOpenDecisions: () => void
  onShare: () => void
  onSave: () => void
  canSave: boolean
  sharing: boolean
  shared: boolean
  saving: boolean
  saved: boolean
}) {
  return (
    <header className="flex min-h-[74px] items-center justify-between gap-4 border-b border-[#e9eaeb] bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenEvaluations}
          aria-label="Open evaluations"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#e9eaeb] text-[#535862] lg:hidden"
        >
          <Menu size={18} />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-lg font-semibold text-[#181d27] sm:text-xl">
              Software Procurement
            </h1>
            {evaluation?.regeneration_status === 'pending' ||
            evaluation?.regeneration_status === 'running' ? (
              <span className="rounded-full border border-[#b2ccff] bg-[#eff4ff] px-2 py-0.5 text-[11px] font-semibold text-[#155eef]">
                Updating
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 truncate text-xs text-[#717680] sm:text-sm">
            Active evaluation
            {evaluation ? ` · ${evaluation.title}` : ''}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onShare}
          disabled={!evaluation || sharing}
          aria-label={
            sharing
              ? 'Sharing evaluation'
              : shared
                ? 'Evaluation link copied'
                : 'Share evaluation'
          }
          className="flex h-9 items-center gap-2 rounded-lg border border-[#d5d7da] bg-white px-2.5 text-sm font-semibold text-[#414651] transition hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-50 sm:px-3"
        >
          <Share2 size={15} />
          <span className="hidden sm:inline">
            {sharing ? 'Sharing…' : shared ? 'Link copied' : 'Share'}
          </span>
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!evaluation || !canSave || saving}
          aria-label={
            saving
              ? 'Saving evaluation'
              : saved
                ? 'Evaluation saved'
                : 'Save evaluation'
          }
          className="flex h-9 items-center gap-2 rounded-lg border border-[#d5d7da] bg-white px-2.5 text-sm font-semibold text-[#414651] transition hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-50 sm:px-3"
        >
          <Save size={15} />
          <span className="hidden sm:inline">
            {saving
              ? 'Saving…'
              : saved
                ? 'Saved'
                : 'Save evaluation'}
          </span>
        </button>
        <button
          type="button"
          onClick={onOpenDecisions}
          aria-label="Open decision workspace"
          className="flex size-9 items-center justify-center rounded-lg border border-[#e9eaeb] text-[#535862] xl:hidden"
        >
          <PanelRight size={18} />
        </button>
      </div>
    </header>
  )
}
