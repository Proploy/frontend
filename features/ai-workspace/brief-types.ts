/**
 * Structured briefs produced by the harness document skills
 * (agent-harness/src/agent_harness/tools/skills/structured.py). The gateway
 * forwards them as `document.data`; the workspace renders them natively.
 */

export type FitStatus = 'yes' | 'partial' | 'no' | 'unknown'

export type BattleCardProduct = {
  product_id: string
  product_name: string
  tagline?: string | null
  best_for?: string | null
  pricing_summary?: string | null
  avg_rating?: number | null
  total_reviews?: number | null
  free_trial?: boolean
  free_plan?: boolean
  deployment_models?: string[]
  compliance_labels?: string[]
}

export type BattleCardRequirement = {
  requirement: string
  why_it_matters?: string
  fit: Record<string, { status: FitStatus; note?: string }>
}

export type BattleCardData = {
  title: string
  buyer_context?: string
  products: BattleCardProduct[]
  requirements: BattleCardRequirement[]
  strengths: Record<string, string[]>
  weaknesses: Record<string, string[]>
  community: Record<string, string>
  recommendation: { product_id: string; reason?: string }
  next_steps: string[]
}

export type ProjectBriefPhase = {
  phase: string
  duration?: string
  owner?: string
  activities: string[]
}

export type ProjectBriefData = {
  title: string
  recommended_product: { product_id: string; product_name: string; tagline?: string | null; best_for?: string | null }
  use_case?: string
  executive_summary?: string
  business_objectives: string[]
  key_requirements: string[]
  shortlist: Array<{
    product_id: string
    product_name: string
    tagline?: string | null
    best_for?: string | null
    avg_rating?: number | null
    free_trial?: boolean
    free_plan?: boolean
    is_recommended?: boolean
  }>
  recommendation: { product_id: string; rationale?: string }
  success_criteria: string[]
  implementation_plan: ProjectBriefPhase[]
  risks: Array<{ risk: string; mitigation?: string }>
  next_steps: string[]
}

const FIT: FitStatus[] = ['yes', 'partial', 'no', 'unknown']

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string' && v.trim().length > 0) : []
}

function record<T>(value: unknown, map: (v: unknown) => T): Record<string, T> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, map(v)]))
}

export function asBattleCard(data: unknown): BattleCardData | null {
  if (!data || typeof data !== 'object') return null
  const raw = data as Record<string, unknown>
  if (!Array.isArray(raw.products) || raw.products.length === 0) return null
  const products: BattleCardProduct[] = raw.products
    .filter((p): p is Record<string, unknown> => Boolean(p) && typeof p === 'object')
    .filter((p) => typeof p.product_id === 'string')
    .map((p) => ({
      product_id: String(p.product_id),
      product_name: typeof p.product_name === 'string' ? p.product_name : String(p.product_id),
      tagline: typeof p.tagline === 'string' ? p.tagline : null,
      best_for: typeof p.best_for === 'string' ? p.best_for : null,
      pricing_summary: typeof p.pricing_summary === 'string' ? p.pricing_summary : null,
      avg_rating: typeof p.avg_rating === 'number' ? p.avg_rating : null,
      total_reviews: typeof p.total_reviews === 'number' ? p.total_reviews : null,
      free_trial: p.free_trial === true,
      free_plan: p.free_plan === true,
      deployment_models: strings(p.deployment_models),
      compliance_labels: strings(p.compliance_labels),
    }))
  if (products.length === 0) return null
  const requirements: BattleCardRequirement[] = (Array.isArray(raw.requirements) ? raw.requirements : [])
    .filter((r): r is Record<string, unknown> => Boolean(r) && typeof r === 'object' && typeof (r as Record<string, unknown>).requirement === 'string')
    .map((r) => ({
      requirement: String(r.requirement),
      why_it_matters: typeof r.why_it_matters === 'string' ? r.why_it_matters : undefined,
      fit: record(r.fit, (cell) => {
        const c = cell && typeof cell === 'object' ? (cell as Record<string, unknown>) : {}
        const status = typeof c.status === 'string' && (FIT as string[]).includes(c.status) ? (c.status as FitStatus) : 'unknown'
        return { status, note: typeof c.note === 'string' ? c.note : undefined }
      }),
    }))
  const rec = raw.recommendation && typeof raw.recommendation === 'object' ? (raw.recommendation as Record<string, unknown>) : {}
  return {
    title: typeof raw.title === 'string' ? raw.title : 'Comparison brief',
    buyer_context: typeof raw.buyer_context === 'string' ? raw.buyer_context : undefined,
    products,
    requirements,
    strengths: record(raw.strengths, strings),
    weaknesses: record(raw.weaknesses, strings),
    community: record(raw.community, (v) => (typeof v === 'string' ? v : '')),
    recommendation: {
      product_id: typeof rec.product_id === 'string' ? rec.product_id : products[0].product_id,
      reason: typeof rec.reason === 'string' ? rec.reason : undefined,
    },
    next_steps: strings(raw.next_steps),
  }
}

