'use client'

import { useState } from 'react'

const TOPICS = [
  'General question',
  'Sales & pricing',
  'Support — existing engagement',
  'Partnerships',
  'Press & media',
  'Something else',
]

export function ContactForm() {
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div className="pp-stack pp-gap-4 pp-center" style={{ alignItems: 'center', paddingBlock: 'var(--sp-10)' }}>
        <span className="pp-tile pp-tile--soft" aria-hidden>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 13 4 4 10-10" />
          </svg>
        </span>
        <p className="pp-h5">Message received</p>
        <p className="pp-body" style={{ maxWidth: '38ch' }}>
          Thanks for reaching out — the right team will reply within one business day.
        </p>
        <button
          type="button"
          className="pp-btn pp-btn--soft pp-btn--sm pp-btn--pill pp-btn--inline"
          onClick={() => setSent(false)}
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form
      className="pp-stack pp-gap-4"
      action={() => {
        setSent(true)
      }}
    >
      <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-4)' }}>
        <div className="pp-field">
          <label htmlFor="ctName">Full name</label>
          <input className="pp-input" id="ctName" type="text" required placeholder="Alex Rivera" />
        </div>
        <div className="pp-field">
          <label htmlFor="ctEmail">Work email</label>
          <input className="pp-input" id="ctEmail" type="email" required placeholder="you@company.com" />
        </div>
      </div>

      <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-4)' }}>
        <div className="pp-field">
          <label htmlFor="ctCompany">Company</label>
          <input className="pp-input" id="ctCompany" type="text" placeholder="Company name" />
        </div>
        <div className="pp-field">
          <label htmlFor="ctTopic">Topic</label>
          <select className="pp-select" id="ctTopic" defaultValue={TOPICS[0]}>
            {TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pp-field">
        <label htmlFor="ctMsg">How can we help?</label>
        <textarea
          className="pp-textarea"
          id="ctMsg"
          required
          placeholder="Tell us a little about what you need — the more context, the faster the answer."
        />
      </div>

      <button type="submit" className="pp-btn pp-btn--cobalt pp-btn--block">
        Send message
      </button>

      <p className="pp-small">We reply to every message within one business day.</p>
    </form>
  )
}
