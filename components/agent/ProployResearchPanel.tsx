'use client'

import { useEffect, useRef, useState } from 'react'
import type { ComponentType, FormEvent, KeyboardEvent } from 'react'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Edit3,
  FileText,
  ImagePlus,
  Paperclip,
  Smile,
  Sparkles,
  X,
  Zap,
} from 'lucide-react'

import { useAuth } from '@/components/providers/auth-provider'
import { useProployAgent } from './proploy-agent-context'

type QuickPrompt = {
  label: string
  icon: ComponentType<{ className?: string }>
  prompt: string
}

const TYPING_DOT_DELAY_CLASSES = ['', '[animation-delay:140ms]', '[animation-delay:280ms]']
const LAUNCHER_ACTIVATION_THRESHOLD = 48

type ActivationPoint = {
  clientX: number
  clientY: number
  viewportWidth: number
  viewportHeight: number
  threshold?: number
}

export function isBottomRightActivationPoint({
  clientX,
  clientY,
  viewportWidth,
  viewportHeight,
  threshold = LAUNCHER_ACTIVATION_THRESHOLD,
}: ActivationPoint): boolean {
  if (
    clientX < 0
    || clientY < 0
    || clientX > viewportWidth
    || clientY > viewportHeight
  ) {
    return false
  }

  return (
    viewportWidth - clientX <= threshold
    && viewportHeight - clientY <= threshold
  )
}

function getQuickPrompts(pageType: string, productName?: string): QuickPrompt[] {
  if (pageType === 'product' && productName) {
    return [
      { label: 'Fit check', icon: ImagePlus, prompt: `Would ${productName} work for a small team?` },
      { label: 'Implementation', icon: Zap, prompt: `What would implementation look like for ${productName}?` },
      { label: 'Alternatives', icon: BarChart3, prompt: `Show me the best alternatives to ${productName}.` },
      { label: 'Pricing', icon: FileText, prompt: `Summarize ${productName} pricing tiers.` },
      { label: 'Compare', icon: Edit3, prompt: `Compare ${productName} to its top 3 competitors.` },
      { label: 'More', icon: Sparkles, prompt: `Tell me more about ${productName}.` },
    ]
  }

  if (pageType === 'catalog') {
    return [
      { label: 'Find software', icon: ImagePlus, prompt: 'I need software for HR in India' },
      { label: 'Compare options', icon: BarChart3, prompt: 'Compare the top options for a 40-person team' },
      { label: 'Quickest deploy', icon: Zap, prompt: 'Which tool is easiest to implement quickly?' },
      { label: 'Summarize', icon: FileText, prompt: 'Summarize my current shortlist' },
      { label: 'Help me write', icon: Edit3, prompt: 'Help me write an RFP brief' },
      { label: 'More', icon: Sparkles, prompt: 'What else should I consider?' },
    ]
  }

  return [
    { label: 'Create image', icon: ImagePlus, prompt: 'Create an image of...' },
    { label: 'Analyze data', icon: BarChart3, prompt: 'Help me analyze some data' },
    { label: 'Make a plan', icon: Zap, prompt: 'Help me make a plan for...' },
    { label: 'Summarize text', icon: FileText, prompt: 'Summarize this text for me' },
    { label: 'Help me write', icon: Edit3, prompt: 'Help me write...' },
    { label: 'More', icon: Sparkles, prompt: 'What else can you help with?' },
  ]
}

function TypingDots() {
  return (
    <div className="flex items-end gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`block h-1 w-1 animate-bounce rounded-full bg-gray-500 [animation-duration:900ms] ${TYPING_DOT_DELAY_CLASSES[i]}`}
        />
      ))}
    </div>
  )
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="h-px flex-1 bg-gray-200" />
      <p className="text-sm-medium text-gray-600">{label}</p>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  )
}

