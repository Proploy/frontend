'use client'

/**
 * Shared template for the footer-linked expert category directories
 * (/experts/top, /experts/engineering, …). Each route's page.tsx is a thin
 * server wrapper that exports metadata and renders this client component with
 * its category config.
 *
 * The pages are filtered views of the real expert directory: they fetch the
 * same approved-experts feed as /experts and client-filter by category
 * keywords (case-insensitive substring over platforms, industries, project
 * types, tags, and headline). "Top experts" skips the keyword filter and
 * surfaces the most experienced specialists instead.
 */

import { useMemo } from 'react'
import Link from 'next/link'
import { Reveal } from '@/components/site/Reveal'
import { useApprovedExperts } from '@/features/experts/use-approved-experts'
import { useCatalogProductMatches } from '@/features/catalog'
import type { ExpertListItem } from '@/features/experts/types'
import {
  ExpertCard,
  ExpertCardSkeleton,
  dedupe,
  expertPlatforms,
} from '@/components/experts/ExpertCardV2'

/* ── config ─────────────────────────────────────────────────── */

export type ExpertCategoryKeywords = {
  platforms?: string[]
  industries?: string[]
  projectTypes?: string[]
}

export type ExpertCategoryConfig = {
  /** Route slug under /experts/ — used to exclude self from the chip row. */
  slug: string
  /** Short lowercase noun for copy, e.g. "engineering" → "No engineering specialists match yet". */
  categoryLabel: string
  /** Mono eyebrow above the display title. */
  eyebrow: string
  /** Display title, one entry per line. */
  titleLines: string[]
  /** Lede paragraph; the live match count is prepended once results load. */
  lede: string
  /**
   * Category keywords, matched case-insensitively as substrings against each
   * expert's platforms, industry expertise, preferred project types, tags,
   * and headline. Omit (undefined) to skip keyword filtering entirely.
   */
  keywords?: ExpertCategoryKeywords
  /** 'experience' sorts by yearsExperience desc (used by /experts/top). */
  sort?: 'experience'
  /** Cap the number of cards shown (e.g. top 12 for /experts/top). */
  take?: number
}

// Footer-linked category directory (labels mirror components/site/Footer.tsx).
const EXPERT_CATEGORIES: { slug: string; label: string }[] = [
  { slug: 'top', label: 'Top experts' },
  { slug: 'engineering', label: 'Engineering' },
  { slug: 'data-ai', label: 'Data & AI' },
  { slug: 'product', label: 'Product' },
  { slug: 'marketing', label: 'Marketing ops' },
  { slug: 'finance-ops', label: 'Finance & ops' },
  { slug: 'consulting', label: 'Business consulting' },
]

/* ── matching ───────────────────────────────────────────────── */

function categoryKeywordList(keywords: ExpertCategoryKeywords | undefined): string[] {
  if (!keywords) return []
  return dedupe([
    ...(keywords.platforms ?? []),
    ...(keywords.industries ?? []),
    ...(keywords.projectTypes ?? []),
  ]).map((keyword) => keyword.toLowerCase())
}

