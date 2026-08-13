import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

export const metadata: Metadata = {
  title: 'Partnerships — Proploy',
  description:
    'List your software, bring your agency, or build an integration. Three ways to partner with the Proploy marketplace.',
}

const PARTNER_TYPES = [
  {
    kind: 'Software vendors',
    title: 'List your product where buyers arrive briefed',
    body: 'Every buyer on Proploy comes with stage, stack and budget already structured. Your product is matched on fit — and every deal ships with a vetted implementer attached, so activation follows the sale.',
    points: ['Fit-scored placement, not pay-to-rank', 'Implementation experts trained on your product', 'Deal-level rollout visibility'],
    icon: (
      <>
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M3 9h18M8 21h8" />
      </>
    ),
  },
  {
    kind: 'Agencies & consultancies',
    title: 'Put your whole bench on the network',
    body: 'Consultancy profiles list team capacity and named leads. Qualified briefs arrive scored against your practice areas — with contracts, escrow and payouts handled in-platform.',
    points: ['Team profiles with named delivery leads', 'Standardised SOWs and milestone escrow', 'No exclusivity — your clients stay yours'],
    icon: (
      <>
        <path d="M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="3.5" />
        <path d="M21 20v-2a4 4 0 0 0-3-3.9M15.5 3.6a3.5 3.5 0 0 1 0 6.8" />
      </>
    ),
  },
  {
    kind: 'Integration partners',
    title: 'Build where the rollouts happen',
    body: 'Connect your platform to the Proploy workspace — milestones, documents, invoicing — so joint customers keep one thread from first brief to go-live.',
    points: ['Workspace and milestone APIs', 'Co-marketing with the catalogue team', 'Roadmap input from real deployments'],
    icon: (
      <>
        <path d="M9 6h6a4 4 0 0 1 0 8h-1" />
        <path d="M15 18H9a4 4 0 0 1 0-8h1" />
      </>
    ),
  },
]

const TIERS = [
  {
    name: 'Registered',
    blurb: 'Get listed and get matched.',
    featured: false,
    perks: ['Catalogue or network listing', 'Fit-based matching', 'Partner newsletter and events', 'Self-serve resources'],
  },
  {
    name: 'Certified',
    blurb: 'Vetted, badged and prioritised.',
    featured: true,
    perks: [
      'Everything in Registered',
      'Verified badge after vetting',
      'Priority placement in matches',
      'Dedicated partner manager',
      'Co-hosted webinars and guides',
    ],
  },
  {
    name: 'Strategic',
    blurb: 'Built into the platform itself.',
    featured: false,
    perks: ['Everything in Certified', 'Deep workspace integration', 'Joint go-to-market plans', 'Quarterly roadmap sessions'],
  },
]

export default function PartnershipsPage() {
  return (
    <main className="pp-page">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -120, left: -60 }} />
        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <p className="pp-label">Partnerships</p>
            <div className="pp-sec-split" style={{ alignItems: 'start' }}>
              <h1 className="pp-display pp-d1">
                Grow where
                <br />
                software meets
                <br />
                its experts.
              </h1>
              <p className="pp-lede">
                Vendors, agencies and integration builders all meet the same buyer on Proploy — one who arrives
                briefed, budgeted and ready to deploy.
              </p>
            </div>
            <div className="pp-flex pp-wrap pp-gap-3">
              <Link className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline" href="/contact">
                Talk to partnerships
              </Link>
              <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/products">
                See the catalogue
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Partner types ───────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Three ways in</p>
              <h2 className="pp-display pp-d3">Pick the seat that fits.</h2>
            </div>
            <p className="pp-lede">
              Each partnership track feeds the same flywheel: better matches, faster rollouts, happier joint customers.
            </p>
          </Reveal>
          <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-6)' }}>
            {PARTNER_TYPES.map((p, i) => (
              <Reveal key={p.kind} delay={i * 90}>
                <article className="pp-card pp-lift pp-stack pp-gap-5" style={{ height: '100%' }}>
                  <span className="pp-ico pp-ico--lg">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {p.icon}
                    </svg>
                  </span>
                  <div className="pp-stack pp-gap-3">
                    <p className="pp-label">{p.kind}</p>
                    <h3 className="pp-h5">{p.title}</h3>
                    <p className="pp-body">{p.body}</p>
                  </div>
                  <ul className="pp-stack pp-gap-3" style={{ marginTop: 'auto' }}>
                    {p.points.map((point) => (
                      <li key={point} className="pp-flex pp-gap-3" style={{ alignItems: 'flex-start' }}>
                        <span className="pp-yes" style={{ flexShrink: 0, marginTop: 2 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                            <path d="m5 13 4 4 10-10" />
                          </svg>
                        </span>
                        <span className="pp-body">{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tiers ───────────────────────────────────────────────── */}
      <section className="pp-section pp-blueprint">
        <div className="pp-glow" style={{ bottom: -160, right: -100 }} />
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Program tiers</p>
              <h2 className="pp-display pp-d3">Start listed. Grow embedded.</h2>
            </div>
            <p className="pp-lede">
              Tiers reflect depth of vetting and integration — not spend. Certification is earned, not bought.
            </p>
          </Reveal>
          <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-6)', alignItems: 'stretch' }}>
            {TIERS.map((tier, i) => (
              <Reveal key={tier.name} delay={i * 90}>
                <article
                  className="pp-card pp-card--panel pp-lift pp-stack pp-gap-5"
                  style={{
                    height: '100%',
                    ...(tier.featured
                      ? { borderColor: 'var(--cobalt)', borderWidth: 'var(--bw-thick)', boxShadow: 'var(--shadow-lift)' }
                      : {}),
                  }}
                >
                  <div className="pp-flex pp-gap-2" style={{ alignItems: 'center' }}>
                    <h3 className="pp-h5">{tier.name}</h3>
                    {tier.featured ? (
                      <span className="pp-tag pp-tag--cobalt" style={{ marginLeft: 'auto' }}>
                        Most partners
                      </span>
                    ) : null}
                  </div>
                  <p className="pp-body">{tier.blurb}</p>
                  <hr className="pp-rule" />
                  <ul className="pp-stack pp-gap-3" style={{ flex: 1 }}>
                    {tier.perks.map((perk) => (
                      <li key={perk} className="pp-flex pp-gap-3" style={{ alignItems: 'flex-start' }}>
                        <span className="pp-yes" style={{ flexShrink: 0, marginTop: 2 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                            <path d="m5 13 4 4 10-10" />
                          </svg>
                        </span>
                        <span className="pp-body">{perk}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    className={
                      tier.featured
                        ? 'pp-btn pp-btn--cobalt pp-btn--pill pp-btn--block'
                        : 'pp-btn pp-btn--secondary pp-btn--pill pp-btn--block'
                    }
                    href="/contact"
                  >
                    Apply for {tier.name}
                  </Link>
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
                <p className="pp-label">Let&apos;s talk</p>
                <h2 className="pp-display pp-d3">Tell us what you&apos;d bring to the network.</h2>
                <p className="pp-lede">
                  A product, a practice or a platform — the partnerships team replies within two business days.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill" href="/contact">
                  Contact partnerships
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/become-expert">
                  Join as an individual expert
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
