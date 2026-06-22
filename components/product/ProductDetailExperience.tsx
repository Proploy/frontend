'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  MapPin,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react'
import { CatalogImage } from '@/components/catalog/CatalogImage'
import { InlineVideo } from '@/components/media/InlineVideo'
import {
  getProductDetailTabs,
  getProductGalleryMedia,
  getProductHeroMedia,
  type ProductPageModel,
  type ProductTabKey,
} from '@/features/catalog'
import { useApprovedExperts } from '@/features/experts'

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
  const tabs = getProductDetailTabs(product)
  const heroMedia = getProductHeroMedia(product.media)
  const gallery = getProductGalleryMedia(product.media)
  const { experts, loading: expertsLoading } = useApprovedExperts({
    platform: product.product_name,
    limit: 8,
  })

  const selectTab = (tab: ProductTabKey) => {
    setActiveTab(tab)
    scrollToSection(tab)
  }

  return (
    <div className="bg-[#f7f9fc] font-[family-name:var(--font-dm-sans)] text-[#181d27]">
      <section className="relative overflow-hidden border-b border-[#e9eaeb] bg-[#0b1f4f]">
        <div className="absolute inset-0">
          {heroMedia ? (
            heroMedia.type === 'video' ? (
              <InlineVideo
                url={heroMedia.url}
                title={heroMedia.alt || `${product.product_name} product preview`}
                mode="direct"
              />
            ) : (
              <CatalogImage
                src={heroMedia.url}
                alt={heroMedia.alt || `${product.product_name} product preview`}
                className="size-full object-cover"
                fallback={<div className="size-full bg-gradient-to-br from-[#0b1f4f] via-[#155eef] to-[#7f56d9]" />}
              />
            )
          ) : (
            <div className="size-full bg-gradient-to-br from-[#0b1f4f] via-[#155eef] to-[#7f56d9]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#071638]/95 via-[#071638]/70 to-[#071638]/20" />
        </div>

        <div className="relative mx-auto flex min-h-[440px] max-w-[1280px] items-end px-[24px] pb-[56px] pt-[148px] sm:px-[32px]">
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

      <div className="sticky top-[72px] z-30 border-b border-[#e9eaeb] bg-white/95 backdrop-blur">
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
                          {plan.price_text || (plan.is_contact_sales ? 'Contact sales' : 'Pricing unavailable')}
                        </p>
                      </div>
                      {plan.is_free && (
                        <span className="rounded-full bg-[#ecfdf3] px-[10px] py-[3px] text-[12px] font-semibold text-[#067647]">
                          Free
                        </span>
                      )}
                    </div>

                    <div className="mt-[16px] flex flex-wrap gap-[8px] text-[12px] text-[#535862]">
                      {plan.billing_period && <PlanMeta value={formatLabel(plan.billing_period)} />}
                      {plan.pricing_model && plan.pricing_model !== 'unknown' && (
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

          <DetailSection id="media" title={`${product.product_name} media`}>
            {mediaError ? (
              <div className="rounded-[12px] border border-[#fda29b] bg-[#fef3f2] p-[24px] text-center">
                <p className="text-[14px] font-medium text-[#b42318]">Product media could not be loaded.</p>
                <button
                  type="button"
                  onClick={onRetryMedia}
                  className="mt-[12px] rounded-[8px] bg-[#155eef] px-[14px] py-[9px] text-[14px] font-semibold text-white"
                >
                  Retry media
                </button>
              </div>
            ) : gallery.length > 0 ? (
              <div className="grid gap-[16px] sm:grid-cols-2">
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    className="aspect-video overflow-hidden rounded-[14px] border border-[#e9eaeb] bg-[#f2f4f7]"
                  >
                    {item.type === 'video' ? (
                      <InlineVideo
                        url={item.url}
                        title={item.alt || `${product.product_name} video`}
                        mode="direct"
                      />
                    ) : (
                      <CatalogImage
                        src={item.url}
                        alt={item.alt || `${product.product_name} media`}
                        className="size-full object-cover"
                        fallback={<div className="size-full bg-[#f2f4f7]" />}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No approved product media is available." />
            )}
          </DetailSection>

          <DetailSection id="experts" title={`${product.product_name} vetted experts`}>
            {expertsLoading ? (
              <div className="grid gap-[16px] md:grid-cols-2">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="h-[170px] animate-pulse rounded-[14px] bg-[#f2f4f7]" />
                ))}
              </div>
            ) : experts.length > 0 ? (
              <div className="grid gap-[16px] md:grid-cols-2">
                {experts.map((expert) => (
                  <article key={expert.id} className="flex flex-col rounded-[14px] border border-[#e9eaeb] p-[18px]">
                    <div className="flex items-start gap-[12px]">
                      <div className="flex size-[44px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#155eef] text-[18px] font-semibold text-white">
                        {expert.profilePictureUrl ? (
                          <CatalogImage
                            src={expert.profilePictureUrl}
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

                    <Link
                      href={`/experts/${expert.id}`}
                      className="mt-[18px] inline-flex items-center gap-[5px] text-[14px] font-semibold text-[#004eeb]"
                    >
                      View profile
                      <ArrowRight size={16} />
                    </Link>
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
            <div className="rounded-[16px] border border-[#e9eaeb] bg-white p-[20px] shadow-[0_8px_20px_rgba(10,13,18,0.04)]">
              <div className="flex items-center gap-[8px]">
                <CircleDollarSign size={20} className="text-[#155eef]" />
                <h2 className="text-[16px] font-semibold">Pricing at a glance</h2>
              </div>
              <p className="mt-[14px] text-[28px] font-semibold leading-[36px] tracking-[-0.56px]">
                {product.pricing_plans[0]?.price_text || formatLabel(product.pricing_bucket || 'Contact vendor')}
              </p>
              <p className="mt-[4px] text-[13px] leading-[19px] text-[#717680]">
                {product.pricing_plans.length > 0
                  ? `${product.pricing_plans.length} published plan${product.pricing_plans.length === 1 ? '' : 's'}`
                  : 'Detailed plans are not published yet'}
              </p>
              <button
                type="button"
                onClick={() => selectTab('pricing')}
                className="mt-[16px] inline-flex items-center gap-[5px] text-[14px] font-semibold text-[#004eeb]"
              >
                See all pricing
                <ChevronRight size={16} />
              </button>
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
          </div>
        </aside>
      </main>
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

function LogoFallback({ name }: { name: string }) {
  return <span className="text-[34px] font-bold text-[#155eef]">{name.charAt(0).toUpperCase()}</span>
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
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-[#fafafa] p-[14px]">
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#717680]">{label}</p>
      <p className="mt-[6px] text-[14px] font-medium leading-[20px] text-[#414651]">{value || 'Not published'}</p>
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
