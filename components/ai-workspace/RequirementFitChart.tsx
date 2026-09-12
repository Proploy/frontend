'use client'

import { Check, CircleDashed, Minus, X } from 'lucide-react'
import { useState } from 'react'
import { fitScore, type BattleCardData, type FitStatus } from '@/features/ai-workspace/brief-types'

/**
 * How each product fits the buyer's requirements, at a glance.
 *
 * The table below this chart answers "what did Sam say about requirement 4?".
 * It cannot answer "what shape is this product?" — you have to read a column
 * top to bottom and hold four states in your head. One row of cells per
 * product does that in a glance: a solid run with two gaps reads instantly,
 * and comparing rows compares products.
 *
 * Encoding notes:
 *  - Fit is *ordinal* (meets > partial > missing), so the marks step one hue
 *    light-to-dark from the brand ramp rather than using categorical colours.
 *    "Not assessed" is absence, not a lower rung, so it leaves the ramp for a
 *    dashed neutral.
 *  - The lighter steps sit under 3:1 against the surface, so colour never
 *    carries meaning alone: every state is named in the legend, every cell
 *    reports itself on hover and focus, and the full table sits directly below.
 *  - Requirements are numbered so a cell can be traced to its table row.
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

type Hovered = { product: string; index: number } | null

export function RequirementFitChart({ card }: { card: BattleCardData }) {
  const [hovered, setHovered] = useState<Hovered>(null)
  const recommendedId = card.recommendation.product_id

  if (card.requirements.length === 0 || card.products.length === 0) return null

  const active = hovered
    ? {
        requirement: card.requirements[hovered.index],
        product: card.products.find((p) => p.product_id === hovered.product),
      }
    : null
  const activeCell = active?.requirement?.fit[hovered?.product ?? ''] ?? null
  const activeStatus: FitStatus = activeCell?.status ?? 'unknown'

  return (
    <figure
      className="m-0 border-b border-border px-5 py-4"
      data-testid="requirement-fit-chart"
      aria-label="Requirements fit by product"
    >
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-[0.875rem] font-semibold text-ink">
          Fit across {card.requirements.length}{' '}
          {card.requirements.length === 1 ? 'requirement' : 'requirements'}
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
        {card.products.map((product) => {
          const score = fitScore(card, product.product_id)
          const isRec = product.product_id === recommendedId
          return (
            <div key={product.product_id} className="flex items-center gap-3">
              <p
                className={`w-[104px] shrink-0 truncate text-[0.78rem] ${
                  isRec ? 'font-semibold text-cobalt-deep' : 'text-ink'
                }`}
                title={product.product_name}
              >
                {product.product_name}
              </p>

              {/* 2px gaps keep adjacent cells from reading as one bar. */}
              <div className="flex min-w-0 flex-1 gap-0.5" role="list">
                {card.requirements.map((requirement, index) => {
                  const status = requirement.fit[product.product_id]?.status ?? 'unknown'
                  const meta = FIT_META[status]
                  const on =
                    hovered?.product === product.product_id && hovered?.index === index
                  return (
                    <button
                      key={`${product.product_id}-${index}`}
                      type="button"
                      role="listitem"
                      aria-label={`${product.product_name} — requirement ${index + 1}, ${requirement.requirement}: ${meta.label}`}
                      onMouseEnter={() => setHovered({ product: product.product_id, index })}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered({ product: product.product_id, index })}
                      onBlur={() => setHovered(null)}
                      className={`h-6 min-w-0 flex-1 rounded-[3px] transition-[outline-color] ${meta.cell} ${
                        on ? 'outline outline-2 outline-offset-1 outline-ink' : 'outline-none'
                      }`}
                    />
                  )
                })}
              </div>

              <p className="w-[52px] shrink-0 text-right font-mono text-[0.78rem] tabular-nums text-ink">
                {score.met}/{card.requirements.length}
              </p>
            </div>
          )
        })}
      </div>

      {/* The numbered axis ties a cell back to its row in the table below. */}
      <div className="mt-1.5 flex items-center gap-3" aria-hidden>
        <span className="w-[104px] shrink-0" />
        <div className="flex min-w-0 flex-1 gap-0.5">
          {card.requirements.map((_, index) => (
            <span
              key={index}
              className="min-w-0 flex-1 text-center font-mono text-[0.6rem] text-ink-soft"
            >
              {index + 1}
            </span>
          ))}
        </div>
        <span className="w-[52px] shrink-0" />
      </div>

      {/* Detail line rather than a floating tooltip: it cannot mis-position
          inside the scroll container, and it reads the same on keyboard focus. */}
      <p
        role="status"
        aria-live="polite"
        className="mt-2.5 min-h-[36px] rounded-lg bg-paper-deep/60 px-3 py-2 text-[0.75rem] leading-5 text-ink-soft"
      >
        {active?.requirement && active.product ? (
          <>
            <span className="font-medium text-ink">
              {active.product.product_name} · {active.requirement.requirement}
            </span>
            <span className="mx-1.5 inline-flex items-center gap-1 align-middle">
              {(() => {
                const Icon = FIT_META[activeStatus].Icon
                return <Icon size={11} aria-hidden strokeWidth={2.6} />
              })()}
              {FIT_META[activeStatus].label}
            </span>
            {activeCell?.note ? <span>— {activeCell.note}</span> : null}
          </>
        ) : (
          'Hover or tab a cell to see what Sam found.'
        )}
      </p>
    </figure>
  )
}
