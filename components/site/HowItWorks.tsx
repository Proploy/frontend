'use client'

import { useState } from "react";
import { Reveal } from "./Reveal";

const STEPS = [
  {
    n: "01",
    key: "discover",
    title: "Discover",
    lead: "AI curates solutions around your actual needs.",
    body: "Describe the problem in plain language. Proploy reads your stack, team size, sector and constraints, then curates a shortlist scored on fit — not on who paid for placement.",
    bullets: ["Requirements captured in minutes", "Fit scoring against your stack", "No RFP cycle required"],
  },
  {
    n: "02",
    key: "decide",
    title: "Decide",
    lead: "Pre-negotiated enterprise pricing, fully transparent.",
    body: "See real costs before you commit. Proploy's vendor partnerships unlock enterprise terms, and every line — licences, services, renewal uplift — is on the table up front.",
    bullets: ["Pre-negotiated enterprise pricing", "Transparent total cost of ownership", "Direct vendor partnerships"],
  },
  {
    n: "03",
    key: "deploy",
    title: "Deploy",
    lead: "Vetted specialists and managed delivery.",
    body: "Matched with implementation specialists we have vetted, plus project management that owns the plan. Execution is the deliverable — not an optional extra you source later.",
    bullets: ["Vetted implementation specialists", "Project management included", "Guaranteed execution path"],
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <section id="how" className="relative py-24 lg:py-32">
      <div aria-hidden className="blueprint pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(90%_60%_at_50%_50%,black,transparent)]" />
      <div className="relative mx-auto max-w-[1240px] px-6 lg:px-10">
        <Reveal>
          <span className="label">How Proploy works</span>
          <h2 className="display mt-5 max-w-[16ch] text-[clamp(2rem,4.2vw,3.25rem)] text-ink">
            Three moves from problem to production.
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-14 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            {/* rail */}
            <ol className="relative">
              <span
                aria-hidden
                className="absolute left-[27px] top-4 bottom-4 w-px bg-border"
              />
              <span
                aria-hidden
                className="absolute left-[27px] w-px bg-cobalt transition-all duration-500 ease-out"
                style={{ top: `${8 + active * 86}px`, height: "70px" }}
              />
              {STEPS.map((s, i) => {
                const on = i === active;
                return (
                  <li key={s.key} className="relative">
                    <button
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      aria-current={on}
                      className="group flex w-full items-center gap-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cobalt"
                    >
                      <span
                        className={`grid h-[54px] w-[54px] shrink-0 place-items-center rounded-full border font-mono text-[0.75rem] transition-all duration-500 ${
                          on
                            ? "border-cobalt bg-cobalt text-white shadow-[0_16px_34px_-18px_var(--cobalt)]"
                            : "border-border bg-paper text-ink-soft group-hover:border-cobalt/50"
                        }`}
                      >
                        {s.n}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`display block text-[1.6rem] transition-colors duration-300 ${
                            on ? "text-ink" : "text-ink-soft/55"
                          }`}
                        >
                          {s.title}
                        </span>
                        <span className="mt-1 block truncate text-[0.85rem] text-ink-soft">
                          {s.lead}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            {/* detail */}
            <div className="glass-card relative overflow-hidden rounded-2xl p-8 lg:p-10">
              <div
                aria-hidden
                className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--cobalt)_22%,transparent),transparent_70%)] blur-xl transition-all duration-700"
                style={{ transform: `translateY(${active * 26}px)` }}
              />
              <div key={active} className="relative animate-[fade-in_0.5s_cubic-bezier(0.22,1,0.36,1)_both]">
                <span className="label">Step {STEPS[active].n}</span>
                <h3 className="display mt-4 text-[2rem] text-ink">{STEPS[active].title}</h3>
                <p className="mt-4 text-[1rem] leading-relaxed text-ink-soft">{STEPS[active].body}</p>
                <ul className="mt-8 space-y-3">
                  {STEPS[active].bullets.map((b, i) => (
                    <li
                      key={b}
                      className="flex items-center gap-3 animate-[fade-in_0.5s_cubic-bezier(0.22,1,0.36,1)_both]"
                      style={{ animationDelay: `${120 + i * 90}ms` }}
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cobalt-soft">
                        <svg viewBox="0 0 14 14" className="h-3 w-3 text-cobalt-deep" fill="none" aria-hidden>
                          <path d="m3 7.4 2.6 2.6L11 4.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="text-[0.9rem] text-ink">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
