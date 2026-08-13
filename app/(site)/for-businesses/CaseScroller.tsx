'use client'

import { useRef, type ReactNode } from 'react'

export function CaseScroller({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.firstElementChild as HTMLElement | null
    const step = card ? card.offsetWidth + 24 : 408
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <div className="pp-stack pp-gap-8">
      <div className="pp-scroller" ref={trackRef}>
        {children}
      </div>

      <div className="pp-flex pp-gap-3">
        <button type="button" className="pp-icon-btn" aria-label="Previous" onClick={() => scroll(-1)}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
        </button>

        <button type="button" className="pp-icon-btn" aria-label="Next" onClick={() => scroll(1)}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
