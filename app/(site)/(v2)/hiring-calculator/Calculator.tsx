'use client'

import { useMemo, useState } from 'react'

// Illustrative rate assumptions — clearly labeled on the page. Not quotes.
const ROLES = [
  { id: 'crm', label: 'CRM implementation specialist', salary: 145_000, rate: 120 },
  { id: 'erp', label: 'ERP consultant', salary: 165_000, rate: 140 },
  { id: 'data', label: 'Data & analytics engineer', salary: 150_000, rate: 130 },
  { id: 'mkt', label: 'Marketing automation specialist', salary: 125_000, rate: 110 },
  { id: 'ai', label: 'AI / ML integration engineer', salary: 180_000, rate: 150 },
  { id: 'revops', label: 'Revenue operations specialist', salary: 135_000, rate: 115 },
] as const

const REGIONS = [
  { id: 'na', label: 'North America', mult: 1.0 },
  { id: 'weu', label: 'Western Europe', mult: 0.92 },
  { id: 'uk', label: 'United Kingdom', mult: 0.95 },
  { id: 'apac', label: 'Asia-Pacific', mult: 0.85 },
  { id: 'latam', label: 'Latin America', mult: 0.7 },
] as const

const OVERHEAD = 0.3 // benefits, payroll taxes, tooling, recruiting — illustrative
const ENGAGED_WEEKS = 46 // expert billable weeks per year — illustrative

function usd(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

export function Calculator() {
  const [roleId, setRoleId] = useState<string>(ROLES[0].id)
  const [regionId, setRegionId] = useState<string>(REGIONS[0].id)
  const [hours, setHours] = useState(20)

  const { fullTime, expert, savings, pct } = useMemo(() => {
    const role = ROLES.find((r) => r.id === roleId) ?? ROLES[0]
    const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[0]
    const fullTimeCost = role.salary * region.mult * (1 + OVERHEAD)
    const expertCost = role.rate * region.mult * hours * ENGAGED_WEEKS
    const diff = fullTimeCost - expertCost
    return {
      fullTime: fullTimeCost,
      expert: expertCost,
      savings: diff,
      pct: fullTimeCost > 0 ? Math.round((diff / fullTimeCost) * 100) : 0,
    }
  }, [roleId, regionId, hours])

  const expertCheaper = savings > 0

  return (
    <div className="pp-card pp-card--panel pp-stack pp-gap-8">
      {/* inputs */}
      <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-6)' }}>
        <div className="pp-field">
          <label htmlFor="calc-role">Role / specialty</label>
          <select id="calc-role" className="pp-select" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div className="pp-field">
          <label htmlFor="calc-region">Region</label>
          <select id="calc-region" className="pp-select" value={regionId} onChange={(e) => setRegionId(e.target.value)}>
            {REGIONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div className="pp-field">
          <label htmlFor="calc-hours">
            Hours needed per week — <span className="pp-mono-num">{hours}h</span>
          </label>
          <input
            id="calc-hours"
            type="range"
            min={5}
            max={40}
            step={5}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            style={{ accentColor: 'var(--cobalt)', height: 44 }}
          />
        </div>
      </div>

      <hr className="pp-rule" />

      {/* results */}
      <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-8)' }}>
        <div className="pp-metric">
          <p className="pp-metric-value" style={{ color: 'var(--ink)' }}>
            {usd(fullTime)}
          </p>
          <p className="pp-label">Full-time hire / year</p>
          <p className="pp-small">Salary + {Math.round(OVERHEAD * 100)}% overhead, region-adjusted</p>
        </div>

        <div className="pp-metric">
          <p className="pp-metric-value">{usd(expert)}</p>
          <p className="pp-label">Proploy expert / year</p>
          <p className="pp-small">
            {hours}h × {ENGAGED_WEEKS} engaged weeks at the illustrative project rate
          </p>
        </div>

        <div
          className="pp-metric"
          style={{
            padding: 'var(--sp-5)',
            borderRadius: 'var(--r-card)',
            background: expertCheaper ? 'var(--cobalt-soft)' : 'var(--paper-deep)',
            border: 'var(--bw) solid color-mix(in oklab, var(--cobalt) 25%, var(--line))',
          }}
        >
          <p className="pp-metric-value" style={{ color: 'var(--cobalt-deep)' }}>
            {expertCheaper ? usd(savings) : usd(-savings)}
          </p>
          <p className="pp-label">{expertCheaper ? `Saved per year · ${pct}%` : 'Full-time is cheaper at this volume'}</p>
          <p className="pp-small">
            {expertCheaper
              ? 'On this workload an on-demand expert costs less than a full-time hire.'
              : 'At 35h+ a week, a full-time hire can be the better call — Proploy can help you find one too.'}
          </p>
        </div>
      </div>
    </div>
  )
}
