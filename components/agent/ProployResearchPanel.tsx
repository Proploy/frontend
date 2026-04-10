'use client'

import { useMemo } from 'react'
import { Bot, ChevronRight, MessageSquare, Sparkles, X } from 'lucide-react'

import { useProployAgent } from './proploy-agent-context'

function getQuickPrompts(pageType: string, productName?: string) {
  if (pageType === 'product' && productName) {
    return [
      `Would ${productName} work for a small team?`,
      `What would implementation look like for ${productName}?`,
      `Show me the best alternatives to ${productName}.`,
    ]
  }

  if (pageType === 'catalog') {
    return [
      'I need software for HR in India',
      'Compare the top options for a 40-person team',
      'Which tool is easiest to implement quickly?',
    ]
  }

  return [
    'I need help choosing software for my business',
    'Shortlist the best fit from what I am looking at',
    'What should I ask before making a decision?',
  ]
}

export default function ProployResearchPanel() {
  const {
    isOpen,
    setIsOpen,
    pageContext,
    messages,
    sendMessage,
    isSending,
    lastError,
    recommendations,
    lastAnswer,
  } = useProployAgent()

  const quickPrompts = useMemo(
    () => getQuickPrompts(pageContext.pageType, pageContext.productName),
    [pageContext.pageType, pageContext.productName]
  )

  const handleQuickPrompt = async (prompt: string) => {
    await sendMessage(prompt)
    setIsOpen(true)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[90] flex items-center gap-3 rounded-full border border-white/10 bg-[#081120] px-4 py-3 text-white shadow-[0_16px_40px_rgba(8,17,32,0.35)] backdrop-blur-xl transition-transform hover:scale-[1.02]"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#4D9CFF] to-[#0466E7]">
          <Sparkles className="h-4 w-4" />
        </span>
        <span className="hidden text-sm font-semibold md:inline">Research</span>
      </button>

      <aside
        className={`fixed right-0 top-0 z-[95] h-dvh w-full border-l border-white/10 bg-[#07101E] text-white shadow-2xl transition-transform duration-300 ease-out md:w-[420px] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(70,132,255,0.22),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(5,101,231,0.18),_transparent_28%)]" />

        <div className="relative flex h-full flex-col">
          <header className="border-b border-white/10 px-5 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#9CC3FF]">
                  <Bot className="h-3.5 w-3.5" />
                  Proploy Research Agent
                </div>
                <h2 className="text-lg font-bold tracking-tight">Context-aware software research</h2>
                <p className="mt-1 text-sm text-slate-300">
                  Page-aware, memory-backed, and ready to narrow the shortlist.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-200 transition-colors hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-200">
                {pageContext.pageType}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-200">
                {pageContext.route}
              </span>
              {pageContext.productName ? (
                <span className="rounded-full border border-[#4D9CFF]/30 bg-[#4D9CFF]/10 px-3 py-1 text-[#CFE2FF]">
                  {pageContext.productName}
                </span>
              ) : null}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            {messages.length === 0 ? (
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <p className="text-sm leading-6 text-slate-200">
                  Ask me what software fits your business. I will use the current page context, what you
                  have told me before, and a retrieval shortlist to keep the answer grounded.
                </p>

                <div className="mt-4 space-y-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      type="button"
                      key={prompt}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0B1628] px-4 py-3 text-left text-sm text-slate-100 transition-colors hover:border-[#4D9CFF]/40 hover:bg-[#0E1A30]"
                    >
                      <span>{prompt}</span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-[#8FB7FF]" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-[24px] border px-4 py-4 ${
                      message.role === 'user'
                        ? 'ml-6 border-[#4D9CFF]/20 bg-[#0B1E3B] text-slate-100'
                        : 'mr-2 border-white/10 bg-white/5 text-slate-100'
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {message.role}
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                  </div>
                ))}

                {lastError ? (
                  <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
                    {lastError}
                  </div>
                ) : null}

                {recommendations.length > 0 ? (
                  <div className="space-y-3">
                    <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                      Shortlist
                    </div>
                    {recommendations.map((item) => (
                      <div
                        key={String(item.product_id)}
                        className="rounded-[24px] border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-base font-semibold text-white">
                              {String(item.product_name)}
                            </h3>
                            <p className="mt-1 text-sm leading-6 text-slate-300">
                              {String(item.why_it_fits || '')}
                            </p>
                          </div>
                          <div className="rounded-full border border-[#4D9CFF]/20 bg-[#4D9CFF]/10 px-3 py-1 text-xs font-bold text-[#CFE2FF]">
                            {String(item.fit_score ?? 0)}
                          </div>
                        </div>

                        <div className="mt-3 grid gap-2 text-xs text-slate-300">
                          <div>
                            <span className="font-semibold text-slate-100">Not for:</span>{' '}
                            {String(item.not_for || '')}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-100">Complexity:</span>{' '}
                            {String(item.implementation_complexity || '')}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-100">Timeline:</span>{' '}
                            {String(item.estimated_timeline || '')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            )}

            {lastAnswer && messages.length > 0 ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-6 text-slate-300">
                <span className="font-semibold text-slate-100">Latest answer:</span> {lastAnswer}
              </div>
            ) : null}
          </div>

          <footer className="border-t border-white/10 p-4">
            <form
              className="space-y-3"
              onSubmit={async (event) => {
                event.preventDefault()
                const form = event.currentTarget
                const formData = new FormData(form)
                const value = String(formData.get('prompt') || '')
                if (!value.trim()) return
                form.reset()
                await sendMessage(value)
              }}
            >
              <textarea
                name="prompt"
                rows={3}
                placeholder="Ask the agent what to choose, what to compare, or what to rule out..."
                className="w-full resize-none rounded-[20px] border border-white/10 bg-[#091423] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-[#4D9CFF]/50"
              />
              <button
                type="submit"
                disabled={isSending}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#4D9CFF] to-[#0466E7] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSending ? 'Researching...' : 'Ask Proploy'}
              </button>
            </form>
          </footer>
        </div>
      </aside>
    </>
  )
}
