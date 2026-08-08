import type { Metadata } from 'next'
import Link from 'next/link'

import { Nav } from '@/components/site/Nav'
import { Footer } from '@/components/site/Footer'
import { Reveal } from '@/components/site/Reveal'

import { FeDots } from './FeDots'
import { FaqAccordion } from './FaqAccordion'
import { MemberScroller } from './MemberScroller'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'For experts — Proploy',
  description:
    'Get hired for what you’re actually great at. Qualified briefs from businesses that already know what they want to deploy. No bidding wars.',
}

const STEPS = [
  {
    num: 'Step 01',
    lit: true,
    title: 'Build your profile',
    body: 'Add the platforms you implement, the sectors you know and the case studies that prove it. Verified badges unlock as references land.',
  },
  {
    num: 'Step 02',
    lit: true,
    title: 'Get matched, not ranked',
    body: 'Briefs arrive scored against your stack and availability. Businesses come with budget and scope already defined.',
  },
  {
    num: 'Step 03',
    lit: false,
    title: 'Scope and sign in-app',
    body: 'Standardised SOWs, milestone plans and e-signature. No chasing legal templates between calls.',
  },
  {
    num: 'Step 04',
    lit: false,
    title: 'Invoice and get paid',
    body: 'Milestone invoicing, tax handling and payouts in local currency — released as each milestone is approved.',
  },
]

const REACH_POINTS = [
  'Local-currency payouts with FX shown before you accept.',
  'Tax documentation generated per engagement, per jurisdiction.',
  'Escrowed milestones — funds committed before kickoff.',
]

