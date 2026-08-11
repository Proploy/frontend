import type { NormalizedError } from '@/lib/service-apis/browser'

export type EvaluationStatus = 'active' | 'archived' | 'deleted'
export type EvaluationAttentionGroup =
  | 'needs_attention'
  | 'in_progress'
  | 'ready_to_decide'
export type EvaluationStage =
  | 'defining_requirements'
  | 'discovering_products'
  | 'reviewing_evidence'
  | 'building_shortlist'
  | 'ready_for_recommendation'
  | 'recommendation_ready'
export type RegenerationStatus =
  | 'idle'
  | 'pending'
  | 'running'
  | 'failed'
export type PublicationState =
  | 'current'
  | 'updating'
  | 'failed'
  | 'generating'
  | 'unavailable'

export type EvaluationMilestones = {
  requirements_confirmed: boolean
  products_discovered: boolean
  shortlist_ready: boolean
  recommendation_generated: boolean
}

export type EvaluationSummary = {
  evaluation_id: string
  title: string
  status: EvaluationStatus
  stage: EvaluationStage
  attention_group: EvaluationAttentionGroup
  next_action: string
  shortlist_count: number
  match_count: number
  recommendation_state:
    | 'unavailable'
    | 'eligible'
    | 'current'
    | 'updating'
    | 'failed'
  regeneration_status: RegenerationStatus
  milestones: EvaluationMilestones
  progress_percent: number
}

export type RequirementValue = {
  state: 'answered' | 'no_requirement' | 'unanswered'
  value?: unknown
}

export type RequirementsDraft = Record<string, RequirementValue>

export type EvaluationProduct = {
  product_id: string
  product_name: string | null
  profile_href: string | null
  available: boolean
  rank?: number
  match_score?: number | null
  match_strength?: string
  best_for?: string
  reasons?: string[]
  considerations?: string[]
  evidence_bundle_id?: string
  data_freshness?: string | null
  uncertain_data?: string[]
  buyer_note?: string | null
  is_agent_selected?: boolean
}

export type EvaluationRecommendation = {
  recommendation_version_id?: string
  recommended_product: EvaluationProduct
  publication_state: PublicationState
  why_it_won: string[]
  main_trade_offs: string[]
  estimated_cost?: string | null
  supporting_evidence_bundle_ids: string[]
  alternative_product?: EvaluationProduct | null
}

export type EvaluationArtifactRef = {
  kind: 'requirements' | 'product_match' | 'recommendation'
  id: string
}

export type EvaluationMessage = {
  id: string
  role: 'user' | 'assistant'
  markdown: string
  artifact_refs: EvaluationArtifactRef[]
  status?: 'complete' | 'streaming' | 'failed'
}

export type EvaluationDetail = EvaluationSummary & {
  agent_session_id: string
  comparison_product_ids: string[]
  active_requirements_version_id?: string | null
  active_match_run_id?: string | null
  active_shortlist_version_id?: string | null
  active_recommendation_version_id?: string | null
  requirements: RequirementsDraft | null
  missing_critical_signals: string[]
  matches: EvaluationProduct[]
  shortlist: EvaluationProduct[]
  recommendation: EvaluationRecommendation | null
  documents?: Array<Record<string, unknown>>
  messages: EvaluationMessage[]
}

export type EvaluationEvidence = {
  evidence_bundle_id: string
  evaluation_id: string
  product_id: string
  purpose: string
  snapshot: {
    product?: {
      product_id: string
      product_name?: string | null
    }
    claims?: Array<Record<string, unknown>>
    review_summaries?: Array<Record<string, unknown>>
    review_sample_size?: number
    rating_sources?: Array<Record<string, unknown>>
    last_updated?: string | null
    missing_or_uncertain?: string[]
  }
}

export type ShortlistMutationResponse = {
  version: number
  items: EvaluationProduct[]
  job_id?: string | null
}

export type EvaluationCreateRequest = {
  title?: string
  agent_session_id?: string
  user_id?: never
}

export type ShortlistUpdateRequest = {
  items: EvaluationProduct[]
  user_id?: never
}

export type EvaluationApiResult<T> =
  | { ok: true; data: T }
  | NormalizedError

export type EvaluationStreamEvent =
  | { type: 'message_delta'; data: { delta: string } }
  | { type: 'message_final'; data: { content: string } }
  | {
      type: 'status'
      data: { content?: string; status?: 'running' | 'done' | string }
    }
  | {
      type: 'evaluation_state'
      data: Partial<EvaluationDetail>
    }
  | {
      type: 'requirements_updated'
      data: {
        requirement_version_id: string
        missing_critical_signals?: string[]
      }
    }
  | {
      type: 'match_run_published'
      data: { match_run_id: string }
    }
  | {
      type: 'product_match_published'
      data: EvaluationProduct
    }
  | {
      type: 'shortlist_updated'
      data: { items: EvaluationProduct[] }
    }
  | {
      type: 'recommendation_published'
      data: { recommendation: EvaluationRecommendation }
    }
  | {
      type: 'document_ready'
      data: { document: Record<string, unknown> }
    }
  | {
      type: 'regeneration_status'
      data: {
        status: RegenerationStatus
        scope: string[]
      }
    }
  | {
      type: 'error'
      data: { code: string; message: string; retryable: boolean }
    }
  | {
      type: 'done'
      data: {
        evaluation_id?: string
        agent_session_id?: string
        session_id?: string
        evaluation?: EvaluationDetail
      }
    }

export type EvaluationWorkspaceState = {
  summaries: EvaluationSummary[]
  detailsById: Record<string, EvaluationDetail>
  activeEvaluationId: string | null
  loading: boolean
  sendingById: Record<string, boolean>
  error: string | null
}
