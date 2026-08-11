/**
 * Sanity environment configuration.
 *
 * Project ID and dataset are NEXT_PUBLIC_ on purpose — they travel in every
 * GROQ request from the browser and are not secrets. The read token is
 * server-only and deliberately NOT asserted here: the `production` dataset is
 * public, so published content reads fine without it. The token is only
 * required for draft/preview reads (Phase 5), which assert it at their own
 * call site.
 */

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined || v === '') {
    throw new Error(errorMessage)
  }
  return v
}

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID',
)

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET',
)

/**
 * Pinned date-based API version. Sanity treats this as a contract: bumping it
 * opts into breaking API changes. Never leave it floating.
 */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-03-01'

/** Where the embedded Studio is mounted. Used for stega / Visual Editing. */
export const studioUrl = '/studio'

/** Server-only. Undefined until a Viewer token is set in .env. */
export const readToken = process.env.SANITY_API_READ_TOKEN
