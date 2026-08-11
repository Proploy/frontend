'use client'

import { X } from 'lucide-react'
import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from 'react'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  /** Optional footer slot for action buttons. */
  footer?: ReactNode
  /** Wording for the close button's aria-label. */
  closeLabel?: string
  /** Forwarded to the dialog section for tests / analytics. */
  'data-testid'?: string
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), select:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'

/**
 * Centred overlay dialog with focus trap, escape-to-close, backdrop
 * dismissal, and focus restoration. Built for parity with the original
 * FilterModal without bringing it inside `components/filters/`.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  closeLabel = 'Close dialog',
  'data-testid': testId,
}: ModalProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    const dialog = dialogRef.current
    dialog?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !dialog) return
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
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

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0d12]/35 p-4"
      onClick={onClose}
      data-testid={testId}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[min(800px,calc(100vh-32px))] w-[min(640px,100%)] max-w-full flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_24px_48px_-12px_rgba(10,13,18,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id={titleId}
            className="flex-1 px-6 pt-6 text-[18px] font-semibold text-[#181d27] sm:px-8 sm:pt-7 sm:text-[22px]"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="mr-4 mt-4 rounded-lg p-2 text-[#535862] hover:bg-[#f2f4f7] sm:mr-6 sm:mt-6"
          >
            <X size={22} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
          {children}
        </div>

        {footer && (
          <div className="flex flex-col-reverse items-stretch gap-3 border-t border-[#e9eaeb] px-6 py-5 sm:flex-row sm:items-center sm:justify-end sm:gap-4 sm:px-8 sm:py-[22px]">
            {footer}
          </div>
        )}
      </section>
    </div>
  )
}
