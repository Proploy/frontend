'use client'

import { MessageSquare } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useCallback, useId, useState } from 'react'
import { compareTrayShows } from '@/components/compare/CompareTray'
import { Sheet } from '@/components/ui/Sheet'
import { useCompareSelection } from '@/features/compare/selection-store'
import { isProtectedRoute } from '@/lib/auth/protected-routes'
import { FeedbackForm } from './FeedbackForm'

// Signed-in areas and the auth callback get no tab: the widget is for the
// public site only.
function showsOn(pathname: string): boolean {
  return !isProtectedRoute(pathname) && !pathname.startsWith('/auth/')
}

export function FeedbackWidget() {
  const pathname = usePathname() ?? '/'
  const { count: compareCount } = useCompareSelection()
  const formId = useId()
  const [open, setOpen] = useState(false)
  const [phase, setPhase] = useState<'editing' | 'sending' | 'sent'>('editing')
  const close = useCallback(() => setOpen(false), [])

  if (!showsOn(pathname)) return null

  return (
    <div className="pp-scope">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Give feedback"
        aria-haspopup="dialog"
        className="pp-btn pp-btn--cobalt pp-btn--pill pp-feedback-pill"
        data-above-tray={compareTrayShows(compareCount, pathname) || undefined}
      >
        <MessageSquare size={18} aria-hidden />
        <span className="pp-feedback-pill__label">Feedback</span>
      </button>
      <Sheet
        open={open}
        onClose={close}
        title="Share feedback"
        closeLabel="Close feedback"
        data-testid="feedback-sheet"
        footer={phase === 'sent' ? undefined : (
          <>
            <button type="button" className="pp-btn pp-btn--ghost" onClick={close}>Cancel</button>
            <button type="submit" form={formId} className="pp-btn pp-btn--cobalt" disabled={phase === 'sending'}>
              {phase === 'sending' ? 'Sending…' : 'Send feedback'}
            </button>
          </>
        )}
      >
        <FeedbackForm formId={formId} onPhaseChange={setPhase} />
      </Sheet>
    </div>
  )
}
