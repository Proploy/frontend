/**
 * Schema registry.
 *
 * Order matters only for the Studio sidebar's "New document" menu —
 * `structure.ts` controls the sidebar layout itself, not this list. We
 * group: shared primitives → reusable objects → documents, so the New
 * menu shows documents last.
 */
import type { SchemaTypeDefinition } from 'sanity'

// Shared primitives (re-used across objects)
import { seo } from './shared/seo'
import { cta } from './shared/cta'

// Section objects (page-builder)
import { comparisonCell } from './objects/comparisonCell'
import { homeHeroSection } from './objects/heroSection'
import { marketingHeroSection } from './objects/marketingHeroSection'
import { valuePropsSection } from './objects/valuePropsSection'
import { industriesSection } from './objects/industriesSection'
import { howItWorksSection } from './objects/howItWorksSection'
import { integrationsSection } from './objects/integrationsSection'
import { closingCtaSection } from './objects/closingCtaSection'
import { metricsSection } from './objects/metricsSection'
import { comparisonSection } from './objects/comparisonSection'
import { solutionCardsSection } from './objects/solutionCardsSection'
import { caseStudiesSection } from './objects/caseStudiesSection'
import { teamSection } from './objects/teamSection'
import { valuesSection } from './objects/valuesSection'
import { faqSection } from './objects/faqSection'
import { mapSection } from './objects/mapSection'
import { quoteTestimonialSection } from './objects/quoteTestimonialSection'
import { proseBlock } from './objects/proseBlock'
import { logoGridSection } from './objects/logoGridSection'
import { logoMarqueeSection } from './objects/logoMarqueeSection'

// Documents
import { siteSettings } from './documents/siteSettings'
import { navigation } from './documents/navigation'
import { footerSettings } from './documents/footerSettings'
import { page } from './documents/page'
import { post } from './documents/post'
import { author } from './documents/author'
import { category } from './documents/category'
import { legalPage } from './documents/legalPage'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Shared
  seo,
  cta,

  // Section objects
  comparisonCell,
  homeHeroSection,
  marketingHeroSection,
  valuePropsSection,
  industriesSection,
  howItWorksSection,
  integrationsSection,
  closingCtaSection,
  metricsSection,
  comparisonSection,
  solutionCardsSection,
  caseStudiesSection,
  teamSection,
  valuesSection,
  faqSection,
  mapSection,
  quoteTestimonialSection,
  proseBlock,
  logoGridSection,
  logoMarqueeSection,

  // Documents
  siteSettings,
  navigation,
  footerSettings,
  page,
  post,
  author,
  category,
  legalPage,
]
