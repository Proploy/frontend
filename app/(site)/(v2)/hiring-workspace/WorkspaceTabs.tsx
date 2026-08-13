'use client'

import { useState } from 'react'

const TABS = ['Shortlist', 'Conversations', 'Decisions'] as const
type Tab = (typeof TABS)[number]

const SHORTLIST = [
  { name: 'Amara O.', role: 'ERP rollout lead', fit: '96%', status: 'Call booked' },
  { name: 'Daniel K.', role: 'CRM migration', fit: '91%', status: 'Responded' },
  { name: 'Ines R.', role: 'Data platform', fit: '88%', status: 'Reviewing brief' },
]

const CONVERSATIONS = [
  { name: 'Amara O.', line: 'Sending the phased cutover plan we discussed — payroll runs parallel in weeks 4–5.', time: '2h ago' },
  { name: 'Daniel K.', line: 'Two references from manufacturing rollouts attached, both happy to take a call.', time: 'Yesterday' },
  { name: 'Proploy', line: 'Reminder: your comparison table updates automatically as responses arrive.', time: 'Mon' },
]

const DECISIONS = [
  { label: 'Software confirmed', detail: 'Meridian HRIS over Northlake — integration coverage', by: 'S. Cho', date: 'May 12' },
  { label: 'Budget approved', detail: '$25k–$40k range signed off by finance', by: 'J. Patel', date: 'May 14' },
  { label: 'Shortlist locked', detail: '3 specialists advanced to first calls', by: 'S. Cho', date: 'May 15' },
]

export function WorkspaceTabs() {
  const [tab, setTab] = useState<Tab>('Shortlist')

  return (
    <div className="pp-glass" style={{ padding: 'var(--sp-5)' }}>
      <div className="pp-flex" style={{ alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--cobalt)' }} />
        <span className="pp-label">Meridian HRIS rollout</span>
        <span className="pp-label" style={{ marginLeft: 'auto' }}>3 candidates</span>
      </div>

      <div className="pp-flex pp-gap-2" style={{ marginBottom: 'var(--sp-4)', flexWrap: 'wrap' }}>
        {TABS.map((t) => (
          <button key={t} type="button" className="pd-tab" aria-pressed={tab === t} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Shortlist' && (
        <div className="pp-stack pp-gap-3">
          {SHORTLIST.map((s) => (
            <div
              key={s.name}
              className="pp-flex"
              style={{
                alignItems: 'center',
                gap: 'var(--sp-3)',
                padding: 'var(--sp-3)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-tile)',
                background: '#fff',
              }}
            >
              <span className="pp-avatar">{s.name.slice(0, 1)}</span>
              <div style={{ minWidth: 0 }}>
                <p className="pp-body" style={{ color: 'var(--ink)', fontWeight: 600 }}>
                  {s.name} <span className="pp-mono-num" style={{ color: 'var(--cobalt-deep)', fontSize: 13 }}>{s.fit}</span>
                </p>
                <p className="pp-small">{s.role}</p>
              </div>
              <span className="pp-tag pp-tag--cobalt" style={{ marginLeft: 'auto' }}>
                {s.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === 'Conversations' && (
        <div className="pp-stack pp-gap-3">
          {CONVERSATIONS.map((c) => (
            <div
              key={c.name + c.time}
              style={{ padding: 'var(--sp-3)', border: '1px solid var(--line)', borderRadius: 'var(--r-tile)', background: '#fff' }}
            >
              <div className="pp-flex" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
                <p className="pp-small" style={{ color: 'var(--ink)', fontWeight: 600 }}>
                  {c.name}
                </p>
                <p className="pp-small">{c.time}</p>
              </div>
              <p className="pp-small" style={{ color: 'var(--ink-soft)' }}>{c.line}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'Decisions' && (
        <div className="pp-stack pp-gap-3">
          {DECISIONS.map((d) => (
            <div
              key={d.label}
              style={{ padding: 'var(--sp-3)', border: '1px solid var(--line)', borderRadius: 'var(--r-tile)', background: '#fff' }}
            >
              <div className="pp-flex" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
                <p className="pp-small" style={{ color: 'var(--ink)', fontWeight: 600 }}>
                  {d.label}
                </p>
                <p className="pp-small">{d.date}</p>
              </div>
              <p className="pp-small">{d.detail}</p>
              <p className="pp-small" style={{ marginTop: 4, color: 'var(--cobalt-deep)' }}>
                Recorded by {d.by}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
