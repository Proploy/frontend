import type { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'

export const metadata: Metadata = constructMetadata({
  title: 'Become an Expert',
  description:
    'Join Proploy as a verified software expert. Get matched with high-intent briefs from businesses deploying your tech stack.',
  path: '/become-expert',
  keywords: [
    'freelance software consultant',
    'apply as expert',
    'software architect jobs',
    'SaaS consultant network',
  ],
})

export default function BecomeExpertLayout({ children }: { children: React.ReactNode }) {
  return children
}
