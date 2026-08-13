import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

export const metadata: Metadata = {
  title: 'Send invoices — Proploy',
  description:
    'Milestone invoices generated from the workspace, with live status tracking from sent to paid. No spreadsheets, no chasing, no lost PDFs.',
}

const INVOICES = [
  { id: 'INV-0231', milestone: 'Discovery & audit', client: 'Northbeam Ltd', amount: '$4,800', status: 'Paid', tone: 'success' as const },
  { id: 'INV-0232', milestone: 'Data migration', client: 'Northbeam Ltd', amount: '$7,200', status: 'Approved', tone: 'cobalt' as const },
  { id: 'INV-0233', milestone: 'Workflow build', client: 'Northbeam Ltd', amount: '$6,400', status: 'Sent', tone: 'warning' as const },
  { id: 'INV-0234', milestone: 'Training & handover', client: 'Northbeam Ltd', amount: '$3,600', status: 'Draft', tone: 'ghost' as const },
]

const TONE_CLASS = {
  success: 'pp-tag pp-tag--success pp-tag--dot',
  warning: 'pp-tag pp-tag--warning pp-tag--dot',
  cobalt: 'pp-tag pp-tag--cobalt pp-tag--dot',
  ghost: 'pp-tag pp-tag--ghost pp-tag--dot',
}

const FEATURES = [
  {
    title: 'Generated, not typed',
    body: 'Each milestone in your SOW carries its own amount. Approve the milestone and the invoice is drafted with the right line items, tax fields and reference numbers.',
    icon: (
      <>
        <path d="M13.5 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9.5L13.5 3Z" />
        <path d="M13.5 3v6.5H20" />
        <path d="M8 13.5h8M8 17h5" />
      </>
    ),
  },
  {
    title: 'Status you can see',
    body: 'Draft, sent, approved, paid — every invoice shows exactly where it sits and who it is waiting on. The client sees the same view, which is why things move.',
    icon: (
      <>
        <circle cx="12" cy="12" r="8.6" />
        <path d="M12 7.5V12l3 2" />
      </>
    ),
  },
  {
    title: 'Chasing, automated',
    body: 'Reminders go out on schedule, in your name, with the polite firmness you would use on a good day. You find out when it is paid, not when it is late.',
    icon: (
      <>
        <path d="M18 8.5a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5" />
        <path d="M10 19a2.2 2.2 0 0 0 4 0" />
      </>
    ),
  },
]

export default function SendInvoicesPage() {
  return (
    <main className="pp-page">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -140, left: -80 }} />
        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <p className="pp-label">Send invoices</p>
            <div className="pp-sec-split" style={{ alignItems: 'start' }}>
              <h1 className="pp-display pp-d1">
                Invoice the milestone.
                <br />
                Skip the paperwork.
              </h1>
              <p className="pp-lede">
                Invoices are generated from the workspace you already deliver in — pre-filled, tracked and chased for
                you.
              </p>
            </div>
            <div className="pp-flex pp-wrap pp-gap-3">
              <Link className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline" href="/become-expert">
                Apply to join
              </Link>
              <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/payments">
                How you get paid
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Invoice ledger mock ─────────────────────────────────── */}
      <section style={{ paddingBlock: '0 var(--section-y)' }}>
        <div className="pp-container pp-stack pp-gap-12">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">One ledger per engagement</p>
              <h2 className="pp-display pp-d3">Every invoice, every status, one screen.</h2>
            </div>
            <p className="pp-lede">
              The invoice list mirrors your milestone plan — so billing is never a separate chore.
            </p>
          </Reveal>
          <Reveal>
            <div className="pp-card pp-card--panel" style={{ paddingBlock: 'var(--sp-6)' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="pp-table" style={{ minWidth: 640 }}>
                  <thead>
                    <tr>
                      <th>Invoice</th>
                      <th>Milestone</th>
                      <th>Client</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {INVOICES.map((inv) => (
                      <tr key={inv.id}>
                        <td className="pp-mono-num" style={{ color: 'var(--ink)' }}>
                          {inv.id}
                        </td>
                        <td>{inv.milestone}</td>
                        <td>{inv.client}</td>
                        <td className="pp-mono-num" style={{ color: 'var(--ink)' }}>
                          {inv.amount}
                        </td>
                        <td>
                          <span className={TONE_CLASS[inv.tone]}>{inv.status}</span>
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

      {/* ── Features ────────────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Built into delivery</p>
              <h2 className="pp-display pp-d3">Billing that keeps up with the work.</h2>
            </div>
            <p className="pp-lede">
              You approved the milestone — that should be the whole job. Everything after is automatic.
            </p>
          </Reveal>
          <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-6)' }}>
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 90}>
                <div
                  className="pp-card pp-lift"
                  style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-10)', minHeight: 270, height: '100%' }}
                >
                  <span className="pp-ico pp-ico--lg">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {f.icon}
                    </svg>
                  </span>
                  <div className="pp-stack pp-gap-3" style={{ marginTop: 'auto' }}>
                    <p className="pp-h6">{f.title}</p>
                    <p className="pp-body">{f.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── After send ──────────────────────────────────────────── */}
      <section className="pp-section pp-blueprint">
        <div className="pp-glow" style={{ bottom: -160, right: -100 }} />
        <div className="pp-container">
          <Reveal>
            <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-16)', alignItems: 'center' }}>
              <div className="pp-stack pp-gap-6 pp-soften">
                <p className="pp-label">After you hit send</p>
                <h2 className="pp-display pp-d3">Approved invoices become payouts on their own.</h2>
                <p className="pp-lede">
                  Because milestones are funded upfront, an approved invoice does not wait on a bank run at the
                  client&apos;s end — release is triggered the moment approval lands.
                </p>
              </div>
              <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-6)' }}>
                <Link href="/payments" className="pp-card pp-lift pp-stack pp-gap-8" style={{ height: '100%', color: 'inherit' }}>
                  <span className="pp-link-arrow" style={{ marginTop: 'auto' }}>
                    Payments
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                  <p className="pp-body">Escrow-style milestone release and payment protection.</p>
                </Link>
                <Link href="/global-payments" className="pp-card pp-lift pp-stack pp-gap-8" style={{ height: '100%', color: 'inherit' }}>
                  <span className="pp-link-arrow" style={{ marginTop: 'auto' }}>
                    Global payments
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                  <p className="pp-body">Local-currency payouts across 34 countries.</p>
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
                <h2 className="pp-display pp-d3">Bill like a firm. Stay a specialist.</h2>
                <p className="pp-lede">
                  Contracts, invoices and payouts come with every Proploy engagement — no accounting stack required.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill" href="/become-expert">
                  Apply to join
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/commission">
                  See the pricing
                </Link>
                <p className="pp-small">0% commission — your rate is your payout.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
