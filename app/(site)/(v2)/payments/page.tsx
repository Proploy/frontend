import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

export const metadata: Metadata = {
  title: 'Payments — Proploy',
  description:
    'Funds committed before kickoff, held in escrow-style milestone accounts and released on approval — with payout methods that fit how you bank.',
}

const ESCROW_STAGES = [
  {
    num: '01',
    title: 'Funded at signing',
    tag: 'Committed',
    tagClass: 'pp-tag pp-tag--cobalt pp-tag--dot',
    body: 'The client funds the milestone when the contract is signed. The budget stops being a promise and becomes a balance.',
  },
  {
    num: '02',
    title: 'Held while you deliver',
    tag: 'Protected',
    tagClass: 'pp-tag pp-tag--cobalt pp-tag--dot',
    body: 'Funds sit in a protected milestone account. Neither side can move them unilaterally while work is in flight.',
  },
  {
    num: '03',
    title: 'Approved in the workspace',
    tag: 'Reviewed',
    tagClass: 'pp-tag pp-tag--warning pp-tag--dot',
    body: 'The client reviews the deliverables against the SOW. Disputes, if any, follow the contract’s defined path — not a support queue.',
  },
  {
    num: '04',
    title: 'Released to you',
    tag: 'Paid out',
    tagClass: 'pp-tag pp-tag--success pp-tag--dot',
    body: 'Approval triggers release automatically. The payout heads to your chosen method the same day.',
  },
]

const PROTECTIONS = [
  {
    title: 'No ghosted invoices',
    body: 'Because milestones are funded upfront, "the client went quiet" is a scheduling problem, not a cash-flow one. The money is already committed.',
    icon: (
      <>
        <path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    title: 'A dispute path that ends',
    body: 'If approval stalls, the standard contract defines exactly what happens next — evidence, timeline, decision. No open-ended limbo on your receivables.',
    icon: (
      <>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
        <circle cx="12" cy="12" r="5.5" />
        <path d="m10 12 1.5 1.5 2.8-3" />
      </>
    ),
  },
  {
    title: 'Payouts your way',
    body: 'Local bank transfer, SEPA, ACH or wire — pick per engagement. Fees and FX are shown before you accept a brief, never discovered on the statement.',
    icon: (
      <>
        <rect x="3" y="6.5" width="18" height="12" rx="2.5" />
        <path d="M3 10.5h18" />
        <circle cx="16.5" cy="14.8" r="1.4" />
      </>
    ),
  },
]

const METRICS = [
  { value: '100%', label: 'Of milestones funded before kickoff' },
  { value: '24h', label: 'Typical release-to-payout time' },
  { value: '0%', label: 'Commission taken from your rate' },
]

export default function PaymentsPage() {
  return (
    <main className="pp-page">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -120, right: -60 }} />
        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <p className="pp-label">Payments</p>
            <div className="pp-sec-split" style={{ alignItems: 'start' }}>
              <h1 className="pp-display pp-d1">
                Funded before kickoff.
                <br />
                Released on approval.
              </h1>
              <p className="pp-lede">
                Every milestone is backed by money already committed. You deliver, the client approves, the payout
                moves — in that order, every time.
              </p>
            </div>
            <div className="pp-flex pp-wrap pp-gap-3">
              <Link className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline" href="/become-expert">
                Apply to join
              </Link>
              <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/global-payments">
                Paid outside the US?
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Escrow timeline ─────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">How the money moves</p>
              <h2 className="pp-display pp-d3">Four states. No surprises.</h2>
            </div>
            <p className="pp-lede">
              An escrow-style flow per milestone — visible to both sides in the workspace at every stage.
            </p>
          </Reveal>
          <div className="pp-grid pp-grid-4" style={{ gap: 'var(--sp-6)' }}>
            {ESCROW_STAGES.map((stage, i) => (
              <Reveal key={stage.num} delay={i * 80}>
                <div
                  className="pp-card pp-lift pp-stack pp-gap-5"
                  style={{ height: '100%', minHeight: 250 }}
                >
                  <div className="pp-flex" style={{ justifyContent: 'space-between', alignItems: 'center', gap: 'var(--sp-3)' }}>
                    <span className={i === 3 ? 'pp-tile pp-tile--ink' : 'pp-tile'}>{stage.num}</span>
                    <span className={stage.tagClass}>{stage.tag}</span>
                  </div>
                  <div className="pp-stack pp-gap-2" style={{ marginTop: 'auto' }}>
                    <p className="pp-h6">{stage.title}</p>
                    <p className="pp-body">{stage.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Metrics band ────────────────────────────────────────── */}
      <section className="pp-section pp-blueprint">
        <div className="pp-glow" style={{ top: 40, left: -140 }} />
        <div className="pp-container">
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
        </div>
      </section>

      {/* ── Protection ──────────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Payment protection</p>
              <h2 className="pp-display pp-d3">Built for the ways independent work goes wrong.</h2>
            </div>
            <p className="pp-lede">
              Late payment is the number-one reason experts leave independent work. It is the first thing we engineered
              out.
            </p>
          </Reveal>
          <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-6)' }}>
            {PROTECTIONS.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <div
                  className="pp-card pp-lift"
                  style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-10)', minHeight: 270, height: '100%' }}
                >
                  <span className="pp-ico pp-ico--lg">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
          <Reveal>
            <p className="pp-body">
              Working across borders?{' '}
              <Link href="/global-payments" className="pp-link-arrow" style={{ fontSize: 15 }}>
                Local-currency payouts in 34 countries
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
                <h2 className="pp-display pp-d3">Deliver the work. The money is already there.</h2>
                <p className="pp-lede">
                  Join a network where every engagement starts funded — and your invoice never has to chase anyone.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill" href="/become-expert">
                  Apply to join
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/commission">
                  See the pricing
                </Link>
                <p className="pp-small">Funds committed at signature, released per approved milestone.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
