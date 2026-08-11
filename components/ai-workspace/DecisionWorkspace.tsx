'use client'

import {
  PanelRightClose,
  PanelRightOpen,
  X,
} from 'lucide-react'
import { useState } from 'react'
import type { EvaluationDetail } from '@/features/ai-workspace'
import { ProductMatchCard } from './ProductMatchCard'
import { RecommendationPanel } from './RecommendationPanel'
import { ShortlistPanel } from './ShortlistPanel'

type Tab = 'results' | 'products' | 'shortlist'

export function DecisionWorkspace({
  evaluation,
  onReorder,
  onRemove,
  onToggleShortlist,
  onCompare,
  onGenerateRecommendation,
  onRetry,
  onClose,
  collapsed = false,
  onToggleCollapsed,
}: {
  evaluation: EvaluationDetail
  onReorder: (productIds: string[]) => void
  onRemove: (productId: string) => void
  onToggleShortlist: (
    productId: string,
    shortlisted: boolean,
  ) => void | boolean | Promise<boolean>
  onCompare: (productIds: string[]) => void
  onGenerateRecommendation: () => void
  onRetry: () => void
  onClose?: () => void
  collapsed?: boolean
  onToggleCollapsed?: () => void
}) {
  const recommendations = evaluation.matches
    .filter(m => m.is_agent_selected)
    .sort((a, b) => (b.match_score ?? 0) - (a.match_score ?? 0))
    .slice(0, 1)
  const products = evaluation.matches

  const [view, setView] = useState<{
    tab: Tab
    matchCount: number
    shortlistCount: number
  }>({
    tab: recommendations.length > 0 ? 'results' : products.length > 0 ? 'products' : 'shortlist',
    matchCount: evaluation.matches.length,
    shortlistCount: evaluation.shortlist.length,
  })

  if (
    view.matchCount !== evaluation.matches.length ||
    view.shortlistCount !== evaluation.shortlist.length
  ) {
    setView({
      tab:
        recommendations.length > 0 && view.tab === 'shortlist'
          ? 'results'
          : products.length > view.matchCount && view.tab !== 'results'
            ? 'products'
            : evaluation.shortlist.length > view.shortlistCount
              ? 'shortlist'
              : view.tab,
      matchCount: evaluation.matches.length,
      shortlistCount: evaluation.shortlist.length,
    })
  }
  const setTab = (tab: Tab) =>
    setView((current) => ({ ...current, tab }))
  const tab = view.tab

  if (collapsed) {
    return (
      <aside className="flex h-full min-h-0 flex-col items-center border-l border-[#e9eaeb] bg-white py-5">
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label="Expand decision workspace"
          title="Expand decision workspace"
          className="flex size-8 items-center justify-center rounded-lg text-[#717680] transition hover:bg-[#f5f8ff] hover:text-[#155eef]"
        >
          <PanelRightOpen size={17} />
        </button>
        <span className="mt-4 [writing-mode:vertical-rl] text-[10px] font-bold uppercase tracking-[0.14em] text-[#a4a7ae]">
          Decisions
        </span>
      </aside>
    )
  }

  const tabs: Array<{ id: Tab; label: string }> = [
    {
      id: 'results',
      label: recommendations.length > 0 ? 'Suggestion' : 'Suggestions 0',
    },
    {
      id: 'products',
      label: `Products ${products.length}`,
    },
    {
      id: 'shortlist',
      label: `Shortlist ${evaluation.shortlist.length}`,
    },
  ]

  const shortlistedIds = new Set(
    evaluation.shortlist.map((item) => item.product_id),
  )

  return (
    <aside className="flex h-full min-h-0 flex-col border-l border-[#e9eaeb] bg-white">
      <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#155eef]">
            Decision workspace
          </p>
          <h2 className="mt-1 text-base font-semibold text-[#181d27]">
            Build your decision
          </h2>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close decision workspace"
            className="flex size-8 items-center justify-center rounded-lg border border-[#e9eaeb] bg-white xl:hidden"
          >
            <X size={16} />
          </button>
        ) : onToggleCollapsed ? (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label="Collapse decision workspace"
            title="Collapse decision workspace"
            className="flex size-8 items-center justify-center rounded-lg text-[#717680] transition hover:bg-[#f5f8ff] hover:text-[#155eef]"
          >
            <PanelRightClose size={17} />
          </button>
        ) : null}
      </div>
      <div
        role="tablist"
        className="mx-3 flex rounded-xl bg-[#f2f4f7] p-1"
      >
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`min-w-0 flex-1 rounded-lg px-1.5 py-2 text-[11px] font-semibold transition ${
              tab === item.id
                ? 'bg-white text-[#181d27] shadow-sm'
                : 'text-[#717680] hover:text-[#414651]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        key={evaluation.evaluation_id}
        className="min-h-0 flex-1 overflow-y-auto px-3 py-4"
      >
        {tab === 'results' ? (
          recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((product) => {
                const shortlisted = shortlistedIds.has(product.product_id)
                return (
                  <ProductMatchCard
                    key={product.product_id}
                    product={product}
                    shortlisted={shortlisted}
                    onToggleShortlist={() =>
                      onToggleShortlist(product.product_id, shortlisted)
                    }
                  />
                )
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#d5d7da] bg-white px-4 py-5 text-center">
              <p className="text-sm font-semibold text-[#414651]">
                No suggestions yet
              </p>
              <p className="mt-1 text-xs leading-5 text-[#717680]">
                Once SAM evaluates options for you, the final suggestions will appear here.
              </p>
            </div>
          )
        ) : null}
        {tab === 'products' ? (
          products.length > 0 ? (
            <div className="space-y-3">
              {products.map((product) => {
                const shortlisted = shortlistedIds.has(product.product_id)
                return (
                  <ProductMatchCard
                    key={`prod-${product.product_id}`}
                    product={product}
                    shortlisted={shortlisted}
                    minimal={true}
                    onToggleShortlist={() =>
                      onToggleShortlist(product.product_id, shortlisted)
                    }
                  />
                )
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#d5d7da] bg-white px-4 py-5 text-center">
              <p className="text-sm font-semibold text-[#414651]">
                No products discovered
              </p>
              <p className="mt-1 text-xs leading-5 text-[#717680]">
                SAM will list all products it evaluates or searches for in this tab.
              </p>
            </div>
          )
        ) : null}
        {tab === 'shortlist' ? (
          <ShortlistPanel
            items={evaluation.shortlist}
            onReorder={onReorder}
            onRemove={onRemove}
            onCompare={onCompare}
          />
        ) : null}
      </div>
    </aside>
  )
}
