'use client'

const STARTERS = [
  {
    label: 'Implementation planning',
    prompt:
      'I need to create an implementation plan. Ask me about our team structure, management approach, current workflow, and end goal before recommending products.',
  },
  {
    label: 'Project management',
    prompt: 'Help me evaluate project management software.',
  },
  {
    label: 'Customer support',
    prompt: 'Help me evaluate customer support software.',
  },
  {
    label: 'CRM',
    prompt: 'Help me evaluate CRM software.',
  },
]

export function WelcomeState({
  onPrompt,
}: {
  onPrompt: (message: string) => void
}) {
  return (
    <div className="flex min-h-full w-full items-center justify-center px-5 py-10 sm:px-8">
      <div
        data-testid="welcome-content"
        className="w-full max-w-[720px] min-w-0 text-center"
      >
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#155eef]">
          Software Procurement
        </p>
        <h2 className="mt-3 text-2xl font-semibold leading-8 tracking-[-0.02em] text-[#181d27] sm:text-[30px] sm:leading-9">
          Describe your requirements and compare suitable products
        </h2>
        <p className="mx-auto mt-3 max-w-[620px] text-sm leading-6 text-[#535862] sm:text-[15px]">
          SAM will clarify the critical details, evaluate products from the
          published catalog, and help you build an evidence-backed shortlist.
        </p>
        <div className="mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {STARTERS.map((starter) => (
            <button
              key={starter.label}
              type="button"
              onClick={() => onPrompt(starter.prompt)}
              className="min-w-0 rounded-xl border border-[#d5d7da] bg-white px-4 py-3 text-left text-sm font-semibold text-[#414651] shadow-[0_1px_2px_rgba(10,13,18,0.04)] transition hover:border-[#84adff] hover:bg-[#f5f8ff] hover:text-[#155eef]"
            >
              {starter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
