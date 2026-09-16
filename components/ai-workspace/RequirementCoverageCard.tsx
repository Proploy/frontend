'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { EvaluationProduct, FitStatus, RequirementsDraft } from '@/features/ai-workspace'
import type { AiWorkspaceProfile } from '@/features/ai-workspace/types'
import { buildFitCoverage, type CoverageRow } from '@/features/ai-workspace/requirement-fit'

/**
 * Where every captured requirement lands across the shortlist, as a picture.
 *
 * One bar per requirement, divided into one segment per product, shaded by how
 * that product answered it. Read down the column of bars and the shape of the
 * decision is visible before any label is: a requirement every product meets is
 * a solid bar, one that separates them is striped, one nobody could answer is
 * an outline. The grid above answers "what did Sam say about product X"; this
 * answers "where does requirement Y leave us", which is the question a buyer
 * comparing three products is actually asking.
 *
 * Deliberately not a list of the requirements — the panel above already is one,
 * and repeating it taught the reader nothing. Values appear only on expansion,
 * beside the verdict that used them.
 */

// Same ramp as RequirementFitChart, so a colour means one thing in this column.
const SEGMENT: Record<FitStatus, string> = {
  yes: 'bg-[var(--color-brand-700)]',
  partial: 'bg-[var(--color-brand-300)]',
  no: 'bg-[var(--color-brand-100)]',
  unknown: 'border border-dashed border-border bg-white',
}

const SEGMENT_LABEL: Record<FitStatus, string> = {
  yes: 'Meets',
  partial: 'Partial',
  no: 'Missing',
  unknown: 'Not assessed',
}

function statusOf(row: CoverageRow, productId: string): FitStatus {
  return row.cells[productId]?.status ?? 'unknown'
}

function Bar({
  row,
  products,
  onHover,
  onActivate,
}: {
  row: CoverageRow
  products: Array<{ id: string; name: string }>
  onHover: (productId: string | null) => void
  onActivate: () => void
}) {
  return (
    // Each segment is its own control, so which product it is can be read by
    // pointer and by keyboard alike. A caption naming the order left to right
    // was the alternative, and it asked the reader to count along the bar and
    // hold the order in their head for every row on the card.
    <div className="flex h-2.5 gap-px overflow-hidden rounded-full">
      {products.map((product) => {
        const status = statusOf(row, product.id)
        return (
          <button
            key={product.id}
            type="button"
            aria-label={`${product.name}: ${SEGMENT_LABEL[status]} on ${row.label}`}
            onMouseEnter={() => onHover(product.id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(product.id)}
            onBlur={() => onHover(null)}
            onClick={onActivate}
            className={`h-full flex-1 ${SEGMENT[status]} first:rounded-l-full last:rounded-r-full transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cobalt`}
          />
        )
      })}
    </div>
  )
}

function Detail({ row, products }: { row: CoverageRow; products: Array<{ id: string; name: string }> }) {
  return (
    <div className="mt-2 rounded-lg bg-paper/60 px-3 py-2.5">
      {row.values.length ? (
        <p className="text-[0.72rem] leading-5 text-ink-soft">
          <span className="text-ink">You said:</span> {row.values.join(' · ')}
        </p>
      ) : null}
      {row.assessed > 0 ? (
        <ul className="mt-1.5 space-y-0.5">
          {products.map((product) => {
            const cell = row.cells[product.id]
            if (!cell) return null
            return (
              <li key={product.id} className="text-[0.72rem] leading-5 text-ink-soft">
                <span aria-hidden className={`mr-1.5 inline-block size-2 rounded-sm align-middle ${SEGMENT[cell.status]}`} />
                <span className="text-ink">{product.name}</span> — {SEGMENT_LABEL[cell.status]}
                {cell.note ? <span> · {cell.note}</span> : null}
              </li>
            )
          })}
        </ul>
      ) : null}
      <p className="mt-1.5 text-[0.7rem] leading-5 text-ink-soft/90">{row.explanation}</p>
    </div>
  )
}

export function RequirementCoverageCard({
  products,
  profile,
  requirements,
}: {
  products: EvaluationProduct[]
  profile: AiWorkspaceProfile | null | undefined
  requirements?: RequirementsDraft | null
}) {
  const [openRow, setOpenRow] = useState<string | null>(null)
  const [hovered, setHovered] = useState<{ row: string; product: string } | null>(null)
  const coverage = buildFitCoverage(products, profile, requirements)
  if (!coverage) return null

  const shown = coverage.rows.filter((row) => row.state !== 'not-captured')
  if (!shown.length || !coverage.products.length) return null

  return (
    <section
      aria-label="Requirement fit across products"
      data-testid="requirement-coverage-card"
      className="mb-3.5 overflow-hidden rounded-2xl border border-border bg-white"
    >
      <div className="border-b border-border/70 px-4 py-3">
        <p className="label leading-none">Where each requirement lands</p>
        {/* A catalog lookup and Sam's read are different kinds of evidence;
            averaging them into one number hides which a column rests on. */}
        <p className="mt-1.5 text-[0.75rem] leading-5 text-ink-soft">
          {shown.length} requirements · {coverage.checked} checked · {coverage.judged} judged
          {coverage.unanswered ? ` · ${coverage.unanswered} unanswered` : ''}
        </p>
      </div>

      <ul className="px-4 py-3">
        {shown.map((row) => {
          const open = openRow === row.key
          const active =
            hovered?.row === row.key
              ? coverage.products.find((product) => product.id === hovered.product)
              : undefined
          return (
            <li key={row.key} className="py-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setOpenRow(open ? null : row.key)}
                  aria-expanded={open}
                  className="flex min-w-0 items-baseline gap-1.5 text-left"
                >
                  <span className="truncate text-[0.76rem] leading-5 text-ink">{row.label}</span>
                  <ChevronDown
                    size={12}
                    aria-hidden
                    className={`shrink-0 text-ink-soft transition-transform ${open ? 'rotate-180' : ''}`}
                  />
                </button>
                {/* The count gives way to the hovered product rather than
                    appearing beside it: one place to look, and no reflow. */}
                <span className="shrink-0 truncate text-[0.72rem] leading-5 text-ink-soft">
                  {active ? (
                    <>
                      <span className="text-ink">{active.name}</span> —{' '}
                      {SEGMENT_LABEL[statusOf(row, active.id)]}
                    </>
                  ) : (
                    `${row.assessed}/${coverage.products.length}`
                  )}
                </span>
              </div>
              <div className="mt-1">
                <Bar
                  row={row}
                  products={coverage.products}
                  onHover={(product) => setHovered(product ? { row: row.key, product } : null)}
                  onActivate={() => setOpenRow(open ? null : row.key)}
                />
              </div>
              {open ? <Detail row={row} products={coverage.products} /> : null}
            </li>
          )
        })}
      </ul>

      <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-border/70 px-4 py-2.5">
        {(['yes', 'partial', 'no', 'unknown'] as FitStatus[]).map((status) => (
          <span key={status} className="flex items-center gap-1.5 text-[0.7rem] leading-5 text-ink-soft">
            <span aria-hidden className={`inline-block size-2 rounded-sm ${SEGMENT[status]}`} />
            {SEGMENT_LABEL[status]}
          </span>
        ))}
      </div>
    </section>
  )
}
