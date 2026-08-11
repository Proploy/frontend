'use client'

import { X } from 'lucide-react'
import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from 'react'

export interface SheetProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  /** Optional footer slot for action buttons. */
  footer?: ReactNode
  /** Wording for the close button's aria-label. */
  closeLabel?: string
  /**
   * On `lg+` viewports, the sheet anchors to the right edge. On mobile,
   * it always slides up from the bottom regardless of this value.
   */
  side?: 'right' | 'left'
  /** Forwarded to the panel for tests / analytics. */
  'data-testid'?: string
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), select:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'

/**
 * Mobile-first side sheet. Anchors to the bottom on phones (full-width
 * drawer) and slides in from the right (default) or left on `lg+` as a
 * fixed-width column. Shares focus-trap semantics with `Modal`.
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
  closeLabel = 'Close sheet',
  side = 'right',
  'data-testid': testId,
}: SheetProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    const panel = panelRef.current
    panel?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panel) return
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable.at(-1) as HTMLElement | undefined
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus()
    }
  }, [open, onClose])

  // Lock body scroll while the sheet is open.
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open) return null

  // Mobile: full-width, anchored to the bottom with a top corner radius.
  // Desktop: fixed-width column on the chosen side (right by default).
  const desktopPosition =
    side === 'left'
      ? 'lg:left-0 lg:right-auto lg:rounded-r-[22px] lg:rounded-l-none'
      : 'lg:right-0 lg:left-auto lg:rounded-l-[22px] lg:rounded-r-none'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#0a0d12]/35 p-0 lg:items-stretch lg:justify-end"
      onClick={onClose}
      data-testid={testId}
    >
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`flex max-h-[92vh] w-full max-w-full flex-col overflow-hidden rounded-t-[22px] bg-white shadow-[0_24px_48px_-12px_rgba(10,13,18,0.25)] lg:max-h-none lg:h-full lg:w-[min(420px,100%)] lg:rounded-t-none ${desktopPosition}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#e9eaeb]">
          <h2
            id={titleId}
            className="flex-1 px-5 pt-5 text-[17px] font-semibold text-[#181d27] sm:px-6 sm:pt-6 sm:text-[20px]"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="mr-3 mt-3 rounded-lg p-2 text-[#535862] hover:bg-[#f2f4f7] sm:mr-4 sm:mt-4"
          >
            <X size={22} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          {children}
        </div>

        {footer && (
          <div className="flex flex-col-reverse items-stretch gap-3 border-t border-[#e9eaeb] px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-4 sm:px-6 sm:py-[18px]">
            {footer}
          </div>
        )}
      </section>
    </div>
  )
}
