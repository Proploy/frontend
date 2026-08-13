import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

export const metadata: Metadata = {
  title: 'Proploy Agent — Proploy',
  description:
    'Describe what your team needs in plain language. The Proploy Agent shortlists software, attaches vetted implementation experts and books the first call — in one conversation.',
}

const CAPABILITIES = [
  {
    title: 'Understands the brief',
    body: 'Tell it your stage, stack and budget in plain language. The agent asks the follow-up questions a good analyst would — then remembers the answers.',
    icon: (
      <path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1.3-4.3A8 8 0 0 1 13 4a8 8 0 0 1 8 8Z" />
    ),
  },
  {
    title: 'Shortlists from the catalogue',
    body: 'It searches 400+ curated products and scores each one against your context — not a sponsored leaderboard, a fit score you can interrogate.',
    icon: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
  },
  {
    title: 'Attaches the right experts',
    body: 'Every shortlist comes with vetted implementers who have shipped that exact platform before, with availability and rates visible up front.',
    icon: (
      <>
        <path d="M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="3.5" />
        <path d="M21 20v-2a4 4 0 0 0-3-3.9" />
      </>
    ),
  },
  {
    title: 'Keeps the thread',
    body: 'From first question to signed SOW, the same conversation carries your context. No re-briefing sales reps, no lost email chains.',
    icon: (
      <>
        <path d="M4 5h16v11H9l-5 4Z" />
        <path d="M8 9h8M8 12h5" />
      </>
    ),
  },
]

const STEPS = [
  {
    num: 'Step 01',
    title: 'Open the chat',
    body: 'The agent lives in the bubble on every Proploy page. Start typing — no forms, no demo-call gatekeeping.',
  },
  {
    num: 'Step 02',
    title: 'Describe the problem',
    body: 'What you do, what you use today, what has to change. The agent turns it into a structured brief you can review.',
  },
  {
    num: 'Step 03',
    title: 'Review matches',
    body: 'Ranked software with fit scores, pricing signals and the vetted experts who can deploy each option.',
  },
  {
    num: 'Step 04',
    title: 'Book the call',
    body: 'Pick an expert and the agent schedules a free consultation — your brief already in their hands.',
  },
]

