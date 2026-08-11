import { defineField, defineType } from 'sanity'
import { homeHeroSection } from '../objects/heroSection'
import { marketingHeroSection } from '../objects/marketingHeroSection'
import { valuePropsSection } from '../objects/valuePropsSection'
import { industriesSection } from '../objects/industriesSection'
import { howItWorksSection } from '../objects/howItWorksSection'
import { integrationsSection } from '../objects/integrationsSection'
import { closingCtaSection } from '../objects/closingCtaSection'
import { metricsSection } from '../objects/metricsSection'
import { comparisonSection } from '../objects/comparisonSection'
import { solutionCardsSection } from '../objects/solutionCardsSection'
import { caseStudiesSection } from '../objects/caseStudiesSection'
import { teamSection } from '../objects/teamSection'
import { valuesSection } from '../objects/valuesSection'
import { faqSection } from '../objects/faqSection'
import { mapSection } from '../objects/mapSection'
import { quoteTestimonialSection } from '../objects/quoteTestimonialSection'
import { proseBlock } from '../objects/proseBlock'
import { logoGridSection } from '../objects/logoGridSection'
import { logoMarqueeSection } from '../objects/logoMarqueeSection'
import { seo } from '../shared/seo'

/**
 * page — the page-builder doc that drives the marketing surface.
 *
 * Each section is a typed object; the renderer in Phase 4 maps `_type` to
 * the corresponding React component. Marketing can reorder sections without
 * code changes. The slug is what Phase 4 queries by — today those map to:
 *
 *   "home"            → (landing-page)
 *   "for-businesses"  → for-businesses
 *   "for-experts"     → for-experts
 *
 * Adding a new marketing page means: create a `page` doc with the right
 * slug + sections, then add a thin route that fetches and renders it.
 */
const sectionTypes = [
  homeHeroSection.name,
  marketingHeroSection.name,
  valuePropsSection.name,
  industriesSection.name,
  howItWorksSection.name,
  integrationsSection.name,
  closingCtaSection.name,
  metricsSection.name,
  comparisonSection.name,
  solutionCardsSection.name,
  caseStudiesSection.name,
  teamSection.name,
  valuesSection.name,
  faqSection.name,
  mapSection.name,
  quoteTestimonialSection.name,
  proseBlock.name,
  logoGridSection.name,
  logoMarqueeSection.name,
] as const

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 64 },
      validation: (R) => R.required(),
      description: 'URL identifier — "home", "for-businesses", "for-experts", …',
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: sectionTypes.map((type) => ({ type })),
    }),
    defineField({ name: 'seo', type: seo.name }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current', sections: 'sections' },
    prepare: ({ title, slug, sections }) => ({
      title,
      subtitle: `/${slug ?? '?'} · ${sections?.length ?? 0} sections`,
    }),
  },
})
