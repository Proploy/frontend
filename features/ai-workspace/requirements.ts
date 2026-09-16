import type { RequirementsDraft } from './evaluation-types'
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

/**
 * Rows the catalog cannot score, so an empty one is not worth asking about.
 * `pricing_bucket` is a six-value enum with no documented money boundaries and
 * `typical_timeline` is null on every product, so a budget or a date the buyer
 * supplies changes no recommendation. They still render when Sam captures one
 * — a fact the buyer stated is never hidden — but an empty one is not counted
 * as a gap and never becomes a chip inviting an answer nothing can use.
 */
const UNSCOREABLE = new Set(['budget', 'timeline'])

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
  const values: string[] = []
  if (Array.isArray(profile.constraints)) {
    for (const c of profile.constraints) {
      if (c && typeof c === 'object' && (c as Record<string, unknown>).type === type) {
        const val = (c as Record<string, unknown>).value
        if (val !== undefined && val !== null) {
          const str = String(val).trim()
          if (str) values.push(str)
        }
      }
    }
  }

  const p = profile as Record<string, unknown>
  if (type === 'team_size') {
    const ts = p.team_size ?? p.headcount ?? p.seats
    if (ts != null) {
      const s = String(ts).trim()
      if (s && !values.includes(s)) values.push(s)
    }
  }
  if (type === 'budget') {
    const b = p.budget ?? p.budget_tier
    if (b != null) {
      const s = String(b).trim()
      if (s && !values.includes(s)) values.push(s)
    }
  }
  if (type === 'industry') {
    const ind = p.industry ?? p.domain ?? p.category
    if (ind != null) {
      const s = String(ind).trim()
      if (s && !values.includes(s)) values.push(s)
    }
  }
  if (type === 'deployment') {
    const dep = p.deployment ?? p.hosting
    if (dep != null) {
      const s = String(dep).trim()
      if (s && !values.includes(s)) values.push(s)
    }
  }
  if (type === 'timeline') {
    const tl = p.timeline ?? p.deadline
    if (tl != null) {
      const s = String(tl).trim()
      if (s && !values.includes(s)) values.push(s)
    }
  }
  if (type === 'compliance') {
    const comp = p.compliance ?? p.security
    if (Array.isArray(comp)) {
      for (const item of comp) {
        if (item != null) {
          const s = String(item).trim()
          if (s && !values.includes(s)) values.push(s)
        }
      }
    } else if (comp != null) {
      const s = String(comp).trim()
      if (s && !values.includes(s)) values.push(s)
    }
  }
  if (type === 'integrations') {
    const ints = p.integrations ?? p.required_integrations
    if (Array.isArray(ints)) {
      for (const item of ints) {
        if (item != null) {
          const s = String(item).trim()
          if (s && !values.includes(s)) values.push(s)
        }
      }
    } else if (ints != null) {
      const s = String(ints).trim()
      if (s && !values.includes(s)) values.push(s)
    }
  }

  return values
}

export function deriveRequirements(
  profile: AiWorkspaceProfile | null | undefined,
  requirementsDraft?: RequirementsDraft | null,
): RequirementsMatrix {
  const safe: AiWorkspaceProfile = profile ?? {}
  const rows: RequirementRow[] = []
  const push = (key: string, label: string, values: string[]) =>
    rows.push({ key, label, values: Array.from(new Set(values)), missing: values.length === 0 })

  const draftVal = (keys: string | string[]): string[] => {
    if (!requirementsDraft) return []
    const keyList = Array.isArray(keys) ? keys : [keys]
    for (const key of keyList) {
      const item = requirementsDraft[key]
      if (!item) continue
      const val = item.value !== undefined ? item.value : item
      if (val == null) continue
      const s = String(val).trim()
      if (s) return [s]
    }
    return []
  }

  const goalValues = [...texts(safe.goals), ...draftVal(['primary_use_case', 'goals', 'goal', 'title'])]
  push('goals', 'Goal', goalValues)

  for (const [type, label] of CONSTRAINT_ROWS) {
    const values = constraintValues(safe, type)
    if (type === 'integrations') {
      push(type, label, [
        ...values,
        ...texts(safe.interested_products),
        ...draftVal(['required_integrations', 'integrations']),
      ])
    } else if (type === 'industry') {
      push(type, label, [
        ...values,
        ...texts(safe.interested_domains),
        ...draftVal(['category', 'industry', 'domain']),
      ])
    } else if (type === 'team_size') {
      push(type, label, [...values, ...draftVal(['team_size', 'headcount', 'seats'])])
    } else if (type === 'budget') {
      push(type, label, [...values, ...draftVal(['budget', 'budget_tier'])])
    } else if (type === 'compliance') {
      push(type, label, [...values, ...draftVal(['security', 'compliance'])])
    } else if (type === 'deployment') {
      push(type, label, [...values, ...draftVal(['deployment', 'hosting'])])
    } else if (type === 'timeline') {
      push(type, label, [...values, ...draftVal(['timeline', 'deadline', 'timeframe'])])
    } else {
      push(type, label, values)
    }
  }
  push('pain_points', 'Pain points', [
    ...texts(safe.pain_points),
    ...draftVal(['problem_frame', 'pain_points', 'pain_point']),
  ])
  push('success_criteria', 'Success criteria', [
    ...texts(safe.success_criteria),
    ...draftVal(['required_capabilities', 'success_criteria', 'success_looks_like']),
  ])

  const visible = rows.filter((row) => !(row.missing && UNSCOREABLE.has(row.key)))
  const known = visible.filter((row) => !row.missing).length
  return { rows: visible, known, total: visible.length }
}

export function hasRequirements(profile: AiWorkspaceProfile | null | undefined): boolean {
  return deriveRequirements(profile).known > 0
}
