'use client'

import { MoreHorizontal } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { EvaluationSummary } from '@/features/ai-workspace'

const STAGE_LABELS: Record<EvaluationSummary['stage'], string> = {
  defining_requirements: 'Defining requirements',
  discovering_products: 'Finding matches',
  reviewing_evidence: 'Reviewing evidence',
  building_shortlist: 'Building shortlist',
  ready_for_recommendation: 'Ready for recommendation',
  recommendation_ready: 'Recommendation ready',
}

export function EvaluationRow({
  evaluation,
  active,
  onSelect,
  onRename,
  onDuplicate,
  onArchive,
  onDelete,
  collapsed = false,
}: {
  evaluation: EvaluationSummary
  active: boolean
  onSelect: () => void
  onRename: () => void
  onDuplicate?: () => void
  onArchive: () => void
  onDelete: () => void
  collapsed?: boolean
}) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div
      className={`group relative rounded-xl border transition ${
        active
          ? 'border-[#84adff] bg-[#eff4ff] shadow-[0_1px_2px_rgba(21,94,239,0.08)]'
          : 'border-transparent bg-transparent hover:border-[#e9eaeb] hover:bg-white'
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        title={collapsed ? evaluation.title : undefined}
        aria-label={
          collapsed
            ? `${evaluation.title}, ${STAGE_LABELS[evaluation.stage]}`
            : undefined
        }
        className={
          collapsed
            ? 'flex size-[52px] items-center justify-center rounded-xl text-sm font-bold text-[#344054] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155eef]/30'
            : 'w-full rounded-xl px-3 py-3.5 pr-10 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155eef]/30'
        }
      >
        {collapsed ? (
          evaluation.title.trim().charAt(0).toUpperCase() || 'E'
        ) : (
          <>
            <span className="block truncate text-sm font-semibold text-[#181d27]">
              {evaluation.title}
            </span>
            <span className="mt-1 flex items-center gap-1.5 text-xs text-[#535862]">
              <span>{STAGE_LABELS[evaluation.stage]}</span>
              {evaluation.shortlist_count > 0 ? (
                <>
                  <span aria-hidden>·</span>
                  <span>
                    {evaluation.shortlist_count} shortlisted
                  </span>
                </>
              ) : null}
            </span>
            {evaluation.progress_percent > 0 &&
            evaluation.progress_percent < 100 ? (
              <span className="mt-2.5 block h-1 overflow-hidden rounded-full bg-white">
                <span
                  className={[
                    'block h-full rounded-full bg-[#155eef]',
                    evaluation.progress_percent >= 75
                      ? 'w-3/4'
                      : evaluation.progress_percent >= 50
                        ? 'w-1/2'
                        : 'w-1/4',
                  ].join(' ')}
                />
              </span>
            ) : null}
          </>
        )}
      </button>
      {!collapsed ? (
        <div ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setOpen((value) => !value)
            }}
            aria-label={`Actions for ${evaluation.title}`}
            aria-expanded={open}
            className={`absolute right-2 top-2.5 flex size-7 items-center justify-center rounded-lg text-[#717680] hover:bg-white hover:text-[#181d27] focus-visible:opacity-100 ${
              open
                ? 'bg-white opacity-100'
                : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            <MoreHorizontal size={16} />
          </button>
          {open ? (
            <div className="absolute right-2 top-10 z-30 w-36 rounded-xl border border-[#e9eaeb] bg-white p-1.5 text-sm shadow-[0_12px_32px_rgba(10,13,18,0.14)]">
              {[
                ['Rename', onRename],
                ['Archive', onArchive],
                ['Delete', onDelete],
              ].map(([label, handler]) => (
                <button
                  key={label as string}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpen(false)
                    // Defer execution slightly to allow menu to unmount safely
                    // before blocking the main thread with window.prompt or confirm
                    window.setTimeout(() => {
                      ;(handler as () => void)()
                    }, 10)
                  }}
                  className={`block w-full rounded-lg px-2.5 py-2 text-left hover:bg-[#f5f8ff] ${
                    label === 'Delete'
                      ? 'text-[#b42318]'
                      : 'text-[#414651]'
                  }`}
                >
                  {label as string}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
