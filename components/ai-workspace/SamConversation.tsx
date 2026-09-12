'use client'

import { SendHorizontal } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { EvaluationDetail } from '@/features/ai-workspace'
import { deriveJourney } from '@/features/ai-workspace/journey'
import { DocumentCard } from './DocumentCard'
import { MarkdownMessage } from './MarkdownMessage'
import { RequirementSummaryCard } from './RequirementSummaryCard'
import { RespondingStatus } from './RespondingStatus'
import { WelcomeState } from './WelcomeState'

export function SamConversation({
  evaluation,
  isSending,
  onSend,
  onConfirmRequirements,
  onExportDocument,
  prefill,
}: {
  evaluation: EvaluationDetail
  isSending: boolean
  onSend: (message: string) => void
  onConfirmRequirements: () => void
  onExportDocument?: (docId: string) => Promise<boolean> | boolean | void
  /** Text pushed into the composer from elsewhere (the requirement chips).
   *  `nonce` lets the same text be sent twice in a row. */
  prefill?: { text: string; nonce: number } | null
}) {
  const [draft, setDraft] = useState('')
  const composerRef = useRef<HTMLTextAreaElement | null>(null)
  // A chip in the results panel prefills rather than sends, so the buyer
  // finishes the sentence themselves. Focus follows the text in, and the
  // caret goes to the end so they can just keep typing.
  const prefillNonce = prefill?.nonce
  useEffect(() => {
    if (!prefill?.text) return
    setDraft(prefill.text)
    const node = composerRef.current
    if (!node) return
    node.focus()
    node.setSelectionRange(prefill.text.length, prefill.text.length)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillNonce])

  const journey = useMemo(() => deriveJourney(evaluation), [evaluation])
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
        className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain"
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
                  <div className="max-w-[620px] rounded-2xl rounded-br-md bg-ink px-4 py-3 text-[0.9375rem] leading-6 text-paper">
                    {message.markdown}
                  </div>
                </div>
              ) : (
                <div key={message.id} className="pr-3 sm:pr-6">
                  <p className="label mb-2 flex items-center gap-2 !text-cobalt-deep">
                    <span className="pulse-dot size-1.5 rounded-full bg-cobalt" aria-hidden />
                    Sam
                  </p>
                  <MarkdownMessage content={message.markdown} />
                  {message.status === 'streaming' ? (
                    <span className="sr-only">SAM is typing...</span>
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

            {journey.documents.length ? (
              <div className="space-y-3">
                {journey.documents.map((doc) => (
                  <DocumentCard key={doc.doc_id} document={doc} onExportPdf={onExportDocument} />
                ))}
              </div>
            ) : null}

          </div>
        )}
      </div>

      <div className="flex min-h-[88px] w-full items-center border-t border-border bg-paper px-4 sm:px-6">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            submit()
          }}
          className="glass-card mx-auto flex w-full max-w-[960px] items-end gap-2 rounded-2xl p-2.5 transition focus-within:border-cobalt/50"
        >
          <textarea
            ref={composerRef}
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
            disabled={isSending}
            placeholder="Describe your team, workflow, end goal, or ask about products..."
            rows={1}
            className="max-h-32 min-h-11 min-w-0 flex-1 resize-none bg-transparent px-2.5 py-2.5 text-[15px] leading-6 text-ink outline-none placeholder:text-ink-soft/80"
          />
          <button
            type="submit"
            disabled={!draft.trim() || isSending}
            aria-label="Send message"
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink text-paper transition-colors hover:bg-cobalt disabled:cursor-not-allowed disabled:opacity-40"
            data-active={draft.trim().length > 0 && !isSending}
          >
            <SendHorizontal size={17} />
          </button>
        </form>
      </div>
    </section>
  )
}
