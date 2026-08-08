'use client'

import { useRef } from 'react'
import { Reveal } from '@/components/site/Reveal'

const MEMBERS = [
  {
    initials: 'MC',
    name: 'Mara Cheng',
    meta: 'Revenue systems · London',
    body: 'CRM migrations and forecasting rebuilds for Series B to enterprise sales orgs.',
  },
  {
    initials: 'DO',
    name: 'Daniel Okafor',
    meta: 'Billing & RevOps · Lagos',
    body: 'Usage-based pricing migrations off legacy invoicing, live in under six weeks.',
  },
  {
    initials: 'SL',
    name: 'Sofia Lindqvist',
    meta: 'Manufacturing systems · Stockholm',
    body: 'MES and maintenance platforms from pilot line to full plant rollout.',
  },
  {
    initials: 'JT',
    name: 'Julien Tran',
    meta: 'Data & analytics · Montréal',
    body: 'Warehouse modelling and reporting layers finance will actually sign off on.',
  },
  {
    initials: 'RM',
    name: 'Renata Moreira',
    meta: 'Support ops · São Paulo',
    body: 'Omnichannel support builds with routing that survives a real queue.',
  },
]

export function MemberScroller() {
  const trackRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.8, 320), behavior: 'smooth' })
  }

  return (
    <div className="pp-container-app pp-stack pp-gap-16">
      <Reveal>
        <div
          className="pp-flex pp-wrap pp-gap-8"
          style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
        >
          <div className="pp-sec-head">
            <p className="pp-label">Meet the network</p>
            <h2 className="pp-display pp-d3">Specialists already shipping on Proploy.</h2>
            <p className="pp-lede">A cross-section of the experts matched with businesses this month.</p>
          </div>
          <div className="pp-flex pp-gap-3">
            <button type="button" className="pp-icon-btn" aria-label="Previous" onClick={() => scroll(-1)}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
            </button>
            <button type="button" className="pp-icon-btn" aria-label="Next" onClick={() => scroll(1)}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </Reveal>

      <div className="pp-scroller" ref={trackRef}>
        {MEMBERS.map((m) => (
          <article key={m.name} className="fe-member">
            <div className="fe-portrait">{m.initials}</div>
            <div className="pp-stack pp-gap-2">
              <p className="pp-h6">{m.name}</p>
              <p className="pp-small pp-accent">{m.meta}</p>
              <p className="pp-body">{m.body}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="pp-flex" style={{ justifyContent: 'center' }}>
        <button type="button" className="pp-btn pp-btn--secondary pp-btn--inline">
          Load more products
        </button>
      </div>
    </div>
  )
}
