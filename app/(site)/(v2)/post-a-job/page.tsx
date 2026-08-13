import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

import { BriefFaq } from './BriefFaq'

export const metadata: Metadata = {
  title: 'Post a job — Proploy',
  description:
    'Brief once and matched specialists respond with scope, timeline and rate — no job-board spam, no fifty unqualified applications.',
}

const FLOW_STEPS = [
  {
    num: '01',
    title: 'Write the brief',
    body: 'Structured questions about the software, your team and your window. Ten minutes, no job-ad copywriting.',
  },
  {
    num: '02',
    title: 'Matching runs',
    body: 'The engine scores your brief against every specialist on stack, sector and availability — only the top handful see it.',
  },
  {
    num: '03',
    title: 'Specialists respond',
    body: 'Each response arrives with a proposed approach, timeline and rate. Median first response inside 48 hours.',
  },
  {
    num: '04',
    title: 'You pick the call',
    body: 'Compare responses in your hiring workspace and book first calls with the two or three that fit best.',
  },
]

const BOARD_PAINS = [
  '50+ applications, mostly unqualified',
  'Copy-pasted cover letters',
  'You do the screening yourself',
  'Rates surface at the last minute',
  'Ghosting after the first call',
]

const BRIEF_WINS = [
  '3–5 matched, vetted responses',
  'Approach and timeline up front',
  'Vetting already done by Proploy',
  'Rate attached to every response',
  'Committed availability windows',
]

const SAMPLE_RESPONSES = [
  {
    name: 'Priya N.',
    role: 'HRIS implementation lead',
    fit: '95% fit',
    note: 'Proposes a 6-week rollout with parallel payroll runs in weeks 4–5. Has shipped this platform 11 times.',
    rate: '$740/day',
    start: 'Starts Monday',
  },
  {
    name: 'Tomas E.',
    role: 'People-ops systems consultant',
    fit: '90% fit',
    note: 'Suggests phasing the benefits module to hit your open-enrollment date. Two references in your sector.',
    rate: '$680/day',
    start: 'Starts in 2 weeks',
  },
  {
    name: 'Grace W.',
    role: 'HR platform architect',
    fit: '87% fit',
    note: 'Flags your SSO setup as the critical path and scopes it first. Fixed-fee option available.',
    rate: '$8.4k fixed',
    start: 'Starts next week',
  },
]

