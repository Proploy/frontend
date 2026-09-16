'use client'

import { Maximize2, RefreshCw } from 'lucide-react'
import type { EvaluationProduct, RequirementsDraft } from '@/features/ai-workspace'
import type { AiWorkspaceProfile } from '@/features/ai-workspace/types'
import { buildFitMatrix } from '@/features/ai-workspace/requirement-fit'
import { RequirementFitChart } from './RequirementFitChart'
import { RequirementCoverageCard } from './RequirementCoverageCard'

/**
 * The requirements matrix, where it can be read beside the requirements it is
 * about.
 *
 * The chart itself renders a grid or nothing; everything conditional lives
 * here — whether there is enough to compare, whether the verdicts still
 * describe the buyer's current requirements, and what to offer when they do
 * not. When `buildFitMatrix` declines, this renders nothing at all rather than
 * an empty frame: the requirements panel directly above already says what Sam
 * is still missing, and a second empty box in a 360px column would say it
 * worse.
 */
export function RequirementFitSection({
  products,
  profile,
  requirements,
  busy = false,
  density = 'comfortable',
  recommendedId,
  onOpenBoard,
  onAsk,
}: {
  products: EvaluationProduct[]
  profile: AiWorkspaceProfile | null | undefined
  requirements?: RequirementsDraft | null
  /** True while Sam is responding; the grid on screen is the previous turn's. */
  busy?: boolean
  density?: 'comfortable' | 'compact'
  recommendedId?: string
  /** Opens the expanded board. Absent = no expand affordance. */
  onOpenBoard?: () => void
  /** Prefills the composer, the same way the requirement gap chips do. */
  onAsk?: (prompt: string) => void
}) {
  const coverage = (
    <RequirementCoverageCard products={products} profile={profile} requirements={requirements} />
  )

  const matrix = buildFitMatrix(products, profile, requirements)
  // No grid worth drawing, but the buyer still has requirements and still
  // deserves to know where they went. Dropping both left them counting six in
  // the panel and finding nothing here.
  if (!matrix) return coverage

  const compact = density === 'compact'
  const stale = matrix.rows.filter((row) => row.stale)

  return (
    <>
    <section
      aria-label="Requirements fit"
      data-testid="requirement-fit-section"
      className={
        compact
          ? 'pp-card pp-card--flat mb-3.5 overflow-hidden !p-0 shadow-[var(--shadow-glass)]'
          : 'mb-5 overflow-hidden rounded-2xl border border-border bg-white'
      }
    >
      <div className="flex items-start justify-between gap-3 border-b border-border/70 bg-white px-4 py-3.5">
        <div className="min-w-0">
          <p className="label leading-none">Requirements fit</p>
          <p className="mt-1.5 text-[0.78rem] leading-5 text-ink-soft">
            {/* The denominator is always printed: a product judged on two cells
                out of ten should never read as confidently as one judged on all
                ten. */}
            {matrix.assessed} of {matrix.total} answered across{' '}
            {matrix.columns.length} products
            {matrix.hasJudgement ? ' · lookups and Sam’s read' : ' · all from the catalog'}
            {busy ? ' · updating' : ''}
          </p>
        </div>
        {onOpenBoard ? (
          <button
            type="button"
            onClick={onOpenBoard}
            aria-label="Open the decision board"
            title="Open the decision board"
            className="grid size-7 shrink-0 place-items-center rounded-full border border-border text-ink-soft transition-colors hover:border-cobalt hover:text-cobalt"
          >
            <Maximize2 size={13} aria-hidden />
          </button>
        ) : null}
      </div>

      <div className={compact ? 'px-4 py-3.5' : 'px-5 py-4'}>
        <RequirementFitChart
          rows={matrix.rows}
          columns={matrix.columns.map((column) => ({
            id: column.product.product_id,
            name: column.productName,
            cells: column.cells,
          }))}
          recommendedId={recommendedId}
          density={density}
        />

        {/* Staleness is per row, not per grid: a buyer who changed one
            requirement should not be told the whole comparison is out of date.
            The dimmed cells say which, this says why and offers the fix. */}
        {stale.length ? (
          <div className="mt-3 rounded-lg border border-dashed border-border bg-paper/60 px-3 py-2.5">
            <p className="text-[0.75rem] leading-5 text-ink-soft">
              <span className="font-medium text-ink">
                {stale.length === 1 ? 'One check is' : `${stale.length} checks are`} out of date
              </span>{' '}
              — {listOf(stale.map((row) => row.label.toLowerCase()))} changed since Sam last
              looked.
            </p>
            {onAsk ? (
              <button
                type="button"
                onClick={() =>
                  onAsk(
                    `My ${listOf(stale.map((row) => row.label.toLowerCase()))} ${
                      stale.length === 1 ? 'requirement has' : 'requirements have'
                    } changed. Can you re-check how the shortlist fits?`,
                  )
                }
                className="mt-2 inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-white px-3 text-[0.72rem] font-medium text-ink transition-colors hover:border-cobalt hover:text-cobalt"
              >
                <RefreshCw size={11} aria-hidden />
                Ask Sam to re-check
              </button>
            ) : null}
          </div>
        ) : null}

        {/* Named so a buyer can discount it. A catalog lookup and a model's
            read are not the same kind of claim, and only one of them is
            checkable. */}
        {matrix.hasJudgement ? (
          <p className="mt-2.5 text-[0.72rem] leading-5 text-ink-soft">
            Some verdicts are Sam&rsquo;s read of the product rather than a catalog record.
          </p>
        ) : null}
      </div>
    </section>
      {coverage}
    </>
  )
}

function listOf(items: string[]): string {
  if (items.length <= 1) return items[0] ?? ''
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}
