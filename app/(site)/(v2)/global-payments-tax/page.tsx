import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

import { PaymentsFaq } from './PaymentsFaq'

export const metadata: Metadata = {
  title: 'Global payments & tax — Proploy',
  description:
    'Pay vetted experts in 34 countries with tax and compliance handled — local invoicing entities, jurisdiction-correct documentation and one monthly invoice.',
}

// deterministic dot pattern — same on server and client
const DOT_COUNT = 132
const HOT = new Set([7, 18, 29, 34, 47, 52, 63, 71, 84, 96, 101, 118])
const ON = new Set([3, 11, 15, 22, 26, 38, 41, 45, 55, 59, 67, 74, 78, 82, 89, 93, 104, 108, 113, 121, 125, 129])

const PAY_STEPS = [
  {
    num: 'Step 01',
    title: 'Approve the invoice',
    body: 'Finance signs off in the approval queue — the same flow whether the expert is across town or across an ocean.',
  },
  {
    num: 'Step 02',
    title: 'Proploy pays out locally',
    body: 'The expert receives local currency through our regional invoicing entity, at the FX rate shown on your invoice line.',
  },
  {
    num: 'Step 03',
    title: 'Documentation files itself',
    body: 'Residency declarations, withholding treatment and remittance records attach to the engagement automatically.',
  },
  {
    num: 'Step 04',
    title: 'One invoice at month-end',
    body: 'Every expert, every project, every currency — consolidated into a single monthly invoice from one entity.',
  },
]

const COMPLIANCE_CARDS = [
  {
    title: 'Local invoicing entities',
    body: 'You contract with a Proploy entity in your region. Cross-border engagements stop being cross-border paperwork.',
    icon: (
      <>
        <path d="M4 20.5h16M5.5 20.5V8l6.5-4 6.5 4v12.5" />
        <path d="M9.5 20.5v-5h5v5M9.5 11.5h5" />
      </>
    ),
  },
  {
    title: 'Tax status collected once',
    body: 'Experts complete the residency and contractor-status declarations their jurisdiction requires — before the first payout, renewed when rules change.',
    icon: (
      <>
        <path d="M6 3.5h9l4 4v13H6Z" />
        <path d="M14.5 3.5v4.5H19" />
        <path d="m9 13 2 2 4-4.5" />
      </>
    ),
  },
  {
    title: 'Correct treatment, per country',
    body: 'Withholding and reporting rules differ in every one of the 34 countries. Proploy applies the right treatment per engagement, and shows its work.',
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17M12 3.5c2.6 2.3 4 5.2 4 8.5s-1.4 6.2-4 8.5c-2.6-2.3-4-5.2-4-8.5s1.4-6.2 4-8.5Z" />
      </>
    ),
  },
  {
    title: 'One monthly invoice',
    body: 'Twelve experts in eight countries still equals one supplier record, one invoice and one payment run for your team.',
    icon: (
      <>
        <rect x="3.5" y="5" width="17" height="15" rx="2" />
        <path d="M3.5 9.5h17M8 14h5M8 17h3" />
      </>
    ),
  },
]

const METRICS = [
  { value: '34', label: 'Countries with local payouts' },
  { value: '1', label: 'Supplier record for procurement' },
  { value: '0', label: 'Tax forms your team chases' },
]

