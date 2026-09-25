import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import {
  SCREENSHOT_MAX_BYTES,
  SCREENSHOT_TYPES,
  type FeedbackAttachment,
  type FeedbackReceipt,
  type FeedbackSubmission,
  type ScreenshotType,
} from './types'

const client = new ServiceApisBrowserClient()

// Goes through the proxy, which attaches the session token when there is one
// (attributing the feedback) and forwards anonymously when there is not.
export function submitFeedback(
  submission: FeedbackSubmission,
): Promise<{ ok: true; data: FeedbackReceipt } | NormalizedError> {
  return client.post<FeedbackReceipt>('/api/v1/feedback', submission)
}

export function screenshotProblem(file: File): string | null {
  if (!(SCREENSHOT_TYPES as readonly string[]).includes(file.type)) {
    return 'Screenshots must be PNG, JPEG, or WebP.'
  }
  if (file.size > SCREENSHOT_MAX_BYTES) {
    return 'Screenshots must be 5 MB or smaller.'
  }
  return null
}

export async function readScreenshot(file: File): Promise<FeedbackAttachment> {
  const bytes = new Uint8Array(await file.arrayBuffer())
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return {
    filename: file.name,
    contentType: file.type as ScreenshotType,
    dataBase64: btoa(binary),
  }
}
