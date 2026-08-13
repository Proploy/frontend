import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

export const metadata: Metadata = {
  title: 'Discover experts — Proploy',
  description:
    'Browse vetted implementation experts, match on stack and sector, and compare shortlists side by side — before the first call.',
}

function Check() {
  return (
    <span className="pp-yes" style={{ flexShrink: 0 }}>
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

const VETTING_STAGES = [
  {
    num: '01',
    title: 'Application screen',
    body: 'Platform certifications, delivery history and sector focus checked against the catalogue before anyone reaches an interview.',
  },
  {
    num: '02',
    title: 'Structured interview',
    body: 'A working session on a real implementation scenario — scoping, migration risk, cutover planning — scored by a practice lead.',
  },
  {
    num: '03',
    title: 'Reference checks',
    body: 'Two named client references per specialist, verified by our team. What shipped, what slipped, and whether they would rehire.',
  },
  {
    num: '04',
    title: 'First-engagement review',
    body: 'The first Proploy engagement is monitored end to end. Miss the bar and the profile comes off the network.',
  },
]

const STACK_CHIPS = ['CRM', 'ERP', 'HRIS', 'Data & AI', 'Finance ops', 'Field service', 'Rev ops', 'Support']
const SECTOR_CHIPS = ['SaaS', 'Manufacturing', 'Healthcare', 'Logistics', 'Retail', 'Professional services']

const MATCH_SIGNALS = [
  { label: 'Platform depth', note: 'Certified builds on the exact product you shortlisted — not adjacent tools.' },
  { label: 'Sector history', note: 'Rollouts in your industry, with its data models and compliance quirks.' },
  { label: 'Team context', note: 'Company size, internal skills and timeline shape who gets proposed.' },
  { label: 'Availability', note: 'Only specialists who can start inside your window make the shortlist.' },
]

const SHORTLIST_ROWS: { label: string; values: [string, string, string] }[] = [
  { label: 'Fit score', values: ['96%', '91%', '88%'] },
  { label: 'Rate (day)', values: ['$780', '$820', '$690'] },
  { label: 'Deploys on record', values: ['23', '17', '31'] },
  { label: 'Sector match', values: ['Manufacturing', 'Manufacturing', 'Logistics'] },
  { label: 'Earliest start', values: ['This week', '2 weeks', 'This week'] },
  { label: 'Rating', values: ['4.9', '4.8', '4.9'] },
]

const NEXT_LINKS = [
  {
    href: '/post-a-job',
    title: 'Post a job',
    body: 'Brief once and let matched specialists come to you — scope, budget and timeline attached.',
  },
  {
    href: '/hiring-workspace',
    title: 'Hiring workspace',
    body: 'Shortlists, conversations and decision records in one place once candidates respond.',
  },
  {
    href: '/for-businesses',
    title: 'For businesses',
    body: 'The full picture: software discovery, expert matching and rollout in one workflow.',
  },
]

export default function DiscoverExpertsPage() {
  return (
    <main className="pp-page">
      {/* ── Hero — blueprint split with static match-console panel ── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -120, right: -60 }} />
        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <p className="pp-label">Discover experts</p>
            <div className="pp-sec-split" style={{ alignItems: 'start' }}>
              <div className="pp-stack pp-gap-8">
                <h1 className="pp-display pp-d1">
                  Browse the bench
                  <br />
                  before you book
                  <br />
                  the first call.
                </h1>
                <p className="pp-lede" style={{ maxWidth: '46ch' }}>
                  Every specialist on Proploy is interviewed, reference-checked and graded on real
                  implementations. Filter by stack and sector, then compare shortlists side by side.
                </p>
                <div className="pp-flex pp-wrap pp-gap-3">
                  <Link className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline" href="/experts">
                    Explore all experts
                  </Link>
                  <Link className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline" href="/sign-up">
                    Get matched
                  </Link>
                </div>
              </div>

              {/* static console mockup */}
              <div className="pp-glass" style={{ padding: 'var(--sp-5)' }}>
                <div className="pp-flex" style={{ alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--cobalt)' }} />
                  <span className="pp-label">Match preview</span>
                  <span className="pp-label" style={{ marginLeft: 'auto' }}>live</span>
                </div>
                <div className="pp-stack pp-gap-3">
                  {[
                    { name: 'Amara O.', role: 'ERP rollout lead', fit: '96%' },
                    { name: 'Daniel K.', role: 'CRM migration', fit: '91%' },
                    { name: 'Ines R.', role: 'Data platform', fit: '88%' },
                  ].map((m) => (
                    <div
                      key={m.name}
                      className="pp-flex"
                      style={{
                        alignItems: 'center',
                        gap: 'var(--sp-3)',
                        padding: 'var(--sp-3)',
                        border: '1px solid var(--line)',
                        borderRadius: 'var(--r-tile)',
                        background: '#fff',
                      }}
                    >
                      <span className="pp-avatar">{m.name.slice(0, 1)}</span>
                      <div style={{ minWidth: 0 }}>
                        <p className="pp-body" style={{ color: 'var(--ink)', fontWeight: 600 }}>
                          {m.name}
                        </p>
                        <p className="pp-small">{m.role}</p>
                      </div>
                      <span className="pp-mono-num" style={{ marginLeft: 'auto', color: 'var(--cobalt-deep)' }}>
                        {m.fit}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="pp-small" style={{ marginTop: 'var(--sp-4)' }}>
                  Scored on stack, sector and availability — not ad spend.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── The vetting bar — numbered stage grid ── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">The vetting bar</p>
              <h2 className="pp-display pp-d3">Roughly one in five applicants makes it in.</h2>
            </div>
            <p className="pp-lede">
              Vetting is the product. A smaller bench that has actually shipped beats an open directory
              every time.
            </p>
          </Reveal>

          <div className="pp-grid pp-grid-4" style={{ gap: 'var(--sp-6)' }}>
            {VETTING_STAGES.map((stage, i) => (
              <Reveal key={stage.num} delay={i * 90}>
                <div
                  className="pp-card pp-lift"
                  style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)', height: '100%', minHeight: 260 }}
                >
                  <span className="pp-tile pp-tile--soft pp-mono-num">{stage.num}</span>
                  <div className="pp-stack pp-gap-3" style={{ marginTop: 'auto' }}>
                    <p className="pp-h6">{stage.title}</p>
                    <p className="pp-body">{stage.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Matching by stack & sector ── */}
      <section className="pp-section pp-blueprint">
        <div className="pp-glow" style={{ bottom: -160, left: -120 }} />
        <div className="pp-container">
          <Reveal>
            <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-16)', alignItems: 'center' }}>
              <div className="pp-stack pp-gap-6 pp-soften">
                <p className="pp-label">Matching</p>
                <h2 className="pp-display pp-d3">Matched on stack and sector, not keywords.</h2>
                <p className="pp-lede">
                  Tell us what you&apos;re deploying and who you are. The match engine narrows 200+
                  specialists to the three or four who have shipped your exact combination before.
                </p>
                <div className="pp-stack pp-gap-3">
                  <p className="pp-label">By stack</p>
                  <div className="pp-flex pp-wrap pp-gap-2">
                    {STACK_CHIPS.map((c) => (
                      <span key={c} className="pp-tag">
                        {c}
                      </span>
                    ))}
                  </div>
                  <p className="pp-label" style={{ marginTop: 'var(--sp-2)' }}>
                    By sector
                  </p>
                  <div className="pp-flex pp-wrap pp-gap-2">
                    {SECTOR_CHIPS.map((c) => (
                      <span key={c} className="pp-tag pp-tag--cobalt">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pp-card pp-card--panel pp-stack pp-gap-5">
                <p className="pp-label">What the match engine weighs</p>
                <ul className="pp-stack pp-gap-4">
                  {MATCH_SIGNALS.map((s) => (
                    <li key={s.label} className="pp-flex pp-gap-3" style={{ alignItems: 'flex-start' }}>
                      <Check />
                      <span className="pp-body">
                        <b style={{ color: 'var(--ink)', fontWeight: 600 }}>{s.label}.</b> {s.note}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Compare shortlists — side-by-side table ── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Compare shortlists</p>
              <h2 className="pp-display pp-d3">Three candidates, one screen, zero guesswork.</h2>
            </div>
            <p className="pp-lede">
              Rates, delivery history and start dates line up side by side — so the decision meeting
              takes twenty minutes, not two weeks.
            </p>
          </Reveal>

          <Reveal>
            <div style={{ overflowX: 'auto' }}>
              <table className="fb-compare">
                <thead>
                  <tr>
                    <th />
                    <th>Daniel K.</th>
                    <th>Ines R.</th>
                    <th>Amara O.</th>
                  </tr>
                </thead>
                <tbody>
                  {SHORTLIST_ROWS.map((row) => (
                    <tr key={row.label}>
                      <td>{row.label}</td>
                      {row.values.map((v, i) => (
                        <td key={i}>{v}</td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td>Verified references</td>
                    <td>
                      <Check />
                    </td>
                    <td>
                      <Check />
                    </td>
                    <td>
                      <Check />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal>
            <p className="pp-small" style={{ maxWidth: '64ch' }}>
              Sample shortlist. Your comparison view is generated from your brief — the columns are the
              specialists matched to you, and every number is pulled from verified engagement history.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Where it goes next — cross-link cards ── */}
      <section className="pp-section">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-head pp-soften">
            <p className="pp-label">Next step</p>
            <h2 className="pp-display pp-d3">Shortlist made? Keep the momentum.</h2>
          </Reveal>
          <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-6)' }}>
            {NEXT_LINKS.map((l, i) => (
              <Reveal key={l.href} delay={i * 90}>
                <Link
                  href={l.href}
                  className="pp-card pp-lift"
                  style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-10)', height: '100%', color: 'inherit' }}
                >
                  <div className="pp-stack pp-gap-3">
                    <p className="pp-h6">{l.title}</p>
                    <p className="pp-body">{l.body}</p>
                  </div>
                  <span className="pp-link-arrow" style={{ marginTop: 'auto' }}>
                    Learn more
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="pp-section">
        <div className="pp-container-app">
          <Reveal className="pp-dark">
            <div className="pp-sec-split" style={{ alignItems: 'center', gap: 'var(--sp-16)' }}>
              <div className="pp-stack" style={{ gap: 'var(--sp-5)' }}>
                <p className="pp-label">Get started</p>
                <h2 className="pp-display pp-d3">Meet your shortlist this week.</h2>
                <p className="pp-lede">
                  Share your stack and sector once — we&apos;ll return three vetted specialists with a
                  free first consultation.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill" href="/sign-up">
                  Get matched
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/experts">
                  Browse experts first
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
