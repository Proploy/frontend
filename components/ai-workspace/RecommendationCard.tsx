'use client'

import Link from 'next/link'
import { Download, FileCheck2 } from 'lucide-react'
import type { EvaluationRecommendation } from '@/features/ai-workspace'

export function RecommendationCard({
  recommendation,
  onEvidence,
}: {
  recommendation: EvaluationRecommendation
  onEvidence?: () => void
}) {
  const product = recommendation.recommended_product
  return (
    <article className="overflow-hidden rounded-2xl border border-[#84adff] bg-white shadow-[0_6px_24px_rgba(21,94,239,0.10)]">
      <div className="bg-[#eff4ff] px-4 py-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#155eef]">
          <FileCheck2 size={16} />
          Recommended product
          {recommendation.publication_state === 'updating' ? (
            <span className="ml-auto rounded-full border border-[#84adff] bg-white px-2 py-0.5 normal-case tracking-normal">
              Updating
            </span>
          ) : null}
        </div>
        {product.profile_href ? (
          <Link
            href={product.profile_href}
            className="mt-2 block text-xl font-semibold text-[#181d27] hover:text-[#155eef]"
          >
            {product.product_name || product.product_id}
          </Link>
        ) : (
          <h3 className="mt-2 text-xl font-semibold text-[#181d27]">
            {product.product_name || product.product_id}
          </h3>
        )}
      </div>
      <div className="space-y-4 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#717680]">
            Why it won
          </p>
          <ul className="mt-2 space-y-1.5 text-sm leading-5 text-[#344054]">
            {recommendation.why_it_won.map((item) => (
              <li key={item}>✓ {item}</li>
            ))}
          </ul>
        </div>
        {recommendation.main_trade_offs.length ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#717680]">
              Main trade-offs
            </p>
            <ul className="mt-2 space-y-1.5 text-sm leading-5 text-[#535862]">
              {recommendation.main_trade_offs.map((item) => (
                <li key={item}>– {item}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {recommendation.estimated_cost ? (
          <p className="text-sm text-[#344054]">
            <span className="font-semibold">Estimated cost:</span>{' '}
            {recommendation.estimated_cost}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2 border-t border-[#e9eaeb] pt-3">
          {onEvidence ? (
            <button
              type="button"
              onClick={onEvidence}
              className="h-9 rounded-lg border border-[#d5d7da] px-3 text-sm font-semibold text-[#414651] hover:bg-[#fafafa]"
            >
              Supporting evidence
            </button>
          ) : null}
          <button
            type="button"
            className="flex h-9 items-center gap-1.5 rounded-lg bg-[#155eef] px-3 text-sm font-semibold text-white hover:bg-[#0e4cc7]"
          >
            <Download size={14} />
            Export recommendation
          </button>
        </div>
      </div>
    </article>
  )
}
