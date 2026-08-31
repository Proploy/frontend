'use client'

/**
 * Product detail page, v2 design system ("pd-*" / "pp-*" classes from
 * app/v2-pages.css). Layout ported from the design-system-extension artifact;
 * all content is driven by the real ProductPageModel + catalog/expert hooks.
 * Sections without published data (integrations, pricing plans, experts,
 * FAQs) are omitted rather than filled with sample copy.
 */

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState, type MouseEvent, type ReactNode } from 'react'
import { AuthRequiredLink } from '@/components/auth/AuthRequiredLink'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CatalogImage } from '@/components/catalog/CatalogImage'
import FavoriteToggle from '@/components/personalization/FavoriteToggle'
import { ProductMediaVideo } from '@/components/product/ProductMediaVideo'
import { buildComparisonAdditions } from '@/components/product/product-detail-comparison'
import { Reveal } from '@/components/site/Reveal'
import { Skeleton } from '@/components/ui/Skeleton'
import {
  getMediaAutoplayDuration,
  getProductDetailHref,
  getProductGalleryMedia,
  isUnpublishedValue,
  useProductAlternatives,
  type ProductAlternative,
  type ProductMediaPreview,
  type ProductPageModel,
  type PricingTier,
} from '@/features/catalog'
import {
  MAX_COMPARE,
  useCompareSelection,
  type SelectedProduct,
} from '@/features/compare/selection-store'
import { useApprovedExperts } from '@/features/experts'
import { resolveExpertPublicResourceUrl } from '@/features/experts/public-resource'
import { useRecentlyViewed } from '@/features/users'

const SECTION_SCROLL_STYLE = { scrollMarginTop: 140 } as const

