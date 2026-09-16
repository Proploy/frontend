import type {
  EvaluationDetail,
  EvaluationMessage,
  EvaluationProduct,
  EvaluationRecommendation,
  EvaluationStreamEvent,
  EvaluationSummary,
  RequirementsDraft,
} from './evaluation-types'
import type { AiWorkspaceProfile } from './types'
import { cleanMarkdown } from './clean-markdown'

function productArray(value: unknown): EvaluationProduct[] {
  return Array.isArray(value)
    ? value.filter((item): item is EvaluationProduct => (
        Boolean(item) &&
        typeof item === 'object' &&
        typeof (item as EvaluationProduct).product_id === 'string'
      ))
    : []
}

function recommendationValue(value: unknown): EvaluationRecommendation | null {
  if (!value || typeof value !== 'object') return null
  const recommendation = value as EvaluationRecommendation
  return recommendation.recommended_product?.product_id
    ? recommendation
    : null
}

/**
 * A profile list entry is either a plain string or an object carrying a `text`
 * field, depending on which agent turn wrote it. Anything else has no text to
 * show and collapses to the empty string so the caller drops it.
 */
function profileEntryText(value: unknown): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'text' in value) {
    return value.text ? String(value.text) : ''
  }
  return ''
}

/** The `type` a loosely-shaped profile constraint labels itself with, if any. */
function constraintType(value: unknown): unknown {
  if (value && typeof value === 'object' && 'type' in value) return value.type
  return undefined
}

export function parseAssistantMarkdown(markdown: string) {
  let displayMarkdown = markdown
  const extractedMatches: EvaluationProduct[] = []
  
  const objectRegex = /{[^{}]*"product_id"[^{}]*}/g
  let objMatch
  let firstMatchIndex = -1
  while ((objMatch = objectRegex.exec(markdown)) !== null) {
    if (firstMatchIndex === -1) {
      firstMatchIndex = objMatch.index
    }
    const objStr = objMatch[0]
    const pidMatch = /"product_id"\s*:\s*"([^"]+)"/.exec(objStr)
    const scoreMatch = /"agent_score"\s*:\s*([\d.]+)/.exec(objStr)
    const reasonMatch = /"reason"\s*:\s*"([^"]+)"/.exec(objStr)
    
    if (pidMatch) {
      const pid = pidMatch[1]
      const scoreRaw = scoreMatch?.[1]
      const reasonRaw = reasonMatch?.[1]
      const score = scoreRaw ? Math.round(Number(scoreRaw) * 10) : undefined
      const reason = reasonRaw ? reasonRaw : undefined
      extractedMatches.push({
        product_id: pid,
        product_name: pid,
        profile_href: null,
        available: true,
        match_score: score !== undefined ? score : 0,
        reasons: reason ? [reason] : [],
        is_agent_selected: true,
      })
    }
  }

  if (firstMatchIndex !== -1) {
    const markerIndex = markdown.lastIndexOf('SELECTED_PRODUCT_IDS:', firstMatchIndex)
    if (markerIndex !== -1 && markerIndex > firstMatchIndex - 60) {
      displayMarkdown = displayMarkdown.slice(0, markerIndex).trim()
    } else {
      const jsonStartIndex = markdown.lastIndexOf('[', firstMatchIndex) !== -1 && markdown.lastIndexOf('[', firstMatchIndex) > firstMatchIndex - 20
        ? markdown.lastIndexOf('[', firstMatchIndex)
        : firstMatchIndex
        
      const codeBlockIndex = markdown.lastIndexOf('```json', jsonStartIndex) !== -1 && markdown.lastIndexOf('```json', jsonStartIndex) > jsonStartIndex - 20
        ? markdown.lastIndexOf('```json', jsonStartIndex)
        : markdown.lastIndexOf('```', jsonStartIndex) !== -1 && markdown.lastIndexOf('```', jsonStartIndex) > jsonStartIndex - 20
          ? markdown.lastIndexOf('```', jsonStartIndex)
          : jsonStartIndex
      
      displayMarkdown = displayMarkdown.slice(0, codeBlockIndex).trim()
    }
  }

  displayMarkdown = cleanMarkdown(displayMarkdown)

  return { displayMarkdown, extractedMatches }
}

