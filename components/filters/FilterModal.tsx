'use client'

import { X } from 'lucide-react'
import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from 'react'

export function FilterModal({
  title,
  onClose,
  onClear,
  onSave,
  children,
}: {
  title: string
  onClose: () => void
  onClear: () => void
  onSave: () => void
  children: ReactNode
}) {
  const titleId = useId()
  const dialogRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    const dialog = dialogRef.current
    const focusableSelector =
      'button:not([disabled]), select:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
    dialog
      ?.querySelector<HTMLElement>(focusableSelector)
      ?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !dialog) return
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelector),
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0d12]/35 p-4"
      onClick={onClose}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[min(800px,calc(100vh-32px))] w-[min(920px,100%)] max-w-full flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_24px_48px_-12px_rgba(10,13,18,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2
            id={titleId}
            className="px-6 pt-6 text-[22px] font-semibold text-[#181d27] sm:px-8 sm:pt-7"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="mr-4 mt-4 rounded-lg p-2 text-[#535862] hover:bg-[#f2f4f7] sm:mr-6 sm:mt-6"
          >
            <X size={22} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
          {children}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-[#e9eaeb] px-6 py-5 sm:px-8 sm:py-[22px]">
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-semibold text-[#414651] sm:text-base"
          >
            Clear all filters
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-[10px] bg-[#181d27] px-5 py-[11px] text-sm font-semibold text-white sm:text-base"
          >
            Save filters
          </button>
        </div>
      </section>
    </div>
  )
}