function AgentChatPanel() {
  return (
    <div className="pp-glass" style={{ overflow: 'hidden' }}>
      {/* header */}
      <div
        className="pp-row"
        style={{ gap: 'var(--sp-2)', padding: 'var(--sp-3) var(--sp-4)', borderBottom: 'var(--bw) solid var(--line)' }}
      >
        <span
          aria-hidden
          style={{ width: 6, height: 6, borderRadius: 'var(--r-full)', background: 'var(--cobalt)', flexShrink: 0 }}
        />
        <span className="pp-label">Proploy agent</span>
        <span className="pp-label" style={{ marginLeft: 'auto' }}>
          online
        </span>
      </div>

      <div className="pp-stack pp-gap-3" style={{ padding: 'var(--sp-4)' }}>
        {/* user message */}
        <div
          style={{
            alignSelf: 'flex-end',
            maxWidth: '85%',
            background: 'var(--ink)',
            color: 'var(--paper)',
            borderRadius: 'var(--r-tile)',
            borderBottomRightRadius: 'var(--r-xs)',
            padding: '10px 14px',
            fontSize: 14,
            lineHeight: '21px',
          }}
        >
          We&apos;re a 60-person logistics company. Need a CRM that plays nicely with our ERP — and someone to actually
          set it up.
        </div>

        {/* agent reply */}
        <div
          style={{
            alignSelf: 'flex-start',
            maxWidth: '92%',
            background: '#fff',
            border: 'var(--bw) solid var(--line)',
            borderRadius: 'var(--r-tile)',
            borderBottomLeftRadius: 'var(--r-xs)',
            padding: '12px 14px',
          }}
          className="pp-stack pp-gap-3"
        >
          <p className="pp-small" style={{ color: 'var(--ink)' }}>
            Got it — CRM for a 60-person logistics team, ERP integration required. Two strong fits from the catalogue,
            each with vetted implementers available this month:
          </p>

          {[
            { name: 'Cadence CRM', tag: 'Sales ops', fit: 94, note: '3 vetted implementers · native ERP sync' },
            { name: 'Northlake Suite', tag: 'Logistics', fit: 88, note: '5-week deploy plan · pre-negotiated pricing' },
          ].map((m) => (
            <div
              key={m.name}
              style={{
                border: 'var(--bw) solid var(--line)',
                borderRadius: 'var(--r-control)',
                padding: 'var(--sp-3)',
                background: 'color-mix(in oklab, white 70%, transparent)',
              }}
            >
              <div className="pp-row" style={{ gap: 'var(--sp-3)' }}>
                <span className="pp-tile pp-tile--sm pp-tile--soft">{m.name[0]}</span>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{m.name}</p>
                  <p className="pp-label" style={{ letterSpacing: '0.1em' }}>
                    {m.tag}
                  </p>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <p className="pp-mono-num" style={{ fontSize: 14, color: 'var(--cobalt-deep)', fontWeight: 600 }}>
                    {m.fit}%
                  </p>
                  <p className="pp-label" style={{ fontSize: 10 }}>
                    fit
                  </p>
                </div>
              </div>
              <div
                aria-hidden
                style={{
                  marginTop: 'var(--sp-2)',
                  height: 4,
                  borderRadius: 'var(--r-full)',
                  background: 'var(--paper-deep)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${m.fit}%`,
                    height: '100%',
                    borderRadius: 'var(--r-full)',
                    background: 'linear-gradient(90deg, var(--cobalt-deep), var(--cobalt))',
                  }}
                />
              </div>
              <p className="pp-small" style={{ marginTop: 6, fontSize: 12, lineHeight: '18px' }}>
                {m.note}
              </p>
            </div>
          ))}

          <p className="pp-small" style={{ color: 'var(--ink)' }}>
            Want me to book a free consultation with an implementer for either?
          </p>
        </div>

        {/* second user message */}
        <div
          style={{
            alignSelf: 'flex-end',
            background: 'var(--ink)',
            color: 'var(--paper)',
            borderRadius: 'var(--r-tile)',
            borderBottomRightRadius: 'var(--r-xs)',
            padding: '10px 14px',
            fontSize: 14,
            lineHeight: '21px',
          }}
        >
          Yes — Cadence, this week if possible.
        </div>
      </div>

      {/* composer */}
      <div style={{ padding: '0 var(--sp-4) var(--sp-4)' }}>
        <div
          className="pp-row"
          style={{
            gap: 'var(--sp-2)',
            border: 'var(--bw) solid var(--line)',
            borderRadius: 'var(--r-control)',
            background: '#fff',
            padding: '10px 14px',
          }}
        >
          <span className="pp-small" style={{ color: 'var(--color-gray-500)' }}>
            Ask the Proploy agent anything…
          </span>
          <span
            aria-hidden
            style={{
              marginLeft: 'auto',
              display: 'grid',
              placeItems: 'center',
              width: 28,
              height: 28,
              borderRadius: 'var(--r-full)',
              background: 'var(--cobalt)',
              color: '#fff',
              flexShrink: 0,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}

export default function ProployAgentPage() {
  return (
    <main className="pp-page">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -140, right: -80 }} />
        <div className="pp-container">
          <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-16)', alignItems: 'center' }}>
            <Reveal className="pp-stack pp-gap-8 pp-soften">
              <p className="pp-label">Proploy agent</p>
              <h1 className="pp-display pp-d1">
                The buying
                <br />
                conversation,
                <br />
                <span className="pp-accent">answered.</span>
              </h1>
              <p className="pp-lede">
                Describe what your team needs in plain language. The agent shortlists software from the curated
                catalogue, attaches vetted implementation experts and books the first call — all in one thread.
              </p>
              <div className="pp-flex pp-wrap pp-gap-3">
                <Link className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline" href="/sign-up">
                  Try the agent free
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/products">
                  Browse the catalogue
                </Link>
              </div>
              <p className="pp-small">Already on every Proploy page — look for the chat bubble.</p>
            </Reveal>
            <Reveal delay={120}>
              <AgentChatPanel />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Capabilities ────────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">What it does</p>
              <h2 className="pp-display pp-d3">A research analyst that never loses your context.</h2>
            </div>
            <p className="pp-lede">
              The agent works from the same catalogue and expert network as the rest of Proploy — it just gets you
              there faster.
            </p>
          </Reveal>
          <div className="pp-grid pp-grid-4" style={{ gap: 'var(--sp-6)' }}>
            {CAPABILITIES.map((cap, i) => (
              <Reveal key={cap.title} delay={i * 80}>
                <div
                  className="pp-card pp-lift"
                  style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-10)', minHeight: 280, height: '100%' }}
                >
                  <span className="pp-ico pp-ico--lg">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {cap.icon}
                    </svg>
                  </span>
                  <div className="pp-stack pp-gap-3" style={{ marginTop: 'auto' }}>
                    <p className="pp-h6">{cap.title}</p>
                    <p className="pp-body">{cap.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────── */}
      <section className="pp-section pp-blueprint">
        <div className="pp-glow" style={{ bottom: -180, left: -120 }} />
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">How it works</p>
              <h2 className="pp-display pp-d3">From question to booked call in one sitting.</h2>
            </div>
            <p className="pp-lede">No forms, no gated demos. The agent is the front door to the whole marketplace.</p>
          </Reveal>
          <div className="fe-steps">
            {STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 90} className="fe-step">
                <p className="pp-label fe-num">{step.num}</p>
                <div className="pp-stack pp-gap-3">
                  <p className="pp-h6">{step.title}</p>
                  <p className="pp-body">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Honesty band ────────────────────────────────────────── */}
      <section className="pp-section pp-band-deep">
        <div className="pp-container">
          <Reveal>
            <div className="pp-card pp-card--panel pp-sec-split" style={{ alignItems: 'center' }}>
              <div className="pp-stack pp-gap-5">
                <p className="pp-label">Human when it matters</p>
                <h2 className="pp-display pp-d4">The agent finds the match. People deliver it.</h2>
                <p className="pp-body" style={{ maxWidth: '58ch' }}>
                  Every recommendation ends with a vetted human implementer — interviewed, reference-checked and graded
                  on the exact platform you&apos;re deploying. The agent handles the search; the expert handles the
                  rollout.
                </p>
              </div>
              <div className="pp-stack pp-gap-4">
                <div className="pp-metric">
                  <p className="pp-metric-value">400+</p>
                  <p className="pp-label">Curated products it searches</p>
                </div>
                <div className="pp-metric">
                  <p className="pp-metric-value">200+</p>
                  <p className="pp-label">Vetted experts it can attach</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Closing CTA ─────────────────────────────────────────── */}
      <section className="pp-section">
        <div className="pp-container-app">
          <Reveal className="pp-dark">
            <div className="pp-sec-split" style={{ alignItems: 'center', gap: 'var(--sp-16)' }}>
              <div className="pp-stack" style={{ gap: 'var(--sp-5)' }}>
                <p className="pp-label">Start a conversation</p>
                <h2 className="pp-display pp-d3">Ask it what you&apos;d ask an analyst.</h2>
                <p className="pp-lede">
                  Create a free account and the agent keeps your brief, shortlists and expert intros in one place.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill" href="/sign-up">
                  Get started free
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/for-businesses">
                  See how Proploy works
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
