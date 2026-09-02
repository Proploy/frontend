import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, Minus } from 'lucide-react'

import { Reveal } from '@/components/site/Reveal'

import { BriefExcerpt } from './BriefExcerpt'

const ASK_SAM_URL = '/AI_workspace'

const TITLE = 'Ask Sam — Proploy'
const DESCRIPTION =
  'Describe what you are trying to fix. Sam asks a few focused questions, shortlists software from the Proploy catalog, and writes a brief your team can act on.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
  },
}

// Copy on this page is derived from the agent's system prompt and tools in
// agent-harness (prompts/prompt_builder.py, prompts/evaluation.py,
// tools/profile/*, tools/skills/project_brief_skill.py). Keep claims in step
// with what Sam actually does.

const PROBLEMS = [
  {
    n: '01',
    title: 'Discovery takes weeks',
    body: 'Requirements get gathered over email threads and calendar holds. By the time a shortlist exists, the need has moved.',
  },
  {
    n: '02',
    title: 'Context gets lost',
    body: 'Every vendor conversation starts from zero. Team size, integrations and constraints are repeated, then forgotten.',
  },
  {
    n: '03',
    title: 'Demos set the agenda',
    body: 'Vendor demos show what the vendor wants to show. Your requirements should decide the shortlist, not the other way round.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Describe the need',
    body: 'Say what you are trying to fix in plain language. What you use today, who is involved, what has to change.',
  },
  {
    n: '02',
    title: 'Answer a few focused questions',
    body: 'Sam asks one to three questions at a time, covering team size, budget, integrations, compliance and deployment. It builds a requirement summary you confirm before anything is searched.',
  },
  {
    n: '03',
    title: 'Get a shortlist you can interrogate',
    body: 'Sam searches the Proploy catalog and shortlists up to three products. Each comes with why it fits and one honest caveat. Ask for a comparison and you get a verdict, not a shrug.',
  },
  {
    n: '04',
    title: 'Take the brief to delivery',
    body: 'Ask for the brief and Sam writes it from your confirmed requirements and shortlist. Export it as a PDF, share it with stakeholders, or hand it to a Proploy implementation expert.',
  },
]

const USE_CASES = [
  {
    title: 'Replacing a tool your team has outgrown',
    body: 'You know the pain points. Sam turns them into requirements and finds what actually fixes them, without a fresh RFP cycle.',
  },
  {
    title: 'Buying a category for the first time',
    body: 'CRM, customer support, project management. Sam asks the questions an experienced buyer would, so you do not learn them from a vendor.',
  },
  {
    title: 'Building a brief before you talk to vendors',
    body: 'Walk into every conversation with objectives, requirements and success criteria agreed. The brief doubles as the starting point for an RFP.',
  },
]

const DOES = [
  'Recommends only products in the Proploy catalog. It never names a product from memory.',
  'Gives each recommendation a reason and an honest caveat, and says so when the best match is only a partial fit.',
  'Tells you when pricing is not public and points you to the vendor instead of guessing.',
  'Flags data it is unsure about and asks you to verify it with the vendor.',
]

const DOES_NOT = [
  'Commit to prices, discounts or timelines. Those come from the vendor and your implementation team.',
  'Replace an expert. When you are ready to implement, Proploy’s vetted experts take over.',
  'Wander off topic. Sam stays on B2B software decisions and will tell you when something is outside its remit.',
]

function AskSamButton({ tone = 'ink' }: { tone?: 'ink' | 'cobalt' }) {
  const base =
    'group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-full px-6 text-[0.875rem] font-medium transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2'
  const style =
    tone === 'ink'
      ? 'bg-ink text-paper focus-visible:outline-cobalt'
      : 'bg-cobalt text-white focus-visible:outline-white'
  return (
    <Link href={ASK_SAM_URL} className={`${base} ${style}`}>
      <span className="relative z-10">Ask Sam</span>
      <ArrowRight
        aria-hidden
        className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
      />
      {tone === 'ink' && (
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-full bg-cobalt transition-transform duration-500 group-hover:translate-x-0"
        />
      )}
    </Link>
  )
}

