'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  MapPin,
  ShieldCheck,
  Sparkles,
  X,
  XCircle,
} from 'lucide-react'
import { AuthRequiredLink } from '@/components/auth/AuthRequiredLink'
import { Skeleton } from '@/components/ui/Skeleton'
import { CatalogImage } from '@/components/catalog/CatalogImage'
import { IntegrationLogo } from '@/components/integrations/IntegrationLogo'
import FavoriteToggle from '@/components/personalization/FavoriteToggle'
import { ProductMediaVideo } from '@/components/product/ProductMediaVideo'
import {
  getProductDetailTabs,
  getProductGalleryMedia,
  isUnpublishedValue,
  useProductAlternatives,
  type ProductAlternative,
  type ProductMediaPreview,
  type ProductPageModel,
  type ProductTabKey,
} from '@/features/catalog'
import {
  MAX_COMPARE,
  useCompareSelection,
  type SelectedProduct,
} from '@/features/compare/selection-store'
import { useApprovedExperts } from '@/features/experts'
import { resolveExpertPublicResourceUrl } from '@/features/experts/public-resource'
import { useRecentlyViewed } from '@/features/users'
import { buildComparisonAdditions } from './product-detail-comparison'

interface ProductDetailExperienceProps {
  product: ProductPageModel
  mediaError: boolean
  onRetryMedia: () => void
}

const SECTION_IDS: Record<ProductTabKey, string> = {
  'product-information': 'product-information',
  integrations: 'integrations',
  pricing: 'pricing',
  features: 'features',
  media: 'media',
  experts: 'experts',
}

