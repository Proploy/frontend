import Image from 'next/image'

import type { AuthPanelVariant } from './auth-panel-variant'

/**
 * The four left-hand brand panels for the auth flow.
 *
 * Each one is shaped around the question a user arriving from that route is
 * actually asking — "what happens after I log in?" for Sam, "what am I signing
 * up to receive?" for experts, "what is being withheld?" for the directory —
 * so the graphics differ per variant rather than being one layout with swapped
 * copy. Styling lives in the `.ap-*` block of `app/v2-pages.css`, alongside the
 * `.pp-dark` primitives these sit on.
 *
 * Server components: nothing here is interactive, so the panel renders in the
 * initial HTML with no hydration cost and no post-load swap.
 */

function Check({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}

function Logomark() {
  return <Image alt="Proploy" src="/proploy-logomark-white.png" width={44} height={44} />
}

function PanelHeading({
  eyebrow,
  headline,
  lede,
  size = 'd3',
}: {
  eyebrow: string
  headline: React.ReactNode
  lede: string
  size?: 'd2' | 'd3'
}) {
  return (
    <div className="pp-stack pp-gap-5">
      <p className="pp-label">{eyebrow}</p>
      <h1 className={`pp-display pp-${size}`}>{headline}</h1>
      <p className={size === 'd2' ? 'pp-lede' : 'ap-lede'}>{lede}</p>
    </div>
  )
}

/** Direct visits, password resets, email verification — no originating intent. */
function DefaultPanel() {
  const lines = [
    'Products scored against your stack and sector',
    'Specialists vetted before they ever see a brief',
    'Contracts, invoices and payments in one workspace',
  ]

  return (
    <div className="pp-stack pp-gap-12 ap-body">
      <Logomark />

      <PanelHeading
        size="d2"
        eyebrow="AI software marketplace"
        headline={
          <>
            Discover. Decide.
            <br />
            Deploy. Done.
          </>
        }
        lede="The marketplace that matches your business with the right software — and the vetted experts who make it work."
      />

      <ul className="pp-stack pp-gap-3">
        {lines.map((line) => (
          <li key={line} className="pp-flex pp-gap-3" style={{ alignItems: 'center' }}>
            <span className="pp-yes" aria-hidden="true">
              <Check />
            </span>
            <span className="pp-body">{line}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * `/AI_workspace`, `/workspace` — the graphic is the product itself: a
 * discovery exchange resolving into scored matches. Example data, and labelled
 * as a sample so it is never mistaken for the viewer's own session.
 */
function AskSamPanel() {
  const matches = [
    { name: 'ServiceTitan', score: 94 },
    { name: 'Jobber', score: 88 },
    { name: 'Housecall Pro', score: 81, dim: true },
  ]

  return (
    <div className="pp-stack pp-gap-10 ap-body">
      <Logomark />

      <PanelHeading
        eyebrow="Your AI procurement analyst"
        headline={
          <>
            Tell Sam the problem.
            <br />
            Get a shortlist.
          </>
        }
        lede="Sam asks the discovery questions, scores products against your stack and sector, and hands you a shortlist you can defend."
      />

      <figure className="ap-glass" aria-label="Sample Ask Sam discovery session">
        <figcaption className="ap-glass-head">
          <span className="ap-dot" aria-hidden="true" />
          <span>Ask Sam</span>
          <span style={{ marginLeft: 'auto' }}>Discovery</span>
        </figcaption>

        <div className="pp-stack pp-gap-4" style={{ padding: 'var(--sp-4)' }}>
          <p className="ap-bubble">
            We&apos;re a 45-person field-service team. Scheduling doesn&apos;t talk to accounting
            and techs lose work offline.
          </p>

          <div className="pp-stack pp-gap-3">
            {matches.map(({ name, score, dim }) => (
              <div key={name} className={`ap-score${dim ? ' is-dim' : ''}`}>
                <span className="ap-score-name">{name}</span>
                <span className="ap-score-num">{score}</span>
                <span className="ap-score-track">
                  <span className="ap-score-fill" style={{ width: `${score}%` }} />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="ap-glass-foot">
          <span>6 questions asked</span>
          <span>3 of 41 shortlisted</span>
        </div>
      </figure>
    </div>
  )
}

/**
 * `/become-expert` — a specialist at a login wall wants to know what they are
 * signing up to receive, so the graphic shows one already-qualified brief and
 * the four stages Proploy handles around it.
 */
function BecomeExpertPanel() {
  const rail = [
    { label: 'Vetted', done: true },
    { label: 'Matched', done: true },
    { label: 'Contracted', done: false },
    { label: 'Paid', done: false },
  ]

  return (
    <div className="pp-stack pp-gap-10 ap-body">
      <Logomark />

      <PanelHeading
        eyebrow="For specialists"
        headline={
          <>
            Briefs that are
            <br />
            already qualified.
          </>
        }
        lede="Scoped work from businesses that have already chosen their software. No bidding wars, no cold outreach."
      />

      <div className="ap-stack-wrap">
        {/* Two offset edges behind the open brief: a queue, not a one-off. */}
        <span className="ap-stack-ghost ap-stack-ghost--a" aria-hidden="true" />
        <span className="ap-stack-ghost ap-stack-ghost--b" aria-hidden="true" />

        <figure className="ap-glass ap-brief" aria-label="Sample expert brief">
          <figcaption className="ap-glass-head">
            <span className="ap-dot" aria-hidden="true" />
            <span>New brief</span>
            <span style={{ marginLeft: 'auto' }}>Matched to your stack</span>
          </figcaption>

          <div className="pp-stack pp-gap-4" style={{ padding: 'var(--sp-5)' }}>
            <div className="ap-brief-top">
              <h2 className="ap-brief-title">
                NetSuite → Xero migration
                <br />
                for a 60-seat wholesaler
              </h2>
              <span className="ap-brief-fee">$18,400</span>
            </div>

            <div className="ap-chips">
              <span className="ap-chip is-on">Scope agreed</span>
              <span className="ap-chip">6 weeks</span>
              <span className="ap-chip">Xero · NetSuite · Celigo</span>
            </div>

            <ol className="ap-rail">
              {rail.map(({ label, done }) => (
                <li key={label} className="ap-rail-step">
                  <span className={`ap-rail-node${done ? ' is-on' : ''}`} aria-hidden="true">
                    {done ? <Check size={9} /> : null}
                  </span>
                  <span className="ap-rail-label">{label}</span>
                </li>
              ))}
            </ol>
          </div>
        </figure>
      </div>
    </div>
  )
}

/**
 * `/experts`, `/experts/[id]` — the only variant where the user was stopped
 * mid-task, so the panel names what the login unlocks instead of pitching the
 * marketplace. The blurred figures are the honest form of that promise.
 *
 * The roster is decorative: initials and the sample profile are fictional, and
 * the count is deliberately static. A real expert's day rate does not belong on
 * a page anyone can load signed out, even blurred.
 */
function BrowseExpertsPanel() {
  const initials = ['MK', 'AR', 'JD', 'SO']
  const locked = [
    { term: 'Day rate', value: '$1,450' },
    { term: 'Available', value: 'Mar 4' },
    { term: 'Delivered', value: '31 projects' },
  ]

  return (
    <div className="pp-stack pp-gap-10 ap-body">
      <Logomark />

      <PanelHeading
        eyebrow="Vetted implementation partners"
        headline={
          <>
            See who actually
            <br />
            ships it.
          </>
        }
        lede="Verified track record, stack depth, rates and availability — full profiles open up the moment you're signed in."
      />

      <div className="pp-stack pp-gap-6">
        <div className="ap-roster" aria-hidden="true">
          {initials.map((mark) => (
            <span key={mark} className="ap-avatar">
              {mark}
              <span className="ap-verified">
                <Check size={9} />
              </span>
            </span>
          ))}
          <span className="ap-roster-more">
            <span className="ap-roster-count">+240</span>
            <span className="ap-roster-cap">Vetted specialists</span>
          </span>
        </div>

        <figure className="ap-glass ap-profile" aria-label="Sample expert profile, locked">
          <div className="ap-profile-top">
            <span className="ap-avatar ap-avatar--sm" aria-hidden="true">
              MK
            </span>
            <span>
              <span className="ap-profile-name">Mariam Kaur</span>
              <span className="ap-profile-role">
                NetSuite &amp; Celigo integration lead · 9 yrs
              </span>
            </span>
          </div>

          <div className="ap-locked">
            <dl className="ap-meta" aria-hidden="true">
              {locked.map(({ term, value }) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <span className="ap-lock-chip">
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              Visible after login
            </span>
          </div>
        </figure>
      </div>
    </div>
  )
}

const PANELS: Record<AuthPanelVariant, () => React.JSX.Element> = {
  'default': DefaultPanel,
  'ask-sam': AskSamPanel,
  'become-expert': BecomeExpertPanel,
  'browse-experts': BrowseExpertsPanel,
}

export function AuthPanel({ variant }: { variant: AuthPanelVariant }) {
  const Panel = PANELS[variant] ?? DefaultPanel
  return <Panel />
}