export function draftFromProfile(profile: AiWorkspaceProfile | null | undefined): RequirementsDraft | null {
  if (!profile) return null
  const draft: RequirementsDraft = {}

  const getGoalText = () => {
    if (Array.isArray(profile.goals) && profile.goals.length > 0) {
      return profile.goals
        .map(profileEntryText)
        .filter(Boolean)
        .join('; ')
    }
    return null
  }

  const getConstraint = (type: string) => {
    if (Array.isArray(profile.constraints)) {
      const c = profile.constraints.find((item) => Boolean(item) && typeof item === 'object' && (item as Record<string, unknown>).type === type)
      if (c && (c as Record<string, unknown>).value) return String((c as Record<string, unknown>).value)
    }
    return null
  }

  const getArrayText = (arr: unknown) => {
    if (Array.isArray(arr) && arr.length > 0) {
      return arr
        .map(profileEntryText)
        .filter(Boolean)
        .join(', ')
    }
    return null
  }

  const primaryUseCase = getGoalText()
  if (primaryUseCase) {
    draft.primary_use_case = { state: 'answered', value: primaryUseCase }
  }

  const problemFrame = getArrayText(profile.pain_points)
  if (problemFrame) {
    draft.problem_frame = { state: 'answered', value: problemFrame }
  }

  const teamSize = getConstraint('team_size') || (profile.team_size != null ? String(profile.team_size) : null)
  if (teamSize) {
    draft.team_size = { state: 'answered', value: teamSize }
  }

  const budget = getConstraint('budget') || (profile.budget_tier ? String(profile.budget_tier) : null)
  if (budget) {
    draft.budget = { state: 'answered', value: budget }
  }

  const integrations =
    getConstraint('integrations') ||
    getArrayText(profile.interested_products) ||
    getArrayText(profile.integrations)
  if (integrations) {
    draft.required_integrations = { state: 'answered', value: integrations }
  }

  const security = getConstraint('compliance') || getArrayText(profile.compliance)
  if (security) {
    draft.security = { state: 'answered', value: security }
  }

  const deployment = getConstraint('deployment') || (profile.deployment ? String(profile.deployment) : null)
  if (deployment) {
    draft.deployment = { state: 'answered', value: deployment }
  }

  const category =
    getConstraint('category') ||
    (profile.industry ? String(profile.industry) : null) ||
    getArrayText(profile.interested_domains)
  if (category) {
    draft.category = { state: 'answered', value: category }
  }

  const capabilities = getArrayText(profile.success_criteria)
  if (capabilities) {
    draft.required_capabilities = { state: 'answered', value: capabilities }
  }

  return Object.keys(draft).length > 0 ? draft : null
}

/**
 * Sam's results accumulate for the life of an evaluation. Incoming server
 * products (the agent's selection for a turn, already persisted by the
 * gateway) are appended to what we have; a product Sam names again keeps its
 * place but takes the newer score and reasons. Provisional entries the client
 * scraped while a reply was streaming are replaced by the server's copy.
 */
export function mergeMatches(
  localMatches: EvaluationProduct[],
  serverMatches: EvaluationProduct[] | undefined,
): EvaluationProduct[] {
  if (!serverMatches || serverMatches.length === 0) return localMatches
  const merged = [...localMatches]
  for (const incoming of serverMatches) {
    const index = merged.findIndex((m) => m.product_id === incoming.product_id)
    if (index >= 0) merged[index] = { ...merged[index], ...incoming }
    else merged.push(incoming)
  }
  return merged
}

/** Products the agent put forward. Anything else never reaches the panel. */
export function agentSelectedProducts(matches: EvaluationProduct[]): EvaluationProduct[] {
  return matches.filter((match) => match.is_agent_selected === true)
}

/**
 * A requirements draft the user actually owns: at least one field carries an
 * answered value. Used to decide whether an existing draft outranks the
 * freshly profile-derived one — an empty or all-unanswered draft must not
 * strangle the derivation the next turn's profile made possible.
 */
export function mergeRequirements(
  base: RequirementsDraft | null | undefined,
  incoming: RequirementsDraft | null | undefined,
): RequirementsDraft | null {
  if (!base && !incoming) return null
  const merged: RequirementsDraft = { ...(base || {}) }
  if (incoming) {
    for (const [k, v] of Object.entries(incoming)) {
      if (
        v &&
        typeof v === 'object' &&
        v.state === 'answered' &&
        v.value !== undefined &&
        v.value !== null &&
        String(v.value).trim() !== ''
      ) {
        merged[k as keyof RequirementsDraft] = v
      }
    }
  }
  return Object.keys(merged).length > 0 ? merged : null
}

