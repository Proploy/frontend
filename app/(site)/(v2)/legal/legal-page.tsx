import type { ReactNode } from 'react'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

export interface LegalSection {
  id: string
  heading: string
  body: ReactNode
}

// Shared reading layout for /legal/terms, /legal/privacy and /legal/cookies.
// Not a route — imported by the three legal pages.
export function LegalPage({
  label = 'Legal',
  title,
  updated,
  intro,
  sections,
}: {
  label?: string
  title: string
  updated: string
  intro: ReactNode
  sections: LegalSection[]
}) {
  return (
    <main className="pp-page">
      {/* ── Compact hero ─────────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-16) var(--sp-12)' }}>
        <div className="pp-glow" style={{ top: -160, right: -100 }} />

        <div className="pp-container-prose">
          <Reveal className="pp-stack pp-gap-5 pp-soften">
            <p className="pp-label">{label}</p>
            <h1 className="pp-display pp-d2">{title}</h1>
            <p className="pp-small">Last updated: {updated}</p>
            <span className="pp-tag pp-tag--warning pp-tag--dot" style={{ alignSelf: 'flex-start' }}>
              Draft — pending legal review
            </span>
          </Reveal>
        </div>
      </section>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: 'var(--sp-4) var(--section-y-lg)' }}>
        <div className="pp-container-prose pp-stack pp-gap-12">
          <Reveal className="pp-stack pp-gap-6">
            <div className="pp-stack pp-gap-4">{intro}</div>

            {/* Simple table of contents */}
            <nav aria-label="Contents" className="pp-card pp-card--flat pp-stack pp-gap-3">
              <p className="pp-label">Contents</p>
              <ol className="pp-stack pp-gap-2" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {sections.map((s, i) => (
                  <li key={s.id} className="pp-flex pp-gap-3" style={{ alignItems: 'baseline' }}>
                    <span className="pp-label pp-mono-num" style={{ flexShrink: 0 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <a href={`#${s.id}`} className="pp-body" style={{ color: 'var(--color-brand-700)' }}>
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </Reveal>

          <div className="pp-stack pp-gap-12">
            {sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                className="pp-stack pp-gap-4"
                style={{ scrollMarginTop: 'calc(var(--nav-h) + 24px)' }}
              >
                <h2 className="pp-display pp-d4">
                  <span className="pp-accent pp-mono-num" style={{ marginRight: 'var(--sp-3)', fontSize: '.72em' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {s.heading}
                </h2>
                <div className="pp-stack pp-gap-4">{s.body}</div>
              </section>
            ))}
          </div>

          <hr className="pp-rule" />

          <p className="pp-small">
            Questions about this document? Reach us via the <Link href="/contact">contact page</Link>{' '}
            or at <a href="mailto:legal@proploy.com">legal@proploy.com</a>. See also our other{' '}
            <Link href="/legal/terms">Terms</Link>, <Link href="/legal/privacy">Privacy</Link> and{' '}
            <Link href="/legal/cookies">Cookie</Link> policies.
          </p>
        </div>
      </section>
    </main>
  )
}
