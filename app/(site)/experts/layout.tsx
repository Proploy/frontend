import type { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'

export const metadata: Metadata = constructMetadata({
  title: 'Explore Vetted Software Experts',
  description:
    'Browse top software implementation and deployment experts, consultants, and architects filtered by platform, industry, and verified reviews.',
  path: '/experts',
  keywords: [
    'software consultants',
    'implementation experts',
    'vetted SaaS consultants',
    'freelance software architects',
    'Proploy experts directory',
  ],
})

export default function ExpertsLayout({ children }: { children: React.ReactNode }) {
  return children
}
