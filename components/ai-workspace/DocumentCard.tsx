'use client'

import { ChevronDown, ChevronUp, Download, FileCheck2, LoaderCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { asBattleCard, asProjectBrief } from '@/features/ai-workspace/brief-types'
import { sanitizeDocumentHtml } from '@/features/ai-workspace/document-html'
import { BRIEF_LABELS, type BriefDocument } from '@/features/ai-workspace/journey'
import { BattleCardView } from './BattleCardView'
import { ImplementationBriefView } from './ImplementationBriefView'

export function documentElementId(docId: string): string {
  return `ai-workspace-document-${docId}`
}

/**
 * A brief Sam generated. Structured briefs render natively (comparison
 * matrix / implementation plan); anything else falls back to sanitized HTML.
 */
export function DocumentCard({
  document,
  onExportPdf,
}: {
  document: BriefDocument
  onExportPdf?: (docId: string) => Promise<boolean> | boolean | void
}) {
  const [expanded, setExpanded] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [exportFailed, setExportFailed] = useState(false)
  const battleCard = useMemo(() => (document.kind === 'comparison' ? asBattleCard(document.data) : null), [document])
  const projectBrief = useMemo(() => (document.kind === 'implementation' ? asProjectBrief(document.data) : null), [document])
  const safeHtml = useMemo(
    () => (battleCard || projectBrief ? '' : sanitizeDocumentHtml(document.html ?? '')),
    [battleCard, projectBrief, document.html],
  )
  const hasBody = Boolean(battleCard || projectBrief || safeHtml)

  return (
    <article
      id={documentElementId(document.doc_id)}
      data-testid="document-card"
      className="scroll-mt-4 overflow-hidden rounded-2xl border border-border bg-white shadow-[0_22px_60px_-40px_color-mix(in_oklab,var(--cobalt)_45%,transparent)]"
    >
      <div className="flex items-center justify-between gap-4 border-b border-border bg-paper px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink text-paper">
            <FileCheck2 size={18} aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="label !text-cobalt-deep">
              {BRIEF_LABELS[document.kind]}
              {document.productName ? ` · ${document.productName}` : ''}
            </p>
            <h4 className="truncate text-[0.95rem] font-semibold text-ink">{document.title}</h4>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {hasBody ? (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              className="inline-flex h-9 items-center gap-1 rounded-full border border-border bg-white px-3 text-[0.8125rem] font-medium text-ink transition-colors hover:border-cobalt/50"
            >
              {expanded ? 'Collapse' : 'Expand'}
              {expanded ? <ChevronUp size={14} aria-hidden /> : <ChevronDown size={14} aria-hidden />}
            </button>
          ) : null}
          {onExportPdf ? (
            <button
              type="button"
              disabled={exporting}
              onClick={async () => {
                setExporting(true)
                setExportFailed(false)
                try {
                  const ok = await onExportPdf(document.doc_id)
                  if (ok === false) setExportFailed(true)
                } catch {
                  setExportFailed(true)
                } finally {
                  setExporting(false)
                }
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-3.5 text-[0.8125rem] font-medium text-paper transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
            >
              {exporting ? <LoaderCircle size={14} className="animate-spin" aria-hidden /> : <Download size={14} aria-hidden />}
              {exporting ? 'Exporting…' : 'Export PDF'}
            </button>
          ) : null}
        </div>
      </div>
      {exportFailed ? (
        <p className="border-b border-border bg-paper px-5 py-2 text-[0.8125rem] text-ink-soft">
          The PDF could not be exported. Try again in a moment.
        </p>
      ) : null}
      {expanded && battleCard ? <BattleCardView card={battleCard} /> : null}
      {expanded && projectBrief ? <ImplementationBriefView brief={projectBrief} /> : null}
      {expanded && safeHtml ? (
        <div className="doc-prose overflow-x-auto px-5 py-4" dangerouslySetInnerHTML={{ __html: safeHtml }} />
      ) : null}
    </article>
  )
}
