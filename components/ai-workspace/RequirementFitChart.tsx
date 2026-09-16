'use client'

import { Check, CircleDashed, Minus, X } from 'lucide-react'
import { useState } from 'react'
import { fitCounts, type FitStatus } from '@/features/ai-workspace/brief-types'
import type { FitSource } from '@/features/ai-workspace/evaluation-types'

/**
 * How each product fits the buyer's requirements, at a glance.
 *
 * A table answers "what did Sam say about requirement 4?". It cannot answer
 * "what shape is this product?" — you have to read a column top to bottom and
 * hold four states in your head. One row of cells per product does that in a
 * glance: a solid run with two gaps reads instantly, and comparing rows
 * compares products.
 *
 * Encoding notes:
 *  - Fit is *ordinal* (meets > partial > missing), so the marks step one hue
 *    light-to-dark from the brand ramp rather than using categorical colours.
 *    "Not assessed" is absence, not a lower rung, so it leaves the ramp for a
 *    dashed neutral. There is deliberately no per-cell number: the evidence
 *    underneath is categorical, so a percentage would be a percentage about
 *    nothing.
 *  - The lighter steps sit under 3:1 against the surface, so colour never
 *    carries meaning alone: every state is named in the legend, every cell
 *    reports itself on hover and focus, and every cell's full verdict is in
 *    its own aria-label.
 *  - `compact` is for the 360px results column, where the numbered axis would
 *    collide and there is no table underneath to number rows against.
 */

const FIT_META: Record<
  FitStatus,
  { label: string; cell: string; swatch: string; Icon: typeof Check }
> = {
  // brand-700 → brand-300 → brand-100: monotonic lightness (0.11 → 0.42 → 0.74),
  // adjacent CVD separation ΔE 16+.
  yes: {
    label: 'Meets',
    cell: 'bg-[var(--color-brand-700)]',
    swatch: 'bg-[var(--color-brand-700)]',
    Icon: Check,
  },
  partial: {
    label: 'Partial',
    cell: 'bg-[var(--color-brand-300)]',
    swatch: 'bg-[var(--color-brand-300)]',
    Icon: CircleDashed,
  },
  no: {
    label: 'Missing',
    cell: 'bg-[var(--color-brand-100)]',
    swatch: 'bg-[var(--color-brand-100)]',
    Icon: X,
  },
  unknown: {
    label: 'Not assessed',
    cell: 'border border-dashed border-border bg-white',
    swatch: 'border border-dashed border-border bg-white',
    Icon: Minus,
  },
}

const ORDER: FitStatus[] = ['yes', 'partial', 'no', 'unknown']

const SOURCE_LABEL: Record<FitSource, string> = {
  catalog: 'from the catalog',
  judgement: "Sam's read",
}

export type FitChartCell = { status: FitStatus; source?: FitSource; note?: string }
export type FitChartRow = { key: string; label: string; stale?: boolean }
export type FitChartColumn = {
  id: string
  name: string
  cells: Record<string, FitChartCell>
}

type Hovered = { product: string; index: number } | null

