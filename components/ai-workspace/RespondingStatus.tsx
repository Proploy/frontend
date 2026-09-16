'use client'

import { Brain, Cpu, Loader2, Sparkles } from 'lucide-react'

export type StreamingStatusInfo = {
  type?: 'thinking' | 'tool_call' | 'status'
  content?: string
  name?: string
  status?: string
}

function friendlyToolName(name?: string): string {
  if (!name) return 'Searching catalog'
  switch (name) {
    case 'search_catalog':
    case 'keyword_search_catalog':
      return 'Searching catalog'
    case 'get_product_info':
    case 'get_product_detail':
    case 'get_product_intelligence':
      return 'Retrieving product details'
    case 'get_pricing_detail':
    case 'calculate_pricing':
      return 'Calculating pricing & seat fit'
    case 'compare_products':
      return 'Comparing product features'
    case 'propose_requirements':
    case 'extract_and_update_needs_profile':
      return 'Extracting decision requirements'
    case 'generate_battle_card':
      return 'Generating battle card'
    case 'generate_project_brief':
      return 'Generating implementation brief'
    case 'plan_next_question':
      return 'Synthesizing recommendations'
    default:
      return name.replace(/_/g, ' ')
  }
}

export function RespondingStatus({
  status,
  seed = 0,
}: {
  status?: StreamingStatusInfo | null
  seed?: number
}) {
  const isThinking = status?.type === 'thinking'
  const isToolCall = status?.type === 'tool_call'

  const labelText = isThinking
    ? status?.content && status.content !== 'Analyzing request'
      ? status.content
      : 'Thinking through solution'
    : isToolCall
      ? friendlyToolName(status?.name || status?.content)
      : status?.content || 'Analyzing requirements'

  return (
    <div
      role="status"
      className="inline-flex items-center gap-2.5 rounded-full border border-cobalt/20 bg-cobalt-soft/60 px-3.5 py-1.5 shadow-[var(--shadow-glass)] backdrop-blur-md transition-all animate-in fade-in duration-200"
    >
      {isThinking ? (
        <span className="grid size-4 place-items-center text-cobalt" aria-hidden>
          <Sparkles size={13} className="animate-pulse motion-reduce:animate-none" />
        </span>
      ) : isToolCall ? (
        <span className="grid size-4 place-items-center text-cobalt" aria-hidden>
          <Cpu size={13} className="animate-spin-slow motion-reduce:animate-none" />
        </span>
      ) : (
        <span className="pulse-dot size-2 rounded-full bg-cobalt" aria-hidden />
      )}

      <span className="label !text-cobalt-deep flex items-center gap-1.5 font-medium tracking-normal text-[0.78rem]">
        {labelText}
        <span className="inline-flex items-center text-cobalt">
          <Loader2 size={11} className="animate-spin" />
        </span>
      </span>
    </div>
  )
}
