import type { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import { ExpertCategoryPage } from '../category-page'

export const metadata: Metadata = constructMetadata({
  title: "Finance & Ops Software Experts",
  description: "Specialists in ERP implementation, accounting systems, billing infrastructure, and revenue operations.",
  path: "/experts/finance-ops",
  keywords: ["finance ops experts","ERP implementation","RevOps consultants","billing automation"],
})

export default function FinanceOpsExpertsPage() {
  return (
    <ExpertCategoryPage
      config={{
        slug: 'finance-ops',
        categoryLabel: 'finance & ops',
        eyebrow: 'Expert directory — Finance & ops',
        titleLines: ['The back office,', 'run like a product.'],
        lede:
          'Accounting, billing, ERP and operations specialists who implement the systems your finance team actually closes the books with.',
        keywords: {
          platforms: ['erp', 'quickbooks', 'netsuite', 'xero'],
          projectTypes: [
            'finance',
            'accounting',
            'billing',
            'operations',
            'procurement',
            'payroll',
            'invoic',
          ],
        },
      }}
    />
  )
}
