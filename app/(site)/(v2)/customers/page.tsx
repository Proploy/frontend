import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

import { QuoteCarousel } from './QuoteCarousel'

export const metadata: Metadata = {
  title: 'Customer stories — Proploy',
  description:
    'How teams use Proploy to find the right software and the vetted experts who deploy it — from first brief to go-live.',
}

// Fictional, plausible companies only.
const STORIES = [
  {
    company: 'Harborline Freight',
    sector: 'Logistics · 140 people',
    result: 'CRM + ERP sync live in 5 weeks',
    quote: '“Three shortlisted platforms by Tuesday, each with a vetted implementer attached.”',
  },
  {
    company: 'Quillstone Manufacturing',
    sector: 'Manufacturing · 320 people',
    result: 'ERP migration, zero downtime cutover',
    quote: '“Our matched expert had shipped the same ERP four times for companies our size.”',
  },
  {
    company: 'Meridian Labs',
    sector: 'Biotech · 60 people',
    result: 'LIMS rollout 40% under budget',
    quote: '“Escrowed milestones meant we paid for outcomes, not hours on a timesheet.”',
  },
  {
    company: 'Bracken & Bow',
    sector: 'Retail · 85 people',
    result: 'POS + inventory stack in 3 weeks',
    quote: '“One workspace from first call to go-live. Nobody chased an email thread once.”',
  },
  {
    company: 'Fernway Health',
    sector: 'Healthcare · 210 people',
    result: 'Patient CRM with compliance sign-off',
    quote: '“The expert knew our compliance constraints better than the vendor did.”',
  },
  {
    company: 'Copperfield Energy',
    sector: 'Energy · 480 people',
    result: 'Field service platform, 6 regions',
    quote: '“Six regional rollouts, one delivery plan. The milestone view kept every lead honest.”',
  },
]

const METRICS = [
  { value: '4,000+', label: 'Companies matched' },
  { value: '92%', label: 'Rollouts on or ahead of plan' },
  { value: '3 wks', label: 'Median time to go-live' },
  { value: '4.9', label: 'Average engagement rating' },
]

export default function CustomersPage() {
  return (
    <main className="pp-page">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -120, right: -60 }} />
        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <p className="pp-label">Customer stories</p>
            <div className="pp-sec-split" style={{ alignItems: 'start' }}>
              <h1 className="pp-display pp-d1">
                Teams that shipped,
                <br />
                and how they
                <br />
                did it.
              </h1>
              <p className="pp-lede">
                Real rollout patterns from teams who matched with software and vetted implementation experts on
                Proploy.
              </p>
            </div>
            <div className="pp-flex pp-wrap pp-gap-3">
              <Link className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline" href="/sign-up">
                Start your own story
              </Link>
              <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/experts">
                Meet the experts
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
              <div className="pp-grid pp-grid-4" style={{ gap: 'var(--sp-8)' }}>
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

      {/* ── Story cards ─────────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container-app pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">The stories</p>
              <h2 className="pp-display pp-d3">Different sectors. Same pattern.</h2>
            </div>
            <p className="pp-lede">
              Brief once, match with software and an expert who has shipped it, track milestones to go-live.
            </p>
          </Reveal>

          <div className="pp-scroller">
            {STORIES.map((story) => (
              <article key={story.company} className="fb-case">
                <p className="pp-label fb-case-name" style={{ color: 'rgba(255,255,255,.7)' }}>
                  {story.sector}
                </p>
                <div className="fb-case-quote">
                  <div className="pp-stack pp-gap-3">
                    <p className="pp-h5" style={{ color: '#fff' }}>
                      {story.company}
                    </p>
                    <p className="pp-label" style={{ color: 'rgba(255,255,255,.65)' }}>
                      {story.result}
                    </p>
                    <p className="pp-lede" style={{ color: 'rgba(255,255,255,.88)' }}>
                      {story.quote}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quote carousel ──────────────────────────────────────── */}
      <section className="pp-section pp-band-deep">
        <Reveal>
          <div className="pp-container pp-stack pp-gap-8 pp-center" style={{ alignItems: 'center' }}>
            <p className="pp-label">In their words</p>
            <QuoteCarousel />
          </div>
        </Reveal>
      </section>

      {/* ── Closing CTA ─────────────────────────────────────────── */}
      <section className="pp-section">
        <div className="pp-container-app">
          <Reveal className="pp-dark">
            <div className="pp-sec-split" style={{ alignItems: 'center', gap: 'var(--sp-16)' }}>
              <div className="pp-stack" style={{ gap: 'var(--sp-5)' }}>
                <p className="pp-label">Your turn</p>
                <h2 className="pp-display pp-d3">The next story starts with a brief.</h2>
                <p className="pp-lede">
                  Tell Proploy what you&apos;re trying to change. Get a shortlist and a vetted expert — first
                  consultation free.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill" href="/sign-up">
                  Get matched
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/for-businesses">
                  How it works
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
