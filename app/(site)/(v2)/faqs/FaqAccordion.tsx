'use client'

import { useState } from 'react'

export interface FaqItem {
  q: string
  a: string
}

export function FaqAccordion({ items, defaultOpen = null }: { items: FaqItem[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen)

  return (
    <div className="pp-acc">
      {items.map((faq, i) => {
        const isOpen = open === i
        return (
          <div key={faq.q} className={isOpen ? 'pp-acc-item is-open' : 'pp-acc-item'}>
            <button
              className="pp-acc-btn"
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="pp-acc-q">{faq.q}</span>
              <span className="pp-acc-ico">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d={isOpen ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
                </svg>
              </span>
            </button>
            <div className="pp-acc-a">{faq.a}</div>
          </div>
        )
      })}
    </div>
  )
}