function scrollToSection(tab: ProductTabKey) {
  document.getElementById(SECTION_IDS[tab])?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

export default function ProductDetailExperience({
  product,
  mediaError,
  onRetryMedia,
}: ProductDetailExperienceProps) {
  const [activeTab, setActiveTab] = useState<ProductTabKey>('product-information')
  const [selectedMedia, setSelectedMedia] = useState<ProductMediaPreview | null>(null)
  const [heroIndex, setHeroIndex] = useState(0)
  const tabs = getProductDetailTabs(product)
  const gallery = getProductGalleryMedia(product.media)
  const heroMedia = useMemo(() => {
    if (gallery.length === 0) return null
    return gallery[heroIndex % gallery.length]
  }, [gallery, heroIndex])
  const { experts, loading: expertsLoading } = useApprovedExperts({
    platform: product.product_name,
    limit: 8,
  })
  const { alternatives, loading: alternativesLoading, error: alternativesError, refetch: refetchAlternatives } =
    useProductAlternatives({ productId: product.product_id, limit: 6 })
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

  useEffect(() => {
    if (gallery.length <= 1) return

    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % gallery.length)
    }, 15000)

    return () => window.clearInterval(timer)
  }, [gallery.length])

  useEffect(() => {
    if (heroIndex >= gallery.length) {
      const timer = window.setTimeout(() => setHeroIndex(0), 0)
      return () => window.clearTimeout(timer)
    }
    return undefined
  }, [gallery.length, heroIndex])

  const selectTab = (tab: ProductTabKey) => {
    setActiveTab(tab)
    scrollToSection(tab)
  }

  const selectedMediaIndex = selectedMedia
    ? gallery.findIndex((item) => item.id === selectedMedia.id)
    : -1
  const openMediaAt = (index: number) => {
    const nextItem = gallery[index]
    if (nextItem) setSelectedMedia(nextItem)
  }

  return (
    <div className="bg-[#f7f9fc] font-[family-name:var(--font-dm-sans)] text-[#181d27]">
      <section className="relative overflow-hidden border-b border-[#e9eaeb] bg-[#0b1f4f]">
        <div className="absolute inset-0">
          {heroMedia ? (
            <button
              type="button"
              onClick={() => setSelectedMedia(heroMedia)}
              className="block size-full cursor-zoom-in text-left"
              aria-label={`Open ${product.product_name} hero media`}
            >
              <div className="relative size-full">
                {heroMedia.type === 'video' ? (
                  <ProductMediaVideo
                    key={heroMedia.id}
                    src={heroMedia.url}
                    title={heroMedia.alt || `${product.product_name} product preview`}
                    className="object-cover"
                    autoPlay
                    muted
                    loop
                    controls={false}
                  />
                ) : (
                  <CatalogImage
                    key={heroMedia.id}
                    src={heroMedia.url}
                    alt={heroMedia.alt || `${product.product_name} product preview`}
                    className="size-full object-cover"
                    fallback={<div className="size-full bg-gradient-to-br from-[#0b1f4f] via-[#155eef] to-[#7f56d9]" />}
                  />
                )}
              </div>
            </button>
          ) : (
            <div className="size-full bg-gradient-to-br from-[#0b1f4f] via-[#155eef] to-[#7f56d9]" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#071638]/70 via-[#071638]/38 to-[#071638]/0" />
        </div>

        <div className="relative mx-auto flex min-h-[280px] max-w-[1280px] items-end px-[24px] pb-[40px] pt-[80px] sm:min-h-[360px] sm:pb-[56px] sm:pt-[120px] md:min-h-[440px] md:pt-[148px] sm:px-[32px]">
          <div className="flex max-w-[760px] flex-col items-start gap-[20px]">
            <div className="flex size-[88px] items-center justify-center overflow-hidden rounded-[18px] border border-white/70 bg-white/95 p-[12px] shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
              {product.product_logo ? (
                <CatalogImage
                  src={product.product_logo}
                  alt={`${product.product_name} logo`}
                  className="size-full object-contain"
                  fallback={<LogoFallback name={product.product_name} />}
                />
              ) : (
                <LogoFallback name={product.product_name} />
              )}
            </div>

            <div>
              <p className="mb-[8px] text-[14px] font-semibold uppercase tracking-[0.12em] text-[#b2ccff]">
                {product.vendor_name || product.primary_category || 'Software product'}
              </p>
              <h1 className="text-[40px] font-semibold leading-[48px] tracking-[-0.8px] text-white sm:text-[52px] sm:leading-[62px]">
                {product.product_name}
              </h1>
              {product.short_description && (
                <p className="mt-[12px] max-w-[720px] text-[18px] leading-[28px] text-white/80">
                  {product.short_description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-[10px]">
              {product.free_plan && <StatusPill label="Free plan" />}
              {product.free_trial && <StatusPill label="Free trial" />}
              {product.pricing_bucket && <StatusPill label={formatLabel(product.pricing_bucket)} />}
              <FavoriteToggle
                targetId={product.product_id}
                label={product.product_name}
                className="border-white/70 bg-white/95 text-[#0b1f4f] hover:bg-white"
              />
              {product.official_website && (
                <a
                  href={product.official_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-[40px] items-center gap-[6px] rounded-full bg-white px-[16px] text-[14px] font-semibold text-[#0b1f4f] hover:bg-[#eff4ff]"
                >
                  Visit website
                  <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-[64px] z-30 border-b border-[#e9eaeb] bg-white/95 pt-[8px] backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] gap-[4px] overflow-x-auto px-[24px] py-[10px] sm:px-[32px]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => selectTab(tab.key)}
              className={`h-[40px] shrink-0 rounded-[8px] px-[14px] text-[14px] font-semibold transition-colors ${
                activeTab === tab.key
                  ? 'bg-[#eff4ff] text-[#004eeb]'
                  : 'text-[#535862] hover:bg-[#fafafa] hover:text-[#181d27]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto grid max-w-[1280px] gap-[24px] px-[24px] py-[40px] lg:grid-cols-[minmax(0,1fr)_320px] lg:px-[32px]">
        <div className="flex min-w-0 flex-col gap-[24px]">
          <DetailSection id="product-information" title={`${product.product_name} overview`}>
            {product.what_is && (
              <p className="text-[16px] leading-[26px] text-[#535862]">{product.what_is}</p>
            )}

            <div className="grid gap-[16px] md:grid-cols-2">
              {product.best_for && (
                <InsightCard
                  tone="positive"
                  title="Best for"
                  body={product.best_for}
                  icon={<CheckCircle2 size={20} />}
                />
              )}
              {product.not_for && (
                <InsightCard
                  tone="caution"
                  title="Not ideal for"
                  body={product.not_for}
                  icon={<XCircle size={20} />}
                />
              )}
            </div>

            <div className="grid gap-[16px] sm:grid-cols-2 xl:grid-cols-3">
              <MetadataCard label="Implementation" value={product.implementation_complexity} />
              <MetadataCard label="Typical timeline" value={product.typical_timeline} />
              <MetadataCard
                label="Deployment"
                value={product.deployment_models.map(formatLabel).join(', ') || null}
              />
              <MetadataCard
                label="Target teams"
                value={product.target_segments.map(formatLabel).join(', ') || null}
              />
              <MetadataCard
                label="Primary category"
                value={product.primary_category ? formatLabel(product.primary_category) : null}
              />
              <MetadataCard
                label="Vendor"
                value={product.vendor_name}
              />
            </div>
          </DetailSection>

          <DetailSection id="integrations" title={`${product.product_name} integrations`}>
            {product.integration_labels.length > 0 ? (
              <div className="flex flex-wrap gap-[10px]">
                {product.integration_labels.map((integration) => (
                  <span
                    key={integration}
                    className="inline-flex items-center gap-[8px] rounded-[10px] border border-[#e9eaeb] bg-white px-[12px] py-[9px] text-[14px] font-medium text-[#414651]"
                  >
                    <span className="flex size-[26px] items-center justify-center rounded-[7px] bg-[#eff4ff] text-[12px] font-bold text-[#155eef]">
                      {integration.charAt(0).toUpperCase()}
                    </span>
                    {integration}
                  </span>
                ))}
              </div>
            ) : (
              <EmptyState message="Integration information has not been published yet." />
            )}
          </DetailSection>

          <DetailSection id="pricing" title={`${product.product_name} pricing`}>
            <div className="grid gap-[12px] sm:grid-cols-3">
              <PricingSummary
                label="Pricing model"
                value={product.pricing_bucket ? formatLabel(product.pricing_bucket) : 'Contact vendor'}
              />
              <PricingSummary label="Free plan" value={product.free_plan ? 'Available' : 'Not listed'} />
              <PricingSummary label="Free trial" value={product.free_trial ? 'Available' : 'Not listed'} />
            </div>

            {product.pricing_plans.length > 0 ? (
              <div className="grid gap-[16px] xl:grid-cols-2">
                {product.pricing_plans.map((plan) => (
                  <article
                    key={plan.plan_id}
                    className="flex flex-col rounded-[16px] border border-[#e9eaeb] bg-white p-[20px]"
                  >
                    <div className="flex items-start justify-between gap-[16px]">
                      <div>
                        <h3 className="text-[18px] font-semibold leading-[28px]">{plan.plan_name}</h3>
                        <p className="mt-[4px] text-[24px] font-semibold leading-[32px] tracking-[-0.48px] text-[#155eef]">
                          {plan.is_contact_sales && plan.source_url ? (
                            <a
                              href={plan.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-[6px] hover:underline focus:outline-none focus:ring-2 focus:ring-[#84adff] focus:ring-offset-2"
                            >
                              Contact sales
                              <ArrowUpRight size={20} />
                            </a>
                          ) : (
                            plan.price_text || (plan.is_contact_sales ? 'Contact sales' : 'Pricing unavailable')
                          )}
                        </p>
                      </div>
                      {plan.is_free && (
                        <span className="rounded-full bg-[#ecfdf3] px-[10px] py-[3px] text-[12px] font-semibold text-[#067647]">
                          Free
                        </span>
                      )}
                    </div>

                    <div className="mt-[16px] flex flex-wrap gap-[8px] text-[12px] text-[#535862]">
                      {isPublishedMetaValue(plan.billing_period) && <PlanMeta value={formatLabel(plan.billing_period)} />}
                      {isPublishedMetaValue(plan.pricing_model) && (
                        <PlanMeta value={formatLabel(plan.pricing_model)} />
                      )}
                      {plan.is_trial && <PlanMeta value="Trial" />}
                    </div>

                    {plan.statement && (
                      <p className="mt-[16px] text-[14px] leading-[22px] text-[#535862]">{plan.statement}</p>
                    )}

                    {plan.features.length > 0 && (
                      <div className="mt-[20px]">
                        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#717680]">
                          Included
                        </p>
                        <ul className="mt-[10px] space-y-[9px]">
                          {plan.features.map((feature) => (
                            <li key={`${plan.plan_id}-${feature.label}`} className="flex gap-[8px] text-[14px] leading-[20px] text-[#414651]">
                              <Check size={16} className="mt-[2px] shrink-0 text-[#079455]" />
                              <span>
                                {feature.label}
                                {feature.value && feature.value !== 'included' ? `: ${feature.value}` : ''}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {plan.limits.length > 0 && (
                      <div className="mt-[16px] rounded-[10px] bg-[#fafafa] p-[12px]">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#717680]">
                          Limits
                        </p>
                        <ul className="mt-[8px] space-y-[6px] text-[13px] leading-[19px] text-[#535862]">
                          {plan.limits.map((limit) => (
                            <li key={`${plan.plan_id}-${limit.label}`}>
                              {limit.label}{limit.value ? `: ${limit.value}` : ''}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState message="Detailed pricing plans have not been published yet." />
            )}

            <PricingSourceDisclosure sourceUrl={getPricingSourceUrl(product.pricing_plans)} />
          </DetailSection>

          <DetailSection id="features" title={`${product.product_name} features`}>
            {product.core_features.length > 0 ? (
              <div className="grid gap-[12px] md:grid-cols-2">
                {product.core_features.map((feature) => (
                  <div
                    key={feature}
                    className="flex gap-[10px] rounded-[12px] border border-[#e9eaeb] bg-[#fafafa] p-[14px]"
                  >
                    <Sparkles size={18} className="mt-[2px] shrink-0 text-[#155eef]" />
                    <p className="text-[14px] leading-[21px] text-[#414651]">{feature}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="Feature information has not been published yet." />
            )}

            {product.compliance_labels.length > 0 && (
              <div className="mt-[8px] border-t border-[#e9eaeb] pt-[20px]">
                <div className="mb-[12px] flex items-center gap-[8px]">
                  <ShieldCheck size={18} className="text-[#155eef]" />
                  <h3 className="text-[15px] font-semibold">Compliance</h3>
                </div>
                <div className="flex flex-wrap gap-[8px]">
                  {product.compliance_labels.map((label) => (
                    <span key={label} className="rounded-full bg-[#eff4ff] px-[11px] py-[5px] text-[13px] font-medium text-[#004eeb]">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </DetailSection>

          <DetailSection id="experts" title={`${product.product_name} vetted experts`}>
            {expertsLoading ? (
              <div className="grid gap-[16px] md:grid-cols-2">
                {[0, 1, 2, 3].map((item) => (
                  <Skeleton key={item} className="h-[170px] rounded-[14px]" />
                ))}
              </div>
            ) : experts.length > 0 ? (
              <div className="grid gap-[16px] md:grid-cols-2">
                {experts.map((expert) => (
                  <article key={expert.id} className="flex flex-col rounded-[14px] border border-[#e9eaeb] p-[18px]">
                    <div className="flex items-start gap-[12px]">
                      <div className="flex size-[44px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#155eef] text-[18px] font-semibold text-white">
                        {resolveExpertPublicResourceUrl(expert.profilePictureUrl) ? (
                          <CatalogImage
                            src={resolveExpertPublicResourceUrl(expert.profilePictureUrl) ?? ''}
                            alt={expert.displayName}
                            className="size-full object-cover"
                            fallback={expert.displayName.charAt(0).toUpperCase()}
                          />
                        ) : (
                          expert.displayName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-[16px] font-semibold">{expert.displayName}</h3>
                        {expert.headline && (
                          <p className="mt-[2px] line-clamp-2 text-[13px] leading-[19px] text-[#535862]">
                            {expert.headline}
                          </p>
                        )}
                      </div>
                    </div>

                    {(expert.regionCity || expert.regionCountry) && (
                      <p className="mt-[14px] flex items-center gap-[5px] text-[13px] text-[#717680]">
                        <MapPin size={14} />
                        {[expert.regionCity, expert.regionCountry].filter(Boolean).join(', ')}
                      </p>
                    )}

                    <AuthRequiredLink
                      href={`/experts/${expert.id}`}
                      className="mt-[18px] inline-flex items-center gap-[5px] text-[14px] font-semibold text-[#004eeb]"
                    >
                      View profile
                      <ArrowRight size={16} />
                    </AuthRequiredLink>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState message={`No approved experts currently list ${product.product_name} as a platform.`} />
            )}
          </DetailSection>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-[142px] flex flex-col gap-[16px]">
            <MediaSidebarCard
              productName={product.product_name}
              gallery={gallery}
              mediaError={mediaError}
              onRetryMedia={onRetryMedia}
              onOpenMedia={setSelectedMedia}
            />

            <div className="rounded-[16px] border border-[#e9eaeb] bg-white p-[20px] shadow-[0_8px_20px_rgba(10,13,18,0.04)]">
              <div className="flex items-center gap-[8px]">
                <CircleDollarSign size={20} className="text-[#155eef]" />
                <h2 className="text-[16px] font-semibold">Pricing at a glance</h2>
              </div>
              <p className="mt-[14px] text-[28px] font-semibold leading-[36px] tracking-[-0.56px]">
                {product.pricing_plans[0]?.price_text || formatLabel(product.pricing_bucket || 'Contact vendor')}
              </p>
              <button
                type="button"
                onClick={() => selectTab('pricing')}
                className="mt-[16px] inline-flex items-center gap-[5px] text-[14px] font-semibold text-[#004eeb]"
              >
                See all pricing
                <ChevronRight size={16} />
              </button>
              <div className="mt-[10px]">
                <PricingSourceDisclosure sourceUrl={getPricingSourceUrl(product.pricing_plans)} />
              </div>
            </div>

            <div className="rounded-[16px] border border-[#e9eaeb] bg-white p-[20px]">
              <h2 className="text-[15px] font-semibold">Categories</h2>
              <div className="mt-[12px] flex flex-wrap gap-[7px]">
                {product.all_categories.length > 0 ? (
                  product.all_categories.map((category) => (
                    <span key={category.term_id} className="rounded-full bg-[#f2f4f7] px-[10px] py-[5px] text-[12px] font-medium text-[#535862]">
                      {category.label}
                    </span>
                  ))
                ) : (
                  <span className="text-[13px] text-[#717680]">No categories published</span>
                )}
              </div>
            </div>

            <AlternativesSidebarCard
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
          </div>
        </aside>
      </main>

      {selectedMedia && (
        <MediaDialog
          item={selectedMedia}
          items={gallery}
          currentIndex={selectedMediaIndex}
          onClose={() => setSelectedMedia(null)}
          onOpenIndex={openMediaAt}
        />
      )}
    </div>
  )
}

function DetailSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className="scroll-mt-[144px] rounded-[18px] border border-[#e9eaeb] bg-white p-[20px] shadow-[0_8px_20px_rgba(10,13,18,0.035)] sm:p-[28px]"
    >
      <h2 className="mb-[20px] text-[20px] font-semibold leading-[30px]">{title}</h2>
      <div className="flex flex-col gap-[20px]">{children}</div>
    </section>
  )
}

function MediaSidebarCard({
  productName,
  gallery,
  mediaError,
  onRetryMedia,
  onOpenMedia,
}: {
  productName: string
  gallery: ProductMediaPreview[]
  mediaError: boolean
  onRetryMedia: () => void
  onOpenMedia: (item: ProductMediaPreview) => void
}) {
  return (
    <section
      id="media"
      className="scroll-mt-[144px] rounded-[16px] bg-white p-[20px]"
    >
      <h2 className="text-[16px] font-semibold">{productName} media</h2>

      {mediaError ? (
        <div className="mt-[12px] rounded-[12px] border border-dashed border-[#d5d7da] bg-[#fafafa] p-[14px]">
          <p className="text-[13px] leading-[19px] text-[#717680]">Media could not be loaded.</p>
          <button
            type="button"
            onClick={onRetryMedia}
            className="mt-[10px] text-[13px] font-semibold text-[#004eeb]"
          >
            Retry
          </button>
        </div>
      ) : gallery.length > 0 ? (
        <div className="mt-[14px] flex gap-[8px] overflow-x-auto pb-[2px]">
          {gallery.slice(0, 8).map((item, index) => (
            <button
              key={item.id ?? item.url}
              type="button"
              onClick={() => onOpenMedia(item)}
              className="group relative size-[76px] shrink-0 overflow-hidden rounded-[10px] bg-[#f5f8ff] transition-colors"
              aria-label={`Open ${item.alt || `${productName} media ${index + 1}`}`}
            >
              {item.type === 'video' ? (
                <ProductMediaVideo
                  src={item.url}
                  title={item.alt || `${productName} media ${index + 1}`}
                  className="object-cover"
                  autoPlay
                  muted
                  loop
                  controls={false}
                />
              ) : (
                <CatalogImage
                  src={item.url}
                  alt={item.alt || `${productName} media ${index + 1}`}
                  className="size-full object-cover"
                  fallback={<div className="size-full bg-[#eff4ff]" />}
                />
              )}
              <span className="absolute inset-0 bg-[#155eef]/0 transition-colors group-hover:bg-[#155eef]/10" />
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-[12px] rounded-[12px] border border-dashed border-[#d5d7da] bg-[#fafafa] px-[14px] py-[16px] text-[13px] leading-[19px] text-[#717680]">
          No approved product media has been published yet.
        </p>
      )}
    </section>
  )
}

function AlternativesSidebarCard({
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
  return (
    <section className="rounded-[16px] border border-[#e9eaeb] bg-white p-[20px]">
      <div className="flex items-center justify-between gap-[12px]">
        <div>
          <h2 className="text-[15px] font-semibold">Recommended products</h2>
          <p className="mt-[4px] text-[12px] leading-[18px] text-[#717680]">
            Compare similar products with {currentProduct.product_name}.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[#eff4ff] px-[8px] py-[4px] text-[11px] font-semibold text-[#155eef]">
          {comparisonCount}/{MAX_COMPARE}
        </span>
      </div>

      {loading && alternatives.length === 0 ? (
        <div className="mt-[14px] space-y-[10px]" aria-label="Loading recommendations">
          {[0, 1].map((item) => (
            <Skeleton key={item} className="h-[116px] rounded-[12px]" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-[14px] rounded-[12px] border border-dashed border-[#d5d7da] bg-[#fafafa] p-[14px]">
          <p className="text-[13px] leading-[19px] text-[#717680]">Recommendations could not be loaded.</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-[10px] text-[13px] font-semibold text-[#004eeb]"
          >
            Retry
          </button>
        </div>
      ) : alternatives.length > 0 ? (
        <div className="mt-[14px] max-h-[280px] space-y-[10px] overflow-y-auto pr-[4px]">
          {alternatives.map((alternative) => {
            const selected = isSelected(alternative.product_id)
            const unseenProducts =
              (isSelected(currentProduct.product_id) ? 0 : 1) + (selected ? 0 : 1)
            const blocked = comparisonCount + unseenProducts > MAX_COMPARE

            return (
              <article
                key={alternative.product_id}
                className="rounded-[12px] border border-[#e9eaeb] p-[12px]"
              >
                <div className="flex items-start gap-[10px]">
                  <div className="flex size-[36px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-[#e9eaeb] bg-white p-[5px]">
                    <CatalogImage
                      src={alternative.logo_url ?? ''}
                      alt={`${alternative.product_name} logo`}
                      className="size-full object-contain"
                      fallback={<LogoFallback name={alternative.product_name} />}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[14px] font-semibold">{alternative.product_name}</h3>
                    <p className="mt-[3px] line-clamp-2 text-[12px] leading-[17px] text-[#717680]">
                      {alternative.short_description || 'Explore this similar product.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={selected || blocked}
                  title={blocked ? `Compare up to ${MAX_COMPARE} products — remove one first` : undefined}
                  onClick={() => onCompare(alternative)}
                  className={`mt-[10px] w-full rounded-[8px] border px-[10px] py-[7px] text-[13px] font-semibold transition-colors disabled:cursor-not-allowed ${
                    selected
                      ? 'border-[#b2ddff] bg-[#eff8ff] text-[#004eeb]'
                      : blocked
                        ? 'border-[#e9eaeb] bg-white text-[#a4a7ae]'
                        : 'border-[#d5d7da] bg-white text-[#414651] hover:bg-[#f5f5f5] hover:text-[#004eeb]'
                  }`}
                >
                  {selected ? 'Added' : blocked ? 'Tray full' : 'Compare'}
                </button>
              </article>
            )
          })}
        </div>
      ) : (
        <p className="mt-[14px] rounded-[12px] border border-dashed border-[#d5d7da] bg-[#fafafa] px-[14px] py-[16px] text-[13px] leading-[19px] text-[#717680]">
          No similar products are available yet.
        </p>
      )}
    </section>
  )
}

function MediaDialog({
  item,
  items,
  currentIndex,
  onClose,
  onOpenIndex,
}: {
  item: ProductMediaPreview
  items: ProductMediaPreview[]
  currentIndex: number
  onClose: () => void
  onOpenIndex: (index: number) => void
}) {
  const touchStartX = useRef<number | null>(null)
  const hasMultipleItems = items.length > 1 && currentIndex >= 0
  const openPrevious = () => {
    if (!hasMultipleItems) return
    onOpenIndex((currentIndex - 1 + items.length) % items.length)
  }
  const openNext = () => {
    if (!hasMultipleItems) return
    onOpenIndex((currentIndex + 1) % items.length)
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#0a0d12]/70 px-[16px] py-[24px] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[calc(100vh-48px)] w-[min(960px,100%)] flex-col overflow-hidden rounded-[18px] bg-[#101828] shadow-[0_24px_64px_rgba(10,13,18,0.35)]"
        onClick={(event) => event.stopPropagation()}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return
          const delta = event.changedTouches[0]?.clientX - touchStartX.current
          touchStartX.current = null
          if (Math.abs(delta) < 48) return
          if (delta > 0) {
            openPrevious()
          } else {
            openNext()
          }
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close media preview"
          className="absolute right-[16px] top-[16px] z-10 flex size-[36px] items-center justify-center rounded-full bg-white/95 text-[#414651] shadow-[0_8px_20px_rgba(10,13,18,0.16)] hover:bg-[#f5f5f5]"
        >
          <X size={18} />
        </button>

        {hasMultipleItems && (
          <>
            <button
              type="button"
              onClick={openPrevious}
              aria-label="Previous media"
              className="absolute left-[16px] top-1/2 z-10 flex size-[40px] -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#414651] shadow-[0_8px_20px_rgba(10,13,18,0.16)] hover:bg-[#f5f5f5]"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={openNext}
              aria-label="Next media"
              className="absolute right-[16px] top-1/2 z-10 flex size-[40px] -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#414651] shadow-[0_8px_20px_rgba(10,13,18,0.16)] hover:bg-[#f5f5f5]"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <div className="flex max-h-[calc(100vh-128px)] min-h-[260px] items-center justify-center overflow-hidden">
          {item.type === 'video' ? (
            <ProductMediaVideo
              src={item.url}
              title={item.alt || 'Product media'}
              className="object-contain"
            />
          ) : (
            <CatalogImage
              src={item.url}
              alt={item.alt || 'Product media'}
              className="max-h-[calc(100vh-128px)] w-full object-contain"
              fallback={<div className="h-[420px] w-full bg-[#eff4ff]" />}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function LogoFallback({ name }: { name: string }) {
  return <IntegrationLogo name={name.toLowerCase()} size={112} />
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="inline-flex h-[40px] items-center rounded-full border border-white/25 bg-white/10 px-[14px] text-[14px] font-medium text-white backdrop-blur">
      {label}
    </span>
  )
}

function InsightCard({
  tone,
  title,
  body,
  icon,
}: {
  tone: 'positive' | 'caution'
  title: string
  body: string
  icon: React.ReactNode
}) {
  const positive = tone === 'positive'
  return (
    <div className={`rounded-[14px] border p-[18px] ${positive ? 'border-[#abefc6] bg-[#ecfdf3]' : 'border-[#fedf89] bg-[#fffaeb]'}`}>
      <div className={`flex items-center gap-[8px] ${positive ? 'text-[#067647]' : 'text-[#b54708]'}`}>
        {icon}
        <h3 className="text-[15px] font-semibold">{title}</h3>
      </div>
      <p className="mt-[10px] text-[14px] leading-[21px] text-[#414651]">{body}</p>
    </div>
  )
}

function MetadataCard({ label, value }: { label: string; value: string | null }) {
  if (!value) return null

  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-[#fafafa] p-[14px]">
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#717680]">{label}</p>
      <p className="mt-[6px] text-[14px] font-medium leading-[20px] text-[#414651]">{value}</p>
    </div>
  )
}

function PricingSummary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] bg-[#eff4ff] p-[14px]">
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#004eeb]">{label}</p>
      <p className="mt-[5px] text-[15px] font-semibold text-[#181d27]">{value}</p>
    </div>
  )
}

function PricingSourceDisclosure({ sourceUrl }: { sourceUrl: string | null }) {
  if (!sourceUrl) return null

  return (
    <div className="group/source relative w-fit">
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-[5px] text-[13px] font-semibold leading-[19px] text-[#004eeb] hover:underline focus:outline-none focus:ring-2 focus:ring-[#84adff] focus:ring-offset-2"
        aria-describedby="pricing-source-note"
      >
        View source?
        <ArrowUpRight size={13} />
      </a>
      <div
        id="pricing-source-note"
        className="pointer-events-none absolute bottom-[calc(100%+8px)] left-0 z-20 w-[280px] rounded-[10px] border border-[#e9eaeb] bg-white px-[12px] py-[10px] text-[12px] font-medium leading-[18px] text-[#535862] opacity-0 shadow-[0_12px_24px_rgba(10,13,18,0.12)] transition-opacity group-hover/source:opacity-100 group-focus-within/source:opacity-100"
      >
        Pricing changes often, so we keep the original vendor source available for verification.
      </div>
    </div>
  )
}

function PlanMeta({ value }: { value: string }) {
  return <span className="rounded-full bg-[#f2f4f7] px-[9px] py-[4px] font-medium">{value}</span>
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-[12px] border border-dashed border-[#d5d7da] bg-[#fafafa] px-[20px] py-[32px] text-center">
      <p className="text-[14px] leading-[20px] text-[#717680]">{message}</p>
    </div>
  )
}

function formatLabel(value: string) {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function isPublishedMetaValue(value: string | null | undefined): value is string {
  return Boolean(value && value.toLowerCase() !== 'unknown' && !isUnpublishedValue(value))
}

function getPricingSourceUrl(plans: { source_url: string | null }[]): string | null {
  return plans.find((plan) => plan.source_url)?.source_url ?? null
}
