import type { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'

export const metadata: Metadata = constructMetadata({
  title: 'Compare Software Products',
  description:
    'Side-by-side comparison of SaaS tools, pricing, compliance standards, integrations, and verified implementation experts.',
  path: '/compare',
  keywords: ['software comparison', 'SaaS compare', 'software features compare', 'tool alternatives', 'Proploy compare'],
})

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children
}
