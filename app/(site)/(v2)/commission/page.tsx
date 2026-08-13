import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

import { PricingFaq } from './PricingFaq'

export const metadata: Metadata = {
  title: 'Transparent pricing — Proploy',
  description:
    '0% commission on your rate. A flat, published engagement fee instead of a percentage cut — see exactly what you pay before you accept a brief.',
}

const FEES = [
  { item: 'Applying & verification', detail: 'Interview, references, badge', cost: 'Free' },
  { item: 'Directory profile & matching', detail: 'Discovery, briefs, shortlists', cost: 'Free' },
  { item: 'Commission on your rate', detail: 'On every engagement, forever', cost: '0%' },
  { item: 'First matched project', detail: 'Platform fee waived entirely', cost: '$0' },
  { item: 'Engagements after that', detail: 'Flat fee, shown on the brief', cost: 'Flat fee' },
  { item: 'Local-rail payouts', detail: 'SEPA · ACH · FPS and equivalents', cost: 'Free' },
]

// true → check, '—' → muted dash, string → plain text
type Cell = true | string

const COMPARE_ROWS: { label: string; values: [Cell, Cell] }[] = [
  { label: 'Commission on your rate', values: ['5–20%', '0%'] },
  { label: 'Fee visible before you accept', values: ['—', true] },
  { label: 'Bidding against other freelancers', values: ['Standard', 'Never'] },
  { label: 'Pay to boost visibility', values: ['Credits & ads', '—'] },
  { label: 'Funds committed before kickoff', values: ['—', true] },
  { label: 'Fee to withdraw your money', values: ['Often', 'Free on local rails'] },
  { label: 'Keep clients off-platform', values: ['Penalised', 'Allowed'] },
]

function CheckCell() {
  return (
    <span className="pp-yes">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="m5 13 4 4 10-10" />
      </svg>
    </span>
  )
}

