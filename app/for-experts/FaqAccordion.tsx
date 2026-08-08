'use client'

import { useState } from 'react'

const FAQS = [
  {
    q: 'What does it take to get approved?',
    a: 'An intake interview, two client references and proof of at least one full implementation on a platform in our catalogue. Most applications are decided within a week.',
  },
  {
    q: 'How much does Proploy take?',
    a: 'Nothing on your first matched project. After that, a flat published platform fee per engagement — never a variable cut negotiated after the quote.',
  },
  {
    q: 'Do I have to give up my own clients?',
    a: "No. There's no exclusivity. Bring existing clients onto the platform for contracting and payments if it's useful, or keep them entirely outside it.",
  },
  {
    q: 'How are briefs matched to me?',
    a: 'On platform expertise, sector history, delivery capacity and the outcome the business is buying. You see the scope and budget before you respond.',
  },
  {
    q: 'When do I get paid?',
    a: 'Funds are committed before kickoff and released per approved milestone, paid out in your local currency with tax paperwork generated automatically.',
  },
  {
    q: 'Can consultancies join, or only individuals?',
    a: 'Both. Consultancy profiles list team capacity and named leads, and the same vetting applies to whoever is delivering the engagement.',
  },
]

export function FaqAccordion() {
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
