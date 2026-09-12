import type { AiWorkspaceProfile } from './types'

/**
 * The buyer requirements Sam has captured so far, as a matrix the workspace
 * can render. Source: the harness needs profile (goals, typed constraints,
 * pain points, success criteria, integrations), which the gateway streams as
 * `profile` and persists on the evaluation.
 */

export type RequirementRow = {
  key: string
  label: string
  values: string[]
  /** True when Sam has not learned this yet. */
  missing: boolean
}

export type RequirementsMatrix = {
  rows: RequirementRow[]
  known: number
  total: number
}

const CONSTRAINT_ROWS: Array<[string, string]> = [
  ['team_size', 'Team size'],
  ['budget', 'Budget'],
  ['industry', 'Industry'],
  ['integrations', 'Integrations'],
  ['deployment', 'Deployment'],
  ['compliance', 'Compliance'],
  ['timeline', 'Timeline'],
]

function texts(value: unknown, pick: (item: Record<string, unknown>) => unknown = (item) => item.text): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => {
      if (typeof item === 'string') return item
      if (item && typeof item === 'object') {
        const picked = pick(item as Record<string, unknown>)
        return typeof picked === 'string' ? picked : ''
      }
      return ''
    })
    .map((text) => text.trim())
    .filter(Boolean)
}

function constraintValues(profile: AiWorkspaceProfile, type: string): string[] {
  if (!Array.isArray(profile.constraints)) return []
  return profile.constraints
    .filter((c): c is Record<string, unknown> => Boolean(c) && typeof c === 'object')
    .filter((c) => c.type === type && typeof c.value === 'string' && c.value.trim())
    .map((c) => String(c.value).trim())
}

export function deriveRequirements(profile: AiWorkspaceProfile | null | undefined): RequirementsMatrix {
  const safe: AiWorkspaceProfile = profile ?? {}
  const rows: RequirementRow[] = []
  const push = (key: string, label: string, values: string[]) =>
    rows.push({ key, label, values: Array.from(new Set(values)), missing: values.length === 0 })

  push('goals', 'Goal', texts(safe.goals))
  for (const [type, label] of CONSTRAINT_ROWS) {
    const values = constraintValues(safe, type)
    if (type === 'integrations') {
      // The harness files integrations under `interested_products`, not as a
      // constraint (tools/profile/extract.py).
      push(type, label, [...values, ...texts(safe.interested_products)])
    } else if (type === 'industry') {
      // Same story for industry: the harness appends it to `interested_domains`
      // rather than emitting Constraint(type="industry"), so reading only the
      // constraints list left this row permanently "Not yet known".
      push(type, label, [...values, ...texts(safe.interested_domains)])
    } else {
      push(type, label, values)
    }
  }
  push('pain_points', 'Pain points', texts(safe.pain_points))
  push('success_criteria', 'Success criteria', texts(safe.success_criteria))

  const known = rows.filter((row) => !row.missing).length
  return { rows, known, total: rows.length }
}

export function hasRequirements(profile: AiWorkspaceProfile | null | undefined): boolean {
  return deriveRequirements(profile).known > 0
}
