'use client'

import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { AlertCircle, ArrowRight, X } from 'lucide-react'
import { useExpertApplicationStage } from '@/features/experts/use-expert-application-stage'

const DISMISS_KEY = 'proploy:complete-application-card-dismissed'

function readDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

const DISMISS_EVENT = 'proploy:complete-application-card-dismiss'

function writeDismissed() {
  try {
    sessionStorage.setItem(DISMISS_KEY, '1')
  } catch {
    // Session storage can be unavailable (private mode); the card just stays.
  }
  window.dispatchEvent(new Event(DISMISS_EVENT))
}

function subscribeDismissed(onChange: () => void) {
  window.addEventListener(DISMISS_EVENT, onChange)
  return () => window.removeEventListener(DISMISS_EVENT, onChange)
}

// Server render and first client paint both hide the card; the real value
// arrives once the store is read on the client.
function readDismissedOnServer(): boolean {
  return true
}

/**
 * Nudge for applicants with an unfinished expert application. Rendered on
 * /profile and the workspace home (/dashboard redirects there). Dismissal is
 * per browser session.
 */
export function CompleteApplicationCard({ className = '' }: { className?: string }) {
  const stage = useExpertApplicationStage()
  const dismissed = useSyncExternalStore(subscribeDismissed, readDismissed, readDismissedOnServer)

  const show = !stage.loading
    && !dismissed
    && (stage.stage === 'draft' || stage.stage === 'changes_requested' || stage.stage === 'rejected')
  if (!show) return null

  const isChanges = stage.stage === 'changes_requested'
  const isRejected = stage.stage === 'rejected'
  const tone = isChanges || isRejected
    ? 'border-danger-line bg-danger-soft text-danger'
    : 'border-cobalt-soft bg-cobalt-soft text-cobalt-deep'
  const title = isRejected
    ? 'Your expert application was closed'
    : isChanges
      ? 'The review team requested changes'
      : `Complete your expert application (${stage.percentComplete}%)`

  const dismiss = () => writeDismissed()

  return (
    <section
      aria-label="Expert application status"
      className={`relative rounded-[12px] border px-4 py-4 text-[14px] leading-[20px] ${tone} ${className}`}
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-3 top-3 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
      >
        <X size={16} />
      </button>

      <div className="flex items-start gap-3 pr-8">
        <AlertCircle size={18} className="mt-0.5 shrink-0" />
        <div className="flex min-w-0 flex-col gap-2">
          <p className="font-semibold">{title}</p>

          {stage.changeRequest?.notes ? (
            <p className="whitespace-pre-wrap text-ink">{stage.changeRequest.notes}</p>
          ) : null}

          {isRejected ? (
            <p className="text-ink">
              You can restore the application and edit it before submitting again.
            </p>
          ) : stage.missingSections.length > 0 ? (
            <ul className="flex flex-col gap-1 text-ink">
              {stage.missingSections.map((section) => (
                <li key={section.key} className="flex flex-wrap items-baseline gap-x-2">
                  <Link
                    href={`/become-expert?section=${section.key}`}
                    className="font-medium underline-offset-2 hover:underline"
                  >
                    {section.label}
                  </Link>
                  {section.missing.length > 0 ? (
                    <span className="text-ink-soft">needs {section.missing.join(', ')}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}

          <Link
            href={stage.href ?? '/become-expert'}
            className="inline-flex w-fit items-center gap-1 font-semibold underline-offset-2 hover:underline"
          >
            {isRejected ? 'Restore and edit' : 'Continue application'}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CompleteApplicationCard
