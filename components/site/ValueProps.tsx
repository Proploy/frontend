import { Reveal } from "./Reveal";

const POINTS = [
  {
    n: "01",
    metric: "−63%",
    metricLabel: "evaluation time",
    title: "Faster vendor evaluation",
    body: "Shortlists in days, not quarters. Skip the RFP theatre — Proploy scores vendors against your actual requirements and constraints.",
  },
  {
    n: "02",
    metric: "2.4×",
    metricLabel: "return on spend",
    title: "Maximise ROI on technology",
    body: "Software only pays back when it is adopted. Every match ships with an implementation path and the specialists to run it.",
  },
  {
    n: "03",
    metric: "100%",
    metricLabel: "spend visibility",
    title: "Stronger cost control",
    body: "Clear, drillable reporting across licences, renewals and services. Know what you spend, with whom, and what it returned.",
  },
];

export function ValueProps() {
  return (
    <section id="value" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <span className="label">Why Proploy</span>
            <h2 className="display mt-5 text-[clamp(2rem,4.2vw,3.25rem)] text-ink">
              The right tools
              <br />
              aren&apos;t enough.
            </h2>
            <p className="mt-6 max-w-[38ch] text-[1rem] leading-relaxed text-ink-soft">
              Centralise procurement with full visibility — then pair every purchase with the
              expertise that turns it into a working system. That second half is where most
              software budgets quietly disappear.
            </p>

            <div className="mt-10 rounded-2xl border border-border bg-white p-5">
              <span className="label">Where budget leaks</span>
              <div className="mt-5 space-y-4">
                {[
                  { l: "Licences bought", v: 100, tone: "bg-ink" },
                  { l: "Actually deployed", v: 61, tone: "bg-cobalt" },
                  { l: "Fully adopted", v: 34, tone: "bg-cobalt/45" },
                ].map((r) => (
                  <div key={r.l}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[0.8125rem] text-ink-soft">{r.l}</span>
                      <span className="font-mono text-[0.75rem] text-ink">{r.v}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-paper-deep">
                      <div className={`h-full rounded-full ${r.tone}`} style={{ width: `${r.v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[0.78rem] leading-relaxed text-ink-soft">
                Proploy closes the gap between the third bar and the first.
              </p>
            </div>
          </Reveal>

          <ul className="grid gap-4">
            {POINTS.map((p, i) => (
              <Reveal as="li" key={p.n} delay={i * 90}>
                <article className="lift group grid gap-6 rounded-2xl border border-border bg-white p-7 sm:grid-cols-[auto_1fr] sm:items-start">
                  <div className="sm:w-[128px]">
                    <span className="label">{p.n}</span>
                    <p className="display mt-3 text-[2.25rem] text-cobalt">{p.metric}</p>
                    <p className="label mt-1 !tracking-[0.1em]">{p.metricLabel}</p>
                  </div>
                  <div className="sm:border-l sm:border-border sm:pl-7">
                    <h3 className="display text-[1.25rem] text-ink">{p.title}</h3>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{p.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
