import type { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import { ExpertCategoryPage } from '../category-page'

export const metadata: Metadata = constructMetadata({
  title: "Business Consulting Experts",
  description: "Vetted management, IT strategy, and business consulting experts for digital transformation and enterprise workflows.",
  path: "/experts/consulting",
  keywords: ["business consulting experts","IT strategy consultants","digital transformation specialists"],
})

export default function ConsultingExpertsPage() {
  return (
    <ExpertCategoryPage
      config={{
        slug: 'consulting',
        categoryLabel: 'consulting',
        eyebrow: 'Expert directory — Business consulting',
        titleLines: ['Advice that comes', 'with the rollout.'],
        lede:
          'Strategy, advisory and transformation consultants who stay through implementation — the recommendation and the delivery from the same specialist.',
        keywords: {
          projectTypes: ['consult', 'strategy', 'advisory', 'transformation'],
        },
      }}
    />
  )
}
