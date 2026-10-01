import type { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import { ExpertCategoryPage } from '../category-page'

export const metadata: Metadata = constructMetadata({
  title: "Product Management & Design Experts",
  description: "Experienced product managers, UI/UX designers, and technical writers for end-to-end product delivery.",
  path: "/experts/product",
  keywords: ["product management experts","UX designers","technical product consultants"],
})

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
