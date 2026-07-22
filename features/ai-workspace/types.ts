import type { NormalizedError } from '@/lib/service-apis/browser'

export type AiWorkspaceRecord = Record<string, unknown>

export type AiWorkspacePageContextPayload = {
  route: string
  page_type: string
  title?: string
  product_id?: string
  product_name?: string
  product_category?: string
  search_query?: string
  comparison_product_ids?: string[]
  filters?: AiWorkspaceRecord
  notes?: string[]
  summary?: string
  timestamp?: string
  [key: string]: unknown
}

export type AiWorkspacePageContextInput = Partial<AiWorkspacePageContextPayload> & {
  pageType?: string
  productId?: string
  productName?: string
  productCategory?: string
  searchQuery?: string
  comparisonProductIds?: string[]
}

export type AiWorkspaceProfile = {
  goals?: unknown[]
  constraints?: unknown[]
  pain_points?: unknown[]
  success_criteria?: unknown[]
  interested_products?: unknown[]
  active_shortlist?: unknown[]
  updated_fields?: unknown[]
  total_turns?: number
  [key: string]: unknown
}

export type AiWorkspaceRecommendation = AiWorkspaceRecord
export type AiWorkspaceSearchResult = AiWorkspaceRecord

export type AiWorkspaceToolCall = {
  name?: string
  status?: 'started' | 'completed' | 'failed' | string
  input?: AiWorkspaceRecord
  output?: AiWorkspaceRecord
  [key: string]: unknown
}

export type AiWorkspaceResearchRequest = {
  message: string
  session_id?: string
  page_context?: AiWorkspacePageContextPayload
  page_context_history?: AiWorkspacePageContextPayload[]
  user_id?: never
}

export type AiWorkspaceResearchResponse = {
  session_id: string
  user_id?: string
  message?: {
    content?: string
    [key: string]: unknown
  } | null
  timing_ms?: number | null
  profile?: AiWorkspaceProfile | null
  recommendations?: AiWorkspaceRecommendation[]
  search_results?: AiWorkspaceSearchResult[]
  tools_called?: AiWorkspaceToolCall[]
  document?: unknown
  error?: {
    code?: string
    message?: string
    retryable?: boolean
    [key: string]: unknown
  } | null
  [key: string]: unknown
}

export type AiWorkspaceSession = AiWorkspaceRecord & {
  session_id?: string
  id?: string
  title?: string
  name?: string
}

export type AiWorkspaceCandidate = AiWorkspaceRecord

/** Payload accepted by POST /api/v1/ai_workspace/candidates/add. */
export type AiWorkspaceCandidateAddPayload = {
  session_id: string
  candidate_data: AiWorkspaceRecord
}

/** Payload accepted by POST /api/v1/ai_workspace/candidates/remove. */
export type AiWorkspaceCandidateRemovePayload = {
  session_id: string
  candidate_id: string
}

/** Payload accepted by POST /api/v1/ai_workspace/session/save. */
export type AiWorkspaceSessionSavePayload = {
  session_id: string
  profile_name?: string
}

/** Payload accepted by POST /api/v1/ai_workspace/session/load. */
export type AiWorkspaceSessionLoadPayload = {
  profile_id: string
  session_id?: string
}

export type AiWorkspaceApiResult<T> = { ok: true; data: T } | NormalizedError

export type AiWorkspaceStreamEventName =
  | 'session'
  | 'message_delta'
  | 'message_final'
  | 'thinking'
  | 'tool_call'
  | 'recommendations'
  | 'profile'
  | 'error'
  | 'done'

export type AiWorkspaceStreamPayloadByEvent = {
  session: {
    session_id?: string
    user_id?: string
    [key: string]: unknown
  }
  message_delta: {
    delta?: string
    [key: string]: unknown
  }
  message_final: {
    content?: string
    [key: string]: unknown
  }
  thinking: {
    content?: string
    status?: 'running' | 'done' | string
    [key: string]: unknown
  }
  tool_call: AiWorkspaceToolCall
  recommendations: {
    items?: AiWorkspaceRecommendation[]
    [key: string]: unknown
  }
  profile: {
    profile?: AiWorkspaceProfile
    [key: string]: unknown
  }
  error: {
    code?: string
    message?: string
    retryable?: boolean
    [key: string]: unknown
  }
  done: Partial<AiWorkspaceResearchResponse> & AiWorkspaceRecord
}

export type AiWorkspaceStreamEvent = {
  [K in AiWorkspaceStreamEventName]: {
    type: K
    data: AiWorkspaceStreamPayloadByEvent[K]
  }
}[AiWorkspaceStreamEventName] | {
  type: 'unknown'
  event: string
  data: unknown
}

export type AiWorkspaceMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  status?: 'streaming' | 'complete' | 'failed'
}
