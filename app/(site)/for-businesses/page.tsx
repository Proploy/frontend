import type { Metadata } from 'next'
import { Fragment, type CSSProperties, type ReactNode } from 'react'
import Link from 'next/link'

import { Nav } from '@/components/site/Nav'
import { Footer } from '@/components/site/Footer'
import { Reveal } from '@/components/site/Reveal'

import { CaseScroller } from './CaseScroller'
import { QuoteCarousel } from './QuoteCarousel'

export const metadata: Metadata = {
  title: 'For Businesses — Proploy',
  description:
    'Discover best-fit software, get matched with vetted implementation experts, and launch with confidence — one workflow from software decision to successful launch.',
}

function CheckMark({ style }: { style?: CSSProperties }) {
  return (
    <span className="pp-yes" style={style}>
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

function LearnMoreArrow() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

// true → check mark, '—' → muted dash, any other string → plain text cell.
type Cell = true | string

interface CompareGroup {
  title: string
  rows: { label: string; values: [Cell, Cell, Cell] }[]
}

const COMPARE_GROUPS: CompareGroup[] = [
  {
    title: 'Discovery & matching',
    rows: [
      { label: 'Curated software shortlist', values: ['—', '—', true] },
      { label: 'Vetted implementation experts', values: ['—', true, true] },
      { label: 'Match based on team context', values: ['—', '—', true] },
      { label: 'Free initial consultation', values: ['—', '—', 'Included'] },
      { label: 'Searchable, filterable directory', values: [true, '—', true] },
      { label: 'Pricing transparency', values: ['—', '—', true] },
    ],
  },
  {
    title: 'Implementation experience',
    rows: [
      { label: 'Single workspace for kickoff', values: ['—', '—', true] },
      { label: 'Milestone tracking', values: ['Limited', 'Manual', 'Built-in'] },
      { label: 'Live status updates', values: ['—', '—', true] },
      { label: 'In-platform comms with expert', values: ['—', '—', true] },
      { label: 'Document hand-off', values: ['Email', 'Email', 'In-app'] },
      { label: 'Standardised SOWs', values: ['—', '—', true] },
      { label: 'Outcome-based check-ins', values: ['—', '—', true] },
      { label: 'Dedicated success owner', values: ['—', '—', true] },
      { label: 'Centralised vendor invoicing', values: ['—', '—', true] },
    ],
  },
  {
    title: 'Trust & accountability',
    rows: [
      { label: 'Verified expert credentials', values: ['—', true, true] },
      { label: 'Public expert ratings', values: ['—', '—', true] },
      { label: 'Money-back guarantee window', values: ['—', '—', true] },
      { label: 'Escalation pathway', values: ['Support ticket', 'None', 'White-glove'] },
      { label: 'Data ownership clarity', values: ['—', '—', true] },
    ],
  },
]

const METRICS = [
  { value: '400+', label: 'Software products curated' },
  { value: '600%', label: 'Faster implementation cycles' },
  { value: '10k', label: 'Buyers & operators served' },
]

interface SolutionCard {
  title: string
  body: string
  icon: ReactNode
}

const SOLUTION_CARDS: SolutionCard[] = [
  {
    title: 'Brief us once',
    body: "Share your team's stage, stack and budget. Proploy turns it into a tailored shortlist of software and experts in days, not weeks.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3.2a8.8 8.8 0 0 1 0 17.6H8.9l-3.6 2.1a.5.5 0 0 1-.74-.57l.85-3.2A8.8 8.8 0 0 1 12 3.2Z" />
        <circle cx="8.4" cy="12" r=".95" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r=".95" fill="currentColor" stroke="none" />
        <circle cx="15.6" cy="12" r=".95" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: 'Match with vetted experts',
    body: "Every implementation expert is interviewed, reference-checked and graded against the playbook for the software you're rolling out.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13.2 2.8 5.6 13.1a.5.5 0 0 0 .4.8h4.3l-.9 7.1a.5.5 0 0 0 .9.35l7.5-10.2a.5.5 0 0 0-.4-.8h-4.2l.9-6.9a.5.5 0 0 0-.9-.35Z" />
      </svg>
    ),
  },
  {
    title: 'Track to go-live',
    body: 'Milestones, status and approvals live in one workspace — so finance, ops and the expert stay aligned through rollout.',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3.5 20.5h17" />
        <rect x="4.5" y="12" width="3.4" height="5.5" rx="1" />
        <rect x="10.3" y="7.5" width="3.4" height="10" rx="1" />
        <rect x="16.1" y="10" width="3.4" height="7.5" rx="1" />
        <path d="M5 5.5 10.5 3l4 2.5L20 2.5" />
      </svg>
    ),
  },
  {
    title: 'Stay supported post-launch',
    body: 'A dedicated success owner keeps the expert engaged through training, cutover and the first 90 days of adoption.',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="8.6" />
        <path d="m8.6 12.1 2.3 2.3 4.5-4.9" />
      </svg>
    ),
  },
]

const STORY_POINTS = [
  'A shortlist tuned to your stage, stack and budget — not a vendor leaderboard.',
  'Implementation partners interviewed and graded against the same playbook every time.',
  'One workspace from first call to go-live, so nothing falls between calendars.',
]

