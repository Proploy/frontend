import type { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import { ExpertCategoryPage } from '../category-page'

export const metadata: Metadata = constructMetadata({
  title: "Software Engineering Experts",
  description: "Senior software architects, cloud engineers, and full-stack developers for complex software implementations.",
  path: "/experts/engineering",
  keywords: ["software engineering experts","cloud architects","backend developers","full-stack specialists"],
})

export default function EngineeringExpertsPage() {
  return (
    <ExpertCategoryPage
      config={{
        slug: 'engineering',
        categoryLabel: 'engineering',
        eyebrow: 'Expert directory — Engineering',
        titleLines: ['Engineers who ship', 'production, not decks.'],
        lede:
          'Backend, frontend, cloud and DevOps specialists with verified credentials and published case studies — ready to build, integrate and harden your stack.',
        keywords: {
          platforms: ['devops', 'cloud'],
          projectTypes: ['engineer', 'developer', 'software', 'backend', 'frontend'],
        },
      }}
    />
  )
}