export function mergeProfiles(
  base: AiWorkspaceProfile | null | undefined,
  patch: Partial<AiWorkspaceProfile> | null | undefined,
): AiWorkspaceProfile {
  if (!base && !patch) return {}
  if (!patch) return base ?? {}
  if (!base) return patch ?? {}

  const mergedConstraints = [...(base.constraints ?? [])]
  if (Array.isArray(patch.constraints)) {
    for (const c of patch.constraints) {
      if (!c) continue
      const idx = mergedConstraints.findIndex(
        (existing) => existing && typeof existing === 'object' && constraintType(existing) === constraintType(c)
      )
      if (idx >= 0) {
        mergedConstraints[idx] = c
      } else {
        mergedConstraints.push(c)
      }
    }
  }

  const mergedPainPoints = Array.from(new Set([
    ...(Array.isArray(base.pain_points) ? base.pain_points : []),
    ...(Array.isArray(patch.pain_points) ? patch.pain_points : []),
  ]))

  const mergedDomains = Array.from(new Set([
    ...(Array.isArray(base.interested_domains) ? base.interested_domains : []),
    ...(Array.isArray(patch.interested_domains) ? patch.interested_domains : []),
  ]))

  const mergedProducts = Array.from(new Set([
    ...(Array.isArray(base.interested_products) ? base.interested_products : []),
    ...(Array.isArray(patch.interested_products) ? patch.interested_products : []),
  ]))

  const mergedGoals = Array.isArray(patch.goals) && patch.goals.length > 0
    ? patch.goals
    : (base.goals ?? [])

  return {
    ...base,
    ...patch,
    constraints: mergedConstraints.length > 0 ? mergedConstraints : base.constraints,
    pain_points: mergedPainPoints.length > 0 ? mergedPainPoints : base.pain_points,
    interested_domains: mergedDomains.length > 0 ? mergedDomains : base.interested_domains,
    interested_products: mergedProducts.length > 0 ? mergedProducts : base.interested_products,
    goals: mergedGoals,
  }
}

/**
 * An evaluation summary is just the metadata row in the sidebar list.
 * Deriving it from the detail avoids keeping a duplicate shape up to date.
 */
export function summaryFromDetail(detail: EvaluationDetail): EvaluationSummary {
  return {
    evaluation_id: detail.evaluation_id,
    title: detail.title,
    status: detail.status,
    stage: detail.stage,
    attention_group: detail.attention_group,
    next_action: detail.next_action,
    shortlist_count: detail.shortlist_count,
    match_count: detail.match_count,
    recommendation_state: detail.recommendation_state,
    regeneration_status: detail.regeneration_status,
    milestones: detail.milestones,
    progress_percent: detail.progress_percent,
  }
}

/**
 * Replaces the summary matching `next` in place, or prepends it if new.
 * Keeps the active/latest evaluation at the top of the rail.
 */
export function placeSummary(
  summaries: EvaluationSummary[],
  next: EvaluationSummary,
): EvaluationSummary[] {
  const index = summaries.findIndex(
    (item) => item.evaluation_id === next.evaluation_id,
  )
  if (index === -1) {
    return [next, ...summaries]
  }
  const copy = [...summaries]
  copy[index] = next
  return copy
}

/**
 * A requirements draft the user actually owns: at least one field carries an
 * answered value. Used to decide whether an existing draft outranks the
 * freshly profile-derived one — an empty or all-unanswered draft must not
 * strangle the derivation the next turn's profile made possible.
 */
function isMeaningfulDraft(requirements: RequirementsDraft | null | undefined): boolean {
  if (!requirements) return false
  return Object.values(requirements).some(
    (field) =>
      Boolean(field) &&
      typeof field === 'object' &&
      field.state === 'answered' &&
      field.value !== undefined &&
      field.value !== null &&
      String(field.value).trim() !== '',
  )
}

function chooseRequirements(
  serverRequirements: RequirementsDraft | null | undefined,
  currentRequirements: RequirementsDraft | null,
  derived: RequirementsDraft | null,
): RequirementsDraft | null {
  const mergedLocal = mergeRequirements(currentRequirements, derived)
  if (serverRequirements && isMeaningfulDraft(serverRequirements)) {
    return mergeRequirements(mergedLocal, serverRequirements)
  }
  return mergedLocal
}


function mergeMessages(
  localMessages: EvaluationMessage[],
  serverMessages: EvaluationMessage[] | undefined,
): EvaluationMessage[] {
  if (!serverMessages || serverMessages.length === 0) return localMessages
  if (localMessages.length === 0) return serverMessages

  const streamingItem = localMessages.find((m) => m.status === 'streaming')
  if (streamingItem && streamingItem.markdown) {
    const serverHasAssistant = serverMessages.some((m) => m.role === 'assistant' && m.markdown)
    if (!serverHasAssistant) {
      return localMessages
    }
  }

  const merged: EvaluationMessage[] = []
  const maxLen = Math.max(localMessages.length, serverMessages.length)
  for (let i = 0; i < maxLen; i++) {
    const local = localMessages[i]
    const server = serverMessages[i]
    if (local && server && local.role === server.role) {
      merged.push({
        ...server,
        id: local.id,
        markdown: local.status === 'streaming' && local.markdown ? local.markdown : (server.markdown || local.markdown),
        status: local.status === 'streaming' ? 'streaming' : (server.status || local.status || 'complete'),
      })
    } else if (local) {
      merged.push(local)
    } else if (server) {
      merged.push(server)
    }
  }
  return merged
}

