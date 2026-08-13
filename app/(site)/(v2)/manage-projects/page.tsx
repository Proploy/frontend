import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

export const metadata: Metadata = {
  title: 'Manage projects — Proploy',
  description:
    'One workspace per engagement: milestones, deliverables, client comms, files and approvals in a single thread — from kickoff to closeout.',
}

const MILESTONES = [
  { name: 'Discovery & audit', amount: '$4,800', status: 'Approved', tone: 'success' as const },
  { name: 'Data migration', amount: '$7,200', status: 'In review', tone: 'warning' as const },
  { name: 'Workflow build', amount: '$6,400', status: 'In progress', tone: 'cobalt' as const },
  { name: 'Training & handover', amount: '$3,600', status: 'Scheduled', tone: 'ghost' as const },
]

const CAPABILITIES = [
  {
    title: 'Milestones & deliverables',
    body: 'Break the engagement into milestones with named deliverables and dates. Clients approve each one in-app — and approval is what releases payment.',
    icon: (
      <>
        <path d="M3.5 20.5h17" />
        <rect x="4.5" y="12" width="3.4" height="5.5" rx="1" />
        <rect x="10.3" y="7.5" width="3.4" height="10" rx="1" />
        <rect x="16.1" y="10" width="3.4" height="7.5" rx="1" />
      </>
    ),
  },
  {
    title: 'Client comms in-thread',
    body: 'Messages, decisions and blockers live next to the milestone they belong to. No archaeology across email, chat and three shared drives.',
    icon: (
      <>
        <path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1.3-4.3A8 8 0 0 1 13 4a8 8 0 0 1 8 8Z" />
        <path d="M8.5 10.5h7M8.5 13.5h4.5" />
      </>
    ),
  },
  {
    title: 'Files & approvals',
    body: 'Specs, exports and sign-offs attach to the milestone record. When the project closes, the whole history is archived — yours and the client’s.',
    icon: (
      <>
        <path d="M13.5 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9.5L13.5 3Z" />
        <path d="M13.5 3v6.5H20" />
        <path d="m8.8 15.2 2 2 4-4.5" />
      </>
    ),
  },
]

const FLOW = [
  {
    num: 'Step 01',
    lit: true,
    title: 'Kick off',
    body: 'The signed contract seeds the workspace: milestones, budget and dates arrive pre-loaded from the SOW.',
  },
  {
    num: 'Step 02',
    lit: true,
    title: 'Deliver',
    body: 'Work the milestones. Post updates, attach deliverables and flag blockers where the client will actually see them.',
  },
  {
    num: 'Step 03',
    lit: false,
    title: 'Get approved',
    body: 'The client reviews and approves each milestone in-app. Every approval triggers the linked invoice.',
  },
  {
    num: 'Step 04',
    lit: false,
    title: 'Close out',
    body: 'Final approval archives the project, requests the client review and rolls the engagement into a case study draft.',
  },
]

const NEXT_LINKS = [
  {
    href: '/sign-contracts',
    label: 'Sign contracts',
    body: 'Standard terms and e-signature, before the workspace opens.',
  },
  {
    href: '/send-invoices',
    label: 'Send invoices',
    body: 'Milestone invoices generated from the same workspace.',
  },
  {
    href: '/payments',
    label: 'Payments',
    body: 'Escrow-style milestone release, straight to your account.',
  },
]

const TONE_CLASS = {
  success: 'pp-tag pp-tag--success pp-tag--dot',
  warning: 'pp-tag pp-tag--warning pp-tag--dot',
  cobalt: 'pp-tag pp-tag--cobalt pp-tag--dot',
  ghost: 'pp-tag pp-tag--ghost pp-tag--dot',
}

