'use client'

import { useState } from 'react'

const FAQS = [
  {
    q: 'Who is my contract and invoice actually with?',
    a: 'With a Proploy invoicing entity in your region. You sign one agreement and receive one consolidated invoice — Proploy holds the individual agreements with each expert.',
  },
  {
    q: 'How does tax documentation work?',
    a: 'Each expert completes the residency and status declarations required for their jurisdiction before their first payout — the local equivalent of the tax forms your finance team would otherwise chase. Collected once, kept current, attached to your records.',
  },
  {
    q: 'What currencies can experts be paid in?',
    a: 'Experts across 34 countries are paid in their local currency. You are billed in yours — the FX rate is shown on the invoice line, not buried in the total.',
  },
  {
    q: 'Do we need to onboard each expert as a vendor?',
    a: 'No. Proploy is your single vendor. One procurement onboarding, one supplier record, one payment run — regardless of how many experts you engage.',
  },
  {
    q: 'What about withholding and reporting obligations?',
    a: 'Proploy determines the correct treatment per engagement and jurisdiction, applies it, and gives you the paperwork. Your auditors get a clean file; your team does not become a tax department.',
  },
]

export function PaymentsFaq() {
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
