import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

export const metadata: Metadata = {
  title: 'Guides — Proploy',
  description:
    'Practical guides to buying, evaluating and implementing business software — written from real rollouts on the Proploy network.',
}

const FILTERS = ['All guides', 'Buying', 'Implementation', 'Vendor management', 'Team readiness', 'Budgeting']

const GUIDES = [
  {
    title: 'The software brief that gets useful answers',
    category: 'Buying',
    read: '8 min read',
    blurb: 'How to describe your stage, stack and constraints so vendors and experts can actually respond to them.',
  },
  {
    title: 'Scoring a shortlist without a spreadsheet war',
    category: 'Buying',
    read: '10 min read',
    blurb: 'A weighted-criteria method that keeps stakeholders honest — and shortlists at three, not thirteen.',
  },
  {
    title: 'What a good implementation SOW actually contains',
    category: 'Implementation',
    read: '12 min read',
    blurb: 'Milestones, acceptance criteria and the escrow structure that keeps both sides aligned to outcomes.',
  },
  {
    title: 'Data migration without the 2 a.m. cutover',
    category: 'Implementation',
    read: '11 min read',
    blurb: 'Staged migration patterns that let you run old and new in parallel until the numbers reconcile.',
  },
  {
    title: 'Negotiating SaaS pricing when you are not enterprise',
    category: 'Vendor management',
    read: '7 min read',
    blurb: 'The levers mid-market buyers actually have: term length, seat bands, references and timing.',
  },
  {
    title: 'The renewal calendar every ops lead needs',
    category: 'Vendor management',
    read: '6 min read',
    blurb: 'Ninety days before renewal is when your leverage peaks. A simple system for never missing it.',
  },
  {
    title: 'Getting a team to actually adopt new software',
    category: 'Team readiness',
    read: '9 min read',
    blurb: 'Champions, cutover comms and the first-90-days cadence that separates rollouts from shelfware.',
  },
  {
    title: 'Change management for teams of ten',
    category: 'Team readiness',
    read: '7 min read',
    blurb: 'You do not need an enterprise playbook — you need three rituals and one owner.',
  },
  {
    title: 'Budgeting a rollout: licences are the small line',
    category: 'Budgeting',
    read: '9 min read',
    blurb: 'Implementation, integration and training usually cost more than the software. Plan for the full number.',
  },
  {
    title: 'Build vs buy vs configure: a 30-minute decision',
    category: 'Budgeting',
    read: '10 min read',
    blurb: 'A decision tree for when to customise, when to integrate and when to walk away.',
  },
]

export default function GuidesPage() {
  return (
    <main className="pp-page">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-12)' }}>
        <div className="pp-glow" style={{ top: -140, left: -80 }} />
        <div className="pp-container pp-stack pp-gap-10">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <p className="pp-label">Guides</p>
            <div className="pp-sec-split" style={{ alignItems: 'start' }}>
              <h1 className="pp-display pp-d1">
                Buy and deploy
                <br />
                like you&apos;ve done
                <br />
                it before.
              </h1>
              <p className="pp-lede">
                Field notes from hundreds of real rollouts on the Proploy network — the buying, budgeting and
                implementation playbook, written down.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="pp-flex pp-wrap pp-gap-2">
              {FILTERS.map((f, i) => (
                <span key={f} className={i === 0 ? 'pp-chip pp-chip--all is-active' : 'pp-chip'} aria-hidden>
                  {f}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Guides grid ─────────────────────────────────────────── */}
      <section className="pp-section pp-band" style={{ paddingTop: 'var(--sp-12)' }}>
        <div className="pp-container">
          <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-6)' }}>
            {GUIDES.map((g, i) => (
              <Reveal key={g.title} delay={(i % 3) * 80}>
                <article className="pp-card pp-lift pp-stack pp-gap-5" style={{ height: '100%' }}>
                  <div className="pp-flex pp-gap-2" style={{ alignItems: 'center' }}>
                    <span className="pp-tag pp-tag--cobalt">{g.category}</span>
                    <span className="pp-small" style={{ marginLeft: 'auto' }}>
                      {g.read}
                    </span>
                  </div>
                  <div className="pp-stack pp-gap-3" style={{ flex: 1 }}>
                    <h2 className="pp-h5">{g.title}</h2>
                    <p className="pp-body">{g.blurb}</p>
                  </div>
                  <span className="pp-link-arrow" aria-hidden>
                    Read guide
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ask-an-expert band ──────────────────────────────────── */}
      <section className="pp-section">
        <div className="pp-container">
          <Reveal>
            <div className="pp-card pp-card--panel pp-sec-split" style={{ alignItems: 'center' }}>
              <div className="pp-stack pp-gap-5">
                <p className="pp-label">Beyond the guide</p>
                <h2 className="pp-display pp-d4">Reading is free. So is the first consultation.</h2>
                <p className="pp-body" style={{ maxWidth: '58ch' }}>
                  Every guide here comes from patterns our vetted experts see weekly. When you&apos;re ready to apply
                  one to your own rollout, get matched with someone who has done it before.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--primary pp-btn--pill" href="/experts">
                  Find an expert
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/faqs">
                  Read the FAQs
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
                <p className="pp-label">Put it to work</p>
                <h2 className="pp-display pp-d3">Turn the playbook into a rollout.</h2>
                <p className="pp-lede">
                  Brief Proploy once and get a shortlist of software plus the vetted expert to deploy it.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill" href="/sign-up">
                  Get matched free
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/products">
                  Browse software
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
