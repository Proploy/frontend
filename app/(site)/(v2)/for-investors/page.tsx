import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

export const metadata: Metadata = {
  title: 'For Investors — Proploy',
  description:
    'The investment thesis behind Proploy: an accountable marketplace closing the execution gap between buying software and deploying it.',
}

const THESIS = [
  {
    title: 'The gap is structural',
    body: 'Software discovery, expert services and engagement tooling are three separate industries today. The buyer is left to integrate them — and rollouts fail in the seams. A single accountable marketplace collapses those seams.',
  },
  {
    title: 'Take rate on outcomes',
    body: 'Proploy monetises the engagement, not the click: contracts, invoices and payments run through the workspace. Revenue scales with delivered rollouts, aligning the platform with both sides of every match.',
  },
  {
    title: 'Vetting compounds',
    body: 'Every graded expert, certified playbook and tracked milestone makes the next match better. The data moat is the delivery history — something neither review sites nor staffing firms capture.',
  },
]

// Clearly illustrative figures for the design mock — not audited metrics.
const MARKET_STATS = [
  { value: '$500B+', label: 'Annual B2B software spend, illustrative' },
  { value: '40–60%', label: 'Licenses under-adopted post-purchase, illustrative' },
  { value: '3 industries', label: 'Discovery, services, tooling — collapsed into one' },
  { value: '2-sided', label: 'Take rate on matched, delivered engagements' },
]

const MILESTONES = [
  {
    period: 'Phase 1',
    title: 'Marketplace foundations',
    body: 'Curated product catalog, expert vetting pipeline, and the first matched engagements run end-to-end through the workspace.',
  },
  {
    period: 'Phase 2',
    title: 'Engagement rails',
    body: 'Contracts, invoicing and payments natively in-platform; standardised SOWs and milestone tracking across every engagement.',
  },
  {
    period: 'Phase 3',
    title: 'Ecosystem expansion',
    body: 'Firm accounts for consulting benches, vendor co-selling programs, and certified playbooks per product.',
  },
  {
    period: 'Next',
    title: 'The execution layer',
    body: 'Delivery-history data powering matching, pricing and guarantees — the default route from software decision to working software.',
  },
]

export default function ForInvestorsPage() {
  return (
    <main className="pp-page">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -140, right: -80 }} />

        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <p className="pp-label">For investors</p>

            <h1 className="pp-display pp-d1" style={{ maxWidth: '15ch' }}>
              The marketplace for making software work.
            </h1>

            <p className="pp-lede" style={{ maxWidth: '58ch' }}>
              Proploy sits between three industries that never quite meet — software discovery,
              implementation services, and engagement tooling — and merges them into one accountable
              transaction.
            </p>

            <div className="pp-flex pp-wrap pp-gap-3">
              <a
                className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline"
                href="mailto:investors@proploy.com"
              >
                Contact the founders
              </a>
              <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/mission">
                Read the mission
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Thesis ───────────────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Thesis</p>
              <h2 className="pp-display pp-d3">Why the execution gap is a venture-scale problem.</h2>
            </div>

            <p className="pp-lede">
              Three observations that shape how we build — and how the business compounds.
            </p>
          </Reveal>

          <div className="pp-grid pp-grid-3">
            {THESIS.map((t, i) => (
              <Reveal key={t.title} delay={i * 80}>
                <div
                  className="pp-stack pp-gap-4"
                  style={{
                    borderTop: 'var(--bw-thick) solid var(--line)',
                    paddingTop: 'var(--sp-6)',
                    height: '100%',
                  }}
                >
                  <p className="pp-label pp-accent pp-mono-num">{String(i + 1).padStart(2, '0')}</p>
                  <p className="pp-h5">{t.title}</p>
                  <p className="pp-body">{t.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Market stats band ────────────────────────────────────── */}
      <section className="pp-section pp-band-deep">
        <div className="pp-container pp-stack pp-gap-12">
          <Reveal className="pp-sec-head pp-soften">
            <p className="pp-label">Market shape</p>
            <h2 className="pp-display pp-d3">A large market, badly stitched together.</h2>
          </Reveal>

          <Reveal>
            <div className="pp-card pp-card--panel" style={{ paddingBlock: 'var(--sp-10)' }}>
              <div className="pp-grid pp-grid-4" style={{ gap: 'var(--sp-8)' }}>
                {MARKET_STATS.map((stat) => (
                  <div key={stat.label} className="pp-metric">
                    <p className="pp-metric-value">{stat.value}</p>
                    <p className="pp-label">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="pp-small pp-mt-8">
                Figures are illustrative directional estimates for context, not audited company or
                market metrics.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Milestones timeline ──────────────────────────────────── */}
      <section className="pp-section pp-blueprint">
        <div className="pp-glow" style={{ top: 80, left: -140 }} />

        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Trajectory</p>
              <h2 className="pp-display pp-d3">Built in deliberate phases.</h2>
            </div>

            <p className="pp-lede">
              Each phase widens the moat the previous one dug.
            </p>
          </Reveal>

          <div className="fe-steps">
            {MILESTONES.map((m, i) => (
              <Reveal key={m.period} delay={i * 80} className="fe-step">
                <span className="pp-tag pp-tag--cobalt pp-tag--dot" style={{ alignSelf: 'flex-start' }}>
                  {m.period}
                </span>
                <div className="pp-stack" style={{ gap: 6 }}>
                  <p className="pp-h6">{m.title}</p>
                  <p className="pp-body">{m.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact CTA ──────────────────────────────────────────── */}
      <section className="pp-section">
        <div className="pp-container-app">
          <Reveal className="pp-dark">
            <div className="pp-stack pp-gap-8" style={{ maxWidth: 640 }}>
              <div className="pp-stack pp-gap-5">
                <p className="pp-label">In touch</p>
                <h2 className="pp-display pp-d3">We keep a short, direct line to investors.</h2>
                <p className="pp-lede">
                  For a deeper look at the model, the metrics and the roadmap, write to the founders
                  directly.
                </p>
              </div>

              <div className="pp-flex pp-wrap pp-gap-3">
                <a
                  className="pp-btn pp-btn--cobalt pp-btn--pill pp-btn--inline"
                  href="mailto:investors@proploy.com"
                >
                  investors@proploy.com
                </a>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/for-businesses">
                  See the product story
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
