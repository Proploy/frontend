// Mirrors service-apis modules/feedback/models.py (FeedbackCreateRequest).

export const FEEDBACK_CATEGORIES = [
  { value: 'bug', label: 'Bug' },
  { value: 'idea', label: 'Idea' },
  { value: 'praise', label: 'Praise' },
  { value: 'other', label: 'Other' },
] as const

export const FEEDBACK_AREAS = [
  { value: 'search', label: 'Search' },
  { value: 'products', label: 'Product pages' },
  { value: 'compare', label: 'Compare' },
  { value: 'experts', label: 'Experts' },
  { value: 'sign_in', label: 'Sign in / sign up' },
  { value: 'other', label: 'Something else' },
] as const

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number]['value']
export type FeedbackArea = (typeof FEEDBACK_AREAS)[number]['value']

export const SCREENSHOT_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const
export type ScreenshotType = (typeof SCREENSHOT_TYPES)[number]

export const MESSAGE_MIN_CHARS = 10
export const MESSAGE_MAX_CHARS = 2000
export const SCREENSHOT_MAX_BYTES = 5 * 1024 * 1024

export interface FeedbackAttachment {
  filename: string
  contentType: ScreenshotType
  dataBase64: string
}

export interface FeedbackSubmission {
  category: FeedbackCategory
  area: FeedbackArea | null
  rating: number | null
  message: string
  email: string | null
  canContact: boolean
  pageUrl: string | null
  website: string | null
  attachment: FeedbackAttachment | null
}

export interface FeedbackReceipt {
  id: string
  status: 'received'
}
