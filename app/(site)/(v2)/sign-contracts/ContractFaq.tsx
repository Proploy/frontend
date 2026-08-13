'use client'

import { useState } from 'react'

const FAQS = [
  {
    q: 'Do I have to use the standard contract?',
    a: 'The standard SOW covers most engagements and is the fastest path to signature. You can adjust milestones, rates and deliverables per project — the protective clauses (IP, scope change, dispute path) stay consistent so both sides know what they signed.',
  },
  {
    q: 'Is the e-signature legally binding?',
    a: 'Yes. Signatures are captured with a full audit trail — signer identity, timestamp and document hash — and are enforceable under e-signature law in every country Proploy operates in.',
  },
  {
    q: 'What happens when the client asks for more?',
    a: 'Anything outside the signed scope goes through a change order: a one-screen addendum with the extra work, the extra fee and a fresh signature. No change order, no obligation — that is the point.',
  },
  {
    q: 'Who owns the work product?',
    a: 'The standard terms transfer IP to the client on payment of the linked milestone — not before. Unpaid work stays yours.',
  },
  {
    q: 'Can I bring my own clients under these contracts?',
    a: 'Yes. Many experts move existing clients onto Proploy purely for contracting and payments. There is no exclusivity and your rate stays your own.',
  },
]

export function ContractFaq() {
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
