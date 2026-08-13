import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

export const metadata: Metadata = {
  title: 'Mission — Proploy',
  description:
    'Proploy exists to close the execution gap in software — pairing every software decision with the vetted expert who makes it work.',
}

const PRINCIPLES = [
  {
    num: '01',
    title: 'Outcomes over transactions',
    body: 'A closed deal is not a finished job. We measure ourselves on working software in production — adopted by the team that bought it.',
  },
  {
    num: '02',
    title: 'Vetting is the product',
    body: 'Anyone can list a directory. Our value is the filter: every expert is interviewed, reference-checked and graded before they touch a client brief.',
  },
  {
    num: '03',
    title: 'One thread, no gaps',
    body: 'Discovery, contracting, delivery and payment live in a single workspace. When context never changes hands, nothing falls between calendars.',
  },
  {
    num: '04',
    title: 'Transparent economics',
    body: 'Buyers see real pricing. Experts see real scope. Nobody negotiates in the dark, and nobody pays for surprises.',
  },
  {
    num: '05',
    title: 'Sides of the same table',
    body: 'Businesses, experts and vendors only win together. We design incentives so the marketplace rewards the engagement that actually ships.',
  },
  {
    num: '06',
    title: 'Earn trust in public',
    body: 'Ratings, milestones and guarantees are visible on the platform. Accountability is a feature, not a support ticket.',
  },
]

const VALUES = [
  { label: 'Ship the boring thing', body: 'Reliable beats clever. The workspace exists so rollouts are predictable, not heroic.' },
  { label: 'Talk like an operator', body: 'We write briefs, SOWs and updates the way busy teams read them — short, concrete, decision-ready.' },
  { label: 'Hold the whole line', body: 'From first shortlist to day-90 adoption, the same team is on the hook. We do not hand off responsibility.' },
]

export default function MissionPage() {
  return (
    <main className="pp-page">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -140, right: -80 }} />

        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <p className="pp-label">Our mission</p>

            <h1 className="pp-display pp-d1" style={{ maxWidth: '16ch' }}>
              Close the gap between buying software and making it work.
            </h1>

            <p className="pp-lede" style={{ maxWidth: '58ch' }}>
              Every year teams pick great tools that never make it into daily use. Proploy pairs
              every software decision with a vetted expert who has shipped it before — so the
              purchase and the rollout are one motion, not two bets.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── The execution gap ────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Why we exist</p>
              <h2 className="pp-display pp-d3">Software buying is broken. Rollout is where it breaks.</h2>
            </div>

            <p className="pp-lede">
              The industry optimises the sale. Nobody owns what happens after the contract is signed.
            </p>
          </Reveal>

          <Reveal>
            <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-16)' }}>
              <div className="pp-stack pp-gap-4">
                <p className="pp-lede">
                  Review sites rank vendors by ad spend. Sales teams disappear after the signature.
                  And the person who actually has to configure, migrate and train — the
                  implementation expert — is found through cold outreach and luck, if at all.
                </p>
                <p className="pp-lede">
                  We call that space the execution gap: the distance between a signed software
                  contract and a team that genuinely uses the product. It is where budgets stall,
                  champions burn out and &ldquo;shelfware&rdquo; is born.
                </p>
                <p className="pp-lede">
                  Proploy was built to own that gap end to end. A marketplace where the shortlist,
                  the expert and the engagement — contracts, invoices, payments, milestones — live
                  in one accountable workspace.
                </p>
              </div>

              <div className="pp-card pp-card--panel pp-stack pp-gap-6">
                <p className="pp-label">What we&rsquo;re building toward</p>
                <p className="pp-h5">
                  A world where no team buys software without also securing the hands to deploy it.
                </p>
                <hr className="pp-rule" />
                <div className="pp-stack pp-gap-4">
                  <p className="pp-body">
                    For businesses: a shortlist tuned to your stack, and an expert who has done this
                    exact rollout before.
                  </p>
                  <p className="pp-body">
                    For experts: a pipeline of qualified briefs and the back office — contracts to
                    payouts — handled.
                  </p>
                  <p className="pp-body">
                    For vendors: customers who go live, adopt, and renew.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Principles ───────────────────────────────────────────── */}
      <section className="pp-section pp-blueprint">
        <div className="pp-glow" style={{ top: 60, left: -160 }} />

        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Principles</p>
              <h2 className="pp-display pp-d3">Six rules we run the marketplace by.</h2>
            </div>

            <p className="pp-lede">
              Written down so every product decision — and every engagement — can be checked against them.
            </p>
          </Reveal>

          <div className="pp-grid pp-grid-3">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.num} delay={(i % 3) * 80}>
                <div
                  className="pp-card pp-lift pp-stack pp-gap-6"
                  style={{ height: '100%', minHeight: 220 }}
                >
                  <span className="pp-tile pp-tile--soft pp-mono-num">{p.num}</span>
                  <div className="pp-stack" style={{ gap: 6, marginTop: 'auto' }}>
                    <p className="pp-h6">{p.title}</p>
                    <p className="pp-body">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team values band ─────────────────────────────────────── */}
      <section className="pp-section pp-band-deep">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-head pp-soften">
            <p className="pp-label">How the team works</p>
            <h2 className="pp-display pp-d3">Small team, whole-line ownership.</h2>
          </Reveal>

          <div className="pp-grid pp-grid-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.label} delay={i * 80}>
                <div
                  className="pp-stack pp-gap-4"
                  style={{
                    borderTop: 'var(--bw-thick) solid var(--line)',
                    paddingTop: 'var(--sp-6)',
                    height: '100%',
                  }}
                >
                  <p className="pp-label pp-accent pp-mono-num">{String(i + 1).padStart(2, '0')}</p>
                  <p className="pp-h6">{v.label}</p>
                  <p className="pp-body">{v.body}</p>
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
                <p className="pp-label">Join the mission</p>
                <h2 className="pp-display pp-d3">Help us close the execution gap.</h2>
                <p className="pp-lede">
                  Whether you buy software, deploy it, or build it — there&rsquo;s a seat at the
                  table.
                </p>
              </div>

              <div className="pp-flex pp-wrap pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill pp-btn--inline" href="/careers">
                  See open roles
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/contact">
                  Talk to us
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
