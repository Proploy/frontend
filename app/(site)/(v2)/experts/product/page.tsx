import type { Metadata } from 'next'
import { ExpertCategoryPage } from '../category-page'

export const metadata: Metadata = {
  title: 'Product experts — Proploy',
  description:
    'Vetted product, UX, design and CRM specialists who turn roadmaps into launches customers actually adopt.',
}

export default function ProductExpertsPage() {
  return (
    <ExpertCategoryPage
      config={{
        slug: 'product',
        categoryLabel: 'product',
        eyebrow: 'Expert directory — Product',
        titleLines: ['Product people who', 'ship what users adopt.'],
        lede:
          'Product managers, UX practitioners, designers and CRM specialists with published case studies — matched to the outcome you need.',
        keywords: {
          platforms: ['crm'],
          projectTypes: ['product', 'ux', 'design', 'user experience'],
        },
      }}
    />
  )
}
