import { fitCounts, type FitStatus } from './brief-types'
import type {
  EvaluationProduct,
  FitCell,
  FitSource,
  RequirementFit,
  RequirementsDraft,
} from './evaluation-types'
import { deriveRequirements } from './requirements'
import type { AiWorkspaceProfile } from './types'

/**
 * The requirements-fit matrix, as a view model.
 *
 * The gateway decides each cell — it owns the catalog, and the agent never
 * receives structured product attributes — so nothing here judges fit. What it
 * does is decide whether a matrix is worth showing at all, and which of its
 * verdicts are still about the requirements the buyer currently has.
 */

const STATUSES: FitStatus[] = ['yes', 'partial', 'no', 'unknown']
const SOURCES: FitSource[] = ['catalog', 'judgement']

/**
 * The same key the gateway stamps into `basis`.
 *
 * Mirrors `normalize_label` in `service-apis` exactly — lowercase, then every
 * non-alphanumeric character removed. The two must agree or a fresh matrix
 * reads as stale, so this is pinned by a shared fixture on both sides.
 */
export function normalizeBasisValue(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '')
}

function normalizeAll(values: string[]): string[] {
  return Array.from(new Set(values.map(normalizeBasisValue).filter(Boolean))).sort()
}

/**
 * Read a `requirement_fit` off the wire, keeping only what the vocabulary
 * allows. Returns null for anything with no usable cells, so absence stays the
 * single signal for "not assessed".
 */
export function asRequirementFit(value: unknown): RequirementFit | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const raw = value as Record<string, unknown>

  const rawCells = raw.cells && typeof raw.cells === 'object' ? (raw.cells as Record<string, unknown>) : {}
  const cells: Record<string, FitCell> = {}
  for (const [key, cell] of Object.entries(rawCells)) {
    if (!cell || typeof cell !== 'object') continue
    const entry = cell as Record<string, unknown>
    const status = STATUSES.includes(entry.status as FitStatus) ? (entry.status as FitStatus) : 'unknown'
    const source = SOURCES.includes(entry.source as FitSource) ? (entry.source as FitSource) : 'catalog'
    cells[key] = {
      status,
      source,
      note: typeof entry.note === 'string' && entry.note.trim() ? entry.note.trim() : undefined,
    }
  }
  if (Object.keys(cells).length === 0) return null

  const rawBasis = raw.basis && typeof raw.basis === 'object' ? (raw.basis as Record<string, unknown>) : {}
  const basis: Record<string, string[]> = {}
  for (const [key, values] of Object.entries(rawBasis)) {
    if (Array.isArray(values)) basis[key] = values.filter((v): v is string => typeof v === 'string')
  }

  return {
    assessed_at: typeof raw.assessed_at === 'string' ? raw.assessed_at : undefined,
    basis,
    cells,
  }
}

export type FitRow = {
  key: string
  label: string
  /** The requirement has changed since these verdicts were made. */
  stale: boolean
}

export type FitColumn = {
  product: EvaluationProduct
  productName: string
  cells: Record<string, FitCell>
  met: number
  partial: number
  missing: number
  unknown: number
  /** Cells with a verdict; the denominator any percentage must use. */
  assessed: number
}

export type FitMatrixView = {
  rows: FitRow[]
  columns: FitColumn[]
  /** How many cells carry a verdict, out of how many the grid has. */
  assessed: number
  total: number
  staleRows: number
  /** True when any cell is the agent's opinion rather than a catalog lookup. */
  hasJudgement: boolean
}

/**
 * A matrix is worth rendering only when it can be read as a comparison.
 *
 * One product is a list wearing a grid's costume, one requirement is a
 * sentence, and a grid of mostly-unassessed cells reads as "these products
 * fail everything" — which is exactly why "not assessed" was taken off the
 * colour ramp. Below any of these the workspace shows nothing and leaves the
 * requirement gap chips, which sit in the same column, to do the work.
 */
const MIN_ROWS = 2
const MIN_PRODUCTS = 2
const MIN_ASSESSED_SHARE = 0.5

