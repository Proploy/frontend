// Annotated mock of the project brief Sam produces. The section list and order
// mirror the generator in agent-harness (tools/skills/project_brief_skill.py):
// executive summary, business objectives, key requirements, shortlisted
// solutions, recommended solution, success criteria, next steps. Content is
// illustrative; product names are deliberately generic.

const SHORTLIST = [
  { name: "Option A", bestFor: "Field teams with offline routes", rating: "4.6", trial: "14 days" },
  { name: "Option B", bestFor: "Dispatch-heavy operations", rating: "4.4", trial: "Free plan" },
  { name: "Option C", bestFor: "Small crews, simple jobs", rating: "4.2", trial: "30 days" },
];

const ANNOTATIONS = [
  { n: "01", title: "Executive summary", body: "One paragraph that grounds the brief in the goal you described, in your words." },
  { n: "02", title: "Business objectives", body: "The outcomes you told Sam you need, listed so stakeholders can agree on them." },
  { n: "03", title: "Key requirements", body: "Built from the constraints and pain points you confirmed: team size, integrations, deployment, compliance." },
  { n: "04", title: "Shortlisted solutions", body: "Every product on your shortlist, side by side, with what it is best for, its rating and trial terms." },
  { n: "05", title: "Recommended solution", body: "Sam's pick, flagged clearly, with a one-sentence reason tied to your situation." },
  { n: "06", title: "Success criteria", body: "How you said you would judge the rollout, so delivery can be measured against it." },
  { n: "07", title: "Next steps", body: "Three concrete actions to take the brief into evaluation, trial or implementation." },
];

function SectionHeading({ n, children }: { n: string; children: string }) {
  return (
    <h3 className="mt-7 flex items-baseline gap-3 first:mt-0">
      <span className="font-mono text-[0.65rem] tracking-[0.16em] text-cobalt">{n}</span>
      <span className="text-[0.95rem] font-semibold text-ink">{children}</span>
    </h3>
  );
}

export function BriefExcerpt() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
      <article
        aria-label="Example project brief"
        className="glass-card relative overflow-hidden rounded-2xl p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
          <div>
            <span className="label">Project brief</span>
            <p className="display mt-2 text-[1.5rem] text-ink">Field scheduling for a 45-person service team</p>
          </div>
          <span className="rounded-full border border-border bg-white/70 px-3 py-1 font-mono text-[0.65rem] tracking-[0.12em] text-ink-soft">
            PDF EXPORT
          </span>
        </div>

        <div className="text-[0.875rem] leading-relaxed text-ink-soft">
          <SectionHeading n="01">Executive summary</SectionHeading>
          <p className="mt-2">
            A 45-person field-service company needs scheduling software that syncs with its accounting system and
            keeps working when technicians lose signal. The current tool does neither, so jobs are re-keyed by hand
            and invoices go out late.
          </p>

          <SectionHeading n="02">Business objectives</SectionHeading>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Stop double entry between scheduling and accounting.</li>
            <li>Let technicians complete jobs offline and sync later.</li>
            <li>Invoice within 24 hours of job completion.</li>
          </ul>

          <SectionHeading n="03">Key requirements</SectionHeading>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Team size: 45, of which 30 are in the field.</li>
            <li>Two-way sync with the existing accounting system.</li>
            <li>Offline mode on mobile; cloud deployment.</li>
            <li>Budget: mid-range per-seat pricing, annual billing.</li>
          </ul>

          <SectionHeading n="04">Shortlisted solutions</SectionHeading>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-left text-[0.8125rem]">
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="py-2 pr-3 font-medium text-ink">Product</th>
                  <th scope="col" className="py-2 pr-3 font-medium text-ink">Best for</th>
                  <th scope="col" className="py-2 pr-3 font-medium text-ink">Rating</th>
                  <th scope="col" className="py-2 font-medium text-ink">Trial</th>
                </tr>
              </thead>
              <tbody>
                {SHORTLIST.map((row, i) => (
                  <tr
                    key={row.name}
                    className={`border-b border-border/60 ${i === 0 ? "bg-cobalt-soft/50" : ""}`}
                  >
                    <td className="py-2 pr-3 font-medium text-ink">{row.name}</td>
                    <td className="py-2 pr-3">{row.bestFor}</td>
                    <td className="py-2 pr-3 font-mono text-[0.75rem]">{row.rating}</td>
                    <td className="py-2">{row.trial}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SectionHeading n="05">Recommended solution</SectionHeading>
          <div className="mt-2 flex flex-wrap items-center gap-3 rounded-xl border border-cobalt/30 bg-cobalt-soft/40 px-4 py-3">
            <span className="rounded-full bg-cobalt px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-white">
              Recommended
            </span>
            <p className="text-ink">
              <span className="font-semibold">Option A.</span> The only shortlisted product with both native accounting
              sync and a true offline mobile app.
            </p>
          </div>

          <SectionHeading n="06">Success criteria</SectionHeading>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Zero manual re-entry of completed jobs after month one.</li>
            <li>90% of invoices sent within 24 hours.</li>
          </ul>

          <SectionHeading n="07">Next steps</SectionHeading>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Start the Option A trial with two field crews.</li>
            <li>Confirm accounting sync scope with the vendor.</li>
            <li>Brief a Proploy implementation expert on the rollout.</li>
          </ol>
        </div>
      </article>

      <ol className="flex flex-col gap-4 lg:pt-2">
        {ANNOTATIONS.map((a) => (
          <li key={a.n} className="flex gap-4">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border bg-paper font-mono text-[0.65rem] text-ink-soft">
              {a.n}
            </span>
            <div>
              <p className="text-[0.9375rem] font-medium text-ink">{a.title}</p>
              <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-soft">{a.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
