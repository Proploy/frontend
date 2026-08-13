import type { Metadata } from 'next'
import { ExpertCategoryPage } from '../category-page'

export const metadata: Metadata = {
  title: 'Business consulting experts — Proploy',
  description:
    'Vetted strategy, advisory and transformation consultants who pair the recommendation with the rollout.',
}

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