export default function GlobalPaymentsTaxPage() {
  return (
    <main className="pp-page">
      {/* ── Hero ── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -140, right: -80 }} />
        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <p className="pp-label">Global payments &amp; tax</p>
            <div className="pp-sec-split" style={{ alignItems: 'start' }}>
              <h1 className="pp-display pp-d1">
                Pay experts in
                <br />
                34 countries like
                <br />
                they&apos;re next door.
              </h1>
              <p className="pp-lede">
                Local invoicing entities, jurisdiction-correct tax documentation and a single monthly
                invoice — compliance handled, not outsourced to your inbox.
              </p>
            </div>
            <div className="pp-flex pp-wrap pp-gap-3">
              <Link className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline" href="/sign-up">
                Get started
              </Link>
              <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/approve-invoices">
                See invoice approvals
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Coverage — dots grid split ── */}
      <section className="pp-section pp-band">
        <div className="pp-container">
          <Reveal className="fe-reach">
            <div className="pp-stack pp-gap-6 pp-soften">
              <p className="pp-label">Coverage</p>
              <h2 className="pp-display pp-d3">One network, 34 payout countries.</h2>
              <p className="pp-lede">
                Hire the best specialist for your rollout, wherever they are. Proploy&apos;s regional
                entities handle the contract, the payout and the paperwork on both sides of the border.
              </p>
              <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-6)' }}>
                {METRICS.map((m) => (
                  <div key={m.label} className="pp-metric">
                    <p className="pp-metric-value" style={{ fontSize: 36 }}>{m.value}</p>
                    <p className="pp-label">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="fe-dots" aria-hidden>
              {Array.from({ length: DOT_COUNT }, (_, i) => (
                <span key={i} className={HOT.has(i) ? 'fe-dot hot' : ON.has(i) ? 'fe-dot on' : 'fe-dot'} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Compliance handled — icon cards ── */}
      <section className="pp-section pp-blueprint">
        <div className="pp-glow" style={{ top: 60, left: -140 }} />
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Compliance handled</p>
              <h2 className="pp-display pp-d3">The parts your finance team dreads, done by default.</h2>
            </div>
            <p className="pp-lede">
              Cross-border engagements usually die in vendor onboarding. On Proploy they never enter it.
            </p>
          </Reveal>

          <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-6)' }}>
            {COMPLIANCE_CARDS.map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <div className="pp-card pp-lift pp-flex pp-gap-5" style={{ alignItems: 'flex-start', height: '100%' }}>
                  <span className="pp-tile pp-tile--soft">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {c.icon}
                    </svg>
                  </span>
                  <div className="pp-stack pp-gap-2">
                    <p className="pp-h6">{c.title}</p>
                    <p className="pp-body">{c.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Payment flow — step rail ── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">How a payout runs</p>
              <h2 className="pp-display pp-d3">Approve once. Everything after is automatic.</h2>
            </div>
            <p className="pp-lede">
              From your approval click to the expert&apos;s local bank account — with the records to
              prove every hop.
            </p>
          </Reveal>

          <div className="fe-steps">
            {PAY_STEPS.map((step, i) => (
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

      {/* ── FAQ ── */}
      <section className="pp-section">
        <div className="pp-container">
          <Reveal>
            <div className="pp-sec-split" style={{ alignItems: 'start', gap: 'var(--sp-16)' }}>
              <div className="pp-stack pp-gap-8">
                <div className="pp-sec-head">
                  <p className="pp-label">FAQs</p>
                  <h2 className="pp-display pp-d3">What finance asks before signing.</h2>
                </div>
                <PaymentsFaq />
              </div>

              <div className="pp-card pp-card--panel pp-stack pp-gap-5">
                <p className="pp-label">Keep exploring</p>
                <div className="pp-stack pp-gap-4">
                  <Link href="/approve-invoices" className="pp-link-arrow">
                    Invoice approval chains
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                  <Link href="/manage-team-projects" className="pp-link-arrow">
                    Milestones &amp; approvals
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                  <Link href="/discover-experts" className="pp-link-arrow">
                    Meet the expert network
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
                <hr className="pp-rule" />
                <p className="pp-body">
                  Specific jurisdiction question? <Link href="/contact">Ask our team</Link> — we&apos;ll
                  route it to the right compliance lead.
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
                <h2 className="pp-display pp-d3">Hire globally. File locally. Sleep soundly.</h2>
                <p className="pp-lede">
                  One agreement, one invoice, 34 countries of vetted implementation talent.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill" href="/sign-up">
                  Get started
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/experts">
                  Browse the network
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