export default function ManageProjectsPage() {
  return (
    <main className="pp-page">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -140, left: -80 }} />
        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <p className="pp-label">Manage projects</p>
            <div className="pp-sec-split" style={{ alignItems: 'start' }}>
              <h1 className="pp-display pp-d1">
                One workspace.
                <br />
                Every engagement.
              </h1>
              <p className="pp-lede">
                Milestones, deliverables, messages and approvals in a single thread — so you run the project instead of
                reconstructing it from email.
              </p>
            </div>
            <div className="pp-flex pp-wrap pp-gap-3">
              <Link className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline" href="/become-expert">
                Apply to join
              </Link>
              <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/for-experts">
                How Proploy works
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Workspace mock ──────────────────────────────────────── */}
      <section style={{ paddingBlock: '0 var(--section-y)' }}>
        <div className="pp-container">
          <Reveal>
            <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-16)', alignItems: 'center' }}>
              <div className="pp-card pp-card--panel pp-stack pp-gap-5">
                <div className="pp-flex" style={{ justifyContent: 'space-between', alignItems: 'center', gap: 'var(--sp-4)' }}>
                  <div className="pp-stack" style={{ gap: 2 }}>
                    <p className="pp-label">Workspace · NetSuite rollout</p>
                    <p className="pp-h5">Milestones — $22,000 total</p>
                  </div>
                  <span className="pp-tag pp-tag--success pp-tag--dot">On track</span>
                </div>
                <div className="pp-stack" style={{ gap: 0 }}>
                  {MILESTONES.map((m, i) => (
                    <div
                      key={m.name}
                      className="pp-flex"
                      style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 'var(--sp-4)',
                        paddingBlock: 'var(--sp-4)',
                        borderBottom: i < MILESTONES.length - 1 ? 'var(--bw) solid var(--line)' : 'none',
                      }}
                    >
                      <div className="pp-stack" style={{ gap: 2, minWidth: 0 }}>
                        <p className="pp-body" style={{ color: 'var(--ink)', fontWeight: 500 }}>
                          {m.name}
                        </p>
                        <p className="pp-small pp-mono-num">{m.amount}</p>
                      </div>
                      <span className={TONE_CLASS[m.tone]}>{m.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pp-stack pp-gap-6 pp-soften">
                <p className="pp-label">The expert workspace</p>
                <h2 className="pp-display pp-d3">The project plan is the interface.</h2>
                <p className="pp-lede">
                  The SOW you signed becomes the board you deliver against. Milestones carry the budget, the
                  deliverables and the conversation — approve one, and the invoice is already on its way.
                </p>
                <div className="pp-flex pp-wrap pp-gap-3">
                  <span className="pp-tag pp-tag--dot">Shared with the client</span>
                  <span className="pp-tag pp-tag--dot">Linked to invoices</span>
                  <span className="pp-tag pp-tag--dot">Full audit trail</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Capabilities ────────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">What lives in the workspace</p>
              <h2 className="pp-display pp-d3">Everything the engagement needs. Nothing it doesn&apos;t.</h2>
            </div>
            <p className="pp-lede">
              Built for implementation work: structured enough for finance, light enough that you actually use it.
            </p>
          </Reveal>
          <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-6)' }}>
            {CAPABILITIES.map((cap, i) => (
              <Reveal key={cap.title} delay={i * 90}>
                <div
                  className="pp-card pp-lift"
                  style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-10)', minHeight: 270, height: '100%' }}
                >
                  <span className="pp-ico pp-ico--lg">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {cap.icon}
                    </svg>
                  </span>
                  <div className="pp-stack pp-gap-3" style={{ marginTop: 'auto' }}>
                    <p className="pp-h6">{cap.title}</p>
                    <p className="pp-body">{cap.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Flow ────────────────────────────────────────────────── */}
      <section className="pp-section pp-blueprint">
        <div className="pp-glow" style={{ bottom: -160, right: -100 }} />
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Kickoff to closeout</p>
              <h2 className="pp-display pp-d3">Four moves, then the next one.</h2>
            </div>
            <p className="pp-lede">
              The same rhythm on every engagement — which is exactly why clients come back for the next one.
            </p>
          </Reveal>
          <div className="fe-steps">
            {FLOW.map((step, i) => (
              <Reveal key={step.num} delay={i * 90} className={step.lit ? 'fe-step is-lit' : 'fe-step'}>
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

      {/* ── Related ─────────────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-12">
          <Reveal className="pp-sec-head pp-soften">
            <p className="pp-label">Wired into the rest</p>
            <h2 className="pp-display pp-d3">The workspace does the admin too.</h2>
          </Reveal>
          <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-6)' }}>
            {NEXT_LINKS.map((link, i) => (
              <Reveal key={link.href} delay={i * 90}>
                <Link
                  href={link.href}
                  className="pp-card pp-lift pp-stack pp-gap-8"
                  style={{ height: '100%', color: 'inherit' }}
                >
                  <span className="pp-link-arrow" style={{ marginTop: 'auto' }}>
                    {link.label}
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                  <p className="pp-body">{link.body}</p>
                </Link>
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
                <h2 className="pp-display pp-d3">Run your next engagement in one thread.</h2>
                <p className="pp-lede">
                  Join the network and get a workspace that handles the project management, the paperwork and the
                  payments.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill" href="/become-expert">
                  Apply to join
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/sign-up">
                  Create an account
                </Link>
                <p className="pp-small">Contracts, invoices and payouts included.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
