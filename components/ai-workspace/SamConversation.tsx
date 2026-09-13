'use client'

import { SendHorizontal } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { EvaluationDetail } from '@/features/ai-workspace'
import {
  COMPOSER_MAX_HEIGHT,
  COMPOSER_MIN_HEIGHT,
  clampComposerHeight,
  composerOverflows,
  scrollAdjustmentFor,
} from '@/features/ai-workspace/composer-autogrow'
import { deriveJourney } from '@/features/ai-workspace/journey'
import { DocumentCard } from './DocumentCard'
import { MarkdownMessage } from './MarkdownMessage'
import { RequirementSummaryCard } from './RequirementSummaryCard'
import { RespondingStatus } from './RespondingStatus'
import { WelcomeState } from './WelcomeState'

/** `useLayoutEffect` warns when React renders on the server, and the workspace
 *  page is server-rendered. Measuring a textarea only means anything in a
 *  browser, so fall back to `useEffect` where there is no layout to read. */
const useMeasureEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

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

  // How much conversation there is, not which array holds it. The hook rebuilds
  // `messages` on every streamed token, so keying the scroll on the array
  // identity ran it for renders where nothing had actually been added.
  const conversationLength = useMemo(
    () =>
      evaluation.messages.reduce(
        (total, message) => total + (message.markdown?.length ?? 0),
        0,
      ),
    [evaluation.messages],
  )

  useEffect(() => {
    const container = scrollRef.current
    if (!container || !followOutputRef.current) return
    // While tokens are arriving, jump. A smooth scroll is an animation, and
    // each token started a new one before the last had finished, so the
    // viewport never actually reached the text being written — it sat still
    // and then lurched to the bottom once the deltas stopped. Instant
    // per-token scrolling is what reads as smooth following.
    if (typeof container.scrollTo === 'function') {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: isSending ? 'auto' : 'smooth',
      })
    } else {
      container.scrollTop = container.scrollHeight
    }
  }, [conversationLength, evaluation.messages.length, isSending])

  // The composer grows with the draft rather than scrolling a one-line box.
  // Measuring needs the height released first, which drops the textarea's own
  // scroll offset — so it goes back afterwards, or the caret vanishes the
  // moment the draft passes the cap.
  const composerHeightRef = useRef(COMPOSER_MIN_HEIGHT)
  const measureComposer = useCallback(() => {
    const node = composerRef.current
    if (!node) return
    const caretAtEnd = node.selectionStart === node.value.length
    const innerScroll = node.scrollTop

    node.style.height = 'auto'
    const contentHeight = node.scrollHeight
    const nextHeight = clampComposerHeight(contentHeight)
    node.style.height = `${nextHeight}px`
    node.style.overflowY = composerOverflows(contentHeight) ? 'auto' : 'hidden'
    node.scrollTop = caretAtEnd ? node.scrollHeight : innerScroll

    const delta = scrollAdjustmentFor(composerHeightRef.current, nextHeight)
    composerHeightRef.current = nextHeight
    const container = scrollRef.current
    if (!container || delta === 0) return
    // Assigned, never animated: this runs on a keystroke, and a smooth
    // correction would trail the typing by a line.
    container.scrollTop += delta
  }, [])

  useMeasureEffect(measureComposer, [draft, measureComposer])

  // A narrower composer rewraps the same draft onto more lines.
  useEffect(() => {
    window.addEventListener('resize', measureComposer)
    return () => window.removeEventListener('resize', measureComposer)
  }, [measureComposer])

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

      {/* `shrink-0` is what anchors the composer: it always takes its natural
          height, so the conversation above is the side that gives up the
          pixels when the draft grows. */}
      <div className="flex min-h-[88px] w-full shrink-0 items-center border-t border-border bg-paper px-4 py-3 sm:px-6">
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
            style={{
              minHeight: COMPOSER_MIN_HEIGHT,
              maxHeight: COMPOSER_MAX_HEIGHT,
            }}
            className="min-w-0 flex-1 resize-none overflow-y-hidden bg-transparent px-2.5 py-2.5 text-[15px] leading-6 text-ink outline-none placeholder:text-ink-soft/80"
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