const CASE_STUDIES = [
  {
    company: 'Layers',
    quote: '“Proploy shortlisted three tools in two days. We picked one and were live in three weeks.”',
  },
  {
    company: 'Sisyphus',
    quote: '“The matched implementation expert knew our CRM better than the vendor sales team did.”',
  },
  {
    company: 'Capsule',
    quote: '“One workspace from RFP to rollout. Procurement stopped chasing email threads.”',
  },
  {
    company: 'Catalog',
    quote: '“We replaced a six-month evaluation with a four-week Proploy engagement. Same outcome.”',
  },
]

const LOGOS = ['Fruition', 'Layers', 'Sisyphus', 'Capsule', 'Catalog', 'Coreos', 'Quotient', 'Hourglass', 'Wildcraft']

export default function ForBusinessesPage() {
  return (
    <div className="pp-scope overflow-x-clip">
      <Nav />

      <main className="pp-page">
        {/* ── Hero ────────────────────────────────────────────────── */}
        <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
          <div className="pp-glow" style={{ top: -120, right: -60 }} />

          <div className="pp-container">
            <Reveal className="pp-stack pp-gap-8 pp-soften">
              <p className="pp-label">For business</p>

              <div className="pp-sec-split" style={{ alignItems: 'start' }}>
                <h1 className="pp-display pp-d1">
                  Find the software
                  <br />
                  and the expert to
                  <br />
                  make it work.
                </h1>

                <p className="pp-lede">
                  Discover best-fit software, get matched with vetted experts, and launch with confidence.
                </p>
              </div>

              <div className="pp-flex pp-wrap pp-gap-3">
                <Link className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline" href="/sign-up">
                  Get matched
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/experts">
                  Explore experts
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Metrics ─────────────────────────────────────────────── */}
        <section style={{ paddingBlock: '0 var(--section-y)' }}>
          <div className="pp-container">
            <Reveal>
              <div className="pp-card pp-card--panel" style={{ paddingBlock: 'var(--sp-12)' }}>
                <div className="pp-fade-stack pp-stack pp-gap-8">
                  <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-8)' }}>
                    {METRICS.map((m) => (
                      <div key={m.label} className="pp-metric">
                        <p className="pp-metric-value">{m.value}</p>
                        <p className="pp-label">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Comparison ──────────────────────────────────────────── */}
        <section className="pp-section pp-band">
          <div className="pp-container pp-stack pp-gap-16">
            <Reveal className="pp-sec-split pp-soften">
              <div className="pp-sec-head">
                <p className="pp-label">The problem</p>
                <h2 className="pp-display pp-d3">Software buying is broken for growing teams.</h2>
              </div>

              <p className="pp-lede">
                Proploy puts discovery, experts and rollout in one place, not across scattered threads.
              </p>
            </Reveal>

            <Reveal>
              <div style={{ overflowX: 'auto' }}>
                <table className="fb-compare">
                  <thead>
                    <tr>
                      <th />
                      <th>Traditional platforms</th>
                      <th>Solo hires</th>
                      <th>Proploy</th>
                    </tr>
                  </thead>

                  <tbody>
                    {COMPARE_GROUPS.map((group) => (
                      <Fragment key={group.title}>
                        <tr className="fb-group">
                          <td className="pp-label" colSpan={4}>
                            {group.title}
                          </td>
                        </tr>
                        {group.rows.map((row) => (
                          <tr key={row.label}>
                            <td>{row.label}</td>
                            {row.values.map((value, i) => (
                              <td key={`${row.label}-col-${i}`}>
                                {value === true ? (
                                  <CheckMark />
                                ) : value === '—' ? (
                                  <span className="pp-no">—</span>
                                ) : (
                                  value
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Solution cards ──────────────────────────────────────── */}
        <section className="pp-section pp-blueprint">
          <div className="pp-glow" style={{ top: 40, left: -140 }} />

          <div className="pp-container pp-stack pp-gap-16">
            <Reveal className="pp-sec-split pp-soften">
              <div className="pp-sec-head">
                <p className="pp-label">The solution</p>
                <h2 className="pp-display pp-d3">One workflow from software decision to successful launch.</h2>
              </div>

              <p className="pp-lede">
                Browse, match and ship in a single thread, with the right experts from day one.
              </p>
            </Reveal>

            <div className="pp-grid pp-grid-4" style={{ gap: 'var(--sp-6)' }}>
              {SOLUTION_CARDS.map((card, i) => (
                <Reveal key={card.title} delay={i * 80}>
                  <div
                    className="pp-card pp-lift"
                    style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-12)', minHeight: 320, height: '100%' }}
                  >
                    <span className="pp-ico">{card.icon}</span>

                    <div className="pp-stack pp-gap-4" style={{ marginTop: 'auto' }}>
                      <div className="pp-stack" style={{ gap: 6 }}>
                        <p className="pp-h6">{card.title}</p>
                        <p className="pp-body">{card.body}</p>
                      </div>

                      <button type="button" className="pp-link-arrow">
                        Learn more
                        <LearnMoreArrow />
                      </button>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Our story ───────────────────────────────────────────── */}
        <section className="pp-section pp-band">
          <div className="pp-container pp-stack pp-gap-16">
            <Reveal className="pp-sec-split pp-soften">
              <div className="pp-sec-head">
                <p className="pp-label">Our story</p>
                <h2 className="pp-display pp-d3">We&apos;re just getting started.</h2>
              </div>

              <p className="pp-lede">Proploy has already helped over 4,000 companies achieve remarkable results.</p>
            </Reveal>

            <Reveal>
              <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-16)' }}>
                <div className="pp-stack pp-gap-4">
                  <p className="pp-lede">
                    Proploy started in a back room of a procurement consultancy where every other deal hit the same
                    wall — a strong shortlist, a strong vendor, and no one who could actually take it live for the
                    team.
                  </p>

                  <p className="pp-lede">
                    So we built the bridge. A directory of software the way buyers actually compare it, paired with a
                    roster of implementation experts who have shipped it before. One brief, one conversation, one
                    rollout.
                  </p>

                  <p className="pp-lede">
                    Today Proploy helps operators, founders and procurement leads at growing companies match with the
                    right software and the right hands — and stay on the same thread through cutover, training and the
                    first 90 days.
                  </p>
                </div>

                <div className="pp-card pp-card--panel pp-stack pp-gap-6">
                  <p className="pp-label">What it actually feels like</p>

                  <ul className="pp-stack pp-gap-4">
                    {STORY_POINTS.map((point) => (
                      <li key={point} className="pp-flex pp-gap-3" style={{ alignItems: 'flex-start' }}>
                        <CheckMark style={{ flexShrink: 0, marginTop: 2 }} />
                        <span className="pp-body">{point}</span>
                      </li>
                    ))}
                  </ul>

                  <hr className="pp-rule" />

                  <p className="pp-body">
                    If the rollout misses the mark, we keep working. The product, the expert and the outcome live on
                    the same line item.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Case studies ────────────────────────────────────────── */}
        <section className="pp-section">
          <div className="pp-container-app pp-stack pp-gap-16">
            <Reveal>
              <div
                className="pp-flex pp-wrap pp-gap-8"
                style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
              >
                <div className="pp-sec-head">
                  <p className="pp-label">Customer stories</p>
                  <h2 className="pp-display pp-d3">We&apos;re proud of our success stories.</h2>
                  <p className="pp-lede">Case studies from customers who are building faster.</p>
                </div>

                <div className="pp-flex pp-wrap pp-gap-3">
                  <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/">
                    Our customers
                  </Link>
                  <Link className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline" href="/sign-up">
                    Create account
                  </Link>
                </div>
              </div>
            </Reveal>

            <CaseScroller>
              {CASE_STUDIES.map((cs) => (
                <article key={cs.company} className="fb-case">
                  <p className="pp-label fb-case-name" style={{ color: 'rgba(255,255,255,.7)' }}>
                    {cs.company}
                  </p>

                  <div className="fb-case-quote">
                    <div className="pp-stack pp-gap-3">
                      <p className="pp-h5" style={{ color: '#fff' }}>
                        {cs.company}
                      </p>
                      <p className="pp-lede" style={{ color: 'rgba(255,255,255,.88)' }}>
                        {cs.quote}
                      </p>
                    </div>

                    <button type="button" className="pp-link-arrow" style={{ color: '#fff' }}>
                      Read case study
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17 17 7M9 7h8v8" />
                      </svg>
                    </button>
                  </div>
                </article>
              ))}
            </CaseScroller>
          </div>
        </section>

        {/* ── Testimonial ─────────────────────────────────────────── */}
        <section className="pp-section pp-band-deep">
          <Reveal>
            <div className="pp-container pp-stack pp-gap-8 pp-center" style={{ alignItems: 'center' }}>
              <p className="pp-label">Customer voice</p>
              <QuoteCarousel />
            </div>
          </Reveal>
        </section>

        {/* ── Closing CTA ─────────────────────────────────────────── */}
        <section className="pp-section">
          <div className="pp-container-app">
            <Reveal className="pp-dark">
              <div className="pp-sec-split" style={{ alignItems: 'center', gap: 'var(--sp-16)' }}>
                <div className="pp-stack pp-gap-8">
                  <div className="pp-stack pp-gap-5">
                    <p className="pp-label">Get started</p>
                    <h2 className="pp-display pp-d3">Join 4,000+ teams choosing software with Proploy.</h2>
                    <p className="pp-lede">
                      Get matched with a vetted implementation expert — first consultation is free.
                    </p>
                  </div>

                  <div className="pp-flex pp-wrap pp-gap-3">
                    <Link className="pp-btn pp-btn--cobalt pp-btn--pill pp-btn--inline" href="/sign-up">
                      Get started
                    </Link>
                    <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/products">
                      Learn more
                    </Link>
                  </div>
                </div>

                <div className="fb-logos">
                  {LOGOS.map((logo) => (
                    <span key={logo} className="pp-label">
                      {logo}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
