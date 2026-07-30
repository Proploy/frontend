'use client'

import { useState } from "react";
import { Reveal } from "./Reveal";

type Solution = { name: string; blurb: string; proof: string; proofLabel: string };

const INDUSTRIES: { key: string; label: string; solutions: Solution[] }[] = [
  {
    key: "manufacturing",
    label: "Manufacturing",
    solutions: [
      { name: "Shopfloor MES", blurb: "Real-time production tracking with quality gates.", proof: "−18%", proofLabel: "scrap rate" },
      { name: "Supplier Hub", blurb: "Consolidated supplier scoring and contract terms.", proof: "£1.4M", proofLabel: "annual savings" },
      { name: "Maintenance AI", blurb: "Predictive servicing across connected assets.", proof: "+31%", proofLabel: "uptime" },
    ],
  },
  {
    key: "healthcare",
    label: "Healthcare",
    solutions: [
      { name: "Care Coordination", blurb: "Unified patient pathways across sites.", proof: "−27%", proofLabel: "admin hours" },
      { name: "Compliance Vault", blurb: "Audit-ready evidence, automatically collected.", proof: "100%", proofLabel: "audit pass" },
      { name: "Rota Intelligence", blurb: "Demand-led staffing with cost guardrails.", proof: "−12%", proofLabel: "agency spend" },
    ],
  },
  {
    key: "financial",
    label: "Financial services",
    solutions: [
      { name: "KYC Orchestration", blurb: "Onboarding flows with tiered risk checks.", proof: "4 days", proofLabel: "to onboard" },
      { name: "Close Automation", blurb: "Reconciliation and reporting on a schedule.", proof: "−5 days", proofLabel: "month-end" },
      { name: "Vendor Risk", blurb: "Continuous third-party monitoring.", proof: "3×", proofLabel: "risk coverage" },
    ],
  },
  {
    key: "retail",
    label: "Retail & e-commerce",
    solutions: [
      { name: "Unified Inventory", blurb: "One stock truth across channels and stores.", proof: "+22%", proofLabel: "sell-through" },
      { name: "Fulfilment Router", blurb: "Cost-optimal routing per order.", proof: "−31%", proofLabel: "delivery cost" },
      { name: "Loyalty Engine", blurb: "Segmented offers tied to margin rules.", proof: "+14%", proofLabel: "repeat rate" },
    ],
  },
  {
    key: "logistics",
    label: "Logistics",
    solutions: [
      { name: "Fleet Command", blurb: "Route, fuel and driver compliance in one view.", proof: "−9%", proofLabel: "fuel spend" },
      { name: "Yard & Dock", blurb: "Slot booking with live gate visibility.", proof: "−41%", proofLabel: "dwell time" },
      { name: "Freight Audit", blurb: "Invoice matching against contracted rates.", proof: "£640k", proofLabel: "recovered" },
    ],
  },
  {
    key: "professional",
    label: "Professional services",
    solutions: [
      { name: "Resourcing Grid", blurb: "Skills-based staffing against pipeline.", proof: "+11pt", proofLabel: "utilisation" },
      { name: "Engagement PSA", blurb: "Scope, time and margin on every project.", proof: "+8pt", proofLabel: "gross margin" },
      { name: "Knowledge Layer", blurb: "Searchable delivery assets across teams.", proof: "−35%", proofLabel: "ramp time" },
    ],
  },
];

export function Industries() {
  const [active, setActive] = useState(INDUSTRIES[0].key);
  const current = INDUSTRIES.find((i) => i.key === active)!;

  return (
    <section id="solutions" className="relative border-y border-border bg-white/60 py-24 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="label">Solutions by industry</span>
              <h2 className="display mt-5 max-w-[18ch] text-[clamp(2rem,4.2vw,3.25rem)] text-ink">
                Browse what already works in your sector.
              </h2>
            </div>
            <p className="max-w-[34ch] text-[0.9375rem] leading-relaxed text-ink-soft">
              Every solution carries a measurable proof point from a live deployment — not a
              feature list.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div role="tablist" aria-label="Industries" className="mt-10 flex flex-wrap gap-2">
            {INDUSTRIES.map((ind) => {
              const on = ind.key === active;
              return (
                <button
                  key={ind.key}
                  role="tab"
                  aria-selected={on}
                  aria-controls={`panel-${ind.key}`}
                  id={`tab-${ind.key}`}
                  onClick={() => setActive(ind.key)}
                  className={`rounded-full border px-4 py-2 text-[0.8125rem] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt ${
                    on
                      ? "border-ink bg-ink text-paper"
                      : "border-border bg-white text-ink-soft hover:border-cobalt hover:text-ink"
                  }`}
                >
                  {ind.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div
          role="tabpanel"
          id={`panel-${current.key}`}
          aria-labelledby={`tab-${current.key}`}
          className="mt-8 grid gap-4 md:grid-cols-3"
        >
          {current.solutions.map((s, i) => (
            <article
              key={`${current.key}-${s.name}`}
              className="lift group relative overflow-hidden rounded-2xl border border-border bg-paper p-6 animate-[fade-in_0.55s_cubic-bezier(0.22,1,0.36,1)_both]"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px scale-x-0 bg-cobalt transition-transform duration-500 group-hover:scale-x-100"
              />
              <div className="flex items-start justify-between gap-4">
                <h3 className="display text-[1.15rem] text-ink">{s.name}</h3>
                <svg viewBox="0 0 20 20" className="mt-1 h-4 w-4 shrink-0 text-ink-soft transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cobalt" fill="none" aria-hidden>
                  <path d="M6 14 14 6m0 0H7m7 0v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="mt-3 min-h-[3rem] text-[0.9rem] leading-relaxed text-ink-soft">{s.blurb}</p>
              <div className="mt-6 flex items-baseline gap-2 border-t border-border pt-4">
                <span className="display text-[1.6rem] text-cobalt">{s.proof}</span>
                <span className="label">{s.proofLabel}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
