import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

export const metadata: Metadata = {
  title: 'Referrals — Proploy',
  description:
    'Know a team that needs software, or an expert who should be on the network? Refer them to Proploy and share in the outcome when the match lands.',
}

const STEPS = [
  {
    num: 'Step 01',
    lit: true,
    title: 'Grab your link',
    body: 'Every Proploy account comes with a personal referral link — one for businesses, one for experts. Find it in your account settings.',
  },
  {
    num: 'Step 02',
    lit: true,
    title: 'Send it to the right person',
    body: 'A team drowning in a software decision, or an implementer whose calendar deserves better briefs. You know who they are.',
  },
  {
    num: 'Step 03',
    lit: false,
    title: 'They match and engage',
    body: 'Your referral signs up through your link. When a business completes its first engagement — or an expert passes vetting and delivers one — the referral qualifies.',
  },
  {
    num: 'Step 04',
    lit: false,
    title: 'You both get credited',
    body: 'You and your referral each receive a credit toward platform fees. Credits stack — there is no cap on how many people you can refer.',
  },
]

const REWARDS = [
  {
    audience: 'Refer a business',
    value: '$250',
    detail: 'in platform-fee credit for each referred business that completes its first expert engagement — and they get $250 off theirs.',
  },
  {
    audience: 'Refer an expert',
    value: '$250',
    detail: 'in fee credit when a referred expert passes vetting and completes a first matched engagement — and their first project stays commission-free.',
  },
]

const FAIR_PLAY = [
  'Credits apply to Proploy platform fees and never expire while your account is active.',
  'Self-referrals and duplicate accounts do not qualify.',
  'Referral terms are illustrative of the program design and may be updated; the in-app referral page always shows the current terms.',
]

export default function ReferPage() {
  return (
    <main className="pp-page">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -120, right: -60 }} />
        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <p className="pp-label">Referral program</p>
            <div className="pp-sec-split" style={{ alignItems: 'start' }}>
              <h1 className="pp-display pp-d1">
                Good matches
                <br />
                deserve a
                <br />
                finder&apos;s fee.
              </h1>
              <p className="pp-lede">
                Know a team stuck choosing software, or an implementer the network should have? Refer them — when the
                match lands, you both share in it.
              </p>
            </div>
            <div className="pp-flex pp-wrap pp-gap-3">
              <Link className="pp-btn pp-btn--primary pp-btn--pill pp-btn--inline" href="/sign-up">
                Get your referral link
              </Link>
              <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/faqs">
                Read the FAQs
              </Link>
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
              <h2 className="pp-display pp-d3">Four steps, two happy sides.</h2>
            </div>
            <p className="pp-lede">
              The program mirrors the marketplace: rewards land when real engagements complete, not when forms get
              filled.
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

      {/* ── Rewards ─────────────────────────────────────────────── */}
      <section className="pp-section pp-blueprint">
        <div className="pp-glow" style={{ bottom: -160, left: -100 }} />
        <div className="pp-container pp-stack pp-gap-12">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">The reward</p>
              <h2 className="pp-display pp-d3">Both sides of the match get paid.</h2>
            </div>
            <p className="pp-lede">Every reward is double-sided — your referral always gets something too.</p>
          </Reveal>

          <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-6)' }}>
            {REWARDS.map((r, i) => (
              <Reveal key={r.audience} delay={i * 90}>
                <div className="pp-card pp-card--panel pp-lift pp-stack pp-gap-5" style={{ height: '100%' }}>
                  <p className="pp-label">{r.audience}</p>
                  <div className="pp-stat-row">
                    <p className="pp-metric-value" style={{ fontSize: 56 }}>
                      {r.value}
                    </p>
                    <p className="pp-label">per qualified referral</p>
                  </div>
                  <p className="pp-body">{r.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="pp-card pp-card--flat pp-stack pp-gap-4">
              <p className="pp-label">Fair play</p>
              <ul className="pp-stack pp-gap-3">
                {FAIR_PLAY.map((rule) => (
                  <li key={rule} className="pp-flex pp-gap-3" style={{ alignItems: 'flex-start' }}>
                    <span className="pp-yes" style={{ flexShrink: 0, marginTop: 2 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <path d="m5 13 4 4 10-10" />
                      </svg>
                    </span>
                    <span className="pp-body">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Who to refer ────────────────────────────────────────── */}
      <section className="pp-section pp-band-deep">
        <div className="pp-container">
          <Reveal>
            <div className="pp-card pp-card--panel pp-sec-split" style={{ alignItems: 'center' }}>
              <div className="pp-stack pp-gap-4">
                <p className="pp-label">Who to think of</p>
                <h2 className="pp-display pp-d4">The best referrals are the ones already complaining.</h2>
                <p className="pp-body" style={{ maxWidth: '58ch' }}>
                  The founder six months into a CRM evaluation. The ops lead whose rollout stalled at data migration.
                  The consultant whose pipeline is all cold outreach. They&apos;re one link away from a better setup.
                </p>
              </div>
              <div className="pp-flex pp-wrap pp-gap-3">
                <span className="pp-tag pp-tag--cobalt pp-tag--dot">Founders mid-evaluation</span>
                <span className="pp-tag pp-tag--cobalt pp-tag--dot">Ops &amp; procurement leads</span>
                <span className="pp-tag pp-tag--cobalt pp-tag--dot">Independent implementers</span>
                <span className="pp-tag pp-tag--cobalt pp-tag--dot">Boutique consultancies</span>
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
                <p className="pp-label">Start referring</p>
                <h2 className="pp-display pp-d3">Your link is one sign-up away.</h2>
                <p className="pp-lede">
                  Create a free account, grab your referral link from settings, and send it to the person you thought
                  of while reading this page.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill" href="/sign-up">
                  Create free account
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/become-expert">
                  Refer yourself as an expert
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
