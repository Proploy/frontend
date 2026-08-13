import type { Metadata } from 'next'
import { ExpertCategoryPage } from '../category-page'

export const metadata: Metadata = {
  title: 'Engineering experts — Proploy',
  description:
    'Vetted software, cloud, backend, frontend and DevOps specialists who take implementation from spec to shipped.',
}

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
