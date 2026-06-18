// Reviews & ratings fixtures. The loop: a business reviews an expert when a
// project completes; the rating feeds the expert's public profile and reputation.
// Shaped to map onto a future `/api/v1/reviews`.

export interface Review {
  id: string
  author: string // business / reviewer name
  company: string
  project: string
  rating: number // 1-5
  title: string
  body: string
  date: string // ISO
  reply?: string | null
}

export interface ReviewableProject {
  id: string
  project: string
  expert: string
  expertInitial: string
  completedDate: string
}

// Reviews an expert has received (expert workspace).
export const EXPERT_REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Sofia Reyes',
    company: 'Atlas Logistics',
    project: 'Lead-routing & forecasting build',
    rating: 5,
    title: 'Shipped exactly what we scoped, on time',
    body: 'Clear communication, clean handover docs, and the forecasting model is already paying off. Would hire again.',
    date: '2026-06-10',
    reply: 'Thank you Sofia — great working with the Atlas team!',
  },
  {
    id: 'r2',
    author: 'Tom Albrecht',
    company: 'Lumen Health',
    project: 'HubSpot → Salesforce consolidation',
    rating: 5,
    title: 'Deep Salesforce expertise',
    body: 'Caught data-model issues we’d have missed and saved us weeks of rework.',
    date: '2026-05-22',
    reply: null,
  },
  {
    id: 'r3',
    author: 'Priya Nair',
    company: 'Northwind Capital',
    project: 'CRM migration',
    rating: 4,
    title: 'Strong delivery, minor timeline slip',
    body: 'Excellent technical work. One milestone ran a few days late but communication was proactive throughout.',
    date: '2026-04-30',
    reply: null,
  },
]

export function ratingSummary(reviews: Review[]) {
  const count = reviews.length
  const avg = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    n: reviews.filter((r) => r.rating === star).length,
  }))
  return { count, avg: Math.round(avg * 10) / 10, dist }
}

// Completed projects a business can still review (business workspace).
export const BUSINESS_REVIEWABLE: ReviewableProject[] = [
  { id: 'rev1', project: 'Marketing data warehouse', expert: 'Mei Lin', expertInitial: 'M', completedDate: '2026-06-12' },
  { id: 'rev2', project: 'Billing system integration', expert: 'Carlos Mendez', expertInitial: 'C', completedDate: '2026-05-28' },
]
