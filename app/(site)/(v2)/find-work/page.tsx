import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

export const metadata: Metadata = {
  title: 'Find work — Proploy',
  description:
    'Qualified briefs matched to your platforms and industries. Scope and budget defined before you respond — no bidding wars, no race to the bottom.',
}

const MATCH_STEPS = [
  {
    num: '01',
    title: 'Your profile is the filter',
    body: 'The platforms you implement, the industries you know and your delivery capacity decide which briefs ever reach you. No feed to refresh, no keywords to game.',
  },
  {
    num: '02',
    title: 'Briefs arrive scored',
    body: 'Every brief lands with a match score against your stack, plus scope, timeline and budget already written down by the business. You see everything before you respond.',
  },
  {
    num: '03',
    title: 'You respond to real intent',
    body: 'Businesses on Proploy have already chosen the software. They need the expert who has shipped it — not fifteen quotes to compare on price.',
  },
]

const SIGNALS_IN = [
  'Platforms you have actually implemented',
  'Industries where you have delivered before',
  'Current capacity and start date',
  'Verified references and case studies',
]

const SIGNALS_OUT = [
  'Who bids the lowest rate',
  'Who replies within ninety seconds',
  'Who buys credits to boost visibility',
  'Who games a public ranking',
]

function CheckIcon() {
  return (
    <span className="pp-yes" style={{ flexShrink: 0, marginTop: 2 }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="m5 13 4 4 10-10" />
      </svg>
    </span>
  )
}

export default function FindWorkPage() {
  return (
    <main className="pp-page">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -140, left: -80 }} />
        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <p className="pp-label">Find work</p>
            <div className="pp-sec-split" style={{ alignItems: 'start' }}>
              <h1 className="pp-display pp-d1">
                Briefs that fit.
                <br />
                No bidding wars.
              </h1>
              <p className="pp-lede">
                Businesses arrive with the software chosen, the scope written and the budget committed. Proploy matches
                the brief to you — you decide whether to take it.
              </p>
            </div>
            <div className="pp-flex pp-wrap pp-gap-3">
              <Link className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline" href="/become-expert">
                Apply to join
              </Link>
              <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/for-experts">
                How Proploy works
              </Link>
            </div>
            <div className="pp-flex pp-wrap pp-gap-3">
              <span className="pp-tag pp-tag--cobalt pp-tag--dot">Matched by platform</span>
              <span className="pp-tag pp-tag--dot">Matched by industry</span>
              <span className="pp-tag pp-tag--dot">Budget defined upfront</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── How matching works ──────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">How matching works</p>
              <h2 className="pp-display pp-d3">You don&apos;t chase work. It routes to you.</h2>
            </div>
            <p className="pp-lede">
              Matching runs on what you have shipped, not on how fast you refresh a job board.
            </p>
          </Reveal>
          <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-6)' }}>
            {MATCH_STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 90}>
                <div
                  className="pp-card pp-lift"
                  style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-10)', minHeight: 280, height: '100%' }}
                >
                  <span className="pp-tile">{step.num}</span>
                  <div className="pp-stack pp-gap-3" style={{ marginTop: 'auto' }}>
                    <p className="pp-h6">{step.title}</p>
                    <p className="pp-body">{step.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sample brief ────────────────────────────────────────── */}
      <section className="pp-section pp-blueprint">
        <div className="pp-glow" style={{ bottom: -160, right: -120 }} />
        <div className="pp-container">
          <Reveal>
            <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-16)', alignItems: 'center' }}>
              <div className="pp-stack pp-gap-6 pp-soften">
                <p className="pp-label">Brief quality</p>
                <h2 className="pp-display pp-d3">Every brief reads like a project, not a lottery ticket.</h2>
                <p className="pp-lede">
                  Proploy&apos;s team qualifies each brief before it goes out: the platform is chosen, the outcome is
                  named and the budget is committed to escrow before kickoff.
                </p>
                <ul className="pp-stack pp-gap-3">
                  {['Scope and deliverables written down', 'Budget range attached, funds committed at signing', 'Decision-maker identified before intro'].map(
                    (point) => (
                      <li key={point} className="pp-flex pp-gap-3" style={{ alignItems: 'flex-start' }}>
                        <CheckIcon />
                        <span className="pp-body">{point}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>

              {/* mock brief card */}
              <div className="pp-glass" style={{ padding: 'var(--sp-8)' }}>
                <div className="pp-stack pp-gap-5">
                  <div className="pp-flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--sp-4)' }}>
                    <div className="pp-stack" style={{ gap: 4 }}>
                      <p className="pp-label">Brief · BR-2481</p>
                      <p className="pp-h5">HubSpot CRM rollout — Series B fintech</p>
                    </div>
                    <span className="pp-tag pp-tag--success pp-tag--dot">96% match</span>
                  </div>
                  <div className="pp-flex pp-wrap pp-gap-2">
                    <span className="pp-tag">HubSpot</span>
                    <span className="pp-tag">Fintech</span>
                    <span className="pp-tag">Migration + training</span>
                  </div>
                  <hr className="pp-rule" />
                  <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-4)' }}>
                    <div className="pp-stack" style={{ gap: 2 }}>
                      <p className="pp-label">Budget</p>
                      <p className="pp-h6 pp-mono-num">$18–24k</p>
                    </div>
                    <div className="pp-stack" style={{ gap: 2 }}>
                      <p className="pp-label">Timeline</p>
                      <p className="pp-h6 pp-mono-num">6 wks</p>
                    </div>
                    <div className="pp-stack" style={{ gap: 2 }}>
                      <p className="pp-label">Start</p>
                      <p className="pp-h6 pp-mono-num">Mar 02</p>
                    </div>
                  </div>
                  <hr className="pp-rule" />
                  <p className="pp-small">
                    Matched on: HubSpot implementations (7), fintech delivery history, availability from March.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── What matters / what doesn't ─────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">No race to the bottom</p>
              <h2 className="pp-display pp-d3">What gets you matched — and what doesn&apos;t.</h2>
            </div>
            <p className="pp-lede">
              There is no public leaderboard to climb and no bid box to undercut. The signal is your delivery record.
            </p>
          </Reveal>
          <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-6)' }}>
            <Reveal>
              <div className="pp-card pp-card--panel pp-stack pp-gap-6" style={{ height: '100%' }}>
                <p className="pp-label pp-accent">Counts toward a match</p>
                <ul className="pp-stack pp-gap-4">
                  {SIGNALS_IN.map((s) => (
                    <li key={s} className="pp-flex pp-gap-3" style={{ alignItems: 'flex-start' }}>
                      <CheckIcon />
                      <span className="pp-body">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={90}>
              <div className="pp-card pp-card--panel pp-stack pp-gap-6" style={{ height: '100%' }}>
                <p className="pp-label">Deliberately ignored</p>
                <ul className="pp-stack pp-gap-4">
                  {SIGNALS_OUT.map((s) => (
                    <li key={s} className="pp-flex pp-gap-3" style={{ alignItems: 'flex-start' }}>
                      <span className="pp-no" style={{ flexShrink: 0, width: 22, textAlign: 'center' }}>
                        —
                      </span>
                      <span className="pp-body">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
          <Reveal>
            <p className="pp-body">
              Want more briefs to reach you? Strengthen your profile —{' '}
              <Link href="/get-discovered" className="pp-link-arrow" style={{ fontSize: 15 }}>
                see how discovery works
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Closing CTA ─────────────────────────────────────────── */}
      <section className="pp-section">
        <div className="pp-container-app">
          <Reveal className="pp-dark">
            <div className="pp-sec-split" style={{ alignItems: 'center', gap: 'var(--sp-16)' }}>
              <div className="pp-stack" style={{ gap: 'var(--sp-5)' }}>
                <p className="pp-label">Get started</p>
                <h2 className="pp-display pp-d3">The next brief could already fit you.</h2>
                <p className="pp-lede">
                  Apply once, get vetted, and let qualified work route to your inbox — scope and budget included.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill" href="/become-expert">
                  Apply to join
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/experts">
                  See the network
                </Link>
                <p className="pp-small">0% commission on your first matched project.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
