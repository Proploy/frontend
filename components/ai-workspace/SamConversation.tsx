'use client'

import { Download, FileCheck2, SendHorizontal } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { EvaluationDetail } from '@/features/ai-workspace'
import { MarkdownMessage } from './MarkdownMessage'
import { RecommendationCard } from './RecommendationCard'
import { RequirementSummaryCard } from './RequirementSummaryCard'
import { RespondingStatus } from './RespondingStatus'
import { WelcomeState } from './WelcomeState'

function cleanMarkdown(content: string): string {
  if (!content) return ''
  return content
    .replace(/```json\s*\{\s*"SELECTED_PRODUCT_IDS"[\s\S]*?\}\s*```/gi, '')
    .replace(/\{\s*"SELECTED_PRODUCT_IDS"[\s\S]*?\}/gi, '')
    .trim()
}

export function SamConversation({
  evaluation,
  isSending,
  onSend,
  onConfirmRequirements,
}: {
  evaluation: EvaluationDetail
  isSending: boolean
  onSend: (message: string) => void
  onConfirmRequirements: () => void
}) {
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const followOutputRef = useRef(false)
  const scrollPositionsRef = useRef<Record<string, number>>({})

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const storageKey = `proploy:evaluation-scroll:${evaluation.evaluation_id}`
    const scrollPositions = scrollPositionsRef.current
    let saved = scrollPositions[evaluation.evaluation_id]
    if (saved === undefined) {
      try {
        const stored = window.sessionStorage.getItem(storageKey)
        saved = stored ? Number(stored) : 0
      } catch {
        saved = 0
      }
    }
    container.scrollTop = Number.isFinite(saved) ? saved : 0
    followOutputRef.current = false

    return () => {
      const position = container.scrollTop
      scrollPositions[evaluation.evaluation_id] = position
      try {
        window.sessionStorage.setItem(storageKey, String(position))
      } catch {
        // Scroll persistence is a progressive enhancement.
      }
    }
  }, [evaluation.evaluation_id])

  useEffect(() => {
    const container = scrollRef.current
    if (!container || !followOutputRef.current) return
    if (typeof container.scrollTo === 'function') {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      })
    } else {
      container.scrollTop = container.scrollHeight
    }
  }, [evaluation.messages, isSending])

  const submit = (message = draft) => {
    const value = message.trim()
    if (!value || isSending) return
    followOutputRef.current = true
    setDraft('')
    onSend(value)
  }

  const isEmpty =
    evaluation.messages.length === 0 &&
    !evaluation.requirements &&
    evaluation.matches.length === 0

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-white">
      <div
        ref={scrollRef}
        data-testid="sam-conversation-scroll"
        onScroll={(event) => {
          const container = event.currentTarget
          const position = container.scrollTop
          scrollPositionsRef.current[evaluation.evaluation_id] =
            position
          followOutputRef.current =
            container.scrollHeight -
              container.clientHeight -
              position <
            80
        }}
        className="min-h-0 flex-1 overflow-y-auto"
      >
        {isEmpty ? (
          <WelcomeState onPrompt={submit} />
        ) : (
          <div className="mx-auto w-full max-w-[960px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            {evaluation.messages.map((message, index) =>
              message.role === 'user' ? (
                <div
                  key={message.id}
                  className="flex justify-end pl-10 sm:pl-20"
                >
                  <div className="max-w-[620px] rounded-2xl rounded-br-md bg-[#eff4ff] px-4 py-3 text-[15px] leading-6 text-[#181d27]">
                    {message.markdown}
                  </div>
                </div>
              ) : (
                <div key={message.id} className="pr-3 sm:pr-6">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-[#155eef]">
                    SAM
                  </p>
                  <MarkdownMessage content={cleanMarkdown(message.markdown)} />
                  {message.status === 'streaming' ? (
                    <span className="inline-block size-2 animate-ping rounded-full bg-[#155eef] ml-1" />
                  ) : null}
                  {message.status === 'failed' ? (
                    <p className="mt-2 text-xs font-medium text-[#b42318]">
                      Response interrupted. The text received so far has
                      been kept—send a follow-up to continue.
                    </p>
                  ) : null}
                </div>
              ),
            )}

            {isSending ? (
              <div className="pr-3 sm:pr-6">
                <RespondingStatus seed={evaluation.messages.length} />
              </div>
            ) : null}

            {evaluation.requirements ? (
              <RequirementSummaryCard
                requirements={evaluation.requirements}
                missing={evaluation.missing_critical_signals}
                onEdit={() =>
                  setDraft(
                    'I want to update these requirements: ',
                  )
                }
                confirmed={
                  evaluation.milestones.requirements_confirmed
                }
                onConfirm={onConfirmRequirements}
              />
            ) : null}

            {evaluation.recommendation ? (
              <RecommendationCard
                recommendation={evaluation.recommendation}
              />
            ) : null}

            {evaluation.documents?.length ? (
              <div className="space-y-3">
                {evaluation.documents.map((doc, idx) => {
                  const docTitle = String(doc.title || 'Implementation Plan & Handoff Document')
                  const pdfUrl = typeof doc.pdf_url === 'string' ? doc.pdf_url : null
                  return (
                    <div
                      key={doc.doc_id ? String(doc.doc_id) : idx}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-[#84adff] bg-[#f5f8ff] p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#155eef] text-white">
                          <FileCheck2 size={20} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="truncate text-sm font-semibold text-[#181d27]">{docTitle}</h4>
                          <p className="text-xs text-[#535862]">Generated by SAM • Ready for export</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (pdfUrl) {
                            window.open(pdfUrl, '_blank')
                          } else {
                            window.print()
                          }
                        }}
                        className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-[#155eef] px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0e4cc7]"
                      >
                        <Download size={14} />
                        Export PDF
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="border-t border-[#e9eaeb] bg-white px-4 pb-4 pt-3 sm:px-6 sm:pb-5 sm:pt-4">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            submit()
          }}
          className="mx-auto flex w-full max-w-[960px] items-end gap-2 rounded-2xl border border-[#d5d7da] bg-white p-2.5 shadow-[0_4px_20px_rgba(10,13,18,0.07)] transition focus-within:border-[#84adff] focus-within:ring-4 focus-within:ring-[#155eef]/10"
        >
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === 'Enter' &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault()
                submit()
              }
            }}
            rows={1}
            placeholder="Describe your team, workflow, end goal, or ask about products…"
            className="max-h-32 min-h-11 min-w-0 flex-1 resize-none bg-transparent px-2.5 py-2.5 text-[15px] leading-6 text-[#181d27] outline-none placeholder:text-[#a4a7ae]"
          />
          <button
            type="submit"
            disabled={!draft.trim() || isSending}
            aria-label="Send message to SAM"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#155eef] text-white transition hover:bg-[#0e4cc7] disabled:cursor-not-allowed disabled:bg-[#d5d7da]"
          >
            <SendHorizontal size={17} />
          </button>
        </form>
        <p className="mx-auto mt-2.5 max-w-[960px] px-2 text-center text-xs leading-5 text-[#8a8f98]">
          SAM answers with evidence from Proploy&apos;s published catalog
          and reviews.
        </p>
      </div>
    </section>
  )
}
