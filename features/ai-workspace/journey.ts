import type { EvaluationDetail, EvaluationProduct } from './evaluation-types'
import { agentSelectedProducts } from './evaluation-reducer'

/**
 * The guided buyer journey in the AI workspace, derived purely from
 * evaluation state so it survives reloads:
 *
 *   discover  — Sam is still asking questions / has fewer than two products
 *   compare   — Sam returned products; nudge a comparison brief (battle card)
 *   implement — a comparison exists (or the buyer skipped it); nudge an
 *               implementation brief around a product the buyer picks
 *
 * Briefs are the documents the harness generates (`generate_battle_card`,
 * `generate_project_brief`). Both tools only fire when the buyer asks, so the
 * nudges send plain chat requests Sam can act on.
 */

export type JourneyStage = 'discover' | 'compare' | 'implement'
export type BriefKind = 'comparison' | 'implementation' | 'other'

export type BriefDocument = {
  doc_id: string
  kind: BriefKind
  title: string
  html: string | null
  pdf_url: string | null
  /** Structured brief from the harness, when available (rendered natively). */
  data: Record<string, unknown> | null
  /** For implementation briefs: the product the brief is built around. */
  productName: string | null
  raw: Record<string, unknown>
}

export type Journey = {
  stage: JourneyStage
  products: EvaluationProduct[]
  documents: BriefDocument[]
  comparisonBriefs: BriefDocument[]
  implementationBriefs: BriefDocument[]
}

const KIND_BY_DOC_TYPE: Record<string, BriefKind> = {
  battle_card: 'comparison',
  project_brief: 'implementation',
}

export const BRIEF_LABELS: Record<BriefKind, string> = {
  comparison: 'Comparison brief',
  implementation: 'Implementation brief',
  other: 'Document',
}

export function briefKind(doc: Record<string, unknown>): BriefKind {
  const docType = typeof doc.doc_type === 'string' ? doc.doc_type : ''
  return KIND_BY_DOC_TYPE[docType] ?? 'other'
}

export function productDisplayName(product: EvaluationProduct): string {
  return product.product_name?.trim() || product.product_id
}

/** Which of Sam's products an implementation brief is built around, by title. */
export function documentProductName(
  doc: Record<string, unknown>,
  products: EvaluationProduct[],
): string | null {
  const data = doc.data && typeof doc.data === 'object' ? (doc.data as Record<string, unknown>) : null
  const rp = data?.recommended_product && typeof data.recommended_product === 'object'
    ? (data.recommended_product as Record<string, unknown>)
    : null
  if (rp && typeof rp.product_name === 'string' && rp.product_name.trim()) return rp.product_name.trim()
  const title = typeof doc.title === 'string' ? doc.title.toLowerCase() : ''
  if (!title) return null
  const match = products
    .map(productDisplayName)
    .filter((name) => name && title.includes(name.toLowerCase()))
    .sort((a, b) => b.length - a.length)[0]
  return match ?? null
}

export function normalizeDocument(
  raw: Record<string, unknown>,
  products: EvaluationProduct[],
): BriefDocument {
  const kind = briefKind(raw)
  const title =
    typeof raw.title === 'string' && raw.title.trim()
      ? raw.title.trim()
      : BRIEF_LABELS[kind]
  return {
    doc_id: typeof raw.doc_id === 'string' ? raw.doc_id : title,
    kind,
    title,
    html: typeof raw.html === 'string' ? raw.html : null,
    pdf_url: typeof raw.pdf_url === 'string' ? raw.pdf_url : null,
    data: raw.data && typeof raw.data === 'object' && !Array.isArray(raw.data) ? (raw.data as Record<string, unknown>) : null,
    productName: kind === 'implementation' ? documentProductName(raw, products) : null,
    raw,
  }
}

/**
 * Sam's picks, best score first. Every lane and every nudge renders products
 * in this order, so the strongest match is always the first thing read.
 * Sorting is stable, so products the agent scored the same keep the order it
 * put them forward in. An unscored product sorts last rather than as a zero.
 */
export function rankProducts(products: EvaluationProduct[]): EvaluationProduct[] {
  const score = (product: EvaluationProduct) =>
    typeof product.match_score === 'number' ? product.match_score : -1
  return [...products].sort((a, b) => score(b) - score(a))
}

/**
 * A product the buyer kept is always one of Sam's products, whether or not
 * Sam's latest turn named it again. Without this, removing a product from the
 * shortlist could take away the only place it was still shown — the buyer
 * would put a product down and watch it disappear rather than return to
 * Matches. Kept products Sam has moved on from sort last, having no score.
 */
export function withShortlisted(
  products: EvaluationProduct[],
  shortlist: EvaluationProduct[],
): EvaluationProduct[] {
  const known = new Set(products.map((product) => product.product_id))
  return [...products, ...shortlist.filter((product) => !known.has(product.product_id))]
}

/** The public comparison page, seeded with the products the buyer shortlisted. */
export function compareHref(products: EvaluationProduct[]): string {
  const ids = products.map((product) => encodeURIComponent(product.product_id)).join(',')
  return `/compare?products=${ids}`
}

export function deriveJourney(
  evaluation: Pick<EvaluationDetail, 'matches' | 'documents'> &
    Partial<Pick<EvaluationDetail, 'shortlist'>>,
  options: { compareDismissed?: boolean } = {},
): Journey {
  const products = rankProducts(
    withShortlisted(agentSelectedProducts(evaluation.matches), evaluation.shortlist ?? []),
  )
  const documents = (evaluation.documents ?? []).map((doc) => normalizeDocument(doc, products))
  const comparisonBriefs = documents.filter((doc) => doc.kind === 'comparison')
  const implementationBriefs = documents.filter((doc) => doc.kind === 'implementation')

  let stage: JourneyStage
  if (products.length === 0) stage = 'discover'
  else if (comparisonBriefs.length > 0) stage = 'implement'
  else if (products.length >= 2 && !options.compareDismissed) stage = 'compare'
  else stage = 'implement'

  return { stage, products, documents, comparisonBriefs, implementationBriefs }
}

export function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? ''
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}

/** Chat request that makes Sam call `generate_battle_card` for these products. */
export function buildComparisonRequest(products: EvaluationProduct[]): string {
  const names = joinNames(products.map(productDisplayName))
  return `Create a comparison brief for ${names}. Show side by side how each one fits my requirements, and say which you would recommend.`
}

/** Chat request that makes Sam call `generate_project_brief` around one product. */
export function buildImplementationRequest(product: EvaluationProduct): string {
  return `Create an implementation brief with ${productDisplayName(product)} as the recommended product. Use the products you have suggested so far as the shortlist.`
}

/** Sam's top pick: the highest-scored product it returned. */
export function topProduct(products: EvaluationProduct[]): EvaluationProduct | null {
  return rankProducts(products)[0] ?? null
}
