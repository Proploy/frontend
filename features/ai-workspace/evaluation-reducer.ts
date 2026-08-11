import type {
  EvaluationDetail,
  EvaluationProduct,
  EvaluationRecommendation,
  EvaluationStreamEvent,
} from './evaluation-types'

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
        available: true,
        match_score: score !== undefined ? score : 0,
        reasons: reason ? [reason] : [],
        is_agent_selected: true,
      })
    }
  }

  if (firstMatchIndex !== -1) {
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

  return { displayMarkdown, extractedMatches }
}

export function mergeMatches(
  localMatches: EvaluationProduct[],
  serverMatches: EvaluationProduct[] | undefined,
): EvaluationProduct[] {
  if (!serverMatches || serverMatches.length === 0) return localMatches
  if (localMatches.length === 0) return serverMatches

  const merged = [...serverMatches]
  for (const local of localMatches) {
    const existingIndex = merged.findIndex(m => m.product_id === local.product_id)
    if (existingIndex >= 0) {
      merged[existingIndex] = {
        ...merged[existingIndex],
        match_score: local.match_score ?? merged[existingIndex].match_score,
        reasons: local.reasons ?? merged[existingIndex].reasons,
        is_agent_selected: local.is_agent_selected || merged[existingIndex].is_agent_selected,
      }
    } else {
      merged.push(local)
    }
  }
  return merged
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
    case 'evaluation_state': {
      const newMatches = mergeMatches(evaluation.matches, event.data.matches)
      const mergedMessages = mergeMessages(evaluation.messages, event.data.messages)
      return {
        ...evaluation,
        ...event.data,
        matches: newMatches,
        match_count: newMatches.length,
        messages: mergedMessages,
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
      return {
        ...evaluation,
        ...event.data.evaluation,
        matches: newMatches,
        match_count: newMatches.length,
        messages: mergedMessages,
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
