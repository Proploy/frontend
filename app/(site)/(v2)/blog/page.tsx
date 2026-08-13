import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/site/Reveal'

export const metadata: Metadata = {
  title: 'Blog — Proploy',
  description:
    'Notes from the Proploy team and expert network on software buying, implementation and the marketplace itself.',
}

const FEATURED = {
  title: 'Why every software deal should ship with an implementer attached',
  excerpt:
    'The industry treats selection and deployment as separate purchases. That split is where most rollouts die. Here is the argument — and the data from a year of matched engagements — for buying them as one.',
  category: 'Perspective',
  date: 'Aug 6, 2026',
  read: '11 min read',
  author: 'Proploy Team',
  initials: 'PT',
}

const POSTS = [
  {
    title: 'What 500 briefs taught us about how teams actually buy software',
    excerpt: 'Budget is stated up front more often than you think — and stack constraints matter more than features.',
    category: 'Research',
    date: 'Jul 23, 2026',
    read: '9 min read',
    author: 'Insights desk',
    initials: 'ID',
  },
  {
    title: 'Inside expert vetting: what the interview actually covers',
    excerpt: 'Reference checks, a live scoping exercise, and one question that filters more than the rest combined.',
    category: 'Inside Proploy',
    date: 'Jul 9, 2026',
    read: '7 min read',
    author: 'Network team',
    initials: 'NT',
  },
  {
    title: 'The quiet rise of the fractional implementation lead',
    excerpt: 'More teams are hiring deployment expertise by the season, not the org chart. The numbers behind the shift.',
    category: 'Trends',
    date: 'Jun 25, 2026',
    read: '8 min read',
    author: 'Insights desk',
    initials: 'ID',
  },
  {
    title: 'Escrowed milestones, explained in one project',
    excerpt: 'A walkthrough of how funds, approvals and delivery checkpoints move through a real engagement.',
    category: 'Product',
    date: 'Jun 11, 2026',
    read: '6 min read',
    author: 'Product team',
    initials: 'PD',
  },
  {
    title: 'When the cheapest quote is the most expensive rollout',
    excerpt: 'Three anonymised engagements where the low bid lost — and what the pricing signal actually predicted.',
    category: 'Perspective',
    date: 'May 28, 2026',
    read: '8 min read',
    author: 'Network team',
    initials: 'NT',
  },
  {
    title: 'Shipping the Proploy agent: lessons from our first AI feature',
    excerpt: 'What changed when the front door to the marketplace became a conversation instead of a search box.',
    category: 'Inside Proploy',
    date: 'May 14, 2026',
    read: '10 min read',
    author: 'Product team',
    initials: 'PD',
  },
]

export default function BlogPage() {
  return (
    <main className="pp-page">
      {/* ── Hero + featured ─────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -140, right: -80 }} />
        <div className="pp-container pp-stack pp-gap-12">
          <Reveal className="pp-stack pp-gap-5 pp-soften">
            <p className="pp-label">Blog</p>
            <h1 className="pp-display pp-d1">Notes from the marketplace.</h1>
            <p className="pp-lede" style={{ maxWidth: '58ch' }}>
              Research, opinions and build logs from the Proploy team and the expert network.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <article className="pp-card pp-card--panel pp-lift pp-sec-split" style={{ alignItems: 'center' }}>
              <div className="pp-stack pp-gap-4">
                <div className="pp-flex pp-wrap pp-gap-2" style={{ alignItems: 'center' }}>
                  <span className="pp-tag pp-tag--cobalt pp-tag--dot">Featured</span>
                  <span className="pp-tag">{FEATURED.category}</span>
                  <span className="pp-small">
                    {FEATURED.date} · {FEATURED.read}
                  </span>
                </div>
                <h2 className="pp-display pp-d4">{FEATURED.title}</h2>
                <p className="pp-body" style={{ maxWidth: '64ch' }}>
                  {FEATURED.excerpt}
                </p>
                <div className="pp-flex pp-gap-3" style={{ alignItems: 'center' }}>
                  <span className="pp-avatar">{FEATURED.initials}</span>
                  <span className="pp-small" style={{ color: 'var(--ink)' }}>
                    {FEATURED.author}
                  </span>
                </div>
              </div>
              <div className="pp-stack pp-gap-3">
                <span className="pp-link-arrow" aria-hidden>
                  Read the post
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      {/* ── Post grid ───────────────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container pp-stack pp-gap-12">
          <Reveal className="pp-sec-head pp-soften">
            <p className="pp-label">Latest</p>
            <h2 className="pp-display pp-d3">Recent posts.</h2>
          </Reveal>
          <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-6)' }}>
            {POSTS.map((post, i) => (
              <Reveal key={post.title} delay={(i % 3) * 80}>
                <article className="pp-card pp-lift pp-stack pp-gap-4" style={{ height: '100%' }}>
                  <div className="pp-flex pp-gap-2" style={{ alignItems: 'center' }}>
                    <span className="pp-tag pp-tag--cobalt">{post.category}</span>
                    <span className="pp-small" style={{ marginLeft: 'auto' }}>
                      {post.read}
                    </span>
                  </div>
                  <div className="pp-stack pp-gap-3" style={{ flex: 1 }}>
                    <h3 className="pp-h5">{post.title}</h3>
                    <p className="pp-body">{post.excerpt}</p>
                  </div>
                  <hr className="pp-rule" />
                  <div className="pp-flex pp-gap-3" style={{ alignItems: 'center' }}>
                    <span className="pp-avatar">{post.initials}</span>
                    <div className="pp-stack">
                      <span className="pp-small" style={{ color: 'var(--ink)' }}>
                        {post.author}
                      </span>
                      <span className="pp-small">{post.date}</span>
                    </div>
                  </div>
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
                <p className="pp-label">Read less, ship more</p>
                <h2 className="pp-display pp-d3">The posts are about rollouts. Yours could be next.</h2>
                <p className="pp-lede">
                  Brief Proploy once and get matched with software and a vetted expert — first consultation free.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill" href="/sign-up">
                  Get started
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/guides">
                  Browse the guides
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
