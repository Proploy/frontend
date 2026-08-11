/**
 * Spell checking, fuzzy matching (Damerau-Levenshtein distance), and
 * autocompletion helpers for Proploy catalog search.
 */

// Popular software catalog dictionary for client-side fuzzy judgment.
export const COMMON_SOFTWARE_DICTIONARY = [
  'Salesforce',
  'Slack',
  'HubSpot',
  'ClickUp',
  'Jira',
  'Zendesk',
  'Pipedrive',
  'QuickBooks',
  'Figma',
  'Monday.com',
  'Notion',
  'Asana',
  'Zoom',
  'Snowflake',
  'Datadog',
  'Stripe',
  'Intercom',
  'Shopify',
  'Airtable',
  'Miro',
  'Trello',
  'Freshworks',
  'Workday',
  'ServiceNow',
  'Gong',
  'Outreach',
  'Marketo',
  'Mailchimp',
  'Zapier',
  'Twilio',
  'Okta',
  'Databricks',
  'DocuSign',
  'Mixpanel',
  'Amplitude',
  'Webflow',
  'Canva',
  'Atlassian',
  'GitHub',
  'GitLab',
  'Postman',
  'Sentry',
  'Linear',
  'Loom',
]

/**
 * Calculates Damerau-Levenshtein distance between strings `a` and `b`.
 */
export function damerauLevenshteinDistance(a: string, b: string): number {
  const sa = a.toLowerCase()
  const sb = b.toLowerCase()
  const lenA = sa.length
  const lenB = sb.length

  if (lenA === 0) return lenB
  if (lenB === 0) return lenA

  const matrix: number[][] = Array.from({ length: lenA + 1 }, () =>
    new Array(lenB + 1).fill(0),
  )

  for (let i = 0; i <= lenA; i++) matrix[i][0] = i
  for (let j = 0; j <= lenB; j++) matrix[0][j] = j

  for (let i = 1; i <= lenA; i++) {
    for (let j = 1; j <= lenB; j++) {
      const cost = sa[i - 1] === sb[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // Deletion
        matrix[i][j - 1] + 1, // Insertion
        matrix[i - 1][j - 1] + cost, // Substitution
      )

      if (
        i > 1 &&
        j > 1 &&
        sa[i - 1] === sb[j - 2] &&
        sa[i - 2] === sb[j - 1]
      ) {
        matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + cost) // Transposition
      }
    }
  }

  return matrix[lenA][lenB]
}

export interface SpellingCorrectionResult {
  original: string
  suggestion: string
  distance: number
  similarity: number
}

/**
 * Detects if `query` is a likely typo of a candidate word in the dictionary/product list.
 */
export function findSpellingCorrection(
  query: string,
  extraCandidates: string[] = [],
): SpellingCorrectionResult | null {
  const trimmed = query.trim()
  if (trimmed.length < 3 || trimmed.includes(' ')) return null

  const candidatesSet = new Set<string>([
    ...COMMON_SOFTWARE_DICTIONARY,
    ...extraCandidates,
  ])
  const queryLower = trimmed.toLowerCase()

  let bestMatch: { candidate: string; distance: number; similarity: number } | null = null

  for (const candidate of candidatesSet) {
    const candidateLower = candidate.toLowerCase()

    // Exact match — no misspelling.
    if (candidateLower === queryLower) {
      return null
    }

    const dist = damerauLevenshteinDistance(queryLower, candidateLower)
    const maxLen = Math.max(queryLower.length, candidateLower.length)
    const similarity = 1 - dist / maxLen

    // Thresholds: Allow max 2 edits for short words, 3 for longer words.
    // Must be at least 65% similar.
    const maxAllowedDist = maxLen <= 5 ? 1 : maxLen <= 8 ? 2 : 3

    if (dist > 0 && dist <= maxAllowedDist && similarity >= 0.65) {
      if (!bestMatch || dist < bestMatch.distance || (dist === bestMatch.distance && similarity > bestMatch.similarity)) {
        bestMatch = { candidate, distance: dist, similarity }
      }
    }
  }

  if (!bestMatch) return null

  return {
    original: trimmed,
    suggestion: bestMatch.candidate,
    distance: bestMatch.distance,
    similarity: bestMatch.similarity,
  }
}

/**
 * Finds ghost text auto-completion (suffix of top matching item starting with `query`).
 */
export function findInlineCompletion(
  query: string,
  candidates: string[],
): { fullMatch: string; ghostSuffix: string } | null {
  const trimmed = query.trim()
  if (trimmed.length < 1) return null

  const queryLower = trimmed.toLowerCase()

  for (const candidate of candidates) {
    const candidateLower = candidate.toLowerCase()
    if (candidateLower.startsWith(queryLower) && candidateLower !== queryLower) {
      const suffix = candidate.slice(trimmed.length)
      return {
        fullMatch: candidate,
        ghostSuffix: suffix,
      }
    }
  }

  return null
}
