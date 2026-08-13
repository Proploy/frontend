import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

import { WorkspaceTabs } from './WorkspaceTabs'

export const metadata: Metadata = {
  title: 'Hiring workspace — Proploy',
  description:
    'Shortlists, conversations and decision records in one place — so your hiring decision survives handoffs, holidays and audits.',
}

const PILLARS = [
  {
    title: 'Shortlists that stay current',
    body: 'Candidates, fit scores and comparison tables update as responses arrive. No spreadsheet exports, no stale versions in email.',
    icon: (
      <>
        <path d="M4 6.5h16M4 12h16M4 17.5h10" />
        <circle cx="19" cy="17.5" r="2.4" />
      </>
    ),
  },
  {
    title: 'Conversations in context',
    body: 'Every message, proposal and attachment sits next to the candidate it came from. Loop in a colleague without forwarding a thread.',
    icon: (
      <>
        <path d="M21 11.5a8 8 0 0 1-8 8H8l-5 3 1.3-4.3A8 8 0 0 1 13 3.5a8 8 0 0 1 8 8Z" />
        <path d="M9 10.5h7M9 13.5h4" />
      </>
    ),
  },
  {
    title: 'Decision records that stick',
    body: 'Who chose what, when and why — captured as you go. Six months later, the rationale is one click away, not one archaeologist away.',
    icon: (
      <>
        <path d="M6 3.5h9l4 4v13H6Z" />
        <path d="M14.5 3.5v4.5H19" />
        <path d="m9 13.5 2 2 4-4.5" />
      </>
    ),
  },
]

const TIMELINE = [
  { time: 'Mon 09:10', event: 'Brief posted', detail: 'Meridian HRIS rollout, 8-week window, $25k–$40k' },
  { time: 'Tue 16:42', event: 'Three responses in', detail: 'Comparison table generated automatically' },
  { time: 'Wed 11:00', event: 'Finance joins', detail: 'J. Patel added as approver — sees budget lines only' },
  { time: 'Thu 14:30', event: 'First calls booked', detail: 'Two candidates, notes template attached' },
  { time: 'Fri 10:05', event: 'Decision recorded', detail: 'Amara O. selected — rationale logged, SOW drafted' },
]

const METRICS = [
  { value: '48h', label: 'Median brief to first response' },
  { value: '1', label: 'Place every artifact lives' },
  { value: '0', label: 'Email threads to reconstruct' },
]

export default function HiringWorkspacePage() {
  return (
    <main className="pp-page">
      {/* ── Hero ── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -120, left: -80 }} />
        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <p className="pp-label">Hiring workspace</p>
            <div className="pp-sec-split" style={{ alignItems: 'start' }}>
              <h1 className="pp-display pp-d1">
                The hire happens
                <br />
                in one place.
                <br />
                So does the why.
              </h1>
              <p className="pp-lede">
                Shortlists, conversations and decision records live together — visible to everyone who
                needs them and no one who doesn&apos;t.
              </p>
            </div>
            <div className="pp-flex pp-wrap pp-gap-3">
              <Link className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline" href="/sign-up">
                Open a workspace
              </Link>
              <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/post-a-job">
                Start with a brief
              </Link>
            </div>
            <div className="pp-flex pp-wrap pp-gap-6" style={{ alignItems: 'center' }}>
              <div className="pp-avatars">
                <span className="pp-avatar">SC</span>
                <span className="pp-avatar">JP</span>
                <span className="pp-avatar">AO</span>
                <span className="pp-avatar">+2</span>
              </div>
              <p className="pp-small">Your team, your approvers and your candidates — one thread.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Three pillars ── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">What lives here</p>
              <h2 className="pp-display pp-d3">Three things email always loses.</h2>
            </div>
            <p className="pp-lede">
              Hiring falls apart in the gaps between tools. The workspace removes the gaps.
            </p>
          </Reveal>

          <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-6)' }}>
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <div
                  className="pp-card pp-lift"
                  style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-10)', minHeight: 268, height: '100%' }}
                >
                  <span className="pp-ico pp-ico--lg">
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {p.icon}
                    </svg>
                  </span>
                  <div className="pp-stack pp-gap-3" style={{ marginTop: 'auto' }}>
                    <p className="pp-h6">{p.title}</p>
                    <p className="pp-body">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive workspace demo ── */}
      <section className="pp-section pp-blueprint">
        <div className="pp-glow" style={{ bottom: -160, right: -100 }} />
        <div className="pp-container">
          <Reveal className="fe-reach">
            <div className="pp-stack pp-gap-6 pp-soften">
              <p className="pp-label">Inside the workspace</p>
              <h2 className="pp-display pp-d3">Click through a live hire.</h2>
              <p className="pp-lede">
                One engagement, three views. The shortlist ranks candidates as responses arrive,
                conversations keep every proposal in context, and the decision log captures the
                rationale the moment it&apos;s made.
              </p>
              <p className="pp-body">
                Approvers see what they need to approve. Reviewers see everything. Candidates see only
                their own thread — never each other.
              </p>
              <div>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/manage-team-projects">
                  See roles &amp; approvals
                </Link>
              </div>
            </div>
            <WorkspaceTabs />
          </Reveal>
        </div>
      </section>

      {/* ── A week in the workspace — timeline ── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">A week in the workspace</p>
              <h2 className="pp-display pp-d3">Brief on Monday. Decision by Friday.</h2>
            </div>
            <p className="pp-lede">
              A real cadence from a mid-market HRIS hire — every event stamped and searchable.
            </p>
          </Reveal>

          <Reveal>
            <div className="pp-card pp-card--panel" style={{ paddingBlock: 'var(--sp-6)' }}>
              <ol className="pp-stack">
                {TIMELINE.map((t, i) => (
                  <li
                    key={t.time}
                    className="pp-flex pp-gap-6"
                    style={{
                      alignItems: 'flex-start',
                      paddingBlock: 'var(--sp-4)',
                      borderBottom: i < TIMELINE.length - 1 ? '1px solid var(--line)' : 'none',
                    }}
                  >
                    <span className="pp-label pp-mono-num" style={{ minWidth: 88, paddingTop: 3 }}>
                      {t.time}
                    </span>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        background: i === TIMELINE.length - 1 ? 'var(--cobalt)' : 'color-mix(in oklab, var(--cobalt) 35%, transparent)',
                        marginTop: 8,
                        flexShrink: 0,
                      }}
                    />
                    <div className="pp-stack" style={{ gap: 2 }}>
                      <p className="pp-body" style={{ color: 'var(--ink)', fontWeight: 600 }}>
                        {t.event}
                      </p>
                      <p className="pp-body">{t.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal>
            <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-8)' }}>
              {METRICS.map((m) => (
                <div key={m.label} className="pp-metric">
                  <p className="pp-metric-value">{m.value}</p>
                  <p className="pp-label">{m.label}</p>
                </div>
              ))}
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
                <h2 className="pp-display pp-d3">Make your next hire the documented one.</h2>
                <p className="pp-lede">
                  Post a brief and the workspace assembles itself — shortlist, threads and decision log
                  included.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill" href="/sign-up">
                  Open a workspace
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/discover-experts">
                  Browse experts first
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
