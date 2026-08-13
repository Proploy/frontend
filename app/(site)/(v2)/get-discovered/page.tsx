import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

export const metadata: Metadata = {
  title: 'Get discovered — Proploy',
  description:
    'One profile, verified once, working everywhere: appear in the expert directory, surface in matched briefs and let businesses find you with proof attached.',
}

const STAGES = [
  {
    num: '01',
    title: 'Build your profile',
    tag: 'Day one',
    body: 'List the platforms you implement, the industries you serve and the engagements that prove it. Case studies and references do the talking — no cover letters.',
  },
  {
    num: '02',
    title: 'Get verified',
    tag: 'Within a week',
    body: 'An intake interview, two client references and proof of at least one full implementation. Pass, and the verified badge goes on your profile — the signal businesses filter by first.',
  },
  {
    num: '03',
    title: 'Appear everywhere it counts',
    tag: 'Ongoing',
    body: 'Your profile surfaces in the public expert directory, in curated shortlists and in every matched brief where your stack fits. One profile, working while you deliver.',
  },
]

const METRICS = [
  { value: '3×', label: 'More profile views with a verified badge' },
  { value: '48h', label: 'Median time from verification to first brief' },
  { value: '92%', label: 'Of matches go to profiles with case studies' },
]

const UPKEEP = [
  {
    title: 'Case studies compound',
    body: 'Every completed Proploy engagement can roll straight into a case study — outcome, platform and timeline captured while they are fresh.',
    icon: (
      <>
        <path d="M4 19.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13.5" />
        <path d="M4 19.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
  },
  {
    title: 'Availability is a signal',
    body: 'Set your capacity and next start date. Matching respects it — you stop appearing when you are booked, and resurface the moment you free up.',
    icon: (
      <>
        <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
        <path d="M3.5 9.5h17M8 3v4M16 3v4" />
        <path d="m9.5 14.5 2 2 3.5-4" />
      </>
    ),
  },
  {
    title: 'References carry weight',
    body: 'Client references are checked by a human, not scraped from a form. They unlock badges and raise your rank in curated shortlists.',
    icon: (
      <>
        <path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
]

export default function GetDiscoveredPage() {
  return (
    <main className="pp-page">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -120, right: -60 }} />
        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <p className="pp-label">Get discovered</p>
            <div className="pp-sec-split" style={{ alignItems: 'start' }}>
              <h1 className="pp-display pp-d1">
                Build it once.
                <br />
                Be found everywhere.
              </h1>
              <p className="pp-lede">
                Your Proploy profile is a storefront that works while you deliver: verified, searchable and wired into
                the matching engine.
              </p>
            </div>
            <div className="pp-flex pp-wrap pp-gap-3">
              <Link className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline" href="/become-expert">
                Create your profile
              </Link>
              <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/experts">
                Browse the directory
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Timeline ────────────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Profile to pipeline</p>
              <h2 className="pp-display pp-d3">Three stages between you and a full pipeline.</h2>
            </div>
            <p className="pp-lede">
              Verification is the gate that keeps the directory credible — and the reason a Proploy profile carries
              weight.
            </p>
          </Reveal>
          <div className="pp-stack" style={{ gap: 0 }}>
            {STAGES.map((stage, i) => (
              <Reveal key={stage.num} delay={i * 100}>
                <div
                  className="pp-grid"
                  style={{
                    gridTemplateColumns: 'auto minmax(0,1fr)',
                    gap: 'var(--sp-6)',
                    paddingBlock: 'var(--sp-6)',
                    borderBottom: i < STAGES.length - 1 ? 'var(--bw) solid var(--line)' : 'none',
                  }}
                >
                  <div className="pp-stack" style={{ alignItems: 'center', gap: 'var(--sp-3)' }}>
                    <span className={i === 0 ? 'pp-tile pp-tile--ink' : 'pp-tile'}>{stage.num}</span>
                    {i < STAGES.length - 1 && (
                      <span style={{ flex: 1, width: 1, background: 'var(--line)', minHeight: 24 }} />
                    )}
                  </div>
                  <div className="pp-stack pp-gap-3" style={{ maxWidth: 640 }}>
                    <div className="pp-flex pp-wrap pp-gap-3" style={{ alignItems: 'center' }}>
                      <p className="pp-h5">{stage.title}</p>
                      <span className="pp-tag pp-tag--cobalt pp-tag--dot">{stage.tag}</span>
                    </div>
                    <p className="pp-body">{stage.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── What businesses see ─────────────────────────────────── */}
      <section className="pp-section pp-blueprint">
        <div className="pp-glow" style={{ bottom: -180, left: -100 }} />
        <div className="pp-container">
          <Reveal>
            <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-16)', alignItems: 'center' }}>
              {/* mock directory card */}
              <div className="pp-glass" style={{ padding: 'var(--sp-8)' }}>
                <div className="pp-stack pp-gap-5">
                  <div className="pp-flex pp-gap-4" style={{ alignItems: 'center' }}>
                    <span className="pp-avatar pp-avatar--lg pp-online">AK</span>
                    <div className="pp-stack" style={{ gap: 2 }}>
                      <div className="pp-flex pp-gap-2" style={{ alignItems: 'center' }}>
                        <p className="pp-h5">Amara Koné</p>
                        <span className="pp-tag pp-tag--cobalt pp-tag--dot">Verified</span>
                      </div>
                      <p className="pp-small">Salesforce &amp; HubSpot implementation lead · Lisbon</p>
                    </div>
                  </div>
                  <div className="pp-flex pp-wrap pp-gap-2">
                    <span className="pp-tag">Salesforce</span>
                    <span className="pp-tag">HubSpot</span>
                    <span className="pp-tag">SaaS</span>
                    <span className="pp-tag">Healthcare</span>
                  </div>
                  <hr className="pp-rule" />
                  <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-4)' }}>
                    <div className="pp-stack" style={{ gap: 2 }}>
                      <p className="pp-label">Projects</p>
                      <p className="pp-h6 pp-mono-num">23</p>
                    </div>
                    <div className="pp-stack" style={{ gap: 2 }}>
                      <p className="pp-label">Rating</p>
                      <p className="pp-h6 pp-mono-num">4.9</p>
                    </div>
                    <div className="pp-stack" style={{ gap: 2 }}>
                      <p className="pp-label">Next start</p>
                      <p className="pp-h6 pp-mono-num">2 wks</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pp-stack pp-gap-6 pp-soften">
                <p className="pp-label">Your storefront</p>
                <h2 className="pp-display pp-d3">What a business sees before they ever email you.</h2>
                <p className="pp-lede">
                  Verified badge, delivery record, live availability. By the time an intro happens, the client already
                  trusts the profile — so the first call is about the project, not your CV.
                </p>
                <p className="pp-body">
                  Once matched, everything moves into the workspace —{' '}
                  <Link href="/manage-projects" className="pp-link-arrow" style={{ fontSize: 15 }}>
                    see how projects run
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Metrics ─────────────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal>
            <div className="pp-card pp-card--panel" style={{ paddingBlock: 'var(--sp-12)' }}>
              <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-8)' }}>
                {METRICS.map((m) => (
                  <div key={m.label} className="pp-metric">
                    <p className="pp-metric-value">{m.value}</p>
                    <p className="pp-label">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-6)' }}>
            {UPKEEP.map((item, i) => (
              <Reveal key={item.title} delay={i * 90}>
                <div
                  className="pp-card pp-lift"
                  style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-10)', minHeight: 260, height: '100%' }}
                >
                  <span className="pp-ico pp-ico--lg">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {item.icon}
                    </svg>
                  </span>
                  <div className="pp-stack pp-gap-3" style={{ marginTop: 'auto' }}>
                    <p className="pp-h6">{item.title}</p>
                    <p className="pp-body">{item.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ─────────────────────────────────────────── */}
      <section className="pp-section">
        <div className="pp-container-app">
          <Reveal className="pp-dark">
            <div className="pp-sec-split" style={{ alignItems: 'center', gap: 'var(--sp-16)' }}>
              <div className="pp-stack" style={{ gap: 'var(--sp-5)' }}>
                <p className="pp-label">Get started</p>
                <h2 className="pp-display pp-d3">Your next client is already searching.</h2>
                <p className="pp-lede">
                  Build the profile once. Verification and matching handle the rest — while you stay heads-down on
                  delivery.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill" href="/become-expert">
                  Create your profile
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/find-work">
                  How matching works
                </Link>
                <p className="pp-small">Most applications are decided within a week.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
