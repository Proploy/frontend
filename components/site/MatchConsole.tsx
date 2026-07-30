'use client'

import { useEffect, useState } from "react";

const QUERIES = [
  "Procurement suite for a 400-person manufacturer",
  "HRIS that integrates with NetSuite",
  "Field service platform with offline mode",
  "Revenue ops stack for a Series B SaaS",
];

const MATCHES = [
  { name: "Vantiq Procure", fit: 96, tag: "Procurement", note: "Pre-negotiated · −22% list" },
  { name: "Northlake ERP", fit: 91, tag: "Finance", note: "3 vetted implementers" },
  { name: "Cadence Ops", fit: 87, tag: "Operations", note: "6-week deploy plan" },
];

export function MatchConsole() {
  const [qIndex, setQIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    const full = QUERIES[qIndex];
    let i = 0;
    setTyped("");
    setRevealed(0);
    const type = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(type);
        [0, 1, 2].forEach((n) =>
          setTimeout(() => setRevealed(n + 1), 420 + n * 380),
        );
        setTimeout(() => setQIndex((v) => (v + 1) % QUERIES.length), 5200);
      }
    }, 34);
    return () => clearInterval(type);
  }, [qIndex]);

  return (
    <div className="glass-card relative overflow-hidden rounded-2xl">
      {/* scan beam */}
      <div
        aria-hidden
        className="scan pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(to_bottom,transparent,color-mix(in_oklab,var(--cobalt)_10%,transparent),transparent)]"
      />
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-cobalt" />
        <span className="label">Proploy match engine</span>
        <span className="label ml-auto">live</span>
      </div>

      <div className="px-4 pt-4">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-3.5 py-3">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-cobalt" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <p className="truncate font-mono text-[0.78rem] text-ink">
            {typed}
            <span className="ml-0.5 inline-block h-3.5 w-px translate-y-0.5 bg-cobalt align-middle" />
          </p>
        </div>
      </div>

      <ul className="space-y-2 p-4">
        {MATCHES.map((m, i) => (
          <li
            key={m.name}
            className="rounded-xl border border-border bg-white/70 p-3.5 transition-all duration-700"
            style={{
              opacity: revealed > i ? 1 : 0,
              transform: revealed > i ? "none" : "translateY(10px)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-cobalt-soft font-display text-[0.8rem] font-semibold text-cobalt-deep">
                {m.name[0]}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[0.85rem] font-medium text-ink">{m.name}</p>
                <p className="label mt-0.5 !tracking-[0.1em]">{m.tag}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="font-mono text-[0.8rem] font-semibold text-cobalt-deep">{m.fit}%</p>
                <p className="label !text-[0.6rem]">fit</p>
              </div>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-paper-deep">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--cobalt-deep),var(--cobalt))] transition-[width] duration-1000 ease-out"
                style={{ width: revealed > i ? `${m.fit}%` : "0%" }}
              />
            </div>
            <p className="mt-2 text-[0.75rem] text-ink-soft">{m.note}</p>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <span className="label">Vetted experts attached</span>
        <div className="flex -space-x-2">
          {["A", "M", "R", "K"].map((c) => (
            <span
              key={c}
              className="grid h-6 w-6 place-items-center rounded-full border border-white bg-ink text-[0.6rem] font-medium text-paper"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