export default function PostAJobPage() {
  return (
    <main className="pp-page">
      {/* ── Hero — centered composition with brief-composer mockup ── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -140, left: '50%', transform: 'translateX(-50%)' }} />
        <div className="pp-container pp-stack pp-gap-12">
          <Reveal className="pp-stack pp-gap-8 pp-center pp-soften" >
            <div className="pp-stack pp-gap-5" style={{ alignItems: 'center' }}>
              <p className="pp-label">Post a job</p>
              <h1 className="pp-display pp-d1" style={{ maxWidth: '18ch', marginInline: 'auto' }}>
                Brief once. Let the right people find you.
              </h1>
              <p className="pp-lede pp-mx-auto" style={{ maxWidth: '52ch' }}>
                No job board, no application pile. Your brief goes only to the specialists who match
                it — and they respond with a plan, a timeline and a rate.
              </p>
            </div>
            <div className="pp-flex pp-wrap pp-gap-3" style={{ justifyContent: 'center' }}>
              <Link className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline" href="/sign-up">
                Post your first brief
              </Link>
              <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/discover-experts">
                See who responds
              </Link>
            </div>
          </Reveal>

          {/* brief composer mockup */}
          <Reveal delay={120}>
            <div className="pp-glass pp-mx-auto" style={{ maxWidth: 720, padding: 'var(--sp-6)' }}>
              <div className="pp-flex" style={{ alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-5)' }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--cobalt)' }} />
                <span className="pp-label">New brief</span>
                <span className="pp-label" style={{ marginLeft: 'auto' }}>Step 2 of 3</span>
              </div>
              <div className="pp-stack pp-gap-4">
                <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-4)' }}>
                  {[
                    { label: 'Software', value: 'Meridian HRIS' },
                    { label: 'Team size', value: '120 people' },
                    { label: 'Go-live target', value: '8 weeks' },
                    { label: 'Budget range', value: '$25k – $40k' },
                  ].map((f) => (
                    <div
                      key={f.label}
                      style={{
                        border: '1px solid var(--line)',
                        borderRadius: 'var(--r-control)',
                        background: '#fff',
                        padding: '10px 14px',
                      }}
                    >
                      <p className="pp-label" style={{ fontSize: 10 }}>
                        {f.label}
                      </p>
                      <p className="pp-body" style={{ color: 'var(--ink)', fontWeight: 500 }}>
                        {f.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="pp-flex" style={{ alignItems: 'center', justifyContent: 'space-between', gap: 'var(--sp-4)' }}>
                  <span className="pp-tag pp-tag--cobalt pp-tag--dot">Will match ~4 specialists</span>
                  <span className="pp-small">Visible only to matched specialists</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── How briefing works — four-step rail ── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">How it works</p>
              <h2 className="pp-display pp-d3">From brief to booked call in four moves.</h2>
            </div>
            <p className="pp-lede">
              You describe the outcome once. Proploy handles the sourcing, the screening and the
              scheduling overhead.
            </p>
          </Reveal>

          <div className="fe-steps">
            {FLOW_STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 90} className="fe-step">
                <p className="pp-label fe-num">Step {step.num}</p>
                <div className="pp-stack pp-gap-3">
                  <p className="pp-h6">{step.title}</p>
                  <p className="pp-body">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── No job-board spam — two-panel contrast ── */}
      <section className="pp-section pp-blueprint">
        <div className="pp-glow" style={{ top: 60, right: -140 }} />
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Why briefs beat boards</p>
              <h2 className="pp-display pp-d3">Fifty applications is not a signal. It&apos;s homework.</h2>
            </div>
            <p className="pp-lede">
              A brief inverts the job board: instead of you filtering the crowd, the match engine
              filters for you.
            </p>
          </Reveal>

          <Reveal>
            <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-6)' }}>
              <div
                className="pp-card pp-card--panel"
                style={{ background: 'var(--ink)', borderColor: 'var(--ink)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}
              >
                <p className="pp-label" style={{ color: 'rgba(255,255,255,.6)' }}>
                  Typical job board
                </p>
                <ul className="pp-stack pp-gap-3">
                  {BOARD_PAINS.map((p) => (
                    <li key={p} className="pp-flex pp-gap-3" style={{ alignItems: 'center' }}>
                      <span
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 999,
                          border: '1px solid rgba(255,255,255,.35)',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0,
                          color: 'rgba(255,255,255,.6)',
                        }}
                      >
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                          <path d="M6 6l12 12M18 6 6 18" />
                        </svg>
                      </span>
                      <span className="pp-body" style={{ color: 'rgba(255,255,255,.78)' }}>
                        {p}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="pp-card pp-card--panel"
                style={{ borderColor: 'color-mix(in oklab, var(--cobalt) 40%, var(--line))', display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}
              >
                <p className="pp-label pp-accent">A Proploy brief</p>
                <ul className="pp-stack pp-gap-3">
                  {BRIEF_WINS.map((p) => (
                    <li key={p} className="pp-flex pp-gap-3" style={{ alignItems: 'center' }}>
                      <span className="pp-yes" style={{ flexShrink: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                          <path d="m5 13 4 4 10-10" />
                        </svg>
                      </span>
                      <span className="pp-body">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── What comes back — sample response cards ── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">What comes back</p>
              <h2 className="pp-display pp-d3">Responses that read like plans, not pitches.</h2>
            </div>
            <p className="pp-lede">
              A sample of what lands in your workspace within 48 hours of posting an HRIS brief.
            </p>
          </Reveal>

          <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-6)' }}>
            {SAMPLE_RESPONSES.map((r, i) => (
              <Reveal key={r.name} delay={i * 90}>
                <div className="pp-card pp-lift" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)', height: '100%' }}>
                  <div className="pp-flex pp-gap-3" style={{ alignItems: 'center' }}>
                    <span className="pp-avatar">{r.name.slice(0, 1)}</span>
                    <div style={{ minWidth: 0 }}>
                      <p className="pp-body" style={{ color: 'var(--ink)', fontWeight: 600 }}>
                        {r.name}
                      </p>
                      <p className="pp-small">{r.role}</p>
                    </div>
                    <span className="pp-tag pp-tag--cobalt" style={{ marginLeft: 'auto' }}>
                      {r.fit}
                    </span>
                  </div>
                  <p className="pp-body">{r.note}</p>
                  <div
                    className="pp-flex"
                    style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 'var(--sp-4)', borderTop: '1px solid var(--line)' }}
                  >
                    <span className="pp-mono-num" style={{ color: 'var(--ink)' }}>
                      {r.rate}
                    </span>
                    <span className="pp-small">{r.start}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="pp-section">
        <div className="pp-container">
          <Reveal>
            <div className="pp-sec-split" style={{ alignItems: 'start', gap: 'var(--sp-16)' }}>
              <div className="pp-stack pp-gap-8">
                <div className="pp-sec-head">
                  <p className="pp-label">FAQs</p>
                  <h2 className="pp-display pp-d3">Before you post.</h2>
                </div>
                <BriefFaq />
              </div>
              <div className="pp-card pp-card--panel pp-stack pp-gap-5">
                <p className="pp-label">Related</p>
                <div className="pp-stack pp-gap-4">
                  <Link href="/discover-experts" className="pp-link-arrow">
                    How experts are vetted
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                  <Link href="/hiring-workspace" className="pp-link-arrow">
                    Where responses land
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                  <Link href="/products" className="pp-link-arrow">
                    Still choosing software?
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
                <hr className="pp-rule" />
                <p className="pp-body">
                  Not sure how to scope it? <Link href="/contact">Talk to us</Link> and we&apos;ll help you
                  draft the brief.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="pp-section">
        <div className="pp-container-app">
          <Reveal className="pp-dark">
            <div className="pp-sec-split" style={{ alignItems: 'center', gap: 'var(--sp-16)' }}>
              <div className="pp-stack" style={{ gap: 'var(--sp-5)' }}>
                <p className="pp-label">Get started</p>
                <h2 className="pp-display pp-d3">Ten minutes to brief. Two days to responses.</h2>
                <p className="pp-lede">Posting is free — you pay only when an engagement is signed.</p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill" href="/sign-up">
                  Post a brief
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
