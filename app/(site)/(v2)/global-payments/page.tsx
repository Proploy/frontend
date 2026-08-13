import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

export const metadata: Metadata = {
  title: 'Global payments — Proploy',
  description:
    'Local-currency payouts across 34 countries on local rails — FX shown before you accept, tax documentation generated per jurisdiction.',
}

// Deterministic world-ish dot map: indexes of lit / hot dots in a 22×9 grid.
const GRID_COLS = 22
const GRID_ROWS = 9
const ON = new Set([
  25, 26, 27, 28, 47, 48, 49, 50, 51, 55, 56, 57, 69, 70, 71, 72, 73, 76, 77, 78, 79, 80, 81,
  91, 92, 93, 98, 99, 100, 101, 102, 103, 104, 113, 114, 120, 121, 122, 123, 124, 125, 126,
  135, 136, 142, 143, 144, 145, 146, 147, 157, 158, 164, 165, 166, 167, 179, 187, 188, 189,
])
const HOT = new Set([48, 70, 99, 122, 144, 165, 188, 26, 77, 101])

const RAILS = [
  { region: 'North America', currencies: 'USD · CAD', rail: 'ACH / EFT', arrival: 'Same day' },
  { region: 'Europe', currencies: 'EUR · GBP · CHF · PLN', rail: 'SEPA / FPS', arrival: 'Same day' },
  { region: 'Asia-Pacific', currencies: 'SGD · AUD · JPY · INR', rail: 'Local clearing', arrival: '1 business day' },
  { region: 'Latin America', currencies: 'BRL · MXN', rail: 'PIX / SPEI', arrival: '1 business day' },
  { region: 'Middle East & Africa', currencies: 'AED · ZAR', rail: 'Local clearing', arrival: '1–2 business days' },
]

const PILLARS = [
  {
    title: 'Local rails, not wires',
    body: 'Payouts route over domestic clearing systems — SEPA, ACH, FPS, PIX — so they arrive like a local salary, without correspondent-bank fees eating the margin.',
    icon: (
      <>
        <circle cx="12" cy="12" r="8.6" />
        <path d="M3.4 12h17.2M12 3.4c2.6 2.3 3.9 5.3 3.9 8.6s-1.3 6.3-3.9 8.6c-2.6-2.3-3.9-5.3-3.9-8.6s1.3-6.3 3.9-8.6Z" />
      </>
    ),
  },
  {
    title: 'FX before you accept',
    body: 'The conversion rate and payout amount are shown on the brief, before you say yes. What you agree to is what lands — not a mystery number three days later.',
    icon: (
      <>
        <path d="M7 10h10l-3-3M17 14H7l3 3" />
        <circle cx="12" cy="12" r="8.6" />
      </>
    ),
  },
  {
    title: 'Tax paperwork per jurisdiction',
    body: 'Invoices and tax documentation are generated per engagement, per jurisdiction — ready for your accountant instead of a January archaeology project.',
    icon: (
      <>
        <path d="M13.5 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9.5L13.5 3Z" />
        <path d="M13.5 3v6.5H20" />
        <path d="M8 13h8M8 16.5h8" />
      </>
    ),
  },
]

export default function GlobalPaymentsPage() {
  return (
    <main className="pp-page">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -140, left: -80 }} />
        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <p className="pp-label">Global payments</p>
            <div className="pp-sec-split" style={{ alignItems: 'start' }}>
              <h1 className="pp-display pp-d1">
                Paid like a local.
                <br />
                In 34 countries.
              </h1>
              <p className="pp-lede">
                Cross-border engagements pay out in your currency, on your country&apos;s rails, with the FX shown
                before you ever accept the brief.
              </p>
            </div>
            <div className="pp-flex pp-wrap pp-gap-3">
              <Link className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline" href="/become-expert">
                Apply to join
              </Link>
              <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/payments">
                How payments work
              </Link>
            </div>
            <div className="pp-flex pp-wrap pp-gap-3">
              <span className="pp-tag pp-tag--cobalt pp-tag--dot">34 countries</span>
              <span className="pp-tag pp-tag--dot">14+ payout currencies</span>
              <span className="pp-tag pp-tag--dot">Local payout rails</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Reach ───────────────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container">
          <Reveal className="fe-reach">
            <div className="pp-stack pp-gap-6 pp-soften">
              <p className="pp-label">One network, many rails</p>
              <h2 className="pp-display pp-d3">A client in Berlin. A payout in São Paulo.</h2>
              <p className="pp-lede">
                The business pays in their currency; you are paid in yours. Proploy sits in the middle so neither side
                deals with wires, IBAN roulette or surprise intermediary fees.
              </p>
              <p className="pp-body">
                Same protection everywhere: milestones funded at signature, released on approval —{' '}
                <Link href="/payments" className="pp-link-arrow" style={{ fontSize: 15 }}>
                  see the escrow flow
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </p>
            </div>
            <div className="fe-dots" aria-hidden>
              {Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => (
                <span key={i} className={HOT.has(i) ? 'fe-dot hot' : ON.has(i) ? 'fe-dot on' : 'fe-dot'} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Rails table ─────────────────────────────────────────── */}
      <section className="pp-section pp-blueprint">
        <div className="pp-glow" style={{ bottom: -160, right: -100 }} />
        <div className="pp-container pp-stack pp-gap-12">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Payout rails</p>
              <h2 className="pp-display pp-d3">Where the money lands, and how fast.</h2>
            </div>
            <p className="pp-lede">
              Representative rails by region. Exact options are confirmed when you add a payout method.
            </p>
          </Reveal>
          <Reveal>
            <div className="pp-card pp-card--panel" style={{ paddingBlock: 'var(--sp-6)' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="pp-table" style={{ minWidth: 680 }}>
                  <thead>
                    <tr>
                      <th>Region</th>
                      <th>Currencies</th>
                      <th>Rail</th>
                      <th>Typical arrival</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RAILS.map((r) => (
                      <tr key={r.region}>
                        <td style={{ color: 'var(--ink)', fontWeight: 500 }}>{r.region}</td>
                        <td className="pp-mono-num">{r.currencies}</td>
                        <td>{r.rail}</td>
                        <td>{r.arrival}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Pillars ─────────────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Why it feels local</p>
              <h2 className="pp-display pp-d3">Cross-border, minus the cross-border admin.</h2>
            </div>
            <p className="pp-lede">
              A rollout for a client abroad should cost you the same admin as one across the street.
            </p>
          </Reveal>
          <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-6)' }}>
            {PILLARS.map((p, i) => (
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
        </div>
      </section>

      {/* ── Closing CTA ─────────────────────────────────────────── */}
      <section className="pp-section">
        <div className="pp-container-app">
          <Reveal className="pp-dark">
            <div className="pp-sec-split" style={{ alignItems: 'center', gap: 'var(--sp-16)' }}>
              <div className="pp-stack" style={{ gap: 'var(--sp-5)' }}>
                <p className="pp-label">Get started</p>
                <h2 className="pp-display pp-d3">Work with teams anywhere. Get paid at home.</h2>
                <p className="pp-lede">
                  Join specialists in 34 countries delivering cross-border rollouts without cross-border headaches.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill" href="/become-expert">
                  Apply to join
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/send-invoices">
                  Invoicing on Proploy
                </Link>
                <p className="pp-small">FX and fees shown before you accept any brief.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
