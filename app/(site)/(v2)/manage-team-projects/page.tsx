import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

export const metadata: Metadata = {
  title: 'Manage team projects — Proploy',
  description:
    'Run engagements with your whole team — clear roles, approval chains and milestone visibility from kickoff to go-live.',
}

function Check() {
  return (
    <span className="pp-yes">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <path d="m5 13 4 4 10-10" />
      </svg>
    </span>
  )
}

type Cell = true | '—' | string

const ROLE_ROWS: { label: string; values: [Cell, Cell, Cell, Cell] }[] = [
  { label: 'View milestones & status', values: [true, true, true, true] },
  { label: 'Message the expert', values: [true, true, '—', true] },
  { label: 'Edit scope & milestones', values: [true, '—', '—', '—'] },
  { label: 'Approve milestone completion', values: [true, true, '—', '—'] },
  { label: 'Approve invoices', values: ['—', true, '—', '—'] },
  { label: 'Add or remove teammates', values: [true, '—', '—', '—'] },
  { label: 'Export decision & audit log', values: [true, true, true, '—'] },
]

const MILESTONES = [
  { name: 'Discovery & data audit', pct: 100, state: 'Approved', tone: 'done' },
  { name: 'Core configuration', pct: 100, state: 'Approved', tone: 'done' },
  { name: 'Integrations & SSO', pct: 65, state: 'In progress', tone: 'active' },
  { name: 'Training & UAT', pct: 20, state: 'Started', tone: 'active' },
  { name: 'Cutover & go-live', pct: 0, state: 'Scheduled', tone: 'todo' },
]

const APPROVAL_STEPS = [
  {
    num: 'Step 01',
    title: 'Expert marks a milestone done',
    body: 'Deliverables attach to the milestone itself — configs, docs, recordings — so review starts from evidence.',
  },
  {
    num: 'Step 02',
    title: 'Owner reviews the work',
    body: 'The project owner checks the deliverable against the SOW acceptance criteria written at kickoff.',
  },
  {
    num: 'Step 03',
    title: 'Approver signs off',
    body: 'A second approver — usually finance or a department head — confirms in one click, from email or the workspace.',
  },
  {
    num: 'Step 04',
    title: 'Payment releases',
    body: 'Sign-off releases the escrowed milestone amount. No approval, no payment. Every step is logged.',
  },
]

const METRICS = [
  { value: '2-step', label: 'Approvals on every milestone' },
  { value: '100%', label: 'Of payments tied to sign-off' },
  { value: '5 min', label: 'To add a teammate with the right role' },
]

