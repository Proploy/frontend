import type { SearchMode } from './types'

/**
 * Picks keyword vs natural search from the query itself, so the landing bar
 * needs no manual mode toggle.
 *
 * The split we want: a name someone already knows ("netsuite", "microsoft
 * dynamics 365") should hit the fast keyword typeahead, which carries spell
 * correction and ghost completion. A described need ("HRIS that integrates
 * with NetSuite") should go to the natural endpoint, which keyword search
 * matches poorly.
 *
 * Length is the strongest signal: product and vendor names are almost always
 * three words or fewer, and a described need almost always runs longer. A
 * question mark or an opening intent word overrides the count, so short
 * phrasings like "best crm?" or "find payroll" still read as questions.
 */
export const NATURAL_WORD_THRESHOLD = 4

/** Opening words that mark a described need regardless of how short it is. */
const INTENT_OPENERS = new Set([
  'what', 'whats', 'which', 'who', 'how', 'why', 'where',
  'find', 'need', 'want', 'looking', 'show', 'give', 'help',
  'best', 'cheapest', 'top', 'recommend', 'suggest', 'compare',
  'something', 'anything', 'is', 'are', 'can', 'should', 'do', 'does',
])

export function detectSearchMode(query: string): SearchMode {
  const trimmed = query.trim()
  if (!trimmed) return 'keyword'

  // A question is a described need however short it is.
  if (trimmed.includes('?')) return 'natural'

  const words = trimmed.split(/\s+/).filter(Boolean)
  if (words.length >= NATURAL_WORD_THRESHOLD) return 'natural'

  const opener = words[0].toLowerCase().replace(/[^a-z]/g, '')
  if (INTENT_OPENERS.has(opener)) return 'natural'

  return 'keyword'
}
