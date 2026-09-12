'use client'

import { Maximize2, PanelRightClose, PanelRightOpen, X } from 'lucide-react'
import type { EvaluationDetail, EvaluationProduct } from '@/features/ai-workspace'
import { deriveJourney } from '@/features/ai-workspace/journey'
import { DecisionBoard } from './DecisionBoard'
import { RequirementsPanel } from './RequirementsPanel'

/**
 * Everything the evaluation has produced, in one column: what Sam knows about
 * the buyer, and the decision board — Sam's suggestions, the buyer's
 * shortlist, and the next steps Sam can take. Nothing here edits the
 * evaluation directly; the conversation is still where the buyer steers Sam.
 */
export function AgentResultsSidebar({
  evaluation,
  onClose,
  collapsed = false,
  onToggleCollapsed,
  busy = false,
  onToggleShortlist,
  onRequestComparisonBrief,
  onRequestImplementationBrief,
  onOpenDocument,
  onAsk,
  onExpandBoard,
}: {
  evaluation: EvaluationDetail
  onClose?: () => void
  collapsed?: boolean
  onToggleCollapsed?: () => void
  /** True while Sam is responding; brief actions wait. */
  busy?: boolean
  /** Adds or removes a product from the buyer's shortlist. */
  onToggleShortlist?: (product: EvaluationProduct) => void
  onRequestComparisonBrief?: (products: EvaluationProduct[]) => void
  onRequestImplementationBrief?: (product: EvaluationProduct) => void
  onOpenDocument?: (docId: string) => void
  /** Prefills the conversation composer — used by the requirement chips. */
  onAsk?: (prompt: string) => void
  /** Opens the same three lanes side by side across the whole workspace. */
  onExpandBoard?: () => void
}) {
  const journey = deriveJourney(evaluation)
  const products = journey.products

  if (collapsed) {
    return (
      <aside className="flex h-full min-h-0 flex-col items-center border-l border-border bg-paper py-5">
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label="Expand agent results"
          title="Expand agent results"
          className="grid size-8 place-items-center rounded-full border border-border text-ink-soft transition-colors hover:border-cobalt hover:text-cobalt"
        >
          <PanelRightOpen size={15} />
        </button>
        <span className="label mt-4 [writing-mode:vertical-rl]">
          Results{products.length ? ` ${products.length}` : ''}
        </span>
      </aside>
    )
  }

  return (
    <aside aria-label="Agent results" className="flex h-full min-h-0 flex-col border-l border-border bg-paper">
      <div className="flex items-start justify-between gap-3 px-4 pb-4 pt-5">
        <div>
          <p className="label">Sam&apos;s decision</p>
          <h2 className="display mt-1.5 text-[1.25rem] text-ink">
            {products.length
              ? `${products.length} ${products.length === 1 ? 'product' : 'products'}`
              : 'No products yet'}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {onExpandBoard && products.length ? (
            <button
              type="button"
              onClick={onExpandBoard}
              aria-label="Expand decision board"
              title="Expand decision board"
              className="grid size-8 place-items-center rounded-full border border-border text-ink-soft transition-colors hover:border-cobalt hover:text-cobalt"
            >
              <Maximize2 size={14} />
            </button>
          ) : null}
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close agent results"
              className="grid size-8 place-items-center rounded-full border border-border bg-white text-ink xl:hidden"
            >
              <X size={15} />
            </button>
          ) : onToggleCollapsed ? (
            <button
              type="button"
              onClick={onToggleCollapsed}
              aria-label="Collapse agent results"
              title="Collapse agent results"
              className="grid size-8 place-items-center rounded-full border border-border text-ink-soft transition-colors hover:border-cobalt hover:text-cobalt"
            >
              <PanelRightClose size={15} />
            </button>
          ) : null}
        </div>
      </div>
      <div key={evaluation.evaluation_id} className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-3 pb-4">
        <RequirementsPanel
          profile={evaluation.profile}
          missingCritical={evaluation.missing_critical_signals}
          onAsk={onAsk}
        />
        <DecisionBoard
          journey={journey}
          shortlist={evaluation.shortlist ?? []}
          busy={busy}
          onToggleShortlist={onToggleShortlist}
          onRequestComparisonBrief={onRequestComparisonBrief}
          onRequestImplementationBrief={onRequestImplementationBrief}
          onOpenDocument={onOpenDocument}
        />
      </div>
    </aside>
  )
}
