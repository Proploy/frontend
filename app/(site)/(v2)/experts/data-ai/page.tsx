import type { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import { ExpertCategoryPage } from '../category-page'

export const metadata: Metadata = constructMetadata({
  title: "Data & AI Implementation Experts",
  description: "Top data engineers, ML architects, LLM integrators, and analytics specialists for modern data stacks.",
  path: "/experts/data-ai",
  keywords: ["Data & AI experts","machine learning engineers","analytics consultants","AI deployment"],
})

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
