import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

export const metadata: Metadata = {
  title: 'Careers — Proploy',
  description:
    'Join the team closing the execution gap in software. Openings across engineering, expert operations and growth at Proploy.',
}

const CULTURE = [
  {
    title: 'Marketplace-minded',
    body: 'Every feature serves three sides at once — buyers, experts and vendors. You will learn to think in flywheels, not funnels.',
  },
  {
    title: 'Operator energy',
    body: 'We ship weekly, write short memos instead of holding long meetings, and treat a customer rollout the way experts treat theirs: milestone by milestone.',
  },
  {
    title: 'Default to ownership',
    body: 'Small team, whole-line responsibility. If you spot the gap, you own the fix — with the context and authority to see it through.',
  },
]

const HOW_WE_WORK = [
  {
    num: '01',
    title: 'Written first',
    body: 'Decisions start as one-page briefs anyone can read and challenge. Context lives in documents, not hallways.',
  },
  {
    num: '02',
    title: 'Close to the work',
    body: 'Everyone — engineers included — sits in on expert interviews and customer kickoffs. The roadmap comes from real engagements.',
  },
  {
    num: '03',
    title: 'Sustainable pace',
    body: 'Marathon, not heroics. Focused sprints, real weekends, and an on-call rotation designed to be boring.',
  },
  {
    num: '04',
    title: 'Feedback in the open',
    body: 'Demos every Friday, retros without blame, and praise in public. Progress is visible so trust is cheap.',
  },
]

// Illustrative openings — the live list is confirmed by the team over email.
const ROLES: { title: string; team: string; location: string; type: string }[] = [
  { title: 'Founding Engineer', team: 'Engineering', location: 'Remote / Hybrid', type: 'Full-time' },
  { title: 'Expert Operations Lead', team: 'Marketplace', location: 'Remote', type: 'Full-time' },
  { title: 'Growth Marketer', team: 'Growth', location: 'Remote', type: 'Full-time' },
  { title: 'Product Designer', team: 'Product', location: 'Remote / Hybrid', type: 'Contract-to-hire' },
]

export default function CareersPage() {
  return (
    <main className="pp-page">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -120, right: -60 }} />

        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <p className="pp-label">Careers</p>

            <div className="pp-sec-split" style={{ alignItems: 'start' }}>
              <h1 className="pp-display pp-d1">
                Do the best
                <br />
                work of your
                <br />
                career here.
              </h1>

              <p className="pp-lede">
                We&rsquo;re a small team building the marketplace that makes software rollouts
                actually work. Early enough to shape everything; focused enough to ship weekly.
              </p>
            </div>

            <div className="pp-flex pp-wrap pp-gap-3">
              <a className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline" href="#open-roles">
                View open roles
              </a>
              <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/mission">
                Read our mission
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Culture ──────────────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Culture</p>
              <h2 className="pp-display pp-d3">What it feels like to work at Proploy.</h2>
            </div>

            <p className="pp-lede">
              Three things you&rsquo;ll notice in your first week — and still recognise in year three.
            </p>
          </Reveal>

          <div className="pp-grid pp-grid-3">
            {CULTURE.map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <div className="pp-card pp-card--panel pp-lift pp-stack pp-gap-4" style={{ height: '100%' }}>
                  <p className="pp-h5">{c.title}</p>
                  <p className="pp-body">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How we work ──────────────────────────────────────────── */}
      <section className="pp-section pp-blueprint">
        <div className="pp-glow" style={{ top: 80, left: -140 }} />

        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">How we work</p>
              <h2 className="pp-display pp-d3">Simple habits, deliberately kept.</h2>
            </div>

            <p className="pp-lede">
              Process should feel like guard rails, not paperwork. Ours fits on one screen.
            </p>
          </Reveal>

          <div className="fe-steps">
            {HOW_WE_WORK.map((step, i) => (
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

      {/* ── Open roles ───────────────────────────────────────────── */}
      <section id="open-roles" className="pp-section pp-band-deep" style={{ scrollMarginTop: 'var(--nav-h)' }}>
        <div className="pp-container pp-stack pp-gap-12">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Open roles</p>
              <h2 className="pp-display pp-d3">Come build the execution layer.</h2>
            </div>

            <p className="pp-lede">
              Illustrative openings — email us and we&rsquo;ll confirm what&rsquo;s live this month.
            </p>
          </Reveal>

          <Reveal>
            <div className="pp-card pp-card--panel" style={{ paddingBlock: 'var(--sp-2)' }}>
              {ROLES.map((role, i) => (
                <div
                  key={role.title}
                  className="pp-flex pp-wrap pp-gap-4"
                  style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBlock: 'var(--sp-5)',
                    borderTop: i === 0 ? 'none' : 'var(--bw) solid var(--line)',
                  }}
                >
                  <div className="pp-stack" style={{ gap: 4, minWidth: 220 }}>
                    <p className="pp-h6">{role.title}</p>
                    <p className="pp-small">{role.type}</p>
                  </div>

                  <div className="pp-flex pp-wrap pp-gap-2">
                    <span className="pp-tag pp-tag--cobalt">{role.team}</span>
                    <span className="pp-tag">{role.location}</span>
                  </div>

                  <a
                    className="pp-btn pp-btn--secondary pp-btn--sm pp-btn--pill pp-btn--inline"
                    href={`mailto:careers@proploy.com?subject=${encodeURIComponent(`Application — ${role.title}`)}`}
                  >
                    Apply
                  </a>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <p className="pp-small">
              Don&rsquo;t see your role? We keep a warm bench — introduce yourself at{' '}
              <a href="mailto:careers@proploy.com">careers@proploy.com</a> or via the{' '}
              <Link href="/contact">contact page</Link>.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────── */}
      <section className="pp-section">
        <div className="pp-container-app">
          <Reveal className="pp-dark">
            <div className="pp-stack pp-gap-8" style={{ maxWidth: 640 }}>
              <div className="pp-stack pp-gap-5">
                <p className="pp-label">One more thing</p>
                <h2 className="pp-display pp-d3">The best time to join a marketplace is before the flywheel spins.</h2>
                <p className="pp-lede">
                  Early team, real traction, and a problem every company on earth has felt.
                </p>
              </div>

              <div className="pp-flex pp-wrap pp-gap-3">
                <a
                  className="pp-btn pp-btn--cobalt pp-btn--pill pp-btn--inline"
                  href="mailto:careers@proploy.com"
                >
                  Introduce yourself
                </a>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/mission">
                  Why we exist
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
