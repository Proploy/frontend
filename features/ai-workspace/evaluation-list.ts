import type { EvaluationSummary } from './evaluation-types'

/**
 * The evaluation rail is a fixed list: an existing evaluation keeps its slot
 * when it is opened or updated, and a new one is added at the top.
 */
export function placeSummary(
  summaries: EvaluationSummary[],
  summary: EvaluationSummary,
): EvaluationSummary[] {
  const index = summaries.findIndex((item) => item.evaluation_id === summary.evaluation_id)
  if (index === -1) return [summary, ...summaries]
  const next = summaries.slice()
  next[index] = summary
  return next
}