export function buildFitMatrix(
  products: EvaluationProduct[],
  profile: AiWorkspaceProfile | null | undefined,
  requirements?: RequirementsDraft | null,
): FitMatrixView | null {
  const assessedProducts = products
    .map((product) => ({ product, fit: asRequirementFit(product.requirement_fit) }))
    .filter((entry): entry is { product: EvaluationProduct; fit: RequirementFit } => entry.fit !== null)

  if (assessedProducts.length < MIN_PRODUCTS) return null

  // Row order follows the requirements panel, so a buyer reading down the two
  // finds them in the same order rather than having to re-locate each one.
  const matrix = deriveRequirements(profile, requirements)
  const labels = new Map(matrix.rows.map((row) => [row.key, row.label]))
  const current = new Map(matrix.rows.map((row) => [row.key, normalizeAll(row.values)]))

  const present = new Set<string>()
  for (const { fit } of assessedProducts) {
    for (const key of Object.keys(fit.cells)) present.add(key)
  }
  const ordered = [
    ...matrix.rows.map((row) => row.key).filter((key) => present.has(key)),
    ...[...present].filter((key) => !labels.has(key)),
  ]

  const rows: FitRow[] = []
  for (const key of ordered) {
    const statuses = assessedProducts.map(({ fit }) => fit.cells[key]?.status ?? 'unknown')
    // A row nobody could assess teaches nothing and reads as failure. Rows that
    // agree across products are kept: "all three meet SOC2" is an answer.
    if (statuses.every((status) => status === 'unknown')) continue

    const now = current.get(key) ?? []
    const stale = assessedProducts.some(({ fit }) => {
      const basis = fit.basis[key]
      if (!basis) return false
      const then = normalizeAll(basis)
      return then.length !== now.length || then.some((value, index) => value !== now[index])
    })

    rows.push({
      key,
      label: labels.get(key) ?? key.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase()),
      stale,
    })
  }

  if (rows.length < MIN_ROWS) return null

  let hasJudgement = false
  const columns: FitColumn[] = assessedProducts.map(({ product, fit }) => {
    const cells: Record<string, FitCell> = {}
    for (const row of rows) {
      const cell = fit.cells[row.key]
      if (!cell) continue
      if (cell.source === 'judgement') hasJudgement = true
      cells[row.key] = cell
    }
    const counts = fitCounts(rows.map((row) => cells[row.key]?.status ?? 'unknown'))
    return {
      product,
      productName: product.product_name?.trim() || product.product_id,
      cells,
      met: counts.met,
      partial: counts.partial,
      missing: counts.missing,
      unknown: counts.unknown,
      assessed: counts.assessed,
    }
  })

  const total = rows.length * columns.length
  const assessed = columns.reduce((sum, column) => sum + column.assessed, 0)
  if (total === 0 || assessed / total < MIN_ASSESSED_SHARE) return null

  return {
    rows,
    columns,
    assessed,
    total,
    staleRows: rows.filter((row) => row.stale).length,
    hasJudgement,
  }
}

/**
 * Which side of the matrix owns each row.
 *
 * Mirrors `CATALOG_ROWS` and `JUDGEMENT_ROWS` in the gateway's `fit_matrix.py`,
 * for the same reason `normalizeBasisValue` mirrors `normalize_label`: this side
 * has to explain a missing verdict, and the explanation differs entirely by
 * owner. A catalog row with no cell means nobody recorded the attribute; a
 * judgement row with no cell means Sam has not weighed in yet.
 */
const CATALOG_ROWS = new Set(['compliance', 'integrations', 'industry', 'deployment', 'team_size'])
const JUDGEMENT_ROWS = new Set(['goals', 'pain_points', 'success_criteria', 'budget', 'timeline'])

export type CoverageState = 'assessed' | 'partly-assessed' | 'awaiting-agent' | 'no-catalog-data' | 'not-captured'