export default function ProployResearchPanel() {
  const pathname = usePathname()
  const {
    isOpen,
    setIsOpen,
    pageContext,
    messages,
    sendMessage,
    isSending,
    lastError,
    recommendations,
  } = useProployAgent()
  const { user } = useAuth()

  const [draft, setDraft] = useState('')
  const [launcherRevealed, setLauncherRevealed] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const launcherHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const coarsePointerRef = useRef(false)
  const isDedicatedWorkspace = pathname?.startsWith('/AI_workspace') ?? false

  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'
  const quickPrompts = getQuickPrompts(
    pageContext.page_type,
    typeof pageContext.product_name === 'string' ? pageContext.product_name : undefined,
  )

  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages.length, isSending])

  useEffect(() => {
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    coarsePointerRef.current = coarsePointer
    if (coarsePointer) {
      return
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!isBottomRightActivationPoint({
        clientX: event.clientX,
        clientY: event.clientY,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      })) {
        return
      }

      if (launcherHideTimerRef.current) clearTimeout(launcherHideTimerRef.current)
      setLauncherRevealed(true)
      launcherHideTimerRef.current = setTimeout(() => {
        setLauncherRevealed(false)
        launcherHideTimerRef.current = null
      }, 1400)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      if (launcherHideTimerRef.current) clearTimeout(launcherHideTimerRef.current)
    }
  }, [])

  const keepLauncherVisible = () => {
    if (launcherHideTimerRef.current) clearTimeout(launcherHideTimerRef.current)
    launcherHideTimerRef.current = null
    setLauncherRevealed(true)
  }

  const scheduleLauncherHide = () => {
    if (coarsePointerRef.current) return
    if (launcherHideTimerRef.current) clearTimeout(launcherHideTimerRef.current)
    launcherHideTimerRef.current = setTimeout(() => {
      setLauncherRevealed(false)
      launcherHideTimerRef.current = null
    }, 350)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = draft.trim()
    if (!value || isSending) return
    setDraft('')
    await sendMessage(value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  const handleQuickPrompt = async (prompt: string) => {
    if (isSending) return
    await sendMessage(prompt)
  }

  const isEmpty = messages.length === 0

  if (isDedicatedWorkspace) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onPointerEnter={keepLauncherVisible}
        onPointerLeave={scheduleLauncherHide}
        onFocus={keepLauncherVisible}
        onBlur={scheduleLauncherHide}
        aria-label="Open Proploy Chatbot"
        className={`fixed bottom-6 right-6 z-[90] flex items-center gap-2 rounded-full bg-brand-700 px-4 py-3 text-white shadow-[0_10px_30px_rgba(0,78,235,0.35)] transition-all duration-200 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
          isOpen
            ? 'opacity-0 pointer-events-none translate-y-2'
            : launcherRevealed
              ? 'opacity-100 pointer-events-auto translate-y-0'
              : 'opacity-0 pointer-events-none translate-y-2 max-md:opacity-100 max-md:pointer-events-auto max-md:translate-y-0 [@media(pointer:coarse)]:opacity-100 [@media(pointer:coarse)]:pointer-events-auto [@media(pointer:coarse)]:translate-y-0'
        }`}
      >
        <Sparkles className="h-4 w-4" />
        <span className="text-sm-semibold">Ask Proploy</span>
      </button>

      <div
        onClick={() => setIsOpen(false)}
        aria-hidden
        className={`fixed inset-0 z-[94] bg-black/10 transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-[95] flex h-dvh w-full max-w-[432px] flex-col overflow-hidden border-l border-gray-200 bg-white shadow-[0_24px_48px_-12px_rgba(10,13,18,0.18)] transition-transform duration-300 ease-out font-[family-name:var(--font-dm-sans)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center gap-4 border-b border-gray-200 px-6 pt-5 pb-5">
          <p className="flex-1 min-w-0 text-lg-semibold text-gray-900">Proploy Chatbot</p>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            aria-label="Close chatbot"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          ref={scrollRef}
          className={`flex-1 overflow-y-auto bg-white px-6 ${
            isEmpty ? 'flex flex-col items-center justify-center' : 'pt-6 pb-6'
          }`}
        >
          {isEmpty ? (
            <div className="flex w-full flex-col items-center gap-8 px-4 py-6">
              <div className="flex flex-col items-center gap-5 w-full">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-950 shadow-[0_8.5px_11.4px_-2.9px_rgba(10,13,18,0.08),0_2.9px_4.3px_-1.4px_rgba(10,13,18,0.03),0_1.4px_1.4px_-0.7px_rgba(10,13,18,0.04)]">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex flex-col w-full">
                    <p className="text-md-semibold text-gray-500">Hi {firstName},</p>
                    <p className="text-md-semibold text-gray-900">Welcome back! How can I help?</p>
                  </div>
                  <p className="text-sm-regular text-gray-600">
                    I&apos;m here to help tackle your tasks. Choose from the prompts below or tell me what you need!
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-start justify-center gap-2 w-full">
                {quickPrompts.map(({ label, icon: Icon, prompt }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleQuickPrompt(prompt)}
                    disabled={isSending}
                    className="flex items-center gap-1 rounded-md border border-gray-300 bg-white pl-2 pr-2.5 py-1 shadow-[0_1px_2px_rgba(10,13,18,0.05)] transition-colors hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Icon className="h-3 w-3 text-gray-700" />
                    <span className="text-sm-medium text-gray-700">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 pb-4">
              <SectionDivider label="Today" />

              {messages.map((message) => {
                const isUser = message.role === 'user'
                return (
                  <div
                    key={message.id}
                    className={`flex w-full ${isUser ? 'justify-end pl-8' : 'pr-8'}`}
                  >
                    <div
                      className={`max-w-[312px] rounded-md border border-gray-200 px-3 py-2 ${
                        isUser ? 'bg-white rounded-tr-none' : 'bg-gray-50 rounded-tl-none'
                      }`}
                    >
                      <p className="text-md-regular text-gray-900 whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                )
              })}

              {isSending ? (
                <div className="flex pr-8">
                  <div className="rounded-md rounded-tl-none border border-gray-200 bg-gray-50 px-2.5 py-2.5">
                    <TypingDots />
                  </div>
                </div>
              ) : null}

              {lastError ? (
                <div className="rounded-md border border-error-200 bg-error-50 px-3 py-2 text-sm-regular text-error-700">
                  {lastError}
                </div>
              ) : null}

              {recommendations.length > 0 ? (
                <div className="flex flex-col gap-2 pt-2">
                  <p className="text-sm-semibold text-gray-700">Shortlist</p>
                  {recommendations.map((item, index) => (
                    <div
                      key={String(item.product_id ?? index)}
                      className="rounded-md border border-gray-200 bg-white p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm-semibold text-gray-900">
                          {String(item.product_name ?? 'Untitled')}
                        </p>
                        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs-semibold text-brand-700">
                          {String(item.fit_score ?? 0)}
                        </span>
                      </div>
                      {item.why_it_fits ? (
                        <p className="mt-1 text-sm-regular text-gray-600">
                          {String(item.why_it_fits)}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 bg-white px-6 pt-5 pb-6">
          <form onSubmit={handleSubmit} className="relative h-32">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message"
              disabled={isSending}
              className="block h-full w-full resize-none rounded-md border border-gray-300 bg-white px-3.5 py-3 pb-12 text-md-regular text-gray-900 placeholder:text-gray-500 shadow-[0_1px_2px_rgba(10,13,18,0.05)] outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:bg-gray-50"
            />
            <div className="absolute bottom-2 right-3.5 flex items-center gap-2">
              <button
                type="button"
                aria-label="Attach file"
                className="flex h-7 w-7 items-center justify-center rounded-sm text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Add emoji"
                className="flex h-7 w-7 items-center justify-center rounded-sm text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
              >
                <Smile className="h-4 w-4" />
              </button>
              <button
                type="submit"
                disabled={isSending || !draft.trim()}
                className="px-1 text-sm-semibold text-brand-700 transition-opacity hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSending ? 'Sending…' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </aside>
    </>
  )
}
