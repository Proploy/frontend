import type { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import { ExpertCategoryPage } from '../category-page'

export const metadata: Metadata = constructMetadata({
  title: "Top Rated Software Experts",
  description: "The highest-rated, verified software architects and implementation specialists across the Proploy marketplace.",
  path: "/experts/top",
  keywords: ["top rated experts","elite software consultants","vetted architects","verified specialists"],
})

export default function TopExpertsPage() {
  return (
    <ExpertCategoryPage
      config={{
        slug: 'top',
        categoryLabel: 'top-rated',
        eyebrow: 'Expert directory — Top experts',
        titleLines: ['The specialists', 'clients rebook.'],
        lede:
          'The deepest track records in the network, ranked by years in the trade — every one interviewed, reference-checked and graded before they take a brief.',
        sort: 'experience',
        take: 12,
      }}
    />
  )
}
