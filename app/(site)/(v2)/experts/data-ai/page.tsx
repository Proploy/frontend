import type { Metadata } from 'next'
import { ExpertCategoryPage } from '../category-page'

export const metadata: Metadata = {
  title: 'Data & AI experts — Proploy',
  description:
    'Vetted data, analytics, machine learning and AI automation specialists who turn your pipelines and models into working systems.',
}

export default function DataAiExpertsPage() {
  return (
    <ExpertCategoryPage
      config={{
        slug: 'data-ai',
        categoryLabel: 'data & AI',
        eyebrow: 'Expert directory — Data & AI',
        titleLines: ['From raw data', 'to working intelligence.'],
        lede:
          'Analytics engineers, ML practitioners and automation specialists who ship pipelines, models and AI workflows that hold up in production.',
        keywords: {
          platforms: ['llm'],
          projectTypes: [
            'data',
            'machine learning',
            'artificial intelligence',
            'analytics',
            'automation',
          ],
        },
      }}
    />
  )
}
