import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

export const metadata: Metadata = {
  title: 'Approve invoices — Proploy',
  description:
    'Invoice review and approval chains built for finance — every line tied to an approved milestone, every action logged for audit.',
}

const QUEUE = [
  { id: 'INV-2041', vendor: 'Amara O.', project: 'Meridian HRIS rollout', amount: '$8,400', state: 'Awaiting you', tone: 'warn' },
  { id: 'INV-2040', vendor: 'Daniel K.', project: 'CRM migration', amount: '$5,150', state: 'Approved', tone: 'ok' },
  { id: 'INV-2039', vendor: 'Ines R.', project: 'Data platform', amount: '$12,000', state: 'In review', tone: 'info' },
]

const CHAIN_STEPS = [
  {
    num: '01',
    title: 'Invoice generated',
    body: 'Raised automatically when a milestone is signed off — amount, project and deliverables pre-linked. No rekeying, no mystery line items.',
  },
  {
    num: '02',
    title: 'Owner confirms delivery',
    body: 'The project owner confirms the work behind the invoice matches the approved milestone. One click, evidence attached.',
  },
  {
    num: '03',
    title: 'Finance approves',
    body: 'Routed by amount: under your threshold, one approver; above it, a chain. Approve from the queue or straight from email.',
  },
  {
    num: '04',
    title: 'Payment schedules',
    body: 'Approved invoices batch into your payment run. Reject with a reason and it goes back to the expert with the note attached.',
  },
]

const FINANCE_FEATURES = [
  {
    title: 'Thresholds you set',
    body: 'Auto-approve under $500, single approver to $10k, dual sign-off above. Your policy, enforced by the queue.',
    icon: (
      <>
        <path d="M12 3.5v17M5 8.5h10a3 3 0 0 1 0 6H7" />
        <path d="M5 20.5h14" />
      </>
    ),
  },
  {
    title: 'Every line traceable',
    body: 'Click any amount and land on the milestone, deliverable and sign-off behind it. Nothing arrives unexplained.',
    icon: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.5 15.5 5 5" />
        <path d="M8 10.5h5M10.5 8v5" />
      </>
    ),
  },
  {
    title: 'Audit trail by default',
    body: 'Who approved, when, from where, against which policy version — exportable for your auditors in one click.',
    icon: (
      <>
        <path d="M6 3.5h9l4 4v13H6Z" />
        <path d="M14.5 3.5v4.5H19" />
        <path d="M9 12h6M9 15.5h6" />
      </>
    ),
  },
  {
    title: 'One monthly statement',
    body: 'Every expert, every project, one consolidated invoice from a single entity — not a folder of PDFs from twelve vendors.',
    icon: (
      <>
        <rect x="3.5" y="5" width="17" height="15" rx="2" />
        <path d="M3.5 9.5h17M8 14h4" />
      </>
    ),
  },
]

const STATES = [
  { state: 'Draft', acts: 'System', means: 'Milestone signed off — invoice assembled and linked to evidence.' },
  { state: 'In review', acts: 'Project owner', means: 'Delivery confirmed against the SOW acceptance criteria.' },
  { state: 'Awaiting approval', acts: 'Finance', means: 'Routed by threshold to one approver or a chain.' },
  { state: 'Approved', acts: 'System', means: 'Queued into the next payment run; expert notified.' },
  { state: 'Rejected', acts: 'Any approver', means: 'Returned with a required reason — visible to the whole chain.' },
]

