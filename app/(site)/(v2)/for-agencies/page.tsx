import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

export const metadata: Metadata = {
  title: 'For Consulting Firms — Proploy',
  description:
    'List your whole bench on Proploy — multi-seat consultant profiles, a pipeline of qualified briefs, and white-label delivery through one workspace.',
}

const PILLARS = [
  {
    num: '01',
    title: 'Multi-seat profiles',
    body: 'One firm account, every consultant on the bench. Individual profiles carry your firm’s badge, shared credentials and a combined track record.',
  },
  {
    num: '02',
    title: 'Pipeline of briefs',
    body: 'Qualified implementation briefs routed to the consultants whose stack and sector match — no cold outreach, no RFP lottery.',
  },
  {
    num: '03',
    title: 'White-label delivery',
    body: 'Run engagements under your own brand inside the Proploy workspace: your SOW templates, your rates, our contracts-to-payments rails.',
  },
]

const OPS = [
  {
    title: 'Bench utilisation, visible',
    body: 'See which consultants are staffed, which are free next week, and route new briefs accordingly — one roster view for the whole firm.',
  },
  {
    title: 'One contract, many seats',
    body: 'Firm-level agreements cover every consultant you list. Add seats as you hire without renegotiating terms.',
  },
  {
    title: 'Consolidated invoicing',
    body: 'Engagement invoices roll up to the firm. Finance reconciles one statement, not a spreadsheet of solo payouts.',
  },
  {
    title: 'Reputation that compounds',
    body: 'Every completed rollout builds the firm’s public track record — ratings accrue to your brand, not just individuals.',
  },
]

const STEPS = [
  { num: '01', title: 'Apply as a firm', body: 'Share your practice areas, bench size and flagship rollouts. One application covers the firm.' },
  { num: '02', title: 'Vet the bench', body: 'Consultants go through the same interview and reference checks as solo experts — accelerated for established firms.' },
  { num: '03', title: 'Receive routed briefs', body: 'Briefs matching your practice land in a shared pipeline. Assign the right consultant in a click.' },
  { num: '04', title: 'Deliver and grow', body: 'Run delivery in the workspace, invoice at firm level, and let the track record win the next brief.' },
]

export default function ForAgenciesPage() {
  return (
    <main className="pp-page">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -120, right: -60 }} />

        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <p className="pp-label">For consulting firms</p>

            <div className="pp-sec-split" style={{ alignItems: 'start' }}>
              <h1 className="pp-display pp-d1">
                Put your whole
                <br />
                bench to work.
              </h1>

              <p className="pp-lede">
                List every consultant on one firm account, receive qualified implementation briefs,
                and deliver under your own brand — with contracts and payments handled.
              </p>
            </div>

            <div className="pp-flex pp-wrap pp-gap-3">
              <Link className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline" href="/contact">
                Talk to partnerships
              </Link>
              <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/for-experts">
                Listing solo? Start here
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Three pillars ────────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Built for firms</p>
              <h2 className="pp-display pp-d3">A marketplace seat shaped like a practice.</h2>
            </div>

            <p className="pp-lede">
              Solo-expert marketplaces flatten firms into freelancers. Proploy keeps the firm intact.
            </p>
          </Reveal>

          <div className="pp-grid pp-grid-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.num} delay={i * 80}>
                <div
                  className="pp-card pp-card--panel pp-lift pp-stack pp-gap-8"
                  style={{ height: '100%', minHeight: 260 }}
                >
                  <span className="pp-tile pp-tile--ink pp-mono-num">{p.num}</span>
                  <div className="pp-stack" style={{ gap: 6, marginTop: 'auto' }}>
                    <p className="pp-h5">{p.title}</p>
                    <p className="pp-body">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Firm operations grid ─────────────────────────────────── */}
      <section className="pp-section pp-blueprint">
        <div className="pp-glow" style={{ top: 60, left: -140 }} />

        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Firm operations</p>
              <h2 className="pp-display pp-d3">The back office scales with the bench.</h2>
            </div>

            <p className="pp-lede">
              Everything a partner cares about between kickoff and cash collected.
            </p>
          </Reveal>

          <div className="pp-grid pp-grid-2">
            {OPS.map((item, i) => (
              <Reveal key={item.title} delay={(i % 2) * 80}>
                <div className="pp-card pp-lift pp-flex pp-gap-4" style={{ height: '100%', alignItems: 'flex-start' }}>
                  <span className="pp-tile pp-tile--soft pp-mono-num" style={{ fontSize: 14 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="pp-stack" style={{ gap: 6 }}>
                    <p className="pp-h6">{item.title}</p>
                    <p className="pp-body">{item.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works steps ───────────────────────────────────── */}
      <section className="pp-section pp-band-deep">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-head pp-soften">
            <p className="pp-label">How it works</p>
            <h2 className="pp-display pp-d3">From application to active pipeline.</h2>
          </Reveal>

          <div className="fe-steps">
            {STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 80} className="fe-step">
                <p className="pp-label fe-num pp-mono-num">{step.num}</p>
                <div className="pp-stack" style={{ gap: 6 }}>
                  <p className="pp-h6">{step.title}</p>
                  <p className="pp-body">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────── */}
      <section className="pp-section">
        <div className="pp-container-app">
          <Reveal className="pp-dark">
            <div className="pp-stack pp-gap-8" style={{ maxWidth: 640 }}>
              <div className="pp-stack pp-gap-5">
                <p className="pp-label">Bring the firm</p>
                <h2 className="pp-display pp-d3">Your consultants are already the product. Give them distribution.</h2>
                <p className="pp-lede">
                  Tell us about your practice and we&rsquo;ll walk through firm onboarding together.
                </p>
              </div>

              <div className="pp-flex pp-wrap pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill pp-btn--inline" href="/contact">
                  Start the conversation
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/experts">
                  See the expert network
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
