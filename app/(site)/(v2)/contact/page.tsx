import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact — Proploy',
  description:
    'Talk to the Proploy team — sales, support, partnerships or press. We reply to every message within one business day.',
}

const CHANNELS = [
  {
    title: 'Sales',
    body: 'Evaluating Proploy for your team? Get pricing, a walkthrough and a shortlist conversation.',
    email: 'sales@proploy.com',
  },
  {
    title: 'Support',
    body: 'Already running an engagement? Reach the success team that owns your workspace.',
    email: 'support@proploy.com',
  },
  {
    title: 'Partnerships',
    body: 'Software vendors and consulting firms — let’s talk distribution and delivery.',
    email: 'partnerships@proploy.com',
  },
  {
    title: 'Press',
    body: 'Writing about the execution gap? We’re happy to share data and perspective.',
    email: 'press@proploy.com',
  },
] as const

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.6 6.8 8.4 6 8.4-6" />
    </svg>
  )
}

export default function ContactPage() {
  return (
    <main className="pp-page">
      {/* ── Hero + form ──────────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--section-y)' }}>
        <div className="pp-glow" style={{ top: -140, right: -80 }} />

        <div className="pp-container">
          <div
            className="pp-grid pp-grid-2"
            style={{ gap: 'var(--sp-16)', alignItems: 'start' }}
          >
            <Reveal className="pp-stack pp-gap-8 pp-soften">
              <p className="pp-label">Contact</p>

              <h1 className="pp-display pp-d1" style={{ maxWidth: '12ch' }}>
                Talk to a human at Proploy.
              </h1>

              <p className="pp-lede" style={{ maxWidth: '48ch' }}>
                Questions about a shortlist, an engagement, a partnership or a story — send a note
                and the right team replies within one business day.
              </p>

              <div className="pp-stack pp-gap-3">
                <p className="pp-small">
                  Looking for answers right now? Try the{' '}
                  <Link href="/help">help center</Link> or browse the{' '}
                  <Link href="/faqs">FAQs</Link>.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="pp-glass" style={{ padding: 'var(--sp-8)' }}>
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Direct channels ──────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-12">
          <Reveal className="pp-sec-head pp-soften">
            <p className="pp-label">Direct lines</p>
            <h2 className="pp-display pp-d3">Know who you need? Skip the form.</h2>
          </Reveal>

          <div className="pp-grid pp-grid-4">
            {CHANNELS.map((ch, i) => (
              <Reveal key={ch.title} delay={i * 80}>
                <div className="pp-card pp-lift pp-stack pp-gap-4" style={{ height: '100%' }}>
                  <span className="pp-tile pp-tile--soft">
                    <MailIcon />
                  </span>
                  <div className="pp-stack" style={{ gap: 6 }}>
                    <p className="pp-h6">{ch.title}</p>
                    <p className="pp-body">{ch.body}</p>
                  </div>
                  <a
                    className="pp-link-arrow"
                    style={{ marginTop: 'auto' }}
                    href={`mailto:${ch.email}`}
                  >
                    {ch.email}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────── */}
      <section className="pp-section">
        <div className="pp-container-app">
          <Reveal className="pp-dark">
            <div className="pp-stack pp-gap-8" style={{ maxWidth: 640 }}>
              <div className="pp-stack pp-gap-5">
                <p className="pp-label">Self-serve</p>
                <h2 className="pp-display pp-d3">Most questions are already answered.</h2>
                <p className="pp-lede">
                  The help center covers getting started, billing, engagements and trust &amp;
                  safety.
                </p>
              </div>

              <div className="pp-flex pp-wrap pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill pp-btn--inline" href="/help">
                  Visit the help center
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/faqs">
                  Browse FAQs
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
