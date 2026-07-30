const LOGOS = [
  "NORTHWIND",
  "Lumen&Co",
  "ARBOR",
  "Kestrel",
  "MERIDIAN",
  "Halden",
  "VOLTA",
  "Pinewood",
  "AXIOM",
  "Rivet",
];

export function LogoMarquee() {
  return (
    <section aria-label="Companies growing with Proploy" className="relative border-y border-border bg-white/50 py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-[linear-gradient(90deg,var(--paper),transparent)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-[linear-gradient(270deg,var(--paper),transparent)]" />
      <div className="flex overflow-hidden">
        <ul className="marquee-track flex shrink-0 items-center gap-14 pr-14">
          {[...LOGOS, ...LOGOS].map((name, i) => (
            <li
              key={`${name}-${i}`}
              className="display shrink-0 text-[1.05rem] tracking-[-0.02em] text-ink-soft/55 transition-colors duration-300 hover:text-cobalt"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
