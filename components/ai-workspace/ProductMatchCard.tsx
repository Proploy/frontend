'use client'

import Link from 'next/link'
import { ArrowUpRight, Check, LoaderCircle, Plus, X } from 'lucide-react'
import { useState } from 'react'
import type { EvaluationProduct } from '@/features/ai-workspace'
import { getProductDetailHref } from '@/features/catalog/products/product-detail-view'

export function ProductMatchCard({
  product,
  shortlisted,
  onToggleShortlist,
}: {
  product: EvaluationProduct
  shortlisted: boolean
  onToggleShortlist: () =>
    | void
    | boolean
    | Promise<boolean>
}) {
  const score = Math.round(product.match_score ?? 0)
  const [updatingShortlist, setUpdatingShortlist] = useState(false)
  const profileHref = product.available
    ? product.profile_href ?? getProductDetailHref(product.product_id)
    : null
  return (
    <article className="rounded-2xl border border-[#d5d7da] bg-white p-4 shadow-[0_4px_16px_rgba(10,13,18,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {profileHref ? (
            <Link
              href={profileHref}
              className="text-lg font-semibold text-[#181d27] hover:text-[#155eef]"
            >
              {product.product_name || 'Product'}
            </Link>
          ) : (
            <h3 className="text-lg font-semibold text-[#181d27]">
              {product.product_name || 'Product unavailable'}
            </h3>
          )}
          <p className="mt-0.5 text-sm font-medium text-[#079455]">
            {product.match_strength || 'Strong match'} · {score}% match
          </p>
        </div>
        <span className="rounded-full bg-[#ecfdf3] px-2.5 py-1 text-xs font-bold text-[#067647]">
          {score}%
        </span>
      </div>

      {product.best_for ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#717680]">
            Best for
          </p>
          <p className="mt-1 text-sm leading-6 text-[#344054]">
            {product.best_for}
          </p>
        </div>
      ) : null}

      {product.reasons?.length ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#717680]">
            Why it matches
          </p>
          <ul className="mt-2 space-y-1.5">
            {product.reasons.map((reason) => (
              <li
                key={reason}
                className="flex gap-2 text-sm leading-5 text-[#344054]"
              >
                <Check
                  size={15}
                  className="mt-0.5 shrink-0 text-[#079455]"
                  aria-hidden
                />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {product.considerations?.length ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#717680]">
            Considerations
          </p>
          <ul className="mt-2 space-y-1.5 text-sm leading-5 text-[#535862]">
            {product.considerations.map((item) => (
              <li key={item}>– {item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2 border-t border-[#e9eaeb] pt-3">
        {profileHref ? (
          <Link
            href={profileHref}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-[#d5d7da] px-3 text-sm font-semibold text-[#414651] hover:bg-[#fafafa]"
          >
            View product
            <ArrowUpRight size={14} />
          </Link>
        ) : null}
        <button
          type="button"
          disabled={updatingShortlist}
          onClick={async () => {
            setUpdatingShortlist(true)
            try {
              await onToggleShortlist()
            } finally {
              setUpdatingShortlist(false)
            }
          }}
          className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold ${
            shortlisted
              ? 'border border-[#d5d7da] text-[#414651] hover:bg-[#fafafa]'
              : 'bg-[#155eef] text-white hover:bg-[#0e4cc7]'
          } disabled:cursor-wait disabled:opacity-70`}
        >
          {updatingShortlist ? (
            <LoaderCircle size={14} className="animate-spin" />
          ) : shortlisted ? (
            <X size={14} />
          ) : (
            <Plus size={14} />
          )}
          {updatingShortlist
            ? shortlisted
              ? 'Removing…'
              : 'Adding…'
            : shortlisted
              ? 'Remove from shortlist'
              : 'Add to shortlist'}
        </button>
      </div>
    </article>
  )
}