export function RequirementFitChart({
  rows,
  columns,
  recommendedId,
  density = 'comfortable',
}: {
  rows: FitChartRow[]
  columns: FitChartColumn[]
  /** Rendered in the brand colour; the product Sam leads with. */
  recommendedId?: string
  density?: 'comfortable' | 'compact'
}) {
  const [hovered, setHovered] = useState<Hovered>(null)

  if (rows.length === 0 || columns.length === 0) return null

  const compact = density === 'compact'
  const nameWidth = compact ? 'w-[84px]' : 'w-[104px]'
  const scoreWidth = compact ? 'w-[38px]' : 'w-[52px]'
  const cellHeight = compact ? 'h-5' : 'h-6'

  const activeColumn = hovered ? columns.find((c) => c.id === hovered.product) : undefined
  const activeRow = hovered ? rows[hovered.index] : undefined
  const activeCell = activeColumn && activeRow ? activeColumn.cells[activeRow.key] : undefined
  const activeStatus: FitStatus = activeCell?.status ?? 'unknown'

  return (
    <figure
      className={`m-0 ${compact ? '' : 'border-b border-border px-5 py-4'}`}
      data-testid="requirement-fit-chart"
      aria-label="Requirements fit by product"
    >
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-[0.875rem] font-semibold text-ink">
          Fit across {rows.length} {rows.length === 1 ? 'requirement' : 'requirements'}
        </p>
        {/* Legend is always present: the ramp is ordinal and the lighter steps
            are low-contrast, so identity never rests on colour. */}
        <ul className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {ORDER.map((status) => (
            <li key={status} className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-[3px] ${FIT_META[status].swatch}`} aria-hidden />
              <span className="text-[0.72rem] text-ink-soft">{FIT_META[status].label}</span>
            </li>
          ))}
        </ul>
      </figcaption>

      <div className="mt-3 space-y-1.5">
        {columns.map((column) => {
          const counts = fitCounts(rows.map((row) => column.cells[row.key]?.status ?? 'unknown'))
          const isRec = column.id === recommendedId
          return (
            <div key={column.id} className="flex items-center gap-3">
              <p
                className={`${nameWidth} shrink-0 truncate text-[0.78rem] ${
                  isRec ? 'font-semibold text-cobalt-deep' : 'text-ink'
                }`}
                title={column.name}
              >
                {column.name}
              </p>

              {/* 2px gaps keep adjacent cells from reading as one bar. */}
              <div className="flex min-w-0 flex-1 gap-0.5">
                {rows.map((row, index) => {
                  const cell = column.cells[row.key]
                  const status = cell?.status ?? 'unknown'
                  const meta = FIT_META[status]
                  const on = hovered?.product === column.id && hovered?.index === index
                  return (
                    <button
                      key={`${column.id}-${row.key}`}
                      type="button"
                      aria-label={[
                        `${column.name} — ${row.label}: ${meta.label}`,
                        cell?.source ? SOURCE_LABEL[cell.source] : null,
                        row.stale ? 'based on earlier requirements' : null,
                        cell?.note,
                      ]
                        .filter(Boolean)
                        .join('. ')}
                      onMouseEnter={() => setHovered({ product: column.id, index })}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered({ product: column.id, index })}
                      onBlur={() => setHovered(null)}
                      className={`${cellHeight} min-w-0 flex-1 rounded-[3px] transition-[outline-color] ${meta.cell} ${
                        row.stale ? 'opacity-45' : ''
                      } ${on ? 'outline outline-2 outline-offset-1 outline-ink' : 'outline-none'}`}
                    />
                  )
                })}
              </div>

              <p
                className={`${scoreWidth} shrink-0 text-right font-mono text-[0.78rem] tabular-nums text-ink`}
                title={`${counts.met} of ${rows.length} requirements met`}
              >
                {counts.met}/{rows.length}
              </p>
            </div>
          )
        })}
      </div>

      {/* The numbered axis ties a cell back to its row in the table below, so it
          is only worth showing where that table exists. */}
      {compact ? null : (
        <div className="mt-1.5 flex items-center gap-3" aria-hidden>
          <span className={`${nameWidth} shrink-0`} />
          <div className="flex min-w-0 flex-1 gap-0.5">
            {rows.map((row, index) => (
              <span
                key={row.key}
                className="min-w-0 flex-1 text-center font-mono text-[0.6rem] text-ink-soft"
              >
                {index + 1}
              </span>
            ))}
          </div>
          <span className={`${scoreWidth} shrink-0`} />
        </div>
      )}

      {/* Detail line rather than a floating tooltip: it cannot mis-position
          inside the scroll container, and it reads the same on keyboard focus.
          In the compact variant it is also the only place a note is readable,
          which is why it is never collapsed away. */}
      <p
        role="status"
        aria-live="polite"
        className="mt-2.5 min-h-[36px] rounded-lg bg-paper-deep/60 px-3 py-2 text-[0.75rem] leading-5 text-ink-soft"
      >
        {activeColumn && activeRow ? (
          <>
            <span className="font-medium text-ink">
              {activeColumn.name} · {activeRow.label}
            </span>
            <span className="mx-1.5 inline-flex items-center gap-1 align-middle">
              {(() => {
                const Icon = FIT_META[activeStatus].Icon
                return <Icon size={11} aria-hidden strokeWidth={2.6} />
              })()}
              {FIT_META[activeStatus].label}
            </span>
            {activeCell?.note ? <span>— {activeCell.note}</span> : null}
            {activeCell?.source === 'judgement' ? (
              <span className="ml-1 text-ink-soft">(Sam&rsquo;s read, not a catalog record)</span>
            ) : null}
          </>
        ) : (
          `Hover or tab a cell to see what Sam found${compact ? '' : ', or read the full table below'}.`
        )}
      </p>
    </figure>
  )
}
