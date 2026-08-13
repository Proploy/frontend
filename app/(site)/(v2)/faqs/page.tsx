import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

import { FaqAccordion, type FaqItem } from './FaqAccordion'

export const metadata: Metadata = {
  title: 'FAQs — Proploy',
  description:
    'Everything businesses and experts ask about Proploy — matching, vetting, pricing, payments, trust and security.',
}

interface FaqSection {
  id: string
  label: string
  title: string
  lede: string
  items: FaqItem[]
}

const SECTIONS: FaqSection[] = [
  {
    id: 'businesses',
    label: 'For businesses',
    title: 'Finding software and experts.',
    lede: 'How briefs, shortlists and matching work when you are the one buying.',
    items: [
      {
        q: 'What exactly does Proploy do?',
        a: 'Proploy is a marketplace that pairs curated business software with the vetted implementation experts who deploy it. You brief once — stage, stack, budget — and get a fit-scored shortlist of products, each with implementers who have shipped it before.',
      },
      {
        q: 'How is this different from a software review site?',
        a: 'Review sites end at the shortlist. Proploy attaches the person who takes the software live: every match includes vetted experts, standardised SOWs, milestone tracking and one workspace from first call to go-live.',
      },
      {
        q: 'What does it cost a business to use?',
        a: 'Browsing the catalogue, briefing the platform and your first expert consultation are free. When you engage an expert, their published rate applies plus a flat, published platform fee — no hidden markups on the quote.',
      },
      {
        q: 'How fast will I see matches?',
        a: 'Shortlists typically arrive within a few days of a complete brief. The Proploy agent — the chat bubble on every page — can produce a first pass in one conversation.',
      },
      {
        q: 'What if the rollout goes badly?',
        a: 'Funds sit in escrow and are released per approved milestone, so you never pay for work you have not accepted. If an engagement misses the mark, an escalation pathway and a money-back guarantee window apply.',
      },
    ],
  },
  {
    id: 'experts',
    label: 'For experts',
    title: 'Joining and working on the network.',
    lede: 'Vetting, briefs and how engagements actually run for implementers.',
    items: [
      {
        q: 'What does it take to get approved?',
        a: 'An intake interview, two client references and proof of at least one full implementation on a platform in the catalogue. Most applications are decided within a week.',
      },
      {
        q: 'How do briefs reach me?',
        a: 'Briefs are matched on platform expertise, sector history and delivery capacity — you see scope and budget before you respond. There is no bidding war and no lead-buying.',
      },
      {
        q: 'Do I have to give up my own clients?',
        a: 'No. There is no exclusivity clause. You can bring existing clients onto the platform for contracting and payments if useful, or keep them entirely outside it.',
      },
      {
        q: 'Can agencies join, or only individuals?',
        a: 'Both. Consultancy profiles list team capacity and named delivery leads, and the same vetting applies to whoever delivers the engagement.',
      },
      {
        q: 'How do I set my rate?',
        a: 'You set it, the client sees it. Proploy adds a flat, published platform fee and never takes a variable cut out of your quote after the fact.',
      },
    ],
  },
  {
    id: 'pricing',
    label: 'Pricing & payments',
    title: 'Money, milestones and invoices.',
    lede: 'How funds move through an engagement, for both sides.',
    items: [
      {
        q: 'How does milestone escrow work?',
        a: 'The business commits funds before kickoff. As each milestone is delivered and approved in the workspace, the corresponding payment is released to the expert. Neither side chases the other.',
      },
      {
        q: 'When do experts get paid?',
        a: 'On milestone approval, paid out in local currency across 34 countries, with FX shown before an engagement is accepted and tax documentation generated per jurisdiction.',
      },
      {
        q: 'Is there a fee to join or list?',
        a: 'No. Creating a business account, applying as an expert and listing in the catalogue are free. Proploy earns a flat platform fee per engagement — published before anyone signs.',
      },
      {
        q: 'Can invoicing go through one vendor?',
        a: 'Yes. Engagements can be invoiced centrally through Proploy, which is often simpler for procurement than onboarding each expert as a separate supplier.',
      },
      {
        q: 'What about scope changes mid-project?',
        a: 'Change requests are raised in the workspace against the SOW, priced by the expert and approved by the business before any new milestone is added. Nothing changes silently.',
      },
    ],
  },
  {
    id: 'trust',
    label: 'Trust & security',
    title: 'Vetting, data and accountability.',
    lede: 'What stands behind the badge, and what happens to your information.',
    items: [
      {
        q: 'How are experts vetted?',
        a: 'Every expert passes an intake interview, reference checks with past clients and a review of delivered implementations before the verified badge appears. Ratings from completed engagements are public.',
      },
      {
        q: 'Who owns the data in a rollout?',
        a: 'You do. Data ownership is stated in every standardised SOW: business data stays the business’s property, and experts’ access ends with the engagement.',
      },
      {
        q: 'How is my information protected on the platform?',
        a: 'Workspace documents and messages are encrypted in transit and at rest, and access is scoped per engagement — an expert only ever sees the projects they are matched to.',
      },
      {
        q: 'What happens if there is a dispute?',
        a: 'Escrow means money is never in limbo on one side. Disputes go to a named resolution owner at Proploy, working from the SOW and the milestone record in the workspace.',
      },
    ],
  },
]

