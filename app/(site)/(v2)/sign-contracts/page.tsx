import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

import { ContractFaq } from './ContractFaq'

export const metadata: Metadata = {
  title: 'Sign contracts — Proploy',
  description:
    'Standardised SOWs with scope protection, e-signed in the workspace. From accepted brief to binding contract without a lawyer on retainer.',
}

const PROTECTIONS = [
  {
    title: 'Scope is a wall, not a suggestion',
    body: 'Deliverables, milestones and exclusions are written into the SOW. Work outside it requires a signed change order — with its own fee attached.',
    icon: (
      <>
        <path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6Z" />
        <path d="M12 8v4M12 15.5v.5" />
      </>
    ),
  },
  {
    title: 'Standard terms, pre-negotiated',
    body: 'IP transfer on payment, liability caps and a defined dispute path — the clauses experts usually pay a lawyer to argue for, already in the template.',
    icon: (
      <>
        <path d="M13.5 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9.5L13.5 3Z" />
        <path d="M13.5 3v6.5H20" />
        <path d="M8 13h8M8 16.5h5" />
      </>
    ),
  },
  {
    title: 'Signed means funded',
    body: 'The client funds the first milestone at signature. You never start an engagement wondering whether the budget actually exists.',
    icon: (
      <>
        <rect x="3" y="6.5" width="18" height="12" rx="2.5" />
        <path d="M3 10.5h18" />
        <path d="M7 15h4" />
      </>
    ),
  },
]

const SIGN_STEPS = [
  { num: '01', title: 'Generate', body: 'The accepted brief pre-fills the SOW: scope, milestones, rate and dates.' },
  { num: '02', title: 'Adjust', body: 'Tune deliverables and milestone splits together with the client, tracked in one draft.' },
  { num: '03', title: 'E-sign', body: 'Both parties sign in the workspace. Identity, timestamp and document hash are recorded.' },
  { num: '04', title: 'Kick off', body: 'Signature funds the first milestone and opens the project workspace automatically.' },
]

