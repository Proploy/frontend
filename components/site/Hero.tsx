'use client'

import { MatchConsole } from "./MatchConsole";
import { Reveal } from "./Reveal";

const heroMesh = "/hero-mesh.jpg";
const WORDS = ["Discover.", "Decide.", "Deploy.", "Done."];

export function Hero() {
  return (
    <section id="top" className="relative z-20 pt-28 pb-16 lg:pt-36 lg:pb-24">
      {/* backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blueprint absolute inset-0 opacity-70 [mask-image:radial-gradient(120%_80%_at_50%_0%,black,transparent_75%)]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroMesh}
          alt=""
          width={1600}
          height={1200}
          className="absolute -right-40 -top-24 w-[560px] max-w-none opacity-40 mix-blend-multiply [mask-image:radial-gradient(60%_60%_at_50%_45%,black_45%,transparent_88%)] [mask-repeat:no-repeat] lg:-right-24 lg:w-[900px] lg:opacity-45"
        />
        <div className="absolute -left-40 top-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--cobalt)_18%,transparent),transparent_65%)] blur-2xl" />
      </div>

      <div className="relative mx-auto grid max-w-[1240px] gap-14 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-10">
        <div className="min-w-0">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1.5">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-cobalt" />
              <span className="label !text-[0.65rem]">AI software + expert marketplace</span>
            </span>
          </Reveal>

          <h1 className="display mt-7 text-[clamp(2.9rem,7.4vw,5.25rem)] text-ink">
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
            <p className="mt-7 max-w-[46ch] text-[1.0625rem] leading-relaxed text-ink-soft">
              An AI marketplace that matches your business with the right software —{" "}
              <span className="text-ink">and the vetted experts who make it land.</span> Because
              buying the tool was never the hard part.
            </p>
          </Reveal>

          <Reveal delay={280}>
            <p className="mt-9 flex items-center gap-3 text-[0.8125rem] text-ink-soft">
              <span className="flex -space-x-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="h-5 w-5 rounded-full border-2 border-paper bg-[linear-gradient(135deg,var(--cobalt),var(--cobalt-deep))]"
                    style={{ opacity: 1 - i * 0.18 }}
                  />
                ))}
              </span>
              Join <strong className="font-semibold text-ink">4,000+ companies</strong> already
              growing with Proploy
            </p>
          </Reveal>
        </div>

        <Reveal delay={160} className="min-w-0 lg:pl-6">
          <MatchConsole />
        </Reveal>
      </div>
    </section>
  );
}
