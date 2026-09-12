'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'
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
    <aside className="flex h-full min-h-0 flex-col bg-paper">
      <div
        className={`flex min-h-[80px] items-center border-b border-border ${
          collapsed ? 'justify-center px-2' : 'justify-between px-4'
        }`}
      >
        {!collapsed ? (
          <Link href="/" className="flex items-center px-1">
            <Image
              src="/PROPLOY.svg"
              alt="Proploy"
              width={121}
              height={34}
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
            className="flex size-8 items-center justify-center rounded-lg text-ink-soft/80 transition hover:bg-cobalt-soft/50 hover:text-cobalt lg:hidden"
          >
            <X size={17} />
          </button>
        ) : onToggleCollapsed ? (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={
              collapsed ? 'Expand evaluations' : 'Collapse evaluations'
            }
            className="flex size-8 items-center justify-center rounded-lg text-ink-soft/80 transition hover:bg-cobalt-soft/50 hover:text-cobalt"
          >
            {collapsed ? (
              <ChevronRight size={17} />
            ) : (
              <ChevronLeft size={17} />
            )}
          </button>
        ) : null}
      </div>
      {!collapsed ? (
        <div className="px-4 pb-3 pt-5">
          <p className="label">Evaluations</p>
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
          <div className="mx-2 mt-4 rounded-xl border border-dashed border-border bg-white px-4 py-5 text-center">
            <p className="text-sm font-medium text-ink-soft">
              No evaluations yet
            </p>
            <p className="mt-1 text-xs leading-5 text-ink-soft/80">
              Start with the software decision you need to make.
            </p>
          </div>
        ) : null}
      </div>
      <div className="flex min-h-[88px] items-center border-t border-border px-4">
        <button
          type="button"
          onClick={onNew}
          aria-label="New evaluation"
          className="group relative flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-ink px-3 text-[0.8125rem] font-medium text-paper transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt/30"
        >
          <span className="absolute inset-0 -translate-x-full bg-cobalt transition-transform duration-500 group-hover:translate-x-0" aria-hidden />
          <Plus size={16} className="relative z-10" />
          <span className="relative z-10">{!collapsed ? 'New evaluation' : null}</span>
        </button>
      </div>
    </aside>
  )
}
