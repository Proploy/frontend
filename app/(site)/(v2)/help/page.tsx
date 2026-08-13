import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

export const metadata: Metadata = {
  title: 'Help Center — Proploy',
  description:
    'Guides and answers for Proploy — getting started, businesses, experts, billing and payments, and trust & safety.',
}

interface HelpTopic {
  title: string
  blurb: string
  articles: string[]
}

const TOPICS: HelpTopic[] = [
  {
    title: 'Getting started',
    blurb: 'First steps on the marketplace, whichever side of it you join.',
    articles: [
      'Create your account and choose a workspace type',
      'How matching works: briefs, shortlists and intro calls',
      'A tour of the engagement workspace',
      'Inviting teammates and setting roles',
    ],
  },
  {
    title: 'For businesses',
    blurb: 'Posting briefs, comparing products and running engagements.',
    articles: [
      'Writing a brief that gets strong matches',
      'Comparing software products side by side',
      'Approving milestones and tracking rollout status',
      'What the free initial consultation covers',
    ],
  },
  {
    title: 'For experts',
    blurb: 'Profiles, vetting, pipeline and getting paid for delivery.',
    articles: [
      'The vetting process, step by step',
      'Building a profile that wins briefs',
      'Scoping engagements with standardised SOWs',
      'Payouts, schedules and commission',
    ],
  },
  {
    title: 'Billing & payments',
    blurb: 'Invoices, payment methods, taxes and refunds.',
    articles: [
      'How invoicing works inside the workspace',
      'Supported payment methods and currencies',
      'Tax documents and compliance basics',
      'The money-back guarantee window',
    ],
  },
  {
    title: 'Trust & safety',
    blurb: 'Verification, disputes, data handling and account security.',
    articles: [
      'How experts are verified and graded',
      'Raising a dispute or escalation',
      'How your data is handled during an engagement',
      'Securing your account',
    ],
  },
]

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.8-3.8" />
    </svg>
  )
}

function ArticleIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 3.5h9l4 4v13H6z" />
      <path d="M14.6 3.9V8h4" />
    </svg>
  )
}

export default function HelpPage() {
  return (
    <main className="pp-page">
      {/* ── Hero with search ─────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -140, left: '50%', marginLeft: -210 }} />

        <div className="pp-container-prose">
          <Reveal className="pp-stack pp-gap-8 pp-center pp-soften">
            <div className="pp-stack pp-gap-5 pp-center">
              <p className="pp-label">Help center</p>
              <h1 className="pp-display pp-d2">How can we help?</h1>
              <p className="pp-lede">
                Answers for buyers, experts and vendors — from first login to final invoice.
              </p>
            </div>

            {/* Decorative search — routes to topics below for now */}
            <div className="pp-search" role="presentation">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search articles, e.g. “milestones”, “payouts”, “vetting”…"
                aria-label="Search help articles"
                readOnly
              />
              <span className="pp-tag pp-tag--ghost pp-mono-num" style={{ fontSize: 12 }}>
                ⌘K
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Topic categories ─────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-12">
          <Reveal className="pp-sec-head pp-soften">
            <p className="pp-label">Browse by topic</p>
            <h2 className="pp-display pp-d3">Five places to start.</h2>
          </Reveal>

          <div className="pp-grid pp-grid-3">
            {TOPICS.map((topic, i) => (
              <Reveal key={topic.title} delay={(i % 3) * 80}>
                <div className="pp-card pp-lift pp-stack pp-gap-5" style={{ height: '100%' }}>
                  <div className="pp-stack" style={{ gap: 6 }}>
                    <p className="pp-h5">{topic.title}</p>
                    <p className="pp-small">{topic.blurb}</p>
                  </div>

                  <ul className="pp-stack pp-gap-3" style={{ marginTop: 'auto' }}>
                    {topic.articles.map((article) => (
                      <li key={article} className="pp-flex pp-gap-2" style={{ alignItems: 'flex-start' }}>
                        <span className="pp-accent" style={{ marginTop: 4, flexShrink: 0 }}>
                          <ArticleIcon />
                        </span>
                        <Link href="/faqs" className="pp-body" style={{ color: 'var(--color-brand-700)' }}>
                          {article}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}

            {/* Sixth cell — quick links panel to keep the grid balanced */}
            <Reveal delay={160}>
              <div
                className="pp-card pp-card--flat pp-stack pp-gap-5"
                style={{ height: '100%', borderStyle: 'dashed' }}
              >
                <div className="pp-stack" style={{ gap: 6 }}>
                  <p className="pp-h5">Popular right now</p>
                  <p className="pp-small">Shortcuts our support team shares most often.</p>
                </div>
                <ul className="pp-stack pp-gap-3" style={{ marginTop: 'auto' }}>
                  <li>
                    <Link className="pp-link-arrow" href="/faqs">
                      Frequently asked questions
                    </Link>
                  </li>
                  <li>
                    <Link className="pp-link-arrow" href="/for-businesses">
                      How Proploy works for buyers
                    </Link>
                  </li>
                  <li>
                    <Link className="pp-link-arrow" href="/for-experts">
                      How Proploy works for experts
                    </Link>
                  </li>
                  <li>
                    <Link className="pp-link-arrow" href="/contact">
                      Contact the team
                    </Link>
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Escalation band ──────────────────────────────────────── */}
      <section className="pp-section">
        <div className="pp-container-app">
          <Reveal className="pp-dark">
            <div className="pp-sec-split" style={{ alignItems: 'center' }}>
              <div className="pp-stack pp-gap-5">
                <p className="pp-label">Still stuck?</p>
                <h2 className="pp-display pp-d3">Talk to a person, not a bot.</h2>
                <p className="pp-lede">
                  If an article didn&rsquo;t solve it, the support team replies within one business
                  day — faster for active engagements.
                </p>
              </div>

              <div className="pp-flex pp-wrap pp-gap-3" style={{ justifyContent: 'flex-end' }}>
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill pp-btn--inline" href="/contact">
                  Contact support
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
