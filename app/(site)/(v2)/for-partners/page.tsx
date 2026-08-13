import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

export const metadata: Metadata = {
  title: 'For Technology Partners — Proploy',
  description:
    'List your software on the Proploy marketplace — reach in-market buyers, plug into a vetted implementation network, and co-sell rollouts that stick.',
}

const REASONS = [
  {
    title: 'Distribution to in-market buyers',
    body: 'Your product appears in curated shortlists built from real briefs — stage, stack and budget — not banner ads. Buyers arrive already qualified.',
  },
  {
    title: 'A vetted implementation network',
    body: 'Every listing is backed by experts graded on your product’s playbook. Customers never buy your software without the hands to deploy it.',
  },
  {
    title: 'Co-selling that closes',
    body: 'Pair your sales motion with a named implementation partner from the first call. Proposals ship with delivery plans attached.',
  },
  {
    title: 'Adoption you can see',
    body: 'Milestones, go-lives and post-launch check-ins are tracked in the workspace — so your team sees rollout health, not just contract dates.',
  },
]

const LIFECYCLE = [
  { num: '01', title: 'List your product', body: 'Structured listing with pricing transparency, integrations and the buyer contexts you serve best.' },
  { num: '02', title: 'Certify experts', body: 'We grade implementation experts against your playbook — your team can review and endorse the roster.' },
  { num: '03', title: 'Match into briefs', body: 'Your product enters shortlists where the fit is real. Intro calls include a delivery-ready expert.' },
  { num: '04', title: 'Win the renewal', body: 'Tracked rollouts and day-90 adoption mean customers who actually use what they bought — and stay.' },
]

const FIT = [
  'B2B software with a real implementation surface — CRM, ERP, data, ops, finance tooling',
  'A pricing model you are willing to publish transparently',
  'Willingness to share an implementation playbook we can certify experts against',
  'A team that cares about adoption metrics, not just bookings',
]

function CheckIcon() {
  return (
    <span className="pp-yes" style={{ flexShrink: 0, marginTop: 2 }}>
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

export default function ForPartnersPage() {
  return (
    <main className="pp-page">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -120, right: -60 }} />

        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <p className="pp-label">For technology partners</p>

            <div className="pp-sec-split" style={{ alignItems: 'start' }}>
              <h1 className="pp-display pp-d1">
                Sell software
                <br />
                that ships with
                <br />
                the experts.
              </h1>

              <p className="pp-lede">
                List your product on Proploy and every deal arrives with distribution, a vetted
                implementation network, and a rollout your customer can actually see through.
              </p>
            </div>

            <div className="pp-flex pp-wrap pp-gap-3">
              <Link className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline" href="/vendor-onboarding">
                List your product
              </Link>
              <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/contact">
                Talk to partnerships
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Why list ─────────────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Why Proploy</p>
              <h2 className="pp-display pp-d3">Churn starts at a failed rollout. So does retention.</h2>
            </div>

            <p className="pp-lede">
              A marketplace where the implementation is part of the purchase changes vendor economics.
            </p>
          </Reveal>

          <div className="pp-grid pp-grid-2">
            {REASONS.map((r, i) => (
              <Reveal key={r.title} delay={(i % 2) * 80}>
                <div className="pp-card pp-card--panel pp-lift pp-stack pp-gap-4" style={{ height: '100%' }}>
                  <p className="pp-h5">{r.title}</p>
                  <p className="pp-body">{r.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lifecycle steps ──────────────────────────────────────── */}
      <section className="pp-section pp-blueprint">
        <div className="pp-glow" style={{ top: 60, left: -140 }} />

        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">The partner lifecycle</p>
              <h2 className="pp-display pp-d3">From listing to renewal, one loop.</h2>
            </div>

            <p className="pp-lede">
              Four steps that turn a marketplace listing into a compounding channel.
            </p>
          </Reveal>

          <div className="fe-steps">
            {LIFECYCLE.map((step, i) => (
              <Reveal key={step.num} delay={i * 80} className="fe-step">
                <p className="pp-label fe-num pp-mono-num">{step.num}</p>
                <div className="pp-stack" style={{ gap: 6 }}>
                  <p className="pp-h6">{step.title}</p>
                  <p className="pp-body">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fit checklist ────────────────────────────────────────── */}
      <section className="pp-section pp-band-deep">
        <div className="pp-container">
          <Reveal>
            <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-16)', alignItems: 'center' }}>
              <div className="pp-sec-head">
                <p className="pp-label">Is your product a fit?</p>
                <h2 className="pp-display pp-d3">We curate the catalog deliberately.</h2>
                <p className="pp-lede">
                  Proploy is not a pay-to-play directory. Listings are reviewed for implementation
                  depth and buyer fit before they go live.
                </p>
              </div>

              <div className="pp-card pp-card--panel pp-stack pp-gap-5">
                <p className="pp-label">Strong partners usually have</p>
                <ul className="pp-stack pp-gap-4">
                  {FIT.map((item) => (
                    <li key={item} className="pp-flex pp-gap-3" style={{ alignItems: 'flex-start' }}>
                      <CheckIcon />
                      <span className="pp-body">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────── */}
      <section className="pp-section">
        <div className="pp-container-app">
          <Reveal className="pp-dark">
            <div className="pp-stack pp-gap-8" style={{ maxWidth: 640 }}>
              <div className="pp-stack pp-gap-5">
                <p className="pp-label">Get listed</p>
                <h2 className="pp-display pp-d3">Put your product where the rollout is guaranteed a pair of hands.</h2>
                <p className="pp-lede">
                  Onboarding takes a week for most vendors — listing, playbook, expert certification.
                </p>
              </div>

              <div className="pp-flex pp-wrap pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill pp-btn--inline" href="/vendor-onboarding">
                  Start vendor onboarding
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/contact">
                  Ask a question first
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
