import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

export const metadata: Metadata = {
  title: 'Events — Proploy',
  description:
    'Webinars, workshops and community sessions on buying and implementing business software — hosted by Proploy and the expert network.',
}

const UPCOMING = [
  {
    month: 'Sep',
    day: '10',
    title: 'Scoping an implementation SOW that protects both sides',
    type: 'Webinar',
    detail: 'Live teardown of a real (anonymised) statement of work with two vetted implementation experts.',
    when: 'Sep 10, 2026 · 11:00 PT · Online',
  },
  {
    month: 'Sep',
    day: '24',
    title: 'CRM selection for mid-market teams: a live shortlist',
    type: 'Workshop',
    detail: 'Bring a real requirement. We build a weighted shortlist together using the Proploy catalogue.',
    when: 'Sep 24, 2026 · 09:00 PT · Online',
  },
  {
    month: 'Oct',
    day: '08',
    title: 'Ask the experts: data migration horror stories, avoided',
    type: 'AMA',
    detail: 'Three implementers on the migrations that nearly failed — and the patterns that saved them.',
    when: 'Oct 8, 2026 · 12:00 PT · Online',
  },
  {
    month: 'Oct',
    day: '22',
    title: 'Proploy expert network: open onboarding session',
    type: 'For experts',
    detail: 'How vetting works, how briefs reach you, and live Q&A with experts already on the platform.',
    when: 'Oct 22, 2026 · 10:00 PT · Online',
  },
  {
    month: 'Nov',
    day: '12',
    title: 'Budgeting 2027: the full cost of a software rollout',
    type: 'Webinar',
    detail: 'Licences, implementation, integration and training — planning the whole number for next year.',
    when: 'Nov 12, 2026 · 11:00 PT · Online',
  },
]

const PAST = [
  { title: 'Adoption after go-live: the first 90 days', type: 'Webinar', when: 'Jun 18, 2026' },
  { title: 'ERP cutover clinic with the expert network', type: 'Workshop', when: 'May 21, 2026' },
  { title: 'Negotiating SaaS renewals from the mid-market', type: 'AMA', when: 'Apr 16, 2026' },
  { title: 'Building your first vendor scorecard', type: 'Workshop', when: 'Mar 12, 2026' },
]

export default function EventsPage() {
  return (
    <main className="pp-page">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -140, right: -80 }} />
        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <p className="pp-label">Events</p>
            <div className="pp-sec-split" style={{ alignItems: 'start' }}>
              <h1 className="pp-display pp-d1">
                Learn from people
                <br />
                who deploy for
                <br />a living.
              </h1>
              <p className="pp-lede">
                Webinars, workshops and AMAs with the Proploy team and the vetted expert network. Free, online, and
                recorded if you can&apos;t make it live.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Upcoming ────────────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-12">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Upcoming</p>
              <h2 className="pp-display pp-d3">On the calendar.</h2>
            </div>
            <p className="pp-lede">Every session ends with open Q&A. Bring the rollout you&apos;re actually planning.</p>
          </Reveal>

          <div className="pp-stack pp-gap-4">
            {UPCOMING.map((ev, i) => (
              <Reveal key={ev.title} delay={i * 70}>
                <article
                  className="pp-card pp-lift"
                  style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--sp-6)' }}
                >
                  <div className="pp-tile pp-tile--lg pp-tile--soft" style={{ flexDirection: 'column', gap: 0 }}>
                    <span className="pp-label" style={{ color: 'var(--cobalt-deep)', letterSpacing: '0.08em' }}>
                      {ev.month}
                    </span>
                    <span className="pp-mono-num" style={{ fontSize: 26, lineHeight: 1, color: 'var(--cobalt-deep)' }}>
                      {ev.day}
                    </span>
                  </div>
                  <div className="pp-stack pp-gap-2" style={{ flex: 1, minWidth: 260 }}>
                    <div className="pp-flex pp-wrap pp-gap-2" style={{ alignItems: 'center' }}>
                      <span className="pp-tag pp-tag--cobalt pp-tag--dot">{ev.type}</span>
                      <span className="pp-small">{ev.when}</span>
                    </div>
                    <h3 className="pp-h5">{ev.title}</h3>
                    <p className="pp-body" style={{ maxWidth: '68ch' }}>
                      {ev.detail}
                    </p>
                  </div>
                  <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/contact">
                    Register
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Past events ─────────────────────────────────────────── */}
      <section className="pp-section pp-band-deep">
        <div className="pp-container pp-stack pp-gap-12">
          <Reveal className="pp-sec-head pp-soften">
            <p className="pp-label">Past sessions</p>
            <h2 className="pp-display pp-d3">Catch up on the recordings.</h2>
          </Reveal>
          <div className="pp-grid pp-grid-4" style={{ gap: 'var(--sp-6)' }}>
            {PAST.map((ev, i) => (
              <Reveal key={ev.title} delay={i * 80}>
                <article className="pp-card pp-card--flat pp-lift pp-stack pp-gap-4" style={{ height: '100%' }}>
                  <div className="pp-flex pp-gap-2" style={{ alignItems: 'center' }}>
                    <span className="pp-tag">{ev.type}</span>
                    <span className="pp-small" style={{ marginLeft: 'auto' }}>
                      {ev.when}
                    </span>
                  </div>
                  <h3 className="pp-h6" style={{ flex: 1 }}>
                    {ev.title}
                  </h3>
                  <span className="pp-link-arrow" aria-hidden>
                    Watch recording
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

      {/* ── Closing CTA ─────────────────────────────────────────── */}
      <section className="pp-section">
        <div className="pp-container-app">
          <Reveal className="pp-dark">
            <div className="pp-sec-split" style={{ alignItems: 'center', gap: 'var(--sp-16)' }}>
              <div className="pp-stack" style={{ gap: 'var(--sp-5)' }}>
                <p className="pp-label">Can&apos;t wait for the next session?</p>
                <h2 className="pp-display pp-d3">Ask your question to a matched expert instead.</h2>
                <p className="pp-lede">
                  Skip the queue — brief Proploy and get a free consultation with a vetted implementer this week.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill" href="/sign-up">
                  Get matched
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/contact">
                  Suggest an event topic
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
