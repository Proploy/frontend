'use client'

import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { EvaluationEvidence } from '@/features/ai-workspace'

function valueText(value: unknown): string {
  if (typeof value === 'string') return value
  if (value === null || value === undefined) return 'Not available'
  return JSON.stringify(value)
}

export function EvidenceDrawer({
  evidence,
  loading,
  onClose,
}: {
  evidence: EvaluationEvidence | null
  loading: boolean
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="evidence-title"
      className="fixed inset-0 z-50 flex justify-end bg-[#101828]/25"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose()
      }}
    >
      <aside className="flex h-full w-full max-w-[460px] flex-col border-l border-[#e9eaeb] bg-white shadow-[-16px_0_40px_rgba(10,13,18,0.12)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#e9eaeb] px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#155eef]">
              Product evidence
            </p>
            <h2
              id="evidence-title"
              className="mt-1 text-lg font-semibold text-[#181d27]"
            >
              {evidence?.snapshot.product?.product_name ||
                'Evidence details'}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close evidence"
            className="flex size-9 items-center justify-center rounded-lg border border-[#e9eaeb] text-[#535862] hover:bg-[#fafafa]"
          >
            <X size={18} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {loading ? (
            <p className="text-sm text-[#717680]">
              Loading evidence…
            </p>
          ) : evidence ? (
            <div className="space-y-6">
              <section>
                <h3 className="text-sm font-semibold text-[#181d27]">
                  Product data used
                </h3>
                <div className="mt-2 space-y-2">
                  {(evidence.snapshot.claims || []).map(
                    (claim, index) => (
                      <div
                        key={`${String(claim.source_record_id)}-${index}`}
                        className="rounded-xl border border-[#e9eaeb] bg-[#fafafa] p-3"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#717680]">
                          {String(claim.field || 'Catalog claim')}
                        </p>
                        <p className="mt-1 text-sm leading-5 text-[#344054]">
                          {valueText(claim.value)}
                        </p>
                        <p className="mt-2 text-[11px] text-[#717680]">
                          {String(claim.source_kind || 'internal source')}
                          {claim.updated_at
                            ? ` · Updated ${String(claim.updated_at)}`
                            : ''}
                          {typeof claim.confidence === 'number'
                            ? ` · ${Math.round(claim.confidence * 100)}% confidence`
                            : ''}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </section>
              <section>
                <h3 className="text-sm font-semibold text-[#181d27]">
                  Review evidence
                </h3>
                <p className="mt-1 text-xs text-[#717680]">
                  Sample size:{' '}
                  {evidence.snapshot.review_sample_size ?? 'Unknown'}
                </p>
                <div className="mt-2 space-y-2">
                  {(evidence.snapshot.review_summaries || []).map(
                    (review, index) => (
                      <div
                        key={`${String(review.source_record_id)}-${index}`}
                        className="rounded-xl border border-[#e9eaeb] p-3"
                      >
                        <p className="text-xs font-semibold capitalize text-[#535862]">
                          {String(review.polarity || 'Review summary')}
                        </p>
                        <p className="mt-1 text-sm leading-5 text-[#344054]">
                          {String(
                            review.summary ||
                              'No review summary available',
                          )}
                        </p>
                        <p className="mt-2 text-[11px] text-[#717680]">
                          {String(
                            review.source_name || 'Internal review database',
                          )}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </section>
              <section>
                <h3 className="text-sm font-semibold text-[#181d27]">
                  Freshness and uncertainty
                </h3>
                <p className="mt-1 text-xs text-[#717680]">
                  Last updated:{' '}
                  {evidence.snapshot.last_updated || 'Unknown'}
                </p>
                {(evidence.snapshot.missing_or_uncertain || []).length ? (
                  <ul className="mt-2 space-y-1 text-sm text-[#b54708]">
                    {evidence.snapshot.missing_or_uncertain?.map(
                      (item) => <li key={item}>– {item}</li>,
                    )}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-[#067647]">
                    No material evidence gaps recorded.
                  </p>
                )}
              </section>
            </div>
          ) : (
            <p className="text-sm text-[#717680]">
              Evidence could not be loaded.
            </p>
          )}
        </div>
      </aside>
    </div>
  )
}
