import type { Metadata } from 'next'
import { ExpertCategoryPage } from '../category-page'

export const metadata: Metadata = {
  title: 'Marketing experts — Proploy',
  description:
    'Vetted marketing, SEO, growth and content specialists — including HubSpot implementers — who run the ops behind the funnel.',
}

export default function MarketingExpertsPage() {
  return (
    <ExpertCategoryPage
      config={{
        slug: 'marketing',
        categoryLabel: 'marketing',
        eyebrow: 'Expert directory — Marketing ops',
        titleLines: ['Marketing ops that', 'move the pipeline.'],
        lede:
          'SEO, growth, content and marketing-automation specialists who wire up the stack, run the campaigns and report the numbers that matter.',
        keywords: {
          platforms: ['hubspot'],
          projectTypes: ['marketing', 'seo', 'growth', 'content'],
        },
      }}
    />
  )
}
