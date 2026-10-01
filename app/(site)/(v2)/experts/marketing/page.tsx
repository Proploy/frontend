import type { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import { ExpertCategoryPage } from '../category-page'

export const metadata: Metadata = constructMetadata({
  title: "Marketing Ops & MarTech Experts",
  description: "Certified MarTech, CRM, marketing automation, and attribution tracking implementation consultants.",
  path: "/experts/marketing",
  keywords: ["marketing ops experts","MarTech consultants","CRM implementation","marketing automation"],
})

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
