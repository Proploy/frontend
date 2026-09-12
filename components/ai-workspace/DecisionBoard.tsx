'use client'

import Link from 'next/link'
import { Bookmark, BookmarkCheck, Columns3, FileCheck2, Maximize2, Sparkles, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import type { EvaluationProduct } from '@/features/ai-workspace'
import { BRIEF_LABELS, compareHref, rankProducts, type Journey } from '@/features/ai-workspace/journey'
import { ProductMatchCard, type ProductCardAction } from './ProductMatchCard'
import { productDisplayName } from '@/features/ai-workspace/journey'

export type BoardLane = 'matches' | 'shortlist' | 'artifacts'

const LANES: Array<{ id: BoardLane; label: string }> = [
  { id: 'matches', label: 'Matches' },
  { id: 'shortlist', label: 'Shortlist' },
  { id: 'artifacts', label: 'Artifacts' },
]

/**
 * The buyer's decision board, in three lanes that read left to right as the
 * decision itself does:
 *
 *   Matches    — everything Sam put forward, best score first
 *   Shortlist  — what the buyer kept, and what can be made from that set
 *   Artifacts  — reserved; what the buyer creates here is not designed yet
 *
 * What Sam can do next lives on the products themselves rather than in a
 * separate prompt, and both briefs hang off the shortlist: a kept product's
 * card is where its implementation brief and a comparison of the set are
 * asked for. Keeping is therefore the one thing a match asks for — a brief is
 * worth writing once the buyer has said the product is worth one. Nothing
 * here mutates the evaluation on its own: shortlisting persists through the
 * gateway's shortlist endpoint, and both briefs are chat requests Sam acts on.
 */
export function DecisionBoard({
  journey,
  shortlist,
  busy = false,
  layout = 'tabs',
  onToggleShortlist,
  onRequestComparisonBrief,
  onRequestImplementationBrief,
  onOpenDocument,
}: {
  journey: Journey
  shortlist: EvaluationProduct[]
  /** True while Sam is responding; the actions that send a turn wait. */
  busy?: boolean
  /** `tabs` for the results column, `columns` for the expanded board. */
  layout?: 'tabs' | 'columns'
  onToggleShortlist?: (product: EvaluationProduct) => void
  onRequestComparisonBrief?: (products: EvaluationProduct[]) => void
  onRequestImplementationBrief?: (product: EvaluationProduct) => void
  onOpenDocument?: (docId: string) => void
}) {
  const [lane, setLane] = useState<BoardLane>('matches')
  const products = journey.products
  const kept = rankProducts(shortlist)
  const keptIds = new Set(kept.map((product) => product.product_id))
  // Newest brief first: the one Sam just wrote is the one being looked for.
  const documents = [...journey.documents].reverse()
  const counts: Record<BoardLane, number | null> = {
    matches: products.length,
    shortlist: kept.length,
    artifacts: null,
  }

  /**
   * Everything a kept product can be turned into, on the product itself.
   * Both are `agent` actions: they hand Sam a prompt and wait for it to write
   * back, unlike the comparison page above, which is simply a page. The
   * comparison covers the whole shortlist either way, but it leads with the
   * card it was asked from, so the brief opens on the product the buyer had
   * in mind. With nothing to compare against, it simply is not offered.
   */
  const keptActions = (product: EvaluationProduct): ProductCardAction[] => [
    ...(onRequestComparisonBrief && kept.length >= 2
      ? [
          {
            label: 'Comparison brief',
            tone: 'agent' as const,
            icon: <Sparkles size={13} aria-hidden />,
            disabled: busy,
            onClick: () =>
              onRequestComparisonBrief([
                product,
                ...kept.filter((item) => item.product_id !== product.product_id),
              ]),
          },
        ]
      : []),
    ...(onRequestImplementationBrief
      ? [
          {
            label: 'Implementation brief',
            tone: 'agent' as const,
            icon: <Sparkles size={13} aria-hidden />,
            disabled: busy,
            onClick: () => onRequestImplementationBrief(product),
          },
        ]
      : []),
  ]

  const matchesLane = products.length ? (
    <ol className="space-y-3">
      {products.map((product, index) => {
        const on = keptIds.has(product.product_id)
        return (
          <li key={product.product_id}>
            <ProductMatchCard
              product={product}
              rank={index + 1}
              actions={
                onToggleShortlist
                  ? [
                      {
                        label: on ? 'Shortlisted' : 'Shortlist',
                        active: on,
                        icon: on ? (
                          <BookmarkCheck size={13} aria-hidden />
                        ) : (
                          <Bookmark size={13} aria-hidden />
                        ),
                        onClick: () => onToggleShortlist(product),
                      },
                    ]
                  : []
              }
            />
          </li>
        )
      })}
    </ol>
  ) : (
    <LaneEmpty
      title="Nothing to show yet"
      body="Products Sam recommends in the conversation are collected here, strongest match first."
    />
  )

  const shortlistLane = kept.length ? (
    <>
      <div className="mb-3">
        <Link
          href={compareHref(kept)}
          target="_blank"
          rel="noopener"
          aria-disabled={kept.length < 2}
          onClick={(event) => {
            if (kept.length < 2) event.preventDefault()
          }}
          className={`inline-flex h-9 items-center gap-2 rounded-full px-4 text-[0.8125rem] font-medium transition-colors ${
            kept.length < 2
              ? 'pointer-events-none border border-border bg-white text-ink-soft opacity-60'
              : 'bg-ink text-paper hover:bg-cobalt'
          }`}
        >
          <Columns3 size={14} aria-hidden />
          Compare {kept.length} side by side
        </Link>
      </div>
      {kept.length < 2 ? (
        <p className="mb-3 text-[0.75rem] text-ink-soft">
          Keep a second product to compare this set.
        </p>
      ) : null}
      <ol className="space-y-3">
        {kept.map((product) => (
          <li key={product.product_id}>
            <ProductMatchCard
              product={product}
              actions={keptActions(product)}
              cornerAction={
                onToggleShortlist
                  ? {
                      label: `Remove ${productDisplayName(product)} from the shortlist`,
                      icon: <X size={14} aria-hidden />,
                      onClick: () => onToggleShortlist(product),
                    }
                  : undefined
              }
            />
          </li>
        ))}
      </ol>
    </>
  ) : (
    <LaneEmpty
      title="No shortlist yet"
      body="Keep the products worth a closer look and they collect here, ready to compare."
    />
  )

  // Reserved. What the buyer creates in this lane is not designed yet, so it
  // says so plainly rather than borrowing content from the lanes beside it.
  const artifactsLane = <LaneEmpty title="Nothing here yet" body="This lane is reserved for artifacts." />

  const lanes: Record<BoardLane, ReactNode> = {
    matches: matchesLane,
    shortlist: shortlistLane,
    artifacts: artifactsLane,
  }

  // The briefs Sam has already written sit under the board rather than in a
  // lane: they belong to the evaluation as a whole, not to one step of it.
  const briefs = documents.length ? (
    <section aria-label="Briefs" className="mt-6">
      <p className="label px-1">Briefs</p>
      <ol className="mt-2 space-y-2">
        {documents.map((doc) => (
          <li key={doc.doc_id}>
            <article className="lift flex items-start gap-2.5 rounded-xl border border-border bg-white px-3 py-2.5">
              <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-ink text-paper">
                <FileCheck2 size={15} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="label block !text-[0.6rem] !text-cobalt-deep">
                  {BRIEF_LABELS[doc.kind]}
                  {doc.productName ? ` · ${doc.productName}` : ''}
                </span>
                <span className="block truncate text-[0.85rem] font-medium text-ink">{doc.title}</span>
              </span>
              <button
                type="button"
                onClick={() => onOpenDocument?.(doc.doc_id)}
                aria-label={`Open ${doc.title}`}
                title={`Open ${doc.title}`}
                className="grid size-7 shrink-0 place-items-center rounded-full border border-border text-ink-soft transition-colors hover:border-cobalt hover:text-cobalt"
              >
                <Maximize2 size={13} aria-hidden />
              </button>
            </article>
          </li>
        ))}
      </ol>
    </section>
  ) : null

  if (layout === 'columns') {
    return (
      <div data-testid="decision-board">
        <div className="grid gap-4 md:grid-cols-3">
          {LANES.map((entry) => (
            <section key={entry.id} aria-label={entry.label} className="min-w-0">
              <p className="label mb-2 px-1">
                {entry.label}
                {counts[entry.id] ? ` · ${counts[entry.id]}` : ''}
              </p>
              {lanes[entry.id]}
            </section>
          ))}
        </div>
        {briefs}
      </div>
    )
  }

  return (
    <div data-testid="decision-board">
      <div role="tablist" aria-label="Decision board" className="mb-3 flex gap-1 rounded-full border border-border bg-white p-1">
        {LANES.map((entry) => {
          const on = entry.id === lane
          return (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setLane(entry.id)}
              className={`h-7 flex-1 rounded-full text-[0.72rem] font-medium transition-colors ${
                on ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink'
              }`}
            >
              {entry.label}
              {counts[entry.id] ? (
                <span className={on ? 'ml-1 text-paper/70' : 'ml-1 text-ink-soft'}>{counts[entry.id]}</span>
              ) : null}
            </button>
          )
        })}
      </div>
      {lanes[lane]}
      {briefs}
    </div>
  )
}

function LaneEmpty({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-white/60 px-4 py-6 text-center">
      <p className="text-[0.875rem] font-medium text-ink">{title}</p>
      <p className="mt-1 text-[0.78rem] leading-5 text-ink-soft">{body}</p>
    </div>
  )
}
