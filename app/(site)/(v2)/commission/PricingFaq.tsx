'use client'

import { useState } from 'react'

const FAQS = [
  {
    q: 'Is 0% commission actually 0%?',
    a: 'Yes — Proploy never takes a percentage of your rate. You quote $20,000, the milestone releases $20,000. After your first matched project, engagements carry a flat platform fee that is published on the brief before you accept it.',
  },
  {
    q: 'So how does Proploy make money?',
    a: 'From the business side — companies pay Proploy for curation, matching and the managed workspace — plus the flat, published engagement fee. Our revenue never scales off your rate, so we have no incentive to inflate or squeeze it.',
  },
  {
    q: 'Are there payout or withdrawal fees?',
    a: 'Local-rail payouts (SEPA, ACH, FPS and equivalents) are free. Cross-currency payouts show the FX rate and any fee on the brief, before you accept — never on the statement afterwards.',
  },
  {
    q: 'What does the flat engagement fee cover?',
    a: 'Contracting and e-signature, the project workspace, milestone escrow, invoicing, payout rails and dispute handling. It is the same published amount whether the engagement is $5,000 or $50,000.',
  },
  {
    q: 'Do I pay anything to join or stay listed?',
    a: 'No. Applying, verification, your directory profile and receiving matched briefs are all free. You only ever pay the flat fee on engagements you chose to take.',
  },
]

export function PricingFaq() {
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
