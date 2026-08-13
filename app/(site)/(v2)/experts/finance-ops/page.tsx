import type { Metadata } from 'next'
import { ExpertCategoryPage } from '../category-page'

export const metadata: Metadata = {
  title: 'Finance & ops experts — Proploy',
  description:
    'Vetted finance, accounting, billing, ERP and operations specialists who keep the back office running and audit-ready.',
}

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
