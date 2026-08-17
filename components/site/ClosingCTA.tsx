'use client'

import { useState } from "react";
import { Reveal } from "./Reveal";

export function ClosingCTA() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  return (
    <section id="cta" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] bg-ink px-7 py-16 text-paper sm:px-14 lg:px-20 lg:py-24">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.16]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                backgroundSize: "64px 64px",
                maskImage: "radial-gradient(90% 70% at 30% 0%, black, transparent)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-40 -right-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--cobalt)_70%,transparent),transparent_65%)] blur-2xl"
            />

            <div className="relative max-w-[46rem]">
              <span className="label !text-paper/60">Get started</span>
              <h2 className="display mt-5 text-[clamp(2.1rem,5vw,3.75rem)]">
                Transform your software
                <br />
                procurement strategy.
              </h2>
              <p className="mt-6 max-w-[48ch] text-[1rem] leading-relaxed text-paper/70">
                Join the enterprises modernising how they buy and deploy software — with
                implementation success rates the old way never reached.
              </p>

              <form
                action={async () => {
                  if (!email.trim() || submitting) return;
                  setSubmitting(true);
                  try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_APIS_URL}/api/v1/contact`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: email.trim(), type: 'newsletter' }),
                    });
                    if (res.ok) {
                      setSent(true);
                    } else {
                      alert('Failed to subscribe. Please try again.');
                    }
                  } catch {
                    alert('Failed to subscribe. Please try again.');
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className="mt-10 flex max-w-[540px] flex-col gap-2 sm:flex-row"
              >
                <label htmlFor="cta-email" className="sr-only">
                  Work email
                </label>
                <input
                  id="cta-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3.5 text-[0.9375rem] text-paper outline-none transition-colors placeholder:text-paper/40 focus:border-cobalt"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cobalt px-6 py-3.5 text-[0.875rem] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[color-mix(in_oklab,var(--cobalt)_85%,white)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-70"
                >
                  {submitting ? "Sending..." : sent ? "You're on the list" : "Get started"}
                  <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" aria-hidden>
                    <path d="M4 10h11m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>
              <p aria-live="polite" className="mt-4 text-[0.8rem] text-paper/50">
                {sent
                  ? "Thanks — we'll be in touch within one business day."
                  : "No sales sequence. A named specialist reviews your stack first."}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