export default function SignContractsPage() {
  return (
    <main className="pp-page">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -120, right: -60 }} />
        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <p className="pp-label">Sign contracts</p>
            <div className="pp-sec-split" style={{ alignItems: 'start' }}>
              <h1 className="pp-display pp-d1">
                Standard terms.
                <br />
                Signed in minutes.
              </h1>
              <p className="pp-lede">
                Every engagement runs on a standardised SOW with scope protection built in — drafted from the brief and
                e-signed without leaving the workspace.
              </p>
            </div>
            <div className="pp-flex pp-wrap pp-gap-3">
              <Link className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline" href="/become-expert">
                Apply to join
              </Link>
              <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/manage-projects">
                See the workspace
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Contract mock + copy ────────────────────────────────── */}
      <section style={{ paddingBlock: '0 var(--section-y)' }}>
        <div className="pp-container">
          <Reveal>
            <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-16)', alignItems: 'center' }}>
              <div className="pp-stack pp-gap-6 pp-soften">
                <p className="pp-label">No legal templates to chase</p>
                <h2 className="pp-display pp-d3">From accepted brief to binding contract, in one sitting.</h2>
                <p className="pp-lede">
                  The brief you accepted already contains the scope and the budget — so the contract writes itself.
                  You review, the client reviews, both sign. Kickoff is the same afternoon, not three weeks of
                  redlines.
                </p>
                <div className="pp-flex pp-wrap pp-gap-3">
                  <span className="pp-tag pp-tag--dot">Audit-trailed e-signature</span>
                  <span className="pp-tag pp-tag--dot">Change orders built in</span>
                  <span className="pp-tag pp-tag--dot">IP transfers on payment</span>
                </div>
              </div>

              {/* mock contract document */}
              <div className="pp-glass" style={{ padding: 'var(--sp-8)' }}>
                <div className="pp-stack pp-gap-5">
                  <div className="pp-flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--sp-4)' }}>
                    <div className="pp-stack" style={{ gap: 4 }}>
                      <p className="pp-label">Statement of work · SOW-1174</p>
                      <p className="pp-h5">Workday HCM implementation</p>
                    </div>
                    <span className="pp-tag pp-tag--success pp-tag--dot">Signed</span>
                  </div>
                  <hr className="pp-rule" />
                  <div className="pp-stack pp-gap-3">
                    {[
                      ['Scope', '4 milestones · 12 deliverables'],
                      ['Value', '$34,000 · funded at signing'],
                      ['Change orders', 'Signed addendum required'],
                      ['IP transfer', 'On milestone payment'],
                    ].map(([k, v]) => (
                      <div key={k} className="pp-flex" style={{ justifyContent: 'space-between', gap: 'var(--sp-4)' }}>
                        <span className="pp-small" style={{ fontWeight: 500, color: 'var(--ink)' }}>
                          {k}
                        </span>
                        <span className="pp-small">{v}</span>
                      </div>
                    ))}
                  </div>
                  <hr className="pp-rule" />
                  <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-4)' }}>
                    <div className="pp-stack" style={{ gap: 4 }}>
                      <p className="pp-label">Expert</p>
                      <p className="pp-body" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--ink)' }}>
                        Jonas Meier
                      </p>
                      <p className="pp-small pp-mono-num">Feb 12, 14:32 UTC</p>
                    </div>
                    <div className="pp-stack" style={{ gap: 4 }}>
                      <p className="pp-label">Client</p>
                      <p className="pp-body" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--ink)' }}>
                        Priya Raman
                      </p>
                      <p className="pp-small pp-mono-num">Feb 12, 15:07 UTC</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Signing flow ────────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">The signing flow</p>
              <h2 className="pp-display pp-d3">Brief in, contract out.</h2>
            </div>
            <p className="pp-lede">Four steps, all inside the workspace — no PDFs orbiting an email thread.</p>
          </Reveal>
          <div className="pp-grid pp-grid-4" style={{ gap: 'var(--sp-6)' }}>
            {SIGN_STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 80}>
                <div className="pp-stack pp-gap-4" style={{ paddingTop: 'var(--sp-5)', borderTop: 'var(--bw-thick) solid var(--line)', height: '100%' }}>
                  <span className="pp-tile pp-tile--sm">{step.num}</span>
                  <div className="pp-stack pp-gap-2">
                    <p className="pp-h6">{step.title}</p>
                    <p className="pp-body">{step.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scope protection ────────────────────────────────────── */}
      <section className="pp-section pp-blueprint">
        <div className="pp-glow" style={{ bottom: -160, left: -100 }} />
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Scope protection</p>
              <h2 className="pp-display pp-d3">The contract works for you after you sign it.</h2>
            </div>
            <p className="pp-lede">
              Scope creep is the tax on independent work. The standard terms are designed to make it billable instead.
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
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section className="pp-section pp-band-deep">
        <div className="pp-container">
          <Reveal>
            <div className="pp-sec-split" style={{ alignItems: 'start', gap: 'var(--sp-16)' }}>
              <div className="pp-stack pp-gap-8">
                <div className="pp-sec-head">
                  <p className="pp-label">Contract FAQs</p>
                  <h2 className="pp-display pp-d3">The fine print, in plain terms.</h2>
                </div>
                <ContractFaq />
              </div>
              <div className="pp-card pp-card--panel pp-stack pp-gap-6">
                <p className="pp-label">What happens next</p>
                <p className="pp-h5">Signature opens the workspace.</p>
                <p className="pp-body">
                  The moment both parties sign, the first milestone is funded and the project workspace spins up with
                  the SOW pre-loaded.
                </p>
                <div className="pp-stack pp-gap-3">
                  <Link className="pp-link-arrow" href="/manage-projects">
                    Manage projects
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                  <Link className="pp-link-arrow" href="/payments">
                    How payments release
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
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
                <h2 className="pp-display pp-d3">Stop negotiating templates. Start signing work.</h2>
                <p className="pp-lede">
                  Join the network and every engagement comes with a contract that protects your scope by default.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill" href="/become-expert">
                  Apply to join
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/send-invoices">
                  Next: send invoices
                </Link>
                <p className="pp-small">Standard terms reviewed by counsel in every market we operate in.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
