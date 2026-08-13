'use client'

import { useState } from 'react'

const FAQS = [
  {
    q: 'How long does a brief take to write?',
    a: 'Around ten minutes. You answer structured questions about the product, your team and your timeline — no free-form job description to agonise over. Most briefs go out the same day.',
  },
  {
    q: 'Who sees my brief?',
    a: 'Only the specialists the match engine scores against it — typically three to five people. Your brief is never published to a public board or blasted to the whole network.',
  },
  {
    q: 'What if I have not chosen the software yet?',
    a: 'Post the brief anyway. Say which products you are weighing and specialists who have shipped several of them will respond — many teams use the first call to settle the software decision itself.',
  },
  {
    q: 'Do I have to include a budget?',
    a: 'A range is enough. Briefs with a budget range get responses roughly twice as fast, because specialists can self-select out instead of opening a negotiation.',
  },
  {
    q: 'What does posting cost?',
    a: 'Nothing. Posting a brief and taking first calls is free. Proploy charges a flat published platform fee only when an engagement is signed.',
  },
]

export function BriefFaq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="pp-acc">
      {FAQS.map((faq, i) => {
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
