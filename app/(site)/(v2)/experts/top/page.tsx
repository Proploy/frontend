import type { Metadata } from 'next'
import { ExpertCategoryPage } from '../category-page'

export const metadata: Metadata = {
  title: 'Top experts — Proploy',
  description:
    'The most experienced specialists on Proploy — interviewed, reference-checked and graded against the playbook for the software they implement.',
}

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
