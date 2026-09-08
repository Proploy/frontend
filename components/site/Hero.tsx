'use client'

import { MatchConsole } from "./MatchConsole";
import { Reveal } from "./Reveal";

const heroMesh = "/hero-mesh.jpg";
const WORDS = ["Discover.", "Decide.", "Deploy.", "Done."];

/**
 * The landing hero, built on the v2 design system: `.pp-scope` for the element
 * resets, `.pp-blueprint` for the grid motif, `.pp-glow` for the ambient
 * bloom, and the `.pp-display` / `.pp-d1` / `.pp-lede` type scale. Layout and
 * the search card live in the `.mc-*` block of app/v2-pages.css.
 */
export function Hero() {
  return (
    <section id="top" className="pp-scope pp-blueprint mc-hero">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroMesh} alt="" width={1600} height={1200} className="mc-hero-mesh" />
        <span className="pp-glow" style={{ left: -160, top: 160 }} />
      </div>

      <div className="pp-container mc-hero-grid">
        <div className="mc-hero-copy">
          <Reveal>
            <span className="mc-eyebrow">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-cobalt" />
              <span className="pp-label">AI software + expert marketplace</span>
            </span>
          </Reveal>

          <h1 className="pp-display pp-d1 pp-mt-6">
            {WORDS.map((w, i) => (
              <span key={w} className="block overflow-hidden">
                <span
                  className="block animate-[fade-in_0.9s_cubic-bezier(0.22,1,0.36,1)_both]"
                  style={{
                    animationDelay: `${i * 110}ms`,
                    color: i === 3 ? "var(--cobalt)" : undefined,
                  }}
                >
                  {w}
                </span>
              </span>
            ))}
          </h1>

          <Reveal delay={120}>
            <p className="pp-lede pp-mt-6" style={{ maxWidth: "46ch" }}>
              An AI marketplace that matches your business with the right software —{" "}
              <span style={{ color: "var(--ink)" }}>
                and the vetted experts who make it land.
              </span>{" "}
              Because buying the tool was never the hard part.
            </p>
          </Reveal>

          <Reveal delay={280}>
            <p className="pp-small mc-proof pp-mt-8">
              <span className="mc-proof-dots" aria-hidden="true">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} style={{ opacity: 1 - i * 0.18 }} />
                ))}
              </span>
              <span>
                Join{" "}
                <strong style={{ color: "var(--ink)", fontWeight: "var(--weight-semibold)" }}>
                  4,000+ companies
                </strong>{" "}
                already growing with Proploy
              </span>
            </p>
          </Reveal>
        </div>

        <Reveal delay={160} className="mc-hero-card">
          <MatchConsole />
        </Reveal>
      </div>
    </section>
  );
}