const VALUES = [
  {
    title: 'Transparent pricing',
    body: 'You set the rate. The client sees it. Proploy’s fee is published and never taken out of your quote after the fact.',
    icon: (
      <path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6.1L12 16.9 6.7 19.7l1.1-6.1L3.4 9.4l6-.8Z" />
    ),
  },
  {
    title: 'Real vetting, real signal',
    body: 'Interviews and reference checks mean the badge on your profile carries weight — and filters out the briefs that were never serious.',
    icon: (
      <>
        <path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    title: 'Your client, your relationship',
    body: 'Proploy doesn’t sit between you and the team after kickoff. Repeat work stays yours, with no exclusivity clause.',
    icon: (
      <>
        <path d="M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="3.5" />
        <path d="M21 20v-2a4 4 0 0 0-3-3.9" />
      </>
    ),
  },
]

export default function ForExpertsPage() {
  return (
    <div className="pp-scope overflow-x-clip">
      <Nav />
      <main className="pp-page">
        {/* ── Hero ────────────────────────────────────────────────── */}
        <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
          <div className="pp-glow" style={{ top: -140, left: -80 }} />
          <div className="pp-container">
            <Reveal className="pp-stack pp-gap-8 pp-soften">
              <p className="pp-label">For experts</p>
              <div className="pp-sec-split" style={{ alignItems: 'start' }}>
                <h1 className="pp-display pp-d1">
                  Get hired for
                  <br />
                  what you&apos;re
                  <br />
                  actually great at.
                </h1>
                <p className="pp-lede">
                  Qualified briefs from businesses that already know what they want to deploy. No bidding wars.
                </p>
              </div>
              <div className="pp-flex pp-wrap pp-gap-3">
                <Link className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline" href="/become-expert">
                  Apply to join
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/experts">
                  See the network
                </Link>
              </div>
              <div className="pp-flex pp-wrap pp-gap-6" style={{ alignItems: 'center' }}>
                <div className="pp-avatars">
                  <span className="pp-avatar">MC</span>
                  <span className="pp-avatar">DO</span>
                  <span className="pp-avatar">SL</span>
                  <span className="pp-avatar">JT</span>
                  <span className="pp-avatar">RM</span>
                </div>
                <p className="pp-small">200+ vetted specialists across 34 countries</p>
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
                  <div className="pp-metric">
                    <p className="pp-metric-value">0%</p>
                    <p className="pp-label">Commission on your first project</p>
                  </div>
                  <div className="pp-metric">
                    <p className="pp-metric-value">48h</p>
                    <p className="pp-label">Median time to first qualified brief</p>
                  </div>
                  <div className="pp-metric">
                    <p className="pp-metric-value">34</p>
                    <p className="pp-label">Countries paid in local currency</p>
                  </div>
                  <div className="pp-metric">
                    <p className="pp-metric-value">4.9</p>
                    <p className="pp-label">Average expert satisfaction</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── How it works ────────────────────────────────────────── */}
        <section className="pp-section pp-band">
          <div className="pp-container pp-stack pp-gap-16">
            <Reveal className="pp-sec-split pp-soften">
              <div className="pp-sec-head">
                <p className="pp-label">How it works</p>
                <h2 className="pp-display pp-d3">Four steps from profile to paid.</h2>
              </div>
              <p className="pp-lede">
                You keep your rate and your clients. Proploy handles discovery, contracts and payments.
              </p>
            </Reveal>
            <div className="fe-steps">
              {STEPS.map((step, i) => (
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

        {/* ── Global reach ────────────────────────────────────────── */}
        <section className="pp-section pp-blueprint">
          <div className="pp-glow" style={{ bottom: -180, right: -100 }} />
          <div className="pp-container">
            <Reveal className="fe-reach">
              <div className="pp-stack pp-gap-6 pp-soften">
                <p className="pp-label">Global by default</p>
                <h2 className="pp-display pp-d3">Work with teams in 34 countries.</h2>
                <p className="pp-lede">
                  Proploy handles contracts, compliance and cross-border payouts, so a rollout in another market is the
                  same amount of admin as one at home.
                </p>
                <ul className="pp-stack pp-gap-3">
                  {REACH_POINTS.map((point) => (
                    <li key={point} className="pp-flex pp-gap-3" style={{ alignItems: 'flex-start' }}>
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
                      <span className="pp-body">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <FeDots />
            </Reveal>
          </div>
        </section>

        {/* ── Values ──────────────────────────────────────────────── */}
        <section className="pp-section pp-band">
          <div className="pp-container pp-stack pp-gap-16">
            <Reveal className="pp-sec-split pp-soften">
              <div className="pp-sec-head">
                <p className="pp-label">What we stand for</p>
                <h2 className="pp-display pp-d3">Built with experts, not around them.</h2>
              </div>
              <p className="pp-lede">
                The network only works if the specialists in it get better work on better terms than they&apos;d find
                alone.
              </p>
            </Reveal>
            <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-6)' }}>
              {VALUES.map((value, i) => (
                <Reveal key={value.title} delay={i * 90}>
                  <div
                    className="pp-card pp-lift"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--sp-10)',
                      minHeight: 268,
                      height: '100%',
                    }}
                  >
                    <span className="pp-ico pp-ico--lg">
                      <svg
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {value.icon}
                      </svg>
                    </span>
                    <div className="pp-stack pp-gap-3" style={{ marginTop: 'auto' }}>
                      <p className="pp-h6">{value.title}</p>
                      <p className="pp-body">{value.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team scroller ───────────────────────────────────────── */}
        <section className="pp-section">
          <MemberScroller />
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────── */}
        <section className="pp-section pp-band-deep">
          <div className="pp-container">
            <Reveal>
              <div className="pp-sec-split" style={{ alignItems: 'start', gap: 'var(--sp-16)' }}>
                <div className="pp-stack pp-gap-8">
                  <div className="pp-sec-head">
                    <p className="pp-label">FAQs</p>
                    <h2 className="pp-display pp-d3">Questions experts ask first.</h2>
                    <p className="pp-lede">Everything about joining, pricing and how work reaches you.</p>
                  </div>
                  <FaqAccordion />
                </div>

                <div className="pp-card pp-card--panel pp-stack pp-gap-6">
                  <span className="pp-ico pp-ico--lg">
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1.3-4.3A8 8 0 0 1 13 4a8 8 0 0 1 8 8Z" />
                    </svg>
                  </span>
                  <div className="pp-stack pp-gap-3">
                    <p className="pp-h5">Still have a question?</p>
                    <p className="pp-body">
                      Talk to the network team before you apply. We&apos;ll tell you honestly whether there&apos;s
                      demand for your specialism right now.
                    </p>
                  </div>
                  <ContactForm />
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
                  <h2 className="pp-display pp-d3">Apply once. Get briefs that fit.</h2>
                  <p className="pp-lede">
                    Join 200+ vetted specialists getting matched with businesses that already know what they&apos;re
                    deploying.
                  </p>
                </div>
                <div className="pp-stack pp-gap-3">
                  <Link className="pp-btn pp-btn--cobalt pp-btn--pill" href="/become-expert">
                    Apply to join
                  </Link>
                  <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/experts">
                    See the network
                  </Link>
                  <p className="pp-small">0% commission on your first matched project.</p>
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
