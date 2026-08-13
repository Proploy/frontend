import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

import { Calculator } from './Calculator'

export const metadata: Metadata = {
  title: 'Hiring calculator — Proploy',
  description:
    'Compare the annual cost of a full-time specialist hire against an on-demand Proploy implementation expert. Pick a role, region and weekly hours to see the math.',
}

const ASSUMPTIONS = [
  {
    title: 'Salary benchmarks',
    body: 'Base salaries are illustrative mid-market benchmarks per role, adjusted by a regional cost multiplier. Your market will vary.',
  },
  {
    title: '30% employment overhead',
    body: 'Benefits, payroll taxes, tooling, management time and amortised recruiting cost — a common planning rule of thumb, not a quote.',
  },
  {
    title: 'Project rates',
    body: 'Expert hourly rates are illustrative averages for vetted specialists on the platform, billed for 46 engaged weeks a year.',
  },
  {
    title: 'What it leaves out',
    body: 'Ramp-up time, attrition risk and re-hiring cost all favour on-demand experts — and none of them are in this math.',
  },
]

export default function HiringCalculatorPage() {
  return (
    <main className="pp-page">
      {/* ── Hero + calculator ───────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -140, left: -80 }} />
        <div className="pp-container pp-stack pp-gap-12">
          <Reveal className="pp-stack pp-gap-6 pp-soften pp-center">
            <div className="pp-stack pp-gap-5 pp-center pp-mx-auto" style={{ maxWidth: 720, alignItems: 'center' }}>
              <p className="pp-label">Hiring calculator</p>
              <h1 className="pp-display pp-d1">Hire full-time, or bring in an expert?</h1>
              <p className="pp-lede">
                Pick a specialty, a region and the hours you actually need. See what a full-time hire costs next to an
                on-demand Proploy expert — with the assumptions in the open.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <Calculator />
          </Reveal>
          <Reveal delay={160}>
            <p className="pp-small pp-center" style={{ maxWidth: 720, marginInline: 'auto' }}>
              All figures are illustrative planning estimates in USD, not quotes. Real expert rates are published on
              each profile before you engage.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Assumptions ─────────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-16">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">The math, honestly</p>
              <h2 className="pp-display pp-d3">Every assumption, on the table.</h2>
            </div>
            <p className="pp-lede">
              A calculator is only useful if you can argue with it. Here&apos;s exactly what&apos;s behind the numbers.
            </p>
          </Reveal>
          <div className="pp-grid pp-grid-4" style={{ gap: 'var(--sp-6)' }}>
            {ASSUMPTIONS.map((a, i) => (
              <Reveal key={a.title} delay={i * 80}>
                <div className="pp-card pp-lift pp-stack pp-gap-3" style={{ height: '100%' }}>
                  <p className="pp-h6">{a.title}</p>
                  <p className="pp-body">{a.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why on-demand ───────────────────────────────────────── */}
      <section className="pp-section">
        <div className="pp-container">
          <Reveal>
            <div className="pp-card pp-card--panel pp-sec-split" style={{ alignItems: 'center' }}>
              <div className="pp-stack pp-gap-5">
                <p className="pp-label">Beyond the spreadsheet</p>
                <h2 className="pp-display pp-d4">Implementation is a project, not a headcount.</h2>
                <p className="pp-body" style={{ maxWidth: '58ch' }}>
                  Most rollouts need deep expertise for a season, not a career. Proploy experts arrive having shipped
                  your exact platform before, work on escrowed milestones, and hand over cleanly when the job is done.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--primary pp-btn--pill" href="/experts">
                  Browse vetted experts
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/for-businesses">
                  How matching works
                </Link>
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
                <p className="pp-label">Run the real numbers</p>
                <h2 className="pp-display pp-d3">Get a scoped quote, not an estimate.</h2>
                <p className="pp-lede">
                  Brief Proploy once and get matched with an expert whose rate, availability and delivery plan are
                  visible before you commit.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill" href="/sign-up">
                  Get matched free
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/contact">
                  Talk to the team
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