function expertSearchText(expert: ExpertListItem): string {
  return [
    ...expertPlatforms(expert),
    ...(expert.industryExpertise ?? []),
    ...(expert.preferredProjectTypes ?? []),
    ...(expert.tags?.map((tag) => tag.tagValue) ?? []),
    expert.headline ?? '',
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function matchesCategory(expert: ExpertListItem, keywords: string[]): boolean {
  if (keywords.length === 0) return true
  const haystack = expertSearchText(expert)
  return keywords.some((keyword) => haystack.includes(keyword))
}

/* ── icons ──────────────────────────────────────────────────── */

function ArrowIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

/* ── template ───────────────────────────────────────────────── */

export function ExpertCategoryPage({ config }: { config: ExpertCategoryConfig }) {
  const { experts, loading, error, refetch } = useApprovedExperts({ limit: 50 })

  const keywords = useMemo(() => categoryKeywordList(config.keywords), [config.keywords])

  const matchedExperts = useMemo(() => {
    let matched = experts.filter((expert) => matchesCategory(expert, keywords))
    if (config.sort === 'experience') {
      matched = [...matched].sort((a, b) => (b.yearsExperience ?? 0) - (a.yearsExperience ?? 0))
    }
    if (config.take != null) {
      matched = matched.slice(0, config.take)
    }
    return matched
  }, [experts, keywords, config.sort, config.take])

  // Resolve the experts' platform labels to catalog products so cards can show
  // real product logos (capped to keep the keyword-search fan-out bounded).
  const platformQueries = useMemo(
    () => dedupe(matchedExperts.flatMap((expert) => expertPlatforms(expert))).slice(0, 24),
    [matchedExperts],
  )
  const { products: platformProducts } = useCatalogProductMatches(platformQueries)

  const count = matchedExperts.length
  const lede = loading || error
    ? config.lede
    : `${count} ${count === 1 ? 'specialist is' : 'specialists are'} live in the directory today. ${config.lede}`

  const otherCategories = EXPERT_CATEGORIES.filter((category) => category.slug !== config.slug)

  return (
    <main className="pp-page">
      {/* ── Category hero ───────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -160, right: -40 }} />

        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <div className="pp-stack pp-gap-6" style={{ maxWidth: 820 }}>
              <p className="pp-label">{config.eyebrow}</p>

              <h1 className="pp-display pp-d2">
                {config.titleLines.map((line, index) => (
                  <span key={line}>
                    {index > 0 && <br />}
                    {line}
                  </span>
                ))}
              </h1>

              <p className="pp-lede" style={{ maxWidth: '56ch' }}>{lede}</p>
            </div>

            <div className="pp-flex pp-wrap pp-gap-2" aria-label="Browse other expert categories">
              <Link href="/experts" className="pp-chip">
                All experts
              </Link>
              {otherCategories.map((category) => (
                <Link key={category.slug} href={`/experts/${category.slug}`} className="pp-chip">
                  {category.label}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <hr className="pp-rule" />

      {/* ── Category directory ──────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container-app pp-stack pp-gap-12">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Expert directory</p>
              <h2 className="pp-display pp-d3">Execution is the deliverable.</h2>
            </div>
            <p className="pp-lede">
              Every specialist is interviewed, reference-checked and graded against the playbook
              for the software they implement.
            </p>
          </Reveal>

          {loading ? (
            <div className="xp-grid" role="status" aria-busy="true">
              {Array.from({ length: 4 }).map((_, i) => (
                <ExpertCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="pp-stack pp-gap-4" style={{ alignItems: 'center', paddingBlock: 'var(--sp-16)', textAlign: 'center' }}>
              <p className="pp-lede">We couldn&apos;t load approved experts right now.</p>
              <p className="pp-small">{error.error.message}</p>
              <button type="button" onClick={refetch} className="pp-btn pp-btn--cobalt pp-btn--inline">
                Try again
              </button>
            </div>
          ) : matchedExperts.length === 0 ? (
            <div className="pp-stack pp-gap-4" style={{ alignItems: 'center', paddingBlock: 'var(--sp-16)', textAlign: 'center' }}>
              <p className="pp-lede">No {config.categoryLabel} specialists match yet.</p>
              <p className="pp-body">
                New experts join the network every week — browse the full directory in the meantime.
              </p>
              <Link href="/experts" className="pp-btn pp-btn--cobalt pp-btn--inline">
                Browse all experts
                <ArrowIcon />
              </Link>
            </div>
          ) : (
            <div className="xp-grid">
              {matchedExperts.map((expert, index) => (
                <ExpertCard key={expert.id} expert={expert} index={index} catalogProducts={platformProducts} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Closing CTA ─────────────────────────────────────── */}
      <section style={{ paddingBlock: '0 var(--section-y)' }}>
        <div className="pp-container-app">
          <Reveal className="pp-dark">
            <div className="pp-sec-split" style={{ alignItems: 'center', gap: 'var(--sp-16)' }}>
              <div className="pp-stack pp-gap-5">
                <p className="pp-label">Get started</p>
                <h2 className="pp-display pp-d3">Brief once. Meet the specialist who ships it.</h2>
                <p className="pp-lede">
                  Describe the rollout in plain language and Proploy returns a shortlist of vetted
                  experts scored on fit — or join the network and get matched to work like this.
                </p>
              </div>

              <div className="pp-flex pp-wrap pp-gap-3">
                <Link href="/experts" className="pp-btn pp-btn--cobalt pp-btn--inline">
                  Browse all experts
                  <ArrowIcon />
                </Link>
                <Link href="/become-expert" className="pp-btn pp-btn--secondary pp-btn--inline">
                  Join as an expert
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
