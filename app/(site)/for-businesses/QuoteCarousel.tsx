'use client'

import { useEffect, useState } from 'react'

const QUOTES = [
  {
    quote:
      '“Finding the right implementation partner for a new platform is a daunting task. Proploy matched us with a vetted expert who shipped on time and on scope.”',
    initials: 'AW',
    name: 'Adam Wathan',
    role: 'Head of Operations, Fruition',
  },
  {
    quote:
      '“Three tools shortlisted in two days. We picked one and were live in three weeks, with the same expert through cutover.”',
    initials: 'LP',
    name: 'Lena Park',
    role: 'VP Revenue Ops, Layers',
  },
  {
    quote:
      '“Procurement stopped chasing email threads. Everything from scope to invoice sat in one workspace.”',
    initials: 'DS',
    name: 'Diego Salas',
    role: 'Finance Director, Capsule',
  },
]

export function QuoteCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setTimeout(() => setIndex((i) => (i + 1) % QUOTES.length), 7000)
    return () => clearTimeout(id)
  }, [index])

  return (
    <>
      <div className="pp-quotes" style={{ width: '100%' }}>
        {QUOTES.map((q, i) => (
          <div key={q.name} className={`pp-quote${i === index ? ' is-on' : ''}`}>
            <p
              className="pp-display pp-d4 pp-mx-auto"
              style={{
                maxWidth: '24ch',
                fontWeight: 'var(--weight-medium)',
                lineHeight: 1.3,
                letterSpacing: 'var(--tracking-display)',
              }}
            >
              {q.quote}
            </p>

            <div className="pp-flex pp-gap-4" style={{ alignItems: 'center' }}>
              <span
                className="pp-avatar"
                style={{ width: 44, height: 44, background: 'var(--cobalt)', color: '#fff', fontSize: 15 }}
              >
                {q.initials}
              </span>

              <div style={{ textAlign: 'left' }}>
                <p className="pp-h6">{q.name}</p>
                <p className="pp-small">{q.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pp-dots" aria-label="Testimonial pagination">
        {QUOTES.map((q, i) => (
          <button
            key={q.name}
            type="button"
            aria-label={`Testimonial ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </>
  )
}