export default function ManageTeamProjectsPage() {
  return (
    <main className="pp-page">
      {/* ── Hero ── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -140, right: -80 }} />
        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <p className="pp-label">Manage team projects</p>
            <div className="pp-sec-split" style={{ alignItems: 'start' }}>
              <h1 className="pp-display pp-d1">
                Everyone sees the
                <br />
                project. Only the
                <br />
                right people act.
              </h1>
              <p className="pp-lede">
                Roles, approval chains and milestone visibility — so ops, finance and the expert run one
                engagement, not three versions of it.
              </p>
            </div>
            <div className="pp-flex pp-wrap pp-gap-3">
              <Link className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline" href="/sign-up">
                Start a project
              </Link>
              <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/hiring-workspace">
                See the hiring side
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Roles matrix ── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Roles</p>
              <h2 className="pp-display pp-d3">Four roles. No permission spreadsheet.</h2>
            </div>
            <p className="pp-lede">
              Assign Owner, Approver, Viewer or Expert when you add someone — the workspace enforces
              the rest.
            </p>
          </Reveal>

          <Reveal>
            <div style={{ overflowX: 'auto' }}>
              <table className="fb-compare">
                <thead>
                  <tr>
                    <th />
                    <th>Viewer</th>
                    <th>Expert</th>
                    <th>Approver</th>
                    <th>Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {ROLE_ROWS.map((row) => (
                    <tr key={row.label}>
                      <td>{row.label}</td>
                      {/* column order: viewer, expert, approver, owner — owner column highlighted */}
                      {[row.values[2], row.values[3], row.values[1], row.values[0]].map((v, i) => (
                        <td key={i}>{v === true ? <Check /> : v === '—' ? <span className="pp-no">—</span> : v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Milestone visibility — tracker panel split ── */}
      <section className="pp-section pp-blueprint">
        <div className="pp-glow" style={{ bottom: -160, left: -120 }} />
        <div className="pp-container">
          <Reveal className="fe-reach">
            <div className="pp-stack pp-gap-6 pp-soften">
              <p className="pp-label">Milestone visibility</p>
              <h2 className="pp-display pp-d3">Status you never have to ask for.</h2>
              <p className="pp-lede">
                Every engagement runs on a milestone plan agreed at kickoff. Progress, blockers and
                approvals update in real time — for everyone with a seat, on every device.
              </p>
              <ul className="pp-stack pp-gap-3">
                {[
                  'Percent-complete rolled up from deliverables, not vibes.',
                  'Blockers flagged to the owner the moment the expert raises them.',
                  'Slipping milestones trigger a re-plan conversation, not a surprise.',
                ].map((point) => (
                  <li key={point} className="pp-flex pp-gap-3" style={{ alignItems: 'flex-start' }}>
                    <span style={{ flexShrink: 0, marginTop: 2 }}>
                      <Check />
                    </span>
                    <span className="pp-body">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pp-glass" style={{ padding: 'var(--sp-5)' }}>
              <div className="pp-flex" style={{ alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-5)' }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--cobalt)' }} />
                <span className="pp-label">Rollout plan</span>
                <span className="pp-label" style={{ marginLeft: 'auto' }}>Week 5 of 8</span>
              </div>
              <div className="pp-stack pp-gap-4">
                {MILESTONES.map((m) => (
                  <div key={m.name} className="pp-stack" style={{ gap: 6 }}>
                    <div className="pp-flex" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <p className="pp-small" style={{ color: 'var(--ink)', fontWeight: 600 }}>
                        {m.name}
                      </p>
                      <span
                        className={
                          m.tone === 'done' ? 'pp-tag pp-tag--success' : m.tone === 'active' ? 'pp-tag pp-tag--cobalt' : 'pp-tag'
                        }
                        style={{ fontSize: 12, padding: '3px 8px' }}
                      >
                        {m.state}
                      </span>
                    </div>
                    <div style={{ height: 6, borderRadius: 999, background: 'var(--paper-deep)', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${m.pct}%`,
                          borderRadius: 999,
                          background:
                            m.tone === 'done'
                              ? 'var(--color-success-500)'
                              : 'linear-gradient(90deg, var(--cobalt-deep), var(--cobalt))',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="pp-small" style={{ marginTop: 'var(--sp-5)' }}>
                Escrow released: 2 of 5 milestones · Next approval: Integrations &amp; SSO
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Approval chain — step rail ── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Approvals</p>
              <h2 className="pp-display pp-d3">Sign-off is a chain, not a bottleneck.</h2>
            </div>
            <p className="pp-lede">
              Approvals happen where the work is — with the evidence attached and payment wired to the
              outcome.
            </p>
          </Reveal>

          <div className="fe-steps">
            {APPROVAL_STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 90} className="fe-step">
                <p className="pp-label fe-num">{step.num}</p>
                <div className="pp-stack pp-gap-3">
                  <p className="pp-h6">{step.title}</p>
                  <p className="pp-body">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="pp-card pp-card--panel">
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

      {/* ── Hand-off to finance ── */}
      <section className="pp-section">
        <div className="pp-container">
          <Reveal>
            <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-6)' }}>
              <Link
                href="/approve-invoices"
                className="pp-card pp-card--panel pp-lift"
                style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-10)', color: 'inherit' }}
              >
                <div className="pp-stack pp-gap-3">
                  <p className="pp-label">For finance</p>
                  <p className="pp-h5">Approve invoices</p>
                  <p className="pp-body">
                    Milestone sign-offs flow straight into the invoice approval queue — review chains,
                    thresholds and an audit trail finance actually likes.
                  </p>
                </div>
                <span className="pp-link-arrow" style={{ marginTop: 'auto' }}>
                  See invoice approvals
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>

              <Link
                href="/global-payments-tax"
                className="pp-card pp-card--panel pp-lift"
                style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-10)', color: 'inherit' }}
              >
                <div className="pp-stack pp-gap-3">
                  <p className="pp-label">Cross-border</p>
                  <p className="pp-h5">Global payments &amp; tax</p>
                  <p className="pp-body">
                    Paying an expert in another country is the same three clicks as paying one at home —
                    tax documentation and compliance handled.
                  </p>
                </div>
                <span className="pp-link-arrow" style={{ marginTop: 'auto' }}>
                  See global payments
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
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
                <h2 className="pp-display pp-d3">Run your next rollout without the status meetings.</h2>
                <p className="pp-lede">
                  Kick off with a vetted expert, a milestone plan and roles your whole team understands.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill" href="/sign-up">
                  Start a project
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/for-businesses">
                  How Proploy works
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
