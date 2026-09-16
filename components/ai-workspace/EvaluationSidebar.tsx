'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Plus, Sparkles, X } from 'lucide-react'
import type {
  EvaluationAttentionGroup,
  EvaluationSummary,
} from '@/features/ai-workspace'
import { EvaluationRow } from './EvaluationRow'

const GROUPS: Array<{
  id: EvaluationAttentionGroup
  label: string
}> = [
  { id: 'needs_attention', label: 'Needs attention' },
  { id: 'in_progress', label: 'In progress' },
  { id: 'ready_to_decide', label: 'Ready to decide' },
]

export function EvaluationSidebar({
  evaluations,
  activeEvaluationId,
  onSelect,
  onNew,
  onRename,
  onDuplicate,
  onArchive,
  onDelete,
  onClose,
  collapsed = false,
  onToggleCollapsed,
}: {
  evaluations: EvaluationSummary[]
  activeEvaluationId: string | null
  onSelect: (evaluationId: string) => void
  onNew: () => void
  onRename: (evaluation: EvaluationSummary) => void
  onDuplicate?: (evaluation: EvaluationSummary) => void
  onArchive: (evaluationId: string) => void
  onDelete: (evaluationId: string) => void
  onClose?: () => void
  collapsed?: boolean
  onToggleCollapsed?: () => void
}) {
  return (
    <aside className="flex h-full min-h-0 flex-col bg-paper/95 backdrop-blur-xl">
      <div
        className={`flex h-16 min-h-16 items-center border-b border-border/80 ${
          collapsed ? 'justify-center px-2' : 'justify-between px-3.5'
        }`}
      >
        {!collapsed ? (
          <Link href="/" className="flex items-center rounded-lg px-1 transition-opacity hover:opacity-75">
            <Image
              src="/PROPLOY.svg"
              alt="Proploy"
              width={106}
              height={28}
              className="object-contain"
              priority
            />
          </Link>
        ) : null}
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close evaluations"
            className="flex size-7.5 items-center justify-center rounded-lg text-ink-soft/80 transition hover:bg-paper-deep hover:text-ink lg:hidden"
          >
            <X size={16} />
          </button>
        ) : onToggleCollapsed ? (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={
              collapsed ? 'Expand evaluations' : 'Collapse evaluations'
            }
            className="flex size-7.5 items-center justify-center rounded-lg text-ink-soft/80 transition hover:bg-paper-deep hover:text-ink"
          >
            {collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        ) : null}
      </div>
      {!collapsed ? (
        <div className="px-4 pb-3 pt-5">
          <div className="flex items-center justify-between px-1">
            <p className="label">Your evaluations</p>
            <span className="font-mono text-[0.65rem] text-ink-soft/70">
              {evaluations.length.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      ) : null}
      <div
        className={`min-h-0 flex-1 overflow-y-auto pb-3 ${
          collapsed ? 'px-2' : 'px-2.5'
        }`}
      >
        {evaluations.length ? (
          GROUPS.map((group) => {
            const items = evaluations.filter(
              (evaluation) =>
                evaluation.attention_group === group.id &&
                evaluation.status !== 'archived',
            )
            if (!items.length) return null
            return (
              <section key={group.id} className="mb-3">
                {!collapsed ? (
                  <h2 className="label px-2 pb-1.5 !text-[0.62rem]">
                    {group.label}
                  </h2>
                ) : null}
                <div className={collapsed ? 'flex flex-col items-center gap-1.5' : 'space-y-0.5'}>
                  {items.map((evaluation) => (
                    <EvaluationRow
                      key={evaluation.evaluation_id}
                      evaluation={evaluation}
                      active={
                        evaluation.evaluation_id === activeEvaluationId
                      }
                      onSelect={() => onSelect(evaluation.evaluation_id)}
                      onRename={() => onRename(evaluation)}
                      onArchive={() =>
                        onArchive(evaluation.evaluation_id)
                      }
                      onDelete={() => onDelete(evaluation.evaluation_id)}
                      collapsed={collapsed}
                    />
                  ))}
                </div>
              </section>
            )
          })
        ) : !collapsed ? (
          <div className="mx-2 mt-3 rounded-2xl border border-dashed border-cobalt/25 bg-cobalt-soft/30 p-4 text-left">
            <span className="grid size-8 place-items-center rounded-xl bg-white text-cobalt shadow-sm">
              <Sparkles size={15} aria-hidden />
            </span>
            <p className="mt-3 text-sm font-semibold text-ink">Your first decision starts here</p>
            <p className="mt-1 text-xs leading-5 text-ink-soft">
              Tell Sam what you need and keep every comparison in one place.
            </p>
          </div>
        ) : null}
      </div>
      <div
        className={`flex min-h-[80px] items-center border-t border-border/80 ${
          collapsed ? 'justify-center px-2' : 'px-3.5'
        }`}
      >
        <button
          type="button"
          onClick={onNew}
          aria-label="New evaluation"
          className={`group relative flex items-center justify-center overflow-hidden rounded-xl bg-ink text-paper shadow-[0_12px_24px_-16px_rgba(17,24,39,0.7)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt/30 ${
            collapsed ? 'size-10 shrink-0' : 'h-10 w-full gap-2 px-3 text-[0.8125rem] font-medium'
          }`}
        >
          <span className="absolute inset-0 -translate-x-full bg-cobalt transition-transform duration-500 group-hover:translate-x-0" aria-hidden />
          <Plus size={18} className="relative z-10 shrink-0" />
          {!collapsed ? <span className="relative z-10">New evaluation</span> : null}
        </button>
      </div>
    </aside>
  )
}
