'use client'

import { useState } from 'react'
import { Star, X } from 'lucide-react'
import { BUTTON_SKEUO } from '@/components/dashboard/DashboardChrome'

export function StarRating({
  value,
  onChange,
  size = 18,
  readOnly = false,
}: {
  value: number
  onChange?: (v: number) => void
  size?: number
  readOnly?: boolean
}) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = (hover || value) >= n
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(n)}
            onMouseEnter={() => !readOnly && setHover(n)}
            onMouseLeave={() => !readOnly && setHover(0)}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            className={readOnly ? 'cursor-default' : 'cursor-pointer'}
          >
            <Star
              size={size}
              className={filled ? 'fill-[#f79009] text-[#f79009]' : 'fill-transparent text-[#d5d7da]'}
            />
          </button>
        )
      })}
    </div>
  )
}

export function ReviewModal({
  expert,
  project,
  onClose,
  onSubmit,
}: {
  expert: string
  project: string
  onClose: () => void
  onSubmit: (data: { rating: number; title: string; body: string }) => void
}) {
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    setSubmitted(true)
    const payload = {
      rating,
      title: title.trim() || 'Great work',
      body: body.trim() || 'Delivered as scoped — would hire again.',
    }
    setTimeout(() => {
      onSubmit(payload)
    }, 900)
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-[16px]">
      <div className="absolute inset-0 bg-[#0a0d12]/40 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-[460px] rounded-[16px] border border-[#e9eaeb] bg-white p-[24px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-[16px] top-[16px] inline-flex size-[32px] items-center justify-center rounded-[8px] text-[#717680] hover:bg-[#fafafa]"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center gap-[12px] py-[24px] text-center">
            <span className="flex size-[56px] items-center justify-center rounded-full bg-[#dcfae6] text-[#067647]">
              <Star size={26} className="fill-[#067647]" />
            </span>
            <h2 className="font-semibold text-[20px] leading-[28px] text-[#181d27]">Review submitted</h2>
            <p className="text-[14px] leading-[20px] text-[#535862]">
              Thanks — your feedback helps {expert} and keeps the Proploy network vetted.
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-semibold text-[20px] leading-[28px] text-[#181d27]">Review {expert}</h2>
            <p className="mt-[2px] text-[14px] leading-[20px] text-[#717680]">{project}</p>

            <div className="mt-[20px] flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <span className="text-[13px] font-medium text-[#414651]">Overall rating</span>
                <StarRating value={rating} onChange={setRating} size={28} />
              </div>
              <label className="flex flex-col gap-[6px]">
                <span className="text-[13px] font-medium text-[#414651]">Title</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  className={`rounded-[8px] border border-[#d5d7da] px-[12px] py-[10px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`}
                />
              </label>
              <label className="flex flex-col gap-[6px]">
                <span className="text-[13px] font-medium text-[#414651]">Review</span>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={4}
                  placeholder="What went well? What could improve?"
                  className={`resize-none rounded-[8px] border border-[#d5d7da] px-[12px] py-[10px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`}
                />
              </label>
            </div>

            <div className="mt-[20px] flex justify-end gap-[10px]">
              <button
                type="button"
                onClick={onClose}
                className={`rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className={`rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
              >
                Submit review
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
