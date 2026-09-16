'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { Check, LoaderCircle } from 'lucide-react'
import type { EvaluationProduct } from '@/features/ai-workspace'
import { getProductDetailHref } from '@/features/catalog/products/product-detail-view'
import { ProductLogo } from './ProductLogo'
import { ProductName } from './ProductName'

export type ProductCardAction = {
  label: string
  icon?: ReactNode
  disabled?: boolean
  /** Only the action that started a request shows progress. */
  loading?: boolean
  /** Renders the button in its "on" state — the shortlist toggle uses it. */
  active?: boolean
  /**
   * `agent` marks an action that asks Sam to write something rather than
   * doing it outright. Those two are not the same kind of promise — one lands
   * a page, the other starts a turn — so they do not wear the same button.
   */
  tone?: 'default' | 'agent'
  onClick: () => void
}

/** A quiet icon-only control in the card's top corner (removing, dismissing). */
export type ProductCardCornerAction = {
  /** Accessible name — the button shows only its icon. */
  label: string
  icon: ReactNode
  disabled?: boolean
  onClick: () => void
}

export type ProductCardSelection = {
  /** `checkbox` for the comparison set, `radio` for the single-product brief. */
  kind: 'checkbox' | 'radio'
  selected: boolean
  disabled?: boolean
  onToggle: () => void
}

/**
 * One product Sam put forward: its logo, score, and why it fits.
 *
 * The card carries no navigation of its own — the lanes around it own what
 * happens next (shortlist, compare, brief), so the buyer never leaves the
 * evaluation by accident. When a lane offers the card as a choice it passes
 * `selection`: an unpicked card is simply not highlighted, never struck
 * through, because it is still a live option rather than a rejected one.
 */
export function ProductMatchCard({
  product,
  actions = [],
  rank,
  selection,
  cornerAction,
}: {
  product: EvaluationProduct
  actions?: ProductCardAction[]
  /** Position in Sam's ranking, 1 = best match. */
  rank?: number
  selection?: ProductCardSelection
  /**
   * Undoing a choice should not compete with making the next one, so it sits
   * in the corner as an icon rather than in the row of things to do next.
   */
  cornerAction?: ProductCardCornerAction
}) {
  const score = typeof product.match_score === 'number' ? Math.round(product.match_score) : null
  const profileHref = product.available
    ? product.profile_href ?? getProductDetailHref(product.product_id)
    : null
  const picked = selection?.selected ?? false

  // Inside a selection control the name cannot be a link (nested interactive
  // elements), so it renders as plain text there and as a catalog link
  // otherwise. Either way the card offers no separate "view product" CTA.
  const name = <ProductName product={product} />
  const identity = (
    <>
      <ProductLogo product={product} />
      <span className="min-w-0 flex-1 text-left">
        <span className="block truncate text-[0.95rem] font-semibold text-ink">
          {profileHref && !selection ? (
            <Link href={profileHref} className="hover:text-cobalt">
              {name}
            </Link>
          ) : (
            name
          )}
        </span>
        {product.match_strength ? (
          <span className="label mt-0.5 block !text-[0.6rem] !text-cobalt-deep">
            {product.match_strength}
          </span>
        ) : null}
      </span>
      {score !== null ? (
        <span className="shrink-0 font-mono text-[1.05rem] leading-none text-ink">
          {score}
          <span className="text-[0.7rem] text-ink-soft">%</span>
        </span>
      ) : null}
    </>
  )

  return (
    <article
      className={`lift rounded-2xl border p-4 transition-colors ${
        picked ? 'border-cobalt bg-cobalt-soft/25' : 'border-border bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        {typeof rank === 'number' && !selection ? (
          <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-border bg-paper font-mono text-[0.65rem] text-ink-soft">
            {String(rank).padStart(2, '0')}
          </span>
        ) : null}
        {selection ? (
          <button
            type="button"
            role={selection.kind}
            aria-checked={picked}
            disabled={selection.disabled}
            onClick={selection.onToggle}
            className="flex min-w-0 flex-1 items-start gap-3 disabled:opacity-60"
          >
            <span
              className={`mt-0.5 grid size-5 shrink-0 place-items-center border ${
                selection.kind === 'radio' ? 'rounded-full' : 'rounded-md'
              } ${picked ? 'border-cobalt bg-cobalt text-white' : 'border-border bg-white text-transparent'}`}
              aria-hidden
            >
              <Check size={12} strokeWidth={3} />
            </span>
            {identity}
          </button>
        ) : (
          <div className="flex min-w-0 flex-1 items-start gap-3">{identity}</div>
        )}
        {cornerAction ? (
          <button
            type="button"
            aria-label={cornerAction.label}
            title={cornerAction.label}
            disabled={cornerAction.disabled}
            onClick={cornerAction.onClick}
            className="-mr-1 -mt-1 grid size-7 shrink-0 place-items-center rounded-full text-ink-soft transition-colors hover:bg-paper-deep hover:text-ink disabled:opacity-50"
          >
            {cornerAction.icon}
          </button>
        ) : null}
      </div>

      {score !== null ? (
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-paper-deep" aria-hidden>
          <div className="h-full rounded-full bg-cobalt" style={{ width: `${score}%` }} />
        </div>
      ) : null}

      {product.best_for ? (
        <p className="mt-3 text-[0.8125rem] leading-5 text-ink-soft">{product.best_for}</p>
      ) : null}

      {product.reasons?.length ? (
        <ul className="mt-3 space-y-1.5">
          {product.reasons.map((reason) => (
            <li key={reason} className="flex gap-2 text-[0.8125rem] leading-5 text-ink">
              <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-cobalt-soft">
                <Check size={10} className="text-cobalt-deep" aria-hidden strokeWidth={3} />
              </span>
              {reason}
            </li>
          ))}
        </ul>
      ) : null}

      {actions.length ? (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              disabled={action.disabled || action.loading}
              onClick={action.onClick}
              className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[0.78rem] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                action.active
                  ? 'border border-cobalt bg-cobalt-soft text-cobalt-deep'
                  : action.tone === 'agent'
                    ? 'ai-pill font-semibold'
                    : 'border border-transparent bg-ink text-paper hover:bg-cobalt'
              }`}
            >
              {action.loading ? (
                <LoaderCircle size={13} className="animate-spin motion-reduce:animate-none" aria-hidden />
              ) : action.icon}
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </article>
  )
}