export function applyEvaluationStreamEvent(
  evaluation: EvaluationDetail,
  event: EvaluationStreamEvent,
): EvaluationDetail {
  switch (event.type) {
    case 'session': {
      const incomingTitle = event.data.title
      return {
        ...evaluation,
        agent_session_id: event.data.session_id ?? evaluation.agent_session_id,
        evaluation_id: event.data.evaluation_id ?? evaluation.evaluation_id,
        title: incomingTitle && typeof incomingTitle === 'string' && incomingTitle.trim() ? incomingTitle.trim() : evaluation.title,
      }
    }
    case 'session_meta': {
      if (!event.data.title || !String(event.data.title).trim()) return evaluation
      return {
        ...evaluation,
        title: String(event.data.title).trim(),
      }
    }
    case 'evaluation_state': {
      const newMatches = mergeMatches(evaluation.matches, event.data.matches)
      const mergedMessages = mergeMessages(evaluation.messages, event.data.messages)
      const updatedProfile = mergeProfiles(evaluation.profile, event.data.profile)
      const derivedReqs = draftFromProfile(updatedProfile)
      const requirements = chooseRequirements(event.data.requirements, evaluation.requirements, derivedReqs)
      const incomingTitle = event.data.title
      return {
        ...evaluation,
        ...event.data,
        title: incomingTitle && typeof incomingTitle === 'string' && incomingTitle.trim() ? incomingTitle.trim() : evaluation.title,
        requirements,
        profile: updatedProfile,
        matches: newMatches,
        match_count: newMatches.length,
        messages: mergedMessages,
        milestones: {
          ...evaluation.milestones,
          ...(event.data.milestones || {}),
          requirements_confirmed: Boolean(requirements),
        },
      }
    }
    case 'shortlist_updated': {
      const shortlist = productArray(event.data.items)
      return {
        ...evaluation,
        shortlist,
        shortlist_count: shortlist.length,
        comparison_product_ids: shortlist.map((product) => product.product_id),
        milestones: {
          ...evaluation.milestones,
          shortlist_ready: shortlist.length > 0,
        },
      }
    }
    case 'recommendation_published': {
      const recommendation = recommendationValue(event.data.recommendation)
      return {
        ...evaluation,
        recommendation,
        recommendation_state: recommendation ? 'current' : evaluation.recommendation_state,
        stage: recommendation ? 'recommendation_ready' : evaluation.stage,
        attention_group: recommendation ? 'ready_to_decide' : evaluation.attention_group,
        next_action: recommendation ? 'review_recommendation' : evaluation.next_action,
        milestones: {
          ...evaluation.milestones,
          recommendation_generated: Boolean(recommendation),
        },
        progress_percent: recommendation ? Math.max(evaluation.progress_percent, 90) : evaluation.progress_percent,
      }
    }
    case 'document_ready': {
      if (!event.data.document) return evaluation
      const currentDocs = evaluation.documents || []
      return {
        ...evaluation,
        documents: [...currentDocs, event.data.document]
      }
    }
    case 'done': {
      if (!event.data.evaluation) return evaluation
      const newMatches = mergeMatches(evaluation.matches, event.data.evaluation.matches)
      const mergedMessages = mergeMessages(evaluation.messages, event.data.evaluation.messages)
      const updatedProfile = event.data.evaluation.profile ?? evaluation.profile
      const derivedReqs = draftFromProfile(updatedProfile)
      const requirements = chooseRequirements(event.data.evaluation.requirements, evaluation.requirements, derivedReqs)
      const incomingTitle = event.data.evaluation.title
      return {
        ...evaluation,
        ...event.data.evaluation,
        title: incomingTitle && typeof incomingTitle === 'string' && incomingTitle.trim() ? incomingTitle.trim() : evaluation.title,
        requirements,
        profile: updatedProfile,
        matches: newMatches,
        match_count: newMatches.length,
        messages: mergedMessages,
        milestones: {
          ...evaluation.milestones,
          ...(event.data.evaluation.milestones || {}),
          requirements_confirmed: Boolean(requirements),
        },
      }
    }
    case 'message_delta':
    case 'requirements_updated':
    case 'match_run_published':
    case 'product_match_published':
    case 'regeneration_status':
    case 'error':
      return evaluation
    default:
      return evaluation
  }
}
