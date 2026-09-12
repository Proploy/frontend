import { deriveRequirements, type RequirementsMatrix } from './requirements'
import type { AiWorkspaceProfile } from './types'

/**
 * Turns the gaps in Sam's picture of the buyer into things the buyer can act
 * on in one tap.
 *
 * The requirements matrix already knows which rows are still empty; what it
 * lacked was a way to close them. Each gap becomes a chip that *prefills the
 * composer* rather than sending a message — the buyer still writes the answer
 * in their own words, so this nudges without acting on their behalf.
 *
 * Ordered by how much each answer sharpens a recommendation: what they are
 * trying to do and what is going wrong beat headcount and timing.
 */

export type RequirementGap = {
  key: string
  /** Chip text — the thing the buyer is being invited to supply. */
  label: string
  /** Prefilled into the composer, left mid-sentence for the buyer to finish. */
  prompt: string
}

/** Prompt starters per requirement row, keyed to `deriveRequirements` rows. */
const PROMPTS: Record<string, { label: string; prompt: string }> = {
  goals: { label: 'Your goal', prompt: "What we're trying to achieve is " },
  pain_points: { label: 'Pain points', prompt: "What isn't working today is " },
  integrations: { label: 'Integrations', prompt: 'It needs to work with ' },
  budget: { label: 'Budget', prompt: 'Our budget is around ' },
  team_size: { label: 'Team size', prompt: 'The team using this is about ' },
  industry: { label: 'Industry', prompt: "We're in " },
  compliance: { label: 'Compliance', prompt: 'We have to meet ' },
  deployment: { label: 'Deployment', prompt: 'We need it deployed as ' },
  timeline: { label: 'Timeline', prompt: 'We want to be live by ' },
  success_criteria: { label: 'Success looks like', prompt: 'This is a success if ' },
}

/** Most decision-shaping first, so the top chips are the ones worth asking. */
const PRIORITY = [
  'goals',
  'pain_points',
  'integrations',
  'budget',
  'team_size',
  'industry',
  'compliance',
  'deployment',
  'timeline',
  'success_criteria',
]

export type RequirementCoverage = {
  matrix: RequirementsMatrix
  /** Empty rows, most decision-shaping first. */
  gaps: RequirementGap[]
  /** 0-100. */
  percent: number
  /** Plain-language read on how complete the picture is. */
  verdict: 'empty' | 'thin' | 'workable' | 'strong'
}

export function requirementCoverage(
  profile: AiWorkspaceProfile | null | undefined,
): RequirementCoverage {
  const matrix = deriveRequirements(profile)

  const gaps = matrix.rows
    .filter((row) => row.missing && PROMPTS[row.key])
    .map((row) => ({ key: row.key, ...PROMPTS[row.key] }))
    .sort((a, b) => PRIORITY.indexOf(a.key) - PRIORITY.indexOf(b.key))

  const percent = matrix.total === 0 ? 0 : Math.round((matrix.known / matrix.total) * 100)

  // Thresholds are about usefulness, not tidiness: Sam can shortlist from a
  // third of the picture, but the result is only defensible past two thirds.
  const verdict: RequirementCoverage['verdict'] =
    matrix.known === 0 ? 'empty' : percent < 34 ? 'thin' : percent < 67 ? 'workable' : 'strong'

  return { matrix, gaps, percent, verdict }
}

export const VERDICT_COPY: Record<RequirementCoverage['verdict'], string> = {
  empty: 'Sam has nothing to match on yet.',
  thin: 'Enough to start, but the matches will be broad.',
  workable: 'Good enough to shortlist. More detail sharpens the ranking.',
  strong: 'Sam has what it needs for a defensible shortlist.',
}