export default function FaqsPage() {
  return (
    <main className="pp-page">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -140, left: -80 }} />
        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-6 pp-soften">
            <p className="pp-label">FAQs</p>
            <div className="pp-sec-split" style={{ alignItems: 'start' }}>
              <h1 className="pp-display pp-d1">
                Asked often.
                <br />
                Answered
                <br />
                honestly.
              </h1>
              <p className="pp-lede">
                Everything businesses and experts want to know before their first engagement — matching, money, trust
                and the fine print.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ sections ────────────────────────────────────────── */}
      {SECTIONS.map((section, i) => (
        <section key={section.id} className={i % 2 === 0 ? 'pp-section pp-band' : 'pp-section'}>
          <div className="pp-container">
            <Reveal>
              <div className="pp-sec-split" style={{ alignItems: 'start', gap: 'var(--sp-16)' }}>
                <div className="pp-stack pp-gap-8">
                  <div className="pp-sec-head">
                    <p className="pp-label">{section.label}</p>
                    <h2 className="pp-display pp-d3">{section.title}</h2>
                    <p className="pp-lede">{section.lede}</p>
                  </div>
                  <FaqAccordion items={section.items} defaultOpen={i === 0 ? 0 : null} />
                </div>
                <div className="pp-stack pp-gap-4" style={{ position: 'sticky', top: 'calc(var(--nav-h) + 24px)' }}>
                  <p className="pp-label">Section {String(i + 1).padStart(2, '0')} / 04</p>
                  <p className="pp-body">
                    {i === 0 && 'Ready to try it? Start with a free brief — or ask the Proploy agent directly.'}
                    {i === 1 && 'Sound like your kind of work? Applications are decided within a week.'}
                    {i === 2 && 'Every fee is published before anyone signs. No exceptions.'}
                    {i === 3 && 'The badge is earned through vetting, never bought.'}
                  </p>
                  {i === 0 && (
                    <Link className="pp-link-arrow" href="/for-businesses">
                      How Proploy works for businesses
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </Link>
                  )}
                  {i === 1 && (
                    <Link className="pp-link-arrow" href="/become-expert">
                      Apply to join the network
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </Link>
                  )}
                  {i === 2 && (
                    <Link className="pp-link-arrow" href="/hiring-calculator">
                      Try the hiring calculator
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </Link>
                  )}
                  {i === 3 && (
                    <Link className="pp-link-arrow" href="/experts">
                      Browse vetted experts
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      {/* ── Contact band (lighter close) ────────────────────────── */}
      <section className="pp-section pp-band-deep">
        <div className="pp-container">
          <Reveal>
            <div className="pp-card pp-card--panel pp-sec-split" style={{ alignItems: 'center' }}>
              <div className="pp-stack pp-gap-4">
                <p className="pp-label">Still stuck?</p>
                <h2 className="pp-display pp-d4">Ask a person, or ask the agent.</h2>
                <p className="pp-body" style={{ maxWidth: '56ch' }}>
                  The Proploy agent — the chat bubble on this page — answers most of these in one message. For anything
                  it can&apos;t, the team replies within a business day.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--primary pp-btn--pill" href="/contact">
                  Contact the team
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/proploy-agent">
                  Meet the Proploy agent
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
