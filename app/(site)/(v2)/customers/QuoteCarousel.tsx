'use client'

import { useEffect, useState } from 'react'

const QUOTES = [
  {
    quote:
      '“We briefed Proploy on a Friday and had three shortlisted platforms — each with a vetted implementer attached — by Tuesday. The rollout finished two weeks early.”',
    name: 'Operations lead',
    org: 'Harborline Freight',
  },
  {
    quote:
      '“The expert we matched with had deployed the same ERP for four companies our size. Every question we asked, she had already answered somewhere else.”',
    name: 'Finance director',
    org: 'Quillstone Manufacturing',
  },
  {
    quote:
      '“Escrowed milestones changed the dynamic completely. We paid for outcomes, and the expert knew exactly what done looked like.”',
    name: 'Co-founder',
    org: 'Meridian Labs',
  },
]

export function QuoteCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIndex((v) => (v + 1) % QUOTES.length), 6000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="pp-stack pp-gap-8" style={{ alignItems: 'center', maxWidth: 820, marginInline: 'auto' }}>
      <div className="pp-quotes" style={{ width: '100%' }}>
        {QUOTES.map((q, i) => (
          <figure key={q.org} className={i === index ? 'pp-quote is-on' : 'pp-quote'} style={{ margin: 0 }}>
            <blockquote className="pp-display pp-d4 pp-center" style={{ margin: 0 }}>
              {q.quote}
            </blockquote>
            <figcaption className="pp-stack pp-gap-2 pp-center" style={{ alignItems: 'center' }}>
              <span className="pp-avatar pp-avatar--lg">{q.org[0]}</span>
              <span className="pp-small" style={{ color: 'var(--ink)', fontWeight: 600 }}>
                {q.name}
              </span>
              <span className="pp-label">{q.org}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="pp-dots">
        {QUOTES.map((q, i) => (
          <button
            key={q.org}
            type="button"
            aria-current={i === index}
            aria-label={`Show quote ${i + 1}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  )
}
