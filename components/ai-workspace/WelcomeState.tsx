'use client'

import { ArrowRight } from 'lucide-react'

const STARTERS = [
  {
    label: 'Implementation planning',
    hint: 'Structure, workflow, end goal first',
    prompt:
      'I need to create an implementation plan. Ask me about our team structure, management approach, current workflow, and end goal before recommending products.',
  },
  { label: 'Project management', hint: 'Evaluate PM software', prompt: 'Help me evaluate project management software.' },
  { label: 'Customer support', hint: 'Evaluate support desks', prompt: 'Help me evaluate customer support software.' },
  { label: 'CRM', hint: 'Evaluate CRM platforms', prompt: 'Help me evaluate CRM software.' },
]

const STEPS = [
  ['01', 'Describe the need', 'Sam asks the details that matter.'],
  ['02', 'Get a shortlist', 'From the published catalog, with reasons.'],
  ['03', 'Compare in a brief', 'A requirements matrix across the shortlist.'],
  ['04', 'Plan the rollout', 'An implementation brief for the product you pick.'],
]

export function WelcomeState({
  onPrompt,
  disabled = false,
}: {
  onPrompt: (message: string) => void
  disabled?: boolean
}) {
  return (
    <div className="relative flex min-h-full w-full items-center justify-center px-5 py-10 sm:px-8">
      <div aria-hidden className="blueprint pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]" />
      <div data-testid="welcome-content" className="relative w-full max-w-[720px] min-w-0 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1.5">
          <span className="pulse-dot size-1.5 rounded-full bg-cobalt" aria-hidden />
          <span className="label !text-[0.65rem]">Software procurement</span>
        </span>
        <h2 className="display mt-6 text-[clamp(1.9rem,4vw,2.6rem)] text-ink">
          Describe your requirements and compare suitable products
        </h2>
        <p className="mx-auto mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-soft">
          SAM asks the details that matter, shortlists products from the
          published catalog, then writes a comparison brief and an
          implementation brief for the product you choose.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {STARTERS.map((starter) => (
            <button
              key={starter.label}
              type="button"
              disabled={disabled}
              onClick={() => onPrompt(starter.prompt)}
              className="lift group flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-border bg-white px-4 py-3.5 text-left disabled:cursor-wait disabled:opacity-50"
            >
              <span className="min-w-0">
                <span className="block text-[0.9375rem] font-medium text-ink">{starter.label}</span>
                <span className="mt-0.5 block text-[0.8rem] text-ink-soft">{starter.hint}</span>
              </span>
              <ArrowRight size={16} className="shrink-0 text-ink-soft transition-transform group-hover:translate-x-0.5 group-hover:text-cobalt" aria-hidden />
            </button>
          ))}
        </div>

        <ol className="mt-10 grid gap-3 text-left sm:grid-cols-4">
          {STEPS.map(([n, title, body]) => (
            <li key={n} className="rounded-xl border border-border/70 bg-white/60 p-3">
              <span className="font-mono text-[0.65rem] tracking-[0.16em] text-cobalt">{n}</span>
              <p className="mt-1 text-[0.85rem] font-medium text-ink">{title}</p>
              <p className="mt-0.5 text-[0.75rem] leading-5 text-ink-soft">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