function scrollToSection(id: string, setActive: (id: string) => void) {
  setActive(id)
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

interface ProductDetailV2Props {
  product: ProductPageModel
  mediaError: boolean
  onRetryMedia: () => void
}

export default function ProductDetailV2({ product, mediaError, onRetryMedia }: ProductDetailV2Props) {
  const gallery = getProductGalleryMedia(product.media)
  const rotatingHeroMedia = gallery
  const [heroMediaIndex, setHeroMediaIndex] = useState(0)
  const heroShot = rotatingHeroMedia.length > 0
    ? rotatingHeroMedia[heroMediaIndex % rotatingHeroMedia.length]
    : gallery[0] ?? null
  const [dialogIndex, setDialogIndex] = useState<number | null>(null)

  // Hold duration per media type. Images advance on a fixed 5s timer, GIFs get
  // a longer fixed hold (8s) since they loop on their own, and videos drive
  // their own advance via the `ended` event (no timer for videos).
  const advanceHero = useCallback(() => {
    if (rotatingHeroMedia.length < 2) return
    setHeroMediaIndex((current) => (current + 1) % rotatingHeroMedia.length)
  }, [rotatingHeroMedia.length])

  useEffect(() => {
    if (rotatingHeroMedia.length < 2 || dialogIndex !== null) return
    const current = rotatingHeroMedia[heroMediaIndex % rotatingHeroMedia.length]
    if (!current || current.type === 'video') return

    const timer = window.setTimeout(advanceHero, getMediaAutoplayDuration(current.type))
    return () => window.clearTimeout(timer)
  }, [heroMediaIndex, dialogIndex, rotatingHeroMedia, advanceHero])

  const { experts, loading: expertsLoading } = useApprovedExperts({
    platform: product.product_name,
    limit: 8,
  })
  const {
    alternatives,
    loading: alternativesLoading,
    error: alternativesError,
    refetch: refetchAlternatives,
  } = useProductAlternatives({ productId: product.product_id, limit: 6 })
  const { addMany, count: comparisonCount, isSelected } = useCompareSelection()
  const { track: trackRecentlyViewed } = useRecentlyViewed()

  const currentComparisonProduct = useMemo<SelectedProduct>(() => ({
    product_id: product.product_id,
    product_name: product.product_name,
    product_logo: product.product_logo,
  }), [product.product_id, product.product_logo, product.product_name])

  useEffect(() => {
    void trackRecentlyViewed(product.product_id, 'product')
  }, [product.product_id, trackRecentlyViewed])

  const hasFeatures = product.core_features.length > 0 || product.compliance_labels.length > 0
  const hasIntegrations = product.integration_labels.length > 0
  const hasPricing =
    product.pricing_plans.length > 0 ||
    product.pricing_bucket !== null ||
    product.free_plan ||
    product.free_trial
  const showExperts = expertsLoading || experts.length > 0

  const sections = useMemo(() => {
    const list: { id: string; label: string }[] = [{ id: 'overview', label: 'Overview' }]
    if (hasFeatures) list.push({ id: 'features', label: 'Features' })
    if (hasIntegrations) list.push({ id: 'integrations', label: 'Integrations' })
    if (hasPricing) list.push({ id: 'pricing', label: 'Pricing' })
    if (showExperts) list.push({ id: 'experts', label: 'Experts' })
    return list
  }, [hasFeatures, hasIntegrations, hasPricing, showExperts])

  const [activeSection, setActiveSection] = useState('overview')
  const sectionIdsKey = sections.map((section) => section.id).join(',')

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-145px 0px -55% 0px', threshold: 0 },
    )
    sectionIdsKey.split(',').forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [sectionIdsKey])

  const onAnchorClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault()
    scrollToSection(id, setActiveSection)
  }

  // ── hero derivations ──────────────────────────────────────────────────────
  const categoryLabel = product.primary_category ? formatLabel(product.primary_category) : null

  const heroTags: { label: string; dot?: boolean }[] = []
  if (categoryLabel) heroTags.push({ label: categoryLabel, dot: true })
  product.target_segments.slice(0, 2).forEach((segment) => heroTags.push({ label: formatLabel(segment) }))
  if (product.free_trial) heroTags.push({ label: 'Free trial' })
  if (product.free_plan) heroTags.push({ label: 'Free plan' })

  const stats: { value: string; label: string }[] = []
  if (product.avg_rating !== null) stats.push({ value: product.avg_rating.toFixed(1), label: 'Avg rating' })
  if (product.integration_labels.length > 0) {
    stats.push({ value: String(product.integration_labels.length), label: 'Integrations' })
  }
  if (product.core_features.length > 0) {
    stats.push({ value: String(product.core_features.length), label: 'Core features' })
  }
  if (!expertsLoading && experts.length > 0) {
    stats.push({ value: String(experts.length), label: 'Matched experts' })
  }
  const heroStats = stats.slice(0, 4)

  const fromPlan = [...product.pricing_plans]
    .filter((plan) => plan.price_value !== null && plan.price_value > 0 && plan.price_text)
    .sort((a, b) => (a.price_value ?? 0) - (b.price_value ?? 0))[0] ?? null
  const pricingSourceUrl = product.pricing_plans.find((plan) => plan.source_url)?.source_url ?? null

  const expertCtaHref = experts.length > 0 ? '#experts' : '/experts'

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="pd-hero">
        <div className="pp-container-app">
          <div className="pd-hero-grid">
            <div className="pp-stack pp-gap-6">
              <nav className="pp-flex pp-gap-2 pp-small" aria-label="Breadcrumb" style={{ alignItems: 'center' }}>
                <Link href="/products" style={{ color: 'rgba(255,255,255,.7)' }}>Products</Link>
                {categoryLabel && (
                  <>
                    <span style={{ color: 'rgba(255,255,255,.4)' }}>/</span>
                    <span>{categoryLabel}</span>
                  </>
                )}
                <span style={{ color: 'rgba(255,255,255,.4)' }}>/</span>
                <span>{product.product_name}</span>
              </nav>

              <div className="pp-flex pp-gap-4" style={{ alignItems: 'center', gap: 'var(--sp-5)' }}>
                <span className="pp-tile pp-tile--lg" style={{ padding: 12 }}>
                  {product.product_logo ? (
                    <CatalogImage
                      src={product.product_logo}
                      alt={`${product.product_name} logo`}
                      className="size-full object-contain"
                      fallback={<span>{product.product_name.charAt(0).toUpperCase()}</span>}
                    />
                  ) : (
                    <span>{product.product_name.charAt(0).toUpperCase()}</span>
                  )}
                </span>

                <div className="pp-stack pp-gap-3">
                  <h1 className="pp-display pp-d2">{product.product_name}</h1>
                  {heroTags.length > 0 && (
                    <div className="pp-flex pp-wrap pp-gap-2">
                      {heroTags.map((tag) => (
                        <span key={tag.label} className={tag.dot ? 'pp-tag pp-tag--dot' : 'pp-tag'}>
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {product.short_description && (
                <p className="pp-lede" style={{ maxWidth: '62ch' }}>{product.short_description}</p>
              )}

              {heroStats.length > 0 && (
                <div className="pd-stats">
                  {heroStats.map((stat) => (
                    <div key={stat.label} className="pp-metric">
                      <p className="pp-metric-value pp-mono-num">{stat.value}</p>
                      <p className="pp-label">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <aside
              className="pp-glass pp-stack"
              style={{
                padding: 'var(--sp-6)',
                gap: 'var(--sp-5)',
                background: 'rgba(255,255,255,.1)',
                borderColor: 'rgba(255,255,255,.24)',
                boxShadow: 'none',
              }}
            >
              {(fromPlan || product.pricing_bucket) && (
                <div className="pp-stack pp-gap-2">
                  <p className="pp-label" style={{ color: 'rgba(255,255,255,.6)' }}>
                    {fromPlan ? 'From' : 'Pricing'}
                  </p>
                  <p className="pp-display pp-d4" style={{ color: '#fff' }}>
                    {fromPlan
                      ? (fromPlan.price_text ?? '').replace(/^from\s+/i, '')
                      : formatLabel(product.pricing_bucket ?? '')}
                  </p>
                  {fromPlan && (
                    <p className="pp-small" style={{ color: 'rgba(255,255,255,.7)' }}>
                      {fromPlan.plan_name}
                      {isPublishedMetaValue(fromPlan.billing_period)
                        ? ` · ${formatLabel(fromPlan.billing_period)}`
                        : ''}
                    </p>
                  )}
                </div>
              )}

              <div className="pp-stack pp-gap-3">
                {/* inline color: .pp-scope a outspecifies .pp-btn--cobalt on anchors */}
                <a
                  className="pp-btn pp-btn--cobalt pp-btn--block"
                  style={{ color: '#fff' }}
                  href={expertCtaHref}
                  onClick={experts.length > 0 ? (event) => onAnchorClick(event, 'experts') : undefined}
                >
                  Get matched with an expert
                </a>
                {product.official_website && (
                  <a
                    className="pp-btn pp-btn--secondary pp-btn--block"
                    href={product.official_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,.3)' }}
                  >
                    Visit website
                  </a>
                )}
              </div>

              <hr className="pp-rule" style={{ borderColor: 'rgba(255,255,255,.2)' }} />

              <div className="pp-flex pp-gap-3" style={{ alignItems: 'center' }}>
                <FavoriteToggle
                  targetId={product.product_id}
                  label={product.product_name}
                />
                <p className="pp-small" style={{ color: 'rgba(255,255,255,.76)' }}>
                  Save {product.product_name} to your profile
                </p>
              </div>

              {experts.length > 0 && (
                <div className="pp-flex pp-gap-3" style={{ alignItems: 'center' }}>
                  <div className="pp-avatars">
                    {experts.slice(0, 3).map((expert) => (
                      <span key={expert.id} className="pp-avatar">{initials(expert.displayName)}</span>
                    ))}
                  </div>
                  <p className="pp-small" style={{ color: 'rgba(255,255,255,.76)' }}>
                    {experts.length} vetted specialist{experts.length === 1 ? '' : 's'} matched to this product
                  </p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* ── Section rail ─────────────────────────────────────────────────── */}
      <div className="pd-rail">
        <div className="pp-container-app">
          <div className="pd-rail-inner">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                className="pd-tab"
                aria-pressed={activeSection === section.id}
                onClick={() => scrollToSection(section.id, setActiveSection)}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pp-container-app pp-section">
        <div className="pd-body">
          {/* ── Main column ─────────────────────────────────────────────── */}
          <div className="pp-stack pp-gap-16">
            <section id="overview" style={SECTION_SCROLL_STYLE}>
              <Reveal className="pp-stack pp-gap-6">
                <p className="pp-label">Overview</p>
                <h2 className="pp-display pp-d3">About {product.product_name}.</h2>
                {product.what_is && <p className="pp-lede">{product.what_is}</p>}
                {product.long_description && product.long_description !== product.what_is && (
                  <p className="pp-body">{product.long_description}</p>
                )}

                {heroShot && (
                  <div className="relative group w-full">
                    <button
                      type="button"
                      className="pd-shot w-full"
                      onClick={() => openMedia(gallery, heroShot, setDialogIndex)}
                      aria-label={`Open ${product.product_name} media preview`}
                      style={{ border: 'var(--bw) solid var(--line)', padding: 0, cursor: 'zoom-in' }}
                    >
                      {heroShot.type === 'video' ? (
                        <ProductMediaVideo
                          src={heroShot.url}
                          title={heroShot.alt || `${product.product_name} video preview`}
                          className="object-contain"
                          autoPlay
                          muted
                          loop={false}
                          controls={false}
                          onEnded={advanceHero}
                        />
                      ) : (
                        <CatalogImage
                          src={heroShot.url}
                          alt={heroShot.alt || `${product.product_name} interface preview`}
                          className="size-full object-contain"
                          fallback={<span className="size-full" style={{ display: 'block' }} />}
                        />
                      )}
                    </button>
                    {rotatingHeroMedia.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setHeroMediaIndex((idx) => (idx - 1 + rotatingHeroMedia.length) % rotatingHeroMedia.length)
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 border border-border shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-105"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="h-5 w-5 text-ink" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setHeroMediaIndex((idx) => (idx + 1) % rotatingHeroMedia.length)
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 border border-border shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-105"
                          aria-label="Next image"
                        >
                          <ChevronRight className="h-5 w-5 text-ink" />
                        </button>
                      </>
                    )}
                  </div>
                )}

                {(product.best_for || product.not_for) && (
                  <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-5)' }}>
                    {product.best_for && (
                      <div className="pp-card pp-stack pp-gap-3">
                        <p className="pp-label">Best for</p>
                        <p className="pp-body">{product.best_for}</p>
                      </div>
                    )}
                    {product.not_for && (
                      <div className="pp-card pp-stack pp-gap-3">
                        <p className="pp-label">Not ideal for</p>
                        <p className="pp-body">{product.not_for}</p>
                      </div>
                    )}
                  </div>
                )}

                <OverviewFacts product={product} />
              </Reveal>
            </section>

            {hasFeatures && (
              <>
                <hr className="pp-rule" />
                <section id="features" style={SECTION_SCROLL_STYLE}>
                  <Reveal className="pp-stack pp-gap-8">
                    <div className="pp-stack" style={{ gap: 'var(--sp-5)' }}>
                      <p className="pp-label">Features</p>
                      <h2 className="pp-display pp-d3">Core capabilities.</h2>
                    </div>

                    {product.core_features.length > 0 && (
                      <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-6)' }}>
                        {product.core_features.map((feature, index) => (
                          <div key={feature} className="pp-card pp-lift pp-flex pp-gap-4" style={{ alignItems: 'flex-start' }}>
                            <span className="pp-ico">{FEATURE_ICONS[index % FEATURE_ICONS.length]}</span>
                            <p className="pp-body" style={{ color: 'var(--ink)', fontWeight: 500 }}>
                              {feature}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {product.compliance_labels.length > 0 && (
                      <div className="pp-stack pp-gap-3">
                        <p className="pp-label">Compliance</p>
                        <div className="pp-flex pp-wrap pp-gap-2">
                          {product.compliance_labels.map((label) => (
                            <span key={label} className="pp-tag pp-tag--cobalt">{label}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </Reveal>
                </section>
              </>
            )}

            {hasIntegrations && (
              <>
                <hr className="pp-rule" />
                <section id="integrations" style={SECTION_SCROLL_STYLE}>
                  <Reveal className="pp-stack pp-gap-8">
                    <div className="pp-sec-head">
                      <p className="pp-label">Integrations</p>
                      <h2 className="pp-display pp-d3">Fits the stack you already run.</h2>
                    </div>
                    <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-4)' }}>
                      {product.integration_labels.map((integration) => (
                        <div key={integration} className="pd-int">
                          <span className="pp-tile pp-tile--sm">{integration.charAt(0).toUpperCase()}</span>
                          <div>
                            <p className="pp-h6" style={{ fontSize: 15 }}>{integration}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Reveal>
                </section>
              </>
            )}

            {hasPricing && (
              <>
                <hr className="pp-rule" />
                <section id="pricing" style={SECTION_SCROLL_STYLE}>
                  <Reveal className="pp-stack pp-gap-8">
                    <div className="pp-sec-head">
                      <p className="pp-label">Pricing</p>
                      <h2 className="pp-display pp-d3">Plans, as published.</h2>
                      <p className="pp-lede">
                        Vendor list pricing as published. Implementation is quoted separately by your matched expert.
                      </p>
                    </div>

                    <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-4)' }}>
                      <PricingFact
                        label="Pricing model"
                        value={product.pricing_bucket ? formatLabel(product.pricing_bucket) : 'Contact vendor'}
                      />
                      <PricingFact label="Free plan" value={product.free_plan ? 'Available' : 'Not listed'} />
                      <PricingFact label="Free trial" value={product.free_trial ? 'Available' : 'Not listed'} />
                    </div>

                    {product.pricing_plans.length > 0 && (
                      <div
                        className="pp-grid"
                        style={{
                          gap: 'var(--sp-5)',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        }}
                      >
                        {product.pricing_plans.map((plan) => (
                          <PlanCard key={plan.plan_id} plan={plan} />
                        ))}
                      </div>
                    )}

                    {pricingSourceUrl && (
                      <a
                        className="pp-link-arrow"
                        href={pricingSourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Pricing changes often, so we keep the original vendor source available for verification."
                      >
                        View pricing source
                        <ArrowIcon />
                      </a>
                    )}
                  </Reveal>
                </section>
              </>
            )}

            {showExperts && (
              <>
                <hr className="pp-rule" />
                <section id="experts" style={SECTION_SCROLL_STYLE}>
                  <Reveal className="pp-stack pp-gap-8">
                    <div className="pp-sec-head">
                      <p className="pp-label">Matched experts</p>
                      <h2 className="pp-display pp-d3">The specialists who deploy it.</h2>
                      <p className="pp-lede">
                        Vetted, reference-checked, and matched on their history with {product.product_name}.
                      </p>
                    </div>

                    {expertsLoading ? (
                      <div className="pp-stack pp-gap-4">
                        {[0, 1, 2].map((item) => (
                          <Skeleton key={item} className="h-[96px] rounded-[16px]" />
                        ))}
                      </div>
                    ) : (
                      <div className="pp-stack pp-gap-4">
                        {experts.map((expert) => {
                          const photoUrl = resolveExpertPublicResourceUrl(expert.profilePictureUrl)
                          const meta = [
                            [expert.regionCity, expert.regionCountry].filter(Boolean).join(', '),
                            expert.yearsExperience !== null && expert.yearsExperience !== undefined
                              ? `${expert.yearsExperience} yrs`
                              : null,
                          ].filter(Boolean).join(' · ')

                          return (
                            <article
                              key={expert.id}
                              className="pp-card pp-lift pp-flex pp-wrap pp-gap-6"
                              style={{ alignItems: 'center', justifyContent: 'space-between' }}
                            >
                              <div className="pp-flex pp-gap-4" style={{ alignItems: 'center', minWidth: 0 }}>
                                <span
                                  className="pp-avatar pp-avatar--lg"
                                  style={{ overflow: 'hidden', borderRadius: 'var(--r-full)' }}
                                >
                                  {photoUrl ? (
                                    <CatalogImage
                                      src={photoUrl}
                                      alt={expert.displayName}
                                      className="size-full object-cover"
                                      fallback={<span>{initials(expert.displayName)}</span>}
                                    />
                                  ) : (
                                    <span>{initials(expert.displayName)}</span>
                                  )}
                                </span>
                                <div style={{ minWidth: 0 }}>
                                  <p className="pp-h6">{expert.displayName}</p>
                                  <p className="pp-small">
                                    {[expert.headline, meta].filter(Boolean).join(' · ') || 'Vetted specialist'}
                                  </p>
                                </div>
                              </div>

                              {(expert.primaryPlatforms?.length ?? 0) > 0 && (
                                <div className="pp-flex pp-wrap pp-gap-2">
                                  {expert.primaryPlatforms?.slice(0, 3).map((platform) => (
                                    <span key={platform} className="pp-tag">{platform}</span>
                                  ))}
                                </div>
                              )}

                              <AuthRequiredLink
                                href={`/experts/${expert.id}`}
                                className="pp-btn pp-btn--primary pp-btn--sm pp-btn--inline text-white!"
                              >
                                View profile
                              </AuthRequiredLink>
                            </article>
                          )
                        })}
                      </div>
                    )}
                  </Reveal>
                </section>
              </>
            )}
          </div>

          {/* ── Sidebar ─────────────────────────────────────────────────── */}
          <aside className="pd-side">
            {(gallery.length > 0 || mediaError) && (
              <div className="pp-card pp-stack pp-gap-4">
                <p className="pp-label">Media</p>
                {mediaError ? (
                  <>
                    <p className="pp-small">Media could not be loaded.</p>
                    <button type="button" className="pp-link-arrow" onClick={onRetryMedia}>
                      Retry
                      <ArrowIcon />
                    </button>
                  </>
                ) : (
                  <div className="pp-flex pp-wrap pp-gap-2">
                    {gallery.slice(0, 8).map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setDialogIndex(index)}
                        aria-label={`Open ${item.alt || `${product.product_name} media ${index + 1}`}`}
                        style={{
                          width: 76,
                          height: 76,
                          padding: 0,
                          overflow: 'hidden',
                          borderRadius: 'var(--r-control)',
                          border: 'var(--bw) solid var(--line)',
                          background: 'var(--cobalt-soft)',
                          cursor: 'zoom-in',
                        }}
                      >
                        {item.type === 'video' ? (
                          <ProductMediaVideo
                            src={item.url}
                            title={item.alt || `${product.product_name} media ${index + 1}`}
                            className="object-cover"
                            autoPlay
                            muted
                            loop
                            controls={false}
                          />
                        ) : (
                          <CatalogImage
                            src={item.url}
                            alt={item.alt || `${product.product_name} media ${index + 1}`}
                            className="size-full object-cover"
                            fallback={<span className="size-full" style={{ display: 'block' }} />}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <AlternativesCard
              alternatives={alternatives}
              loading={alternativesLoading}
              error={Boolean(alternativesError)}
              comparisonCount={comparisonCount}
              currentProduct={currentComparisonProduct}
              isSelected={isSelected}
              onRetry={refetchAlternatives}
              onCompare={(alternative) => {
                addMany(buildComparisonAdditions(currentComparisonProduct, {
                  product_id: alternative.product_id,
                  product_name: alternative.product_name,
                  product_logo: alternative.logo_url,
                }))
              }}
            />
          </aside>
        </div>
      </div>

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <section style={{ paddingBlock: '0 var(--section-y)' }}>
        <div className="pp-container-app">
          <Reveal className="pp-dark">
            <div className="pp-sec-split" style={{ alignItems: 'center', gap: 'var(--sp-16)' }}>
              <div className="pp-stack" style={{ gap: 'var(--sp-5)' }}>
                <p className="pp-label">Get started</p>
                <h2 className="pp-display pp-d3">Ready to deploy {product.product_name}?</h2>
                <p className="pp-lede">
                  Get matched with a Proploy-vetted specialist who has shipped {product.product_name} on
                  a stack like yours.
                </p>
              </div>
              <div className="pp-stack pp-gap-3">
                <Link className="pp-btn pp-btn--cobalt pp-btn--pill" style={{ color: '#fff' }} href="/experts">
                  Get matched with an expert
                </Link>
                <Link className="pp-btn pp-btn--secondary pp-btn--pill" href="/products">
                  Compare alternatives
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {dialogIndex !== null && gallery[dialogIndex] && (
        <MediaDialog
          items={gallery}
          currentIndex={dialogIndex}
          onClose={() => setDialogIndex(null)}
          onOpenIndex={setDialogIndex}
        />
      )}
    </>
  )
}

/* ── Overview facts ───────────────────────────────────────────────────────── */

function OverviewFacts({ product }: { product: ProductPageModel }) {
  const facts: { label: string; value: string }[] = []
  if (product.implementation_complexity) {
    facts.push({ label: 'Implementation', value: formatLabel(product.implementation_complexity) })
  }
  if (product.typical_timeline) facts.push({ label: 'Typical timeline', value: product.typical_timeline })
  if (product.deployment_models.length > 0) {
    facts.push({ label: 'Deployment', value: product.deployment_models.map(formatLabel).join(', ') })
  }
  if (product.target_segments.length > 0) {
    facts.push({ label: 'Target teams', value: product.target_segments.map(formatLabel).join(', ') })
  }
  if (product.vendor_name) facts.push({ label: 'Vendor', value: product.vendor_name })
  if (product.primary_category) facts.push({ label: 'Primary category', value: formatLabel(product.primary_category) })

  if (facts.length === 0) return null

  return (
    <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-4)' }}>
      {facts.map((fact) => (
        <div key={fact.label} className="pp-card pp-stack pp-gap-2" style={{ padding: 'var(--sp-4)' }}>
          <p className="pp-label">{fact.label}</p>
          <p className="pp-body" style={{ color: 'var(--ink)' }}>{fact.value}</p>
        </div>
      ))}
    </div>
  )
}

/* ── Pricing ──────────────────────────────────────────────────────────────── */

function PricingFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="pp-card pp-stack pp-gap-2" style={{ padding: 'var(--sp-4)' }}>
      <p className="pp-label">{label}</p>
      <p className="pp-body" style={{ color: 'var(--ink)', fontWeight: 600 }}>{value}</p>
    </div>
  )
}

function PlanCard({ plan }: { plan: PricingTier }) {
  const getPriceText = () => {
    if (plan.price_text) return plan.price_text
    if (plan.price_value != null && plan.price_value > 0) {
      const currency = plan.currency || 'USD'
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: plan.price_value % 1 === 0 ? 0 : 2
      }).format(plan.price_value)
    }
    if (plan.is_free) return 'Free'
    return plan.is_contact_sales ? 'Contact sales' : 'Pricing unavailable'
  }
  const priceText = getPriceText()
  const longPrice = priceText.length > 8

  return (
    <div className="pd-plan">
      <div className="pp-stack pp-gap-2">
        <div className="pp-flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="pp-label">{plan.plan_name}</p>
          {plan.is_free && <span className="pp-tag pp-tag--success">Free</span>}
          {!plan.is_free && plan.is_trial && <span className="pp-tag pp-tag--cobalt">Trial</span>}
        </div>
        <p className="pd-price" style={longPrice ? { fontSize: 24, lineHeight: 1.2 } : undefined}>
          {priceText}
        </p>
        <div className="pp-flex pp-wrap pp-gap-2">
          {isPublishedMetaValue(plan.billing_period) && (
            <span className="pp-tag">{formatLabel(plan.billing_period)}</span>
          )}
          {isPublishedMetaValue(plan.pricing_model) && (
            <span className="pp-tag">{formatLabel(plan.pricing_model)}</span>
          )}
        </div>
        {plan.statement && <p className="pp-small">{plan.statement}</p>}
      </div>

      {((plan.features?.length || 0) > 0 || (plan.limits?.length || 0) > 0) && <hr className="pp-rule" />}

      {(plan.features?.length || 0) > 0 && (
        <ul className="pp-stack pp-gap-3" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {(plan.features || []).map((feature) => (
            <li key={`${plan.plan_id}-${feature.label}`} className="pp-small">
              {feature.label}
              {feature.value && feature.value !== 'included' ? `: ${feature.value}` : ''}
            </li>
          ))}
        </ul>
      )}

      {(plan.limits?.length || 0) > 0 && (
        <div className="pp-stack pp-gap-2">
          <p className="pp-label">Limits</p>
          <ul className="pp-stack pp-gap-2" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {(plan.limits || []).map((limit) => (
              <li key={`${plan.plan_id}-${limit.label}`} className="pp-small">
                {limit.label}
                {limit.value && limit.value !== 'limited' ? `: ${limit.value}` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}

      {plan.is_contact_sales && plan.source_url && (
        <div style={{ marginTop: 'auto', paddingTop: 'var(--sp-4)' }}>
          <a
            href={plan.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="pp-link-arrow"
          >
            View pricing source
            <ArrowIcon />
          </a>
        </div>
      )}
    </div>
  )
}

/* ── Alternatives sidebar card ────────────────────────────────────────────── */

function AlternativesCard({
  alternatives,
  loading,
  error,
  comparisonCount,
  currentProduct,
  isSelected,
  onRetry,
  onCompare,
}: {
  alternatives: ProductAlternative[]
  loading: boolean
  error: boolean
  comparisonCount: number
  currentProduct: SelectedProduct
  isSelected: (productId: string) => boolean
  onRetry: () => void
  onCompare: (alternative: ProductAlternative) => void
}) {
  if (!loading && !error && alternatives.length === 0) return null

  return (
    <div className="pp-card pp-stack pp-gap-4">
      <p className="pp-label">Alternatives</p>

      {loading && alternatives.length === 0 ? (
        <div className="pp-stack pp-gap-3" aria-label="Loading recommendations">
          {[0, 1].map((item) => (
            <Skeleton key={item} className="h-[104px] rounded-[12px]" />
          ))}
        </div>
      ) : error ? (
        <>
          <p className="pp-small">Recommendations could not be loaded.</p>
          <button type="button" className="pp-link-arrow" onClick={onRetry}>
            Retry
            <ArrowIcon />
          </button>
        </>
      ) : (
        <div className="pp-stack pp-gap-3" style={{ maxHeight: 320, overflowY: 'auto' }}>
          {alternatives.map((alternative) => {
            const selected = isSelected(alternative.product_id)
            const unseenProducts =
              (isSelected(currentProduct.product_id) ? 0 : 1) + (selected ? 0 : 1)
            const blocked = comparisonCount + unseenProducts > MAX_COMPARE

            return (
              <article
                key={alternative.product_id}
                className="pp-stack pp-gap-3"
                style={{
                  border: 'var(--bw) solid var(--line)',
                  borderRadius: 'var(--r-tile)',
                  padding: 'var(--sp-4)',
                }}
              >
                <div className="pp-flex pp-gap-3" style={{ alignItems: 'flex-start' }}>
                  <span className="pp-tile pp-tile--sm" style={{ padding: 5 }}>
                    {alternative.logo_url ? (
                      <CatalogImage
                        src={alternative.logo_url}
                        alt={`${alternative.product_name} logo`}
                        className="size-full object-contain"
                        fallback={<span>{alternative.product_name.charAt(0).toUpperCase()}</span>}
                      />
                    ) : (
                      <span>{alternative.product_name.charAt(0).toUpperCase()}</span>
                    )}
                  </span>
                  <div className="min-w-0">
                    <Link
                      href={getProductDetailHref(alternative.product_id)}
                      className="pp-h6 text-[15px] hover:text-[var(--cobalt)]"
                    >
                      {alternative.product_name}
                    </Link>
                    {alternative.short_description && (
                      <p className="pp-small pp-clamp-3" style={{ marginTop: 2 }}>
                        {alternative.short_description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="pp-stack pp-gap-2">
                  <Link
                    href={getProductDetailHref(alternative.product_id)}
                    className="pp-btn pp-btn--secondary pp-btn--block pp-btn--sm"
                  >
                    View product
                  </Link>
                  <button
                    type="button"
                    className="pp-btn pp-btn--secondary pp-btn--block pp-btn--sm"
                    disabled={selected || blocked}
                    title={blocked ? `Compare up to ${MAX_COMPARE} products — remove one first` : undefined}
                    onClick={() => onCompare(alternative)}
                  >
                    {selected ? 'Added' : blocked ? 'Tray full' : 'Compare'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── Media dialog ─────────────────────────────────────────────────────────── */

function MediaDialog({
  items,
  currentIndex,
  onClose,
  onOpenIndex,
}: {
  items: ProductMediaPreview[]
  currentIndex: number
  onClose: () => void
  onOpenIndex: (index: number) => void
}) {
  const item = items[currentIndex]
  const hasMultiple = items.length > 1

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const dialogButtonStyle = {
    position: 'absolute',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 38,
    height: 38,
    borderRadius: 'var(--r-full)',
    border: 0,
    background: 'rgba(255,255,255,.95)',
    color: 'var(--ink)',
    cursor: 'pointer',
  } as const

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Product media preview"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--sp-6)',
        background: 'rgba(10,13,18,.72)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          position: 'relative',
          width: 'min(960px, 100%)',
          maxHeight: 'calc(100vh - 48px)',
          overflow: 'hidden',
          borderRadius: 'var(--r-panel)',
          background: 'var(--ink)',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close media preview"
          style={{ ...dialogButtonStyle, top: 16, right: 16 }}
        >
          <CloseIcon />
        </button>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => onOpenIndex((currentIndex - 1 + items.length) % items.length)}
              aria-label="Previous media"
              style={{ ...dialogButtonStyle, left: 16, top: '50%', transform: 'translateY(-50%)' }}
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={() => onOpenIndex((currentIndex + 1) % items.length)}
              aria-label="Next media"
              style={{ ...dialogButtonStyle, right: 16, top: '50%', transform: 'translateY(-50%)' }}
            >
              <ChevronIcon direction="right" />
            </button>
          </>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 260,
            maxHeight: 'calc(100vh - 128px)',
            overflow: 'hidden',
          }}
        >
          {item.type === 'video' ? (
            <ProductMediaVideo src={item.url} title={item.alt || 'Product media'} className="object-contain" />
          ) : (
            <CatalogImage
              src={item.url}
              alt={item.alt || 'Product media'}
              className="max-h-[calc(100vh-128px)] w-full object-contain"
              fallback={<span style={{ display: 'block', height: 320, width: '100%' }} />}
            />
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function openMedia(
  gallery: ProductMediaPreview[],
  item: ProductMediaPreview,
  setDialogIndex: (index: number) => void,
) {
  const index = gallery.findIndex((entry) => entry.id === item.id)
  if (index >= 0) setDialogIndex(index)
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || '?'
}

function formatLabel(value: string): string {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function isPublishedMetaValue(value: string | null | undefined): value is string {
  return Boolean(value && value.toLowerCase() !== 'unknown' && !isUnpublishedValue(value))
}

/* ── Inline icons (from the design artifact, camelCased) ──────────────────── */

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {direction === 'left' ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  )
}

const FEATURE_ICONS: ReactNode[] = [
  <svg key="chat" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 5h16v11H8l-4 4Z" />
  </svg>,
  <svg key="bars" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>,
  <svg key="shield" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6Z" />
  </svg>,
  <svg key="bolt" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12Z" />
  </svg>,
]