export function asProjectBrief(data: unknown): ProjectBriefData | null {
  if (!data || typeof data !== 'object') return null
  const raw = data as Record<string, unknown>
  const rp = raw.recommended_product && typeof raw.recommended_product === 'object' ? (raw.recommended_product as Record<string, unknown>) : null
  if (!rp || typeof rp.product_id !== 'string') return null
  const rec = raw.recommendation && typeof raw.recommendation === 'object' ? (raw.recommendation as Record<string, unknown>) : {}
  return {
    title: typeof raw.title === 'string' ? raw.title : 'Implementation brief',
    recommended_product: {
      product_id: rp.product_id,
      product_name: typeof rp.product_name === 'string' ? rp.product_name : rp.product_id,
      tagline: typeof rp.tagline === 'string' ? rp.tagline : null,
      best_for: typeof rp.best_for === 'string' ? rp.best_for : null,
    },
    use_case: typeof raw.use_case === 'string' ? raw.use_case : undefined,
    executive_summary: typeof raw.executive_summary === 'string' ? raw.executive_summary : undefined,
    business_objectives: strings(raw.business_objectives),
    key_requirements: strings(raw.key_requirements),
    shortlist: (Array.isArray(raw.shortlist) ? raw.shortlist : [])
      .filter((p): p is Record<string, unknown> => Boolean(p) && typeof p === 'object' && typeof (p as Record<string, unknown>).product_id === 'string')
      .map((p) => ({
        product_id: String(p.product_id),
        product_name: typeof p.product_name === 'string' ? p.product_name : String(p.product_id),
        tagline: typeof p.tagline === 'string' ? p.tagline : null,
        best_for: typeof p.best_for === 'string' ? p.best_for : null,
        avg_rating: typeof p.avg_rating === 'number' ? p.avg_rating : null,
        free_trial: p.free_trial === true,
        free_plan: p.free_plan === true,
        is_recommended: p.is_recommended === true,
      })),
    recommendation: {
      product_id: typeof rec.product_id === 'string' ? rec.product_id : rp.product_id,
      rationale: typeof rec.rationale === 'string' ? rec.rationale : undefined,
    },
    success_criteria: strings(raw.success_criteria),
    implementation_plan: (Array.isArray(raw.implementation_plan) ? raw.implementation_plan : [])
      .filter((p): p is Record<string, unknown> => Boolean(p) && typeof p === 'object' && typeof (p as Record<string, unknown>).phase === 'string')
      .map((p) => ({
        phase: String(p.phase),
        duration: typeof p.duration === 'string' ? p.duration : undefined,
        owner: typeof p.owner === 'string' ? p.owner : undefined,
        activities: strings(p.activities),
      })),
    risks: (Array.isArray(raw.risks) ? raw.risks : [])
      .filter((r): r is Record<string, unknown> => Boolean(r) && typeof r === 'object' && typeof (r as Record<string, unknown>).risk === 'string')
      .map((r) => ({ risk: String(r.risk), mitigation: typeof r.mitigation === 'string' ? r.mitigation : undefined })),
    next_steps: strings(raw.next_steps),
  }
}

/** Share of requirements a product meets, counting partial as half. */
export function fitScore(card: BattleCardData, productId: string): { met: number; partial: number; missing: number; unknown: number; percent: number } {
  const counts = { met: 0, partial: 0, missing: 0, unknown: 0 }
  for (const requirement of card.requirements) {
    const status = requirement.fit[productId]?.status ?? 'unknown'
    if (status === 'yes') counts.met += 1
    else if (status === 'partial') counts.partial += 1
    else if (status === 'no') counts.missing += 1
    else counts.unknown += 1
  }
  const assessed = counts.met + counts.partial + counts.missing
  const percent = assessed === 0 ? 0 : Math.round(((counts.met + counts.partial * 0.5) / assessed) * 100)
  return { ...counts, percent }
}