export type CoverageRow = {
  key: string
  label: string
  /** What the buyer actually said, verbatim. */
  values: string[]
  decidedBy: 'catalog' | 'judgement' | null
  cells: Record<string, FitCell | undefined>
  assessed: number
  state: CoverageState
  /** Why this row has the verdicts it has — shown to the buyer, so plain. */
  explanation: string
}

export type FitCoverage = {
  rows: CoverageRow[]
  products: Array<{ id: string; name: string }>
  /** Cells decided by a catalog lookup. */
  checked: number
  /** Cells decided by Sam reading the conversation. */
  judged: number
  /** Requirements captured but carrying no verdict anywhere. */
  unanswered: number
}

function explain(state: CoverageState, decidedBy: 'catalog' | 'judgement' | null): string {
  switch (state) {
    case 'assessed':
      return decidedBy === 'catalog'
        ? 'Checked against what the catalog records for each product.'
        : 'Sam weighed this one — the catalog has nothing that decides it.'
    case 'partly-assessed':
      return 'Answered for some products. The rest have nothing on file to decide it.'
    case 'awaiting-agent':
      return 'Sam decides this one, and has not weighed in on it yet.'
    case 'no-catalog-data':
      return 'Nothing recorded in the catalog for these products, so it is unproven rather than missing.'
    case 'not-captured':
      return 'Not captured yet — tell Sam and it joins the comparison.'
  }
}

/**
 * Every requirement the buyer has stated, whether or not it has a verdict.
 *
 * The grid deliberately hides rows it cannot fill, which reads as though the
 * requirement was never captured. This is the counterpart: it accounts for all
 * of them, and says why each is where it is. Returns null only when there is
 * nothing captured at all.
 */
export function buildFitCoverage(
  products: EvaluationProduct[],
  profile: AiWorkspaceProfile | null | undefined,
  requirements?: RequirementsDraft | null,
): FitCoverage | null {
  const matrix = deriveRequirements(profile, requirements)
  // `deriveRequirements` always returns the full row list, captured or not, so
  // the count of *known* rows is what decides whether there is anything to
  // account for. A card reading "All 0 requirements" is worse than no card.
  if (!matrix.known) return null

  const scored = products
    .map((product) => ({ product, fit: asRequirementFit(product.requirement_fit) }))
    .filter((entry): entry is { product: EvaluationProduct; fit: RequirementFit } => entry.fit !== null)

  const columns = scored.map(({ product, fit }) => ({
    id: product.product_id,
    name: product.product_name?.trim() || product.product_id,
    cells: fit.cells,
  }))

  let checked = 0
  let judged = 0
  let unanswered = 0

  const rows: CoverageRow[] = matrix.rows.map((row) => {
    const decidedBy = CATALOG_ROWS.has(row.key)
      ? ('catalog' as const)
      : JUDGEMENT_ROWS.has(row.key)
        ? ('judgement' as const)
        : null

    const cells: Record<string, FitCell | undefined> = {}
    let assessed = 0
    for (const column of columns) {
      const cell = column.cells[row.key]
      cells[column.id] = cell
      // An `unknown` cell is the gateway saying it looked and could not tell.
      // Counting it as answered is how "No record of email, chat" ended up
      // labelled "Answered" — the same rule `fitCounts` already applies.
      if (!cell || cell.status === 'unknown') continue
      assessed += 1
      if (cell.source === 'catalog') checked += 1
      else judged += 1
    }

    let state: CoverageState
    if (row.missing) state = 'not-captured'
    else if (assessed === 0) state = decidedBy === 'judgement' ? 'awaiting-agent' : 'no-catalog-data'
    else if (assessed < columns.length) state = 'partly-assessed'
    else state = 'assessed'

    if (state !== 'assessed' && state !== 'partly-assessed' && !row.missing) unanswered += 1

    return { key: row.key, label: row.label, values: row.values, decidedBy, cells, assessed, state, explanation: explain(state, decidedBy) }
  })

  return { rows, products: columns.map(({ id, name }) => ({ id, name })), checked, judged, unanswered }
}