export default function ApproveInvoicesPage() {
  return (
    <main className="pp-page">
      {/* ── Hero — split with approval-queue mockup ── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -120, right: -60 }} />
        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <p className="pp-label">Approve invoices</p>
            <div className="pp-sec-split" style={{ alignItems: 'start' }}>
              <div className="pp-stack pp-gap-8">
                <h1 className="pp-display pp-d1">
                  Finance signs off
                  <br />
                  in minutes, not
                  <br />
                  month-end.
                </h1>
                <p className="pp-lede" style={{ maxWidth: '46ch' }}>
                  Every invoice arrives pre-linked to an approved milestone. Review chains route by
                  amount, and every action lands in the audit trail.
                </p>
                <div className="pp-flex pp-wrap pp-gap-3">
                  <Link className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline" href="/sign-up">
                    Set up approvals
                  </Link>
                  <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/global-payments-tax">
                    See payments &amp; tax
                  </Link>
                </div>
              </div>

              {/* approval queue mockup */}
              <div className="pp-glass" style={{ padding: 'var(--sp-5)' }}>
                <div className="pp-flex" style={{ alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--cobalt)' }} />
                  <span className="pp-label">Approval queue</span>
                  <span className="pp-label" style={{ marginLeft: 'auto' }}>1 pending</span>
                </div>
                <div className="pp-stack pp-gap-3">
                  {QUEUE.map((q) => (
                    <div
                      key={q.id}
                      style={{ padding: 'var(--sp-3)', border: '1px solid var(--line)', borderRadius: 'var(--r-tile)', background: '#fff' }}
                    >
                      <div className="pp-flex" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <p className="pp-small" style={{ color: 'var(--ink)', fontWeight: 600 }}>
                          <span className="pp-mono-num">{q.id}</span> · {q.vendor}
                        </p>
                        <span className="pp-mono-num" style={{ color: 'var(--ink)' }}>
                          {q.amount}
                        </span>
                      </div>
                      <div className="pp-flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                        <p className="pp-small">{q.project}</p>
                        <span
                          className={
                            q.tone === 'ok' ? 'pp-tag pp-tag--success' : q.tone === 'warn' ? 'pp-tag pp-tag--warning' : 'pp-tag pp-tag--cobalt'
                          }
                          style={{ fontSize: 12, padding: '3px 8px' }}
                        >
                          {q.state}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="pp-small" style={{ marginTop: 'var(--sp-4)' }}>
                  Linked milestone and deliverables are one click from every row.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Approval chain steps ── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">The chain</p>
              <h2 className="pp-display pp-d3">From milestone to payment run, without a single PDF.</h2>
            </div>
            <p className="pp-lede">
              Approval is downstream of delivery. If the work isn&apos;t signed off, the invoice never
              reaches finance.
            </p>
          </Reveal>

          <div className="pp-grid pp-grid-4" style={{ gap: 'var(--sp-6)' }}>
            {CHAIN_STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 90}>
                <div
                  className="pp-card pp-lift"
                  style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)', height: '100%', minHeight: 250 }}
                >
                  <span className="pp-tile pp-tile--ink pp-mono-num">{step.num}</span>
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

      {/* ── What finance gets — icon card grid ── */}
      <section className="pp-section pp-blueprint">
        <div className="pp-glow" style={{ top: 40, left: -140 }} />
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Built for finance</p>
              <h2 className="pp-display pp-d3">Controls without the controller&apos;s overtime.</h2>
            </div>
            <p className="pp-lede">
              The queue enforces your policy so approvals stop depending on whoever remembers it.
            </p>
          </Reveal>

          <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-6)' }}>
            {FINANCE_FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
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
                      {f.icon}
                    </svg>
                  </span>
                  <div className="pp-stack pp-gap-2">
                    <p className="pp-h6">{f.title}</p>
                    <p className="pp-body">{f.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Invoice lifecycle table ── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Lifecycle</p>
              <h2 className="pp-display pp-d3">Five states. Always know who acts next.</h2>
            </div>
            <p className="pp-lede">
              No invoice sits in limbo — every state names its actor and its exit.
            </p>
          </Reveal>

          <Reveal>
            <div style={{ overflowX: 'auto' }}>
              <table className="pp-table" style={{ minWidth: 680 }}>
                <thead>
                  <tr>
                    <th style={{ width: 180 }}>State</th>
                    <th style={{ width: 160 }}>Who acts</th>
                    <th>What it means</th>
                  </tr>
                </thead>
                <tbody>
                  {STATES.map((s) => (
                    <tr key={s.state}>
                      <td>
                        <span className="pp-tag pp-tag--dot pp-tag--cobalt">{s.state}</span>
                      </td>
                      <td style={{ color: 'var(--ink)' }}>{s.acts}</td>
                      <td>{s.means}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal>
            <div className="pp-card pp-card--panel">
              <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-8)' }}>
                <div className="pp-metric">
                  <p className="pp-metric-value">1</p>
                  <p className="pp-label">Consolidated monthly invoice</p>
                </div>
                <div className="pp-metric">
                  <p className="pp-metric-value">3×</p>
                  <p className="pp-label">Faster month-end close reported</p>
                </div>
                <div className="pp-metric">
                  <p className="pp-metric-value">100%</p>
                  <p className="pp-label">Of approvals in the audit log</p>
                </div>
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
                <h2 className="pp-display pp-d3">Give finance a queue worth opening.</h2>
                <p className="pp-lede">
                  Set thresholds once — then approve engagement spend with the evidence one click away.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill" href="/sign-up">
                  Set up approvals
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/manage-team-projects">
                  See project workflows
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