export default function CommissionPage() {
  return (
    <main className="pp-page">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -120, right: -60 }} />
        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <p className="pp-label">Transparent pricing</p>
            <div className="pp-sec-split" style={{ alignItems: 'start' }}>
              <h1 className="pp-display pp-d1">
                0% commission.
                <br />
                Yes, really.
              </h1>
              <p className="pp-lede">
                Proploy never takes a cut of your rate. You pay one flat, published fee per engagement — and nothing at
                all on your first matched project.
              </p>
            </div>
            <div className="pp-flex pp-wrap pp-gap-3">
              <Link className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline" href="/become-expert">
                Apply to join
              </Link>
              <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/for-experts">
                Why experts join
              </Link>
            </div>
            <div className="pp-flex pp-wrap pp-gap-6" style={{ alignItems: 'baseline' }}>
              <div className="pp-stat-row">
                <span className="pp-metric-value">0%</span>
                <span className="pp-small">commission on your rate</span>
              </div>
              <div className="pp-stat-row">
                <span className="pp-metric-value">$0</span>
                <span className="pp-small">on your first matched project</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Fee table ───────────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-12">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">The whole price list</p>
              <h2 className="pp-display pp-d3">Short enough to read. On purpose.</h2>
            </div>
            <p className="pp-lede">
              Every fee is published before you accept a brief. If it is not on this list, you do not pay it.
            </p>
          </Reveal>
          <Reveal>
            <div className="pp-card pp-card--panel" style={{ paddingBlock: 'var(--sp-6)' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="pp-table" style={{ minWidth: 560 }}>
                  <thead>
                    <tr>
                      <th>What</th>
                      <th>Covers</th>
                      <th>You pay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FEES.map((f) => (
                      <tr key={f.item}>
                        <td style={{ color: 'var(--ink)', fontWeight: 500 }}>{f.item}</td>
                        <td>{f.detail}</td>
                        <td>
                          <span className="pp-mono-num pp-accent" style={{ fontWeight: 600 }}>
                            {f.cost}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Comparison ──────────────────────────────────────────── */}
      <section className="pp-section pp-blueprint">
        <div className="pp-glow" style={{ bottom: -160, left: -100 }} />
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Versus the usual model</p>
              <h2 className="pp-display pp-d3">Marketplaces take a cut. We publish a fee.</h2>
            </div>
            <p className="pp-lede">
              A percentage commission grows with your success. A flat fee doesn&apos;t. That is the whole difference.
            </p>
          </Reveal>
          <Reveal>
            <div style={{ overflowX: 'auto' }}>
              <table className="fb-compare" style={{ minWidth: 720 }}>
                <thead>
                  <tr>
                    <th />
                    <th>Typical marketplace</th>
                    <th>Proploy</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row) => (
                    <tr key={row.label}>
                      <td>{row.label}</td>
                      {row.values.map((value, i) => (
                        <td key={i}>
                          {value === true ? <CheckCell /> : value === '—' ? <span className="pp-no">—</span> : value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Worked example ──────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container">
          <Reveal>
            <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-16)', alignItems: 'center' }}>
              <div className="pp-stack pp-gap-6 pp-soften">
                <p className="pp-label">A worked example</p>
                <h2 className="pp-display pp-d3">Quote $20,000. Keep $20,000.</h2>
                <p className="pp-lede">
                  On a percentage marketplace, a $20,000 engagement can cost you $1,000–$4,000 in commission. On
                  Proploy, your rate is your payout — the flat engagement fee is listed on the brief before you say
                  yes.
                </p>
                <p className="pp-body">
                  Payouts release per approved milestone —{' '}
                  <Link href="/payments" className="pp-link-arrow" style={{ fontSize: 15 }}>
                    see how payments work
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </p>
              </div>
              <div className="pp-glass" style={{ padding: 'var(--sp-8)' }}>
                <div className="pp-stack pp-gap-4">
                  <p className="pp-label">Engagement · $20,000 · 4 milestones</p>
                  {[
                    ['Your quoted rate', '$20,000'],
                    ['Proploy commission (0%)', '−$0'],
                    ['Platform engagement fee', 'Published on brief'],
                    ['Local-rail payout fee', '−$0'],
                  ].map(([k, v]) => (
                    <div key={k} className="pp-flex" style={{ justifyContent: 'space-between', gap: 'var(--sp-4)' }}>
                      <span className="pp-body" style={{ color: 'var(--ink)' }}>
                        {k}
                      </span>
                      <span className="pp-body pp-mono-num">{v}</span>
                    </div>
                  ))}
                  <hr className="pp-rule" />
                  <div className="pp-flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--sp-4)' }}>
                    <span className="pp-h6">Released to you</span>
                    <span className="pp-metric-value" style={{ fontSize: 36 }}>
                      $20,000
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section className="pp-section pp-band-deep">
        <div className="pp-container">
          <Reveal>
            <div className="pp-sec-split" style={{ alignItems: 'start', gap: 'var(--sp-16)' }}>
              <div className="pp-stack pp-gap-8">
                <div className="pp-sec-head">
                  <p className="pp-label">Pricing FAQs</p>
                  <h2 className="pp-display pp-d3">The questions the fine print usually hides.</h2>
                </div>
                <PricingFaq />
              </div>
              <div className="pp-card pp-card--panel pp-stack pp-gap-6">
                <p className="pp-label">Why we price this way</p>
                <p className="pp-h5">Aligned by design.</p>
                <p className="pp-body">
                  A commission model profits when your rate is squeezed through a bidding war. A flat fee only works if
                  experts stay, deliver and come back — so that is what the whole platform optimises for.
                </p>
                <Link className="pp-link-arrow" href="/find-work">
                  How matching replaces bidding
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
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
                <p className="pp-label">Get started</p>
                <h2 className="pp-display pp-d3">Your rate is your payout. Full stop.</h2>
                <p className="pp-lede">
                  Apply once, keep 100% of what you quote, and see every fee before you commit to anything.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill" href="/become-expert">
                  Apply to join
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/experts">
                  See the network
                </Link>
                <p className="pp-small">First matched project: $0 platform fee.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
