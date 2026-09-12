'use client'

import { MoreHorizontal } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { EvaluationSummary } from '@/features/ai-workspace'

/** One evaluation in the left rail: a single line, title first. */
export function EvaluationRow({
  evaluation,
  active,
  onSelect,
  onRename,
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

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onSelect}
        title={evaluation.title}
        aria-label={evaluation.title}
        aria-current={active ? 'true' : undefined}
        className={`grid size-9 place-items-center rounded-full border text-[0.75rem] font-semibold transition-colors ${
          active ? 'border-cobalt bg-cobalt text-white' : 'border-border bg-white text-ink-soft hover:border-cobalt/50'
        }`}
      >
        {evaluation.title.trim().charAt(0).toUpperCase() || 'E'}
      </button>
    )
  }

  return (
    <div
      className={`group relative flex h-9 items-center rounded-lg pr-8 transition-colors ${
        active ? 'bg-white text-cobalt shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_10px_24px_-20px_color-mix(in_oklab,var(--cobalt)_60%,transparent)]' : 'text-ink hover:bg-white/70'
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-current={active ? 'true' : undefined}
        title={evaluation.title}
        className="flex h-full min-w-0 flex-1 items-center gap-2 px-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt/30"
      >
        <span aria-hidden className={`size-1.5 shrink-0 rounded-full ${active ? 'bg-cobalt' : 'bg-border'}`} />
        <span className="truncate text-[0.85rem] font-medium">{evaluation.title}</span>
        {evaluation.match_count > 0 ? (
          <span className="ml-auto shrink-0 font-mono text-[0.65rem] text-ink-soft" aria-label={`${evaluation.match_count} products`}>
            {evaluation.match_count}
          </span>
        ) : null}
      </button>
      <div ref={menuRef}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setOpen((value) => !value)
          }}
          aria-label={`Actions for ${evaluation.title}`}
          aria-expanded={open}
          className={`absolute right-1 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-ink-soft hover:bg-paper hover:text-ink focus-visible:opacity-100 ${
            open ? 'bg-paper opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <MoreHorizontal size={15} />
        </button>
        {open ? (
          <div className="absolute right-1 top-9 z-30 w-36 rounded-xl border border-border bg-white p-1.5 text-[0.8125rem] shadow-[0_24px_48px_-16px_rgba(10,13,18,0.18)]">
            {(
              [
                ['Rename', onRename],
                ['Archive', onArchive],
                ['Delete', onDelete],
              ] as Array<[string, () => void]>
            ).map(([label, handler]) => (
              <button
                key={label}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setOpen(false)
                  // Let the menu unmount before window.prompt/confirm blocks the thread.
                  window.setTimeout(() => handler(), 10)
                }}
                className={`block w-full rounded-lg px-2.5 py-2 text-left hover:bg-cobalt-soft/50 ${label === 'Delete' ? 'text-[#b42318]' : 'text-ink'}`}
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
