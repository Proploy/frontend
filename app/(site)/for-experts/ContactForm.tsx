'use client'

import { useState } from 'react'

export function ContactForm() {
  const [sent, setSent] = useState(false)

  return (
    <form
      className="pp-stack pp-gap-3"
      action={() => {
        setSent(true)
      }}
    >
      <div className="pp-field">
        <label htmlFor="feEmail">Work email</label>
        <input className="pp-input" id="feEmail" type="email" required placeholder="you@studio.com" />
      </div>
      <div className="pp-field">
        <label htmlFor="feMsg">What do you implement?</label>
        <textarea
          className="pp-textarea"
          id="feMsg"
          style={{ minHeight: 96 }}
          placeholder="Platforms, sectors, typical engagement size"
        />
      </div>
      <button type="submit" className="pp-btn pp-btn--cobalt pp-btn--block">
        Contact the network team
      </button>
      {sent && (
        <p className="pp-small" style={{ color: 'var(--color-success-700)' }}>
          Thanks — we&apos;ll reply within one business day.
        </p>
      )}
    </form>
  )
}
