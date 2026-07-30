import { Reveal } from "./Reveal";

const RING_A = ["Slack", "NetSuite", "Xero", "Jira", "Okta", "HubSpot"];
const RING_B = ["Workday", "SAP", "Notion", "Snowflake", "Zendesk"];

function Ring({
  items,
  radius,
  size,
  reverse,
}: {
  items: string[];
  radius: number;
  size: number;
  reverse?: boolean;
}) {
  return (
    <div
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-border ${
        reverse ? "spin-slower-rev" : "spin-slow"
      }`}
      style={{ width: `${radius * 2}px`, height: `${radius * 2}px` }}
    >
      {items.map((label, i) => {
        const angle = (i / items.length) * Math.PI * 2;
        const x = radius + Math.cos(angle) * radius - size / 2;
        const y = radius + Math.sin(angle) * radius - size / 2;
        return (
          <div
            key={label}
            className={`absolute grid place-items-center rounded-2xl border border-border bg-white text-[0.7rem] font-medium text-ink-soft shadow-[0_10px_28px_-20px_rgba(21,94,239,0.7)] ${
              reverse ? "spin-slower" : "spin-slow-rev"
            }`}
            style={{ left: Math.round(x), top: Math.round(y), width: size, height: size }}
          >
            <span className="px-1 text-center leading-tight">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function Integrations() {
  return (
    <section id="integrations" className="relative overflow-hidden border-y border-border bg-white/60 py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1240px] items-center gap-16 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <Reveal>
          <span className="label">Integrations</span>
          <h2 className="display mt-5 max-w-[16ch] text-[clamp(2rem,4.2vw,3.25rem)] text-ink">
            Connects to the tools your teams already run.
          </h2>
          <p className="mt-6 max-w-[40ch] text-[1rem] leading-relaxed text-ink-soft">
            30+ apps and growing — finance, identity, ticketing, data warehouse. Procurement data
            flows both ways, so spend, contracts and delivery status stay in one place.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <span className="display text-[2.5rem] text-cobalt">30+</span>
            <span className="label max-w-[14ch] leading-relaxed">apps connected and growing</span>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative mx-auto aspect-square w-full max-w-[460px]">
            <div aria-hidden className="absolute inset-0 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--cobalt)_14%,transparent),transparent_62%)] blur-xl" />
            <Ring items={RING_B} radius={215} size={62} reverse />
            <Ring items={RING_A} radius={135} size={62} />
            <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-3xl border border-border bg-ink text-paper shadow-[0_30px_60px_-30px_var(--cobalt)]">
              <span className="display text-[0.95rem] tracking-[-0.03em]">Proploy</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
