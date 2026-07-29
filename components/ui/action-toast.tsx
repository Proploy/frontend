'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, Check, Link2, X } from 'lucide-react'

export type ActionToastState = {
  tone?: 'success' | 'info' | 'error'
  title: string
  body?: string
  actionLabel?: string
  actionHref?: string
}

export function ActionToast({
  show,
  toast,
  onClose,
}: {
  show: boolean
  toast: ActionToastState | null
  onClose: () => void
}) {
  useEffect(() => {
    if (!show) return
    const handle = window.setTimeout(onClose, 3600)
    return () => window.clearTimeout(handle)
  }, [show, onClose])

  if (!show || !toast) return null

  const tone = toast.tone ?? 'success'
  const Icon = tone === 'success' ? Check : tone === 'info' ? Link2 : AlertCircle
  const toneClass = {
    success: 'border-[#abefc6] bg-[#ecfdf3] text-[#079455]',
    info: 'border-[#b2ccff] bg-[#eff4ff] text-[#155eef]',
    error: 'border-[#fecdca] bg-[#fef3f2] text-[#d92d20]',
  }[tone]

  return (
    <div
      role="status"
      aria-live="polite"
      className="app-action-toast fixed bottom-[24px] left-1/2 z-[95] w-[calc(100%-32px)] max-w-[560px] -translate-x-1/2"
    >
      <div className="flex items-center gap-[12px] rounded-[12px] border border-[#e9eaeb] bg-white px-[14px] py-[12px] shadow-[0_20px_44px_-12px_rgba(10,13,18,0.28)]">
        <span className={`flex size-[34px] shrink-0 items-center justify-center rounded-[9px] border ${toneClass}`}>
          <Icon size={17} strokeWidth={tone === 'success' ? 3 : 2} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">
            {toast.title}
          </span>
          {toast.body ? (
            <span className="block truncate text-[13px] leading-[18px] text-[#717680]">
              {toast.body}
            </span>
          ) : null}
          {toast.actionLabel && toast.actionHref ? (
            <Link
              href={toast.actionHref}
              onClick={onClose}
              className="mt-[3px] inline-flex text-[12px] font-semibold text-[#155eef] hover:underline"
            >
              {toast.actionLabel}
            </Link>
          ) : null}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="inline-flex size-[28px] shrink-0 items-center justify-center rounded-[8px] text-[#a4a7ae] transition hover:bg-[#f5f5f5] hover:text-[#535862]"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export function SavedToast({
  show,
  onClose,
  kind = 'saved',
}: {
  show: boolean
  onClose: () => void
  kind?: 'saved' | 'share'
}) {
  return (
    <ActionToast
      show={show}
      onClose={onClose}
      toast={
        kind === 'share'
          ? { tone: 'info', title: 'Share link copied', body: 'Anyone with the link can view this comparison.' }
          : { tone: 'success', title: 'Comparison saved', body: 'Find it under Saved comparisons in your account.' }
      }
    />
  )
}