function ConversationCard() {
  return (
    <div className="glass-card relative overflow-hidden rounded-2xl">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-cobalt" />
        <span className="label">Ask Sam</span>
        <span className="label ml-auto">discovery</span>
      </div>
      <div className="flex flex-col gap-3 px-4 py-4 text-[0.875rem] leading-relaxed">
        <p className="max-w-[88%] self-end rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-paper">
          We&apos;re a 45-person field-service company. Our scheduling tool doesn&apos;t talk to accounting and
          technicians lose work when they go offline.
        </p>
        <p className="max-w-[92%] self-start rounded-2xl rounded-bl-md border border-border bg-white px-4 py-2.5 text-ink">
          Got it. Before I search: does scheduling data need to sync both ways with accounting, or is a one-way
          export enough?
        </p>
        <p className="max-w-[70%] self-end rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-paper">
          Both ways. Invoices should go out from completed jobs.
        </p>
      </div>
      <div className="border-t border-border px-4 py-3">
        <span className="label">Requirements captured</span>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {['Team size: 45', 'Integration: accounting, two-way', 'Offline mobile', 'Pain point: late invoicing'].map(
            (chip) => (
              <li
                key={chip}
                className="rounded-lg border border-border bg-white/70 px-2.5 py-1 text-[0.72rem] text-ink-soft"
              >
                {chip}
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  )
}

export default function AskSamPage() {
  return (
    <main className="font-inter overflow-x-clip bg-paper text-ink">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="blueprint absolute inset-0 opacity-70 [mask-image:radial-gradient(120%_80%_at_50%_0%,black,transparent_75%)]" />
          <div className="absolute -left-40 top-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--cobalt)_18%,transparent),transparent_65%)] blur-2xl" />
        </div>

        <div className="relative mx-auto grid max-w-[1240px] gap-14 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-10">
          <div className="min-w-0">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1.5">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-cobalt" />
                <span className="label !text-[0.65rem]">Ask Sam</span>
              </span>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="display mt-7 text-[clamp(2.4rem,6vw,4.25rem)] text-ink">
                Describe the problem.
                <br />
                Get a shortlist
                <br />
                <span className="text-cobalt">and a brief.</span>
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-7 max-w-[46ch] text-[1.0625rem] leading-relaxed text-ink-soft">
                Sam is Proploy&apos;s software buying assistant. It asks the questions an experienced buyer would,
                shortlists from the Proploy catalog, and writes the brief your team can scope and build from.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div className="mt-9">
                <AskSamButton />
              </div>
            </Reveal>
          </div>

          <Reveal delay={160} className="min-w-0 lg:pl-6">
            <ConversationCard />
          </Reveal>
        </div>
      </section>

      {/* ── The problem ──────────────────────────────────────────────── */}
      <section className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
          <Reveal>
            <span className="label">The problem</span>
            <h2 className="display mt-5 max-w-[18ch] text-[clamp(2rem,4.2vw,3.25rem)] text-ink">
              Discovery is where software projects lose their first month.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PROBLEMS.map((p, i) => (
              <Reveal key={p.n} delay={i * 80}>
                <div className="lift h-full rounded-2xl border border-border bg-white p-6">
                  <span className="font-mono text-[0.7rem] tracking-[0.16em] text-cobalt">{p.n}</span>
                  <h3 className="mt-4 text-[1.125rem] font-semibold text-ink">{p.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How Sam works ────────────────────────────────────────────── */}
      <section className="relative py-20 lg:py-28">
        <div
          aria-hidden
          className="blueprint pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(90%_60%_at_50%_50%,black,transparent)]"
        />
        <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
          <Reveal>
            <span className="label">How Sam works</span>
            <h2 className="display mt-5 max-w-[16ch] text-[clamp(2rem,4.2vw,3.25rem)] text-ink">
              Four steps from a rough idea to a brief.
            </h2>
          </Reveal>
          <ol className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} as="li" delay={i * 90} className="relative">
                <div className="glass-card h-full rounded-2xl p-6">
                  <span className="grid h-[46px] w-[46px] place-items-center rounded-full border border-cobalt bg-cobalt font-mono text-[0.7rem] text-white shadow-[0_16px_34px_-18px_var(--cobalt)]">
                    {s.n}
                  </span>
                  <h3 className="mt-5 text-[1.0625rem] font-semibold text-ink">{s.title}</h3>
                  <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-soft">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── What's in a brief ────────────────────────────────────────── */}
      <section className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
          <Reveal>
            <span className="label">What&apos;s in a brief</span>
            <h2 className="display mt-5 max-w-[18ch] text-[clamp(2rem,4.2vw,3.25rem)] text-ink">
              Seven sections a delivery team can scope from.
            </h2>
            <p className="mt-6 max-w-[52ch] text-[1rem] leading-relaxed text-ink-soft">
              Every brief is written from the requirements you confirmed and the shortlist you built with Sam.
              Nothing in it is invented to fill space; missing details are marked as not specified.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-12">
              <BriefExcerpt />
            </div>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-8 text-[0.875rem] text-ink-soft">
              Asked Sam to compare two or more products instead? You get a comparison card: pricing, a
              requirements-fit matrix, strengths, weaknesses and a recommendation.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Who it's for ─────────────────────────────────────────────── */}
      <section className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <Reveal>
              <span className="label">Who it&apos;s for</span>
              <h2 className="display mt-5 text-[clamp(2rem,4.2vw,3.25rem)] text-ink">
                Buyers who need
                <br />
                a decision, not a demo.
              </h2>
            </Reveal>
            <div className="grid gap-4">
              {USE_CASES.map((u, i) => (
                <Reveal key={u.title} delay={i * 80}>
                  <div className="lift rounded-2xl border border-border bg-white p-6">
                    <h3 className="text-[1.0625rem] font-semibold text-ink">{u.title}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{u.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust and boundaries ─────────────────────────────────────── */}
      <section className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
          <Reveal>
            <div className="rounded-[28px] border border-border bg-paper-deep/60 p-7 sm:p-10 lg:p-14">
              <span className="label">Where Sam stops</span>
              <h2 className="display mt-5 max-w-[20ch] text-[clamp(1.9rem,3.8vw,3rem)] text-ink">
                Straight about what it does, and what it doesn&apos;t.
              </h2>
              <div className="mt-10 grid gap-10 md:grid-cols-2">
                <div>
                  <h3 className="text-[0.95rem] font-semibold text-ink">Sam does</h3>
                  <ul className="mt-4 space-y-3">
                    {DOES.map((item) => (
                      <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                        <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cobalt-soft">
                          <Check aria-hidden className="h-3 w-3 text-cobalt-deep" strokeWidth={2.2} />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-[0.95rem] font-semibold text-ink">Sam does not</h3>
                  <ul className="mt-4 space-y-3">
                    {DOES_NOT.map((item) => (
                      <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                        <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-border bg-white">
                          <Minus aria-hidden className="h-3 w-3 text-ink-soft" strokeWidth={2.2} />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────── */}
      <section className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
          <Reveal>
            <div className="relative overflow-hidden rounded-[28px] bg-ink px-7 py-16 text-paper sm:px-14 lg:px-20 lg:py-24">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.16] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(90%_70%_at_30%_0%,black,transparent)]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-40 -right-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--cobalt)_70%,transparent),transparent_65%)] blur-2xl"
              />
              <div className="relative max-w-[46rem]">
                <span className="label !text-paper/60">Start a conversation</span>
                <h2 className="display mt-5 text-[clamp(2.1rem,5vw,3.75rem)]">
                  Tell Sam what you&apos;re trying to fix.
                </h2>
                <p className="mt-6 max-w-[48ch] text-[1rem] leading-relaxed text-paper/70">
                  A few questions, a shortlist with reasons, and a brief you can hand to the people who will build
                  it.
                </p>
                <div className="mt-10">
                  <AskSamButton tone="cobalt" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
