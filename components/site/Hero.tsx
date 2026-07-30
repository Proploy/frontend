'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { getProductDetailHref, useKeywordSearch } from "@/features/catalog";
import { MatchConsole } from "./MatchConsole";
import { Reveal } from "./Reveal";

const heroMesh = "/hero-mesh.jpg";
const WORDS = ["Discover.", "Decide.", "Deploy.", "Done."];

function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [resultsOpen, setResultsOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const { products, loading, error, search, clear } = useKeywordSearch();

  React.useEffect(() => {
    if (query.trim().length > 1) {
      void search(query, 6);
    } else {
      clear();
    }
  }, [clear, query, search]);

  React.useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setResultsOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const handleSubmit = () => {
    const value = query.trim();
    if (!value) return;
    router.push(`/products?search=${encodeURIComponent(value)}`);
  };

  return (
    <div ref={searchRef} className="relative max-w-[520px]">
      <form
        id="hero-search"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-2 rounded-2xl border border-border bg-white p-2 shadow-[0_24px_60px_-46px_color-mix(in_oklab,var(--cobalt)_80%,transparent)] sm:flex-row sm:items-center"
      >
        <label htmlFor="hero-q" className="sr-only">
          What are you trying to solve?
        </label>
        <input
          id="hero-q"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setResultsOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length > 1) setResultsOpen(true);
          }}
          placeholder="What are you trying to solve?"
          className="min-w-0 flex-1 bg-transparent px-3.5 py-2.5 text-[0.9375rem] text-ink outline-none placeholder:text-ink-soft/70"
        />
        <button
          type="submit"
          className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cobalt px-5 text-[0.875rem] font-medium text-white transition-all duration-300 hover:bg-cobalt-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt"
        >
          Find your software
          <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" aria-hidden>
            <path d="M4 10h11m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>

      {resultsOpen && query.trim().length > 1 && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-border bg-white shadow-[0_24px_48px_-12px_rgba(10,13,18,0.18)]">
          {loading ? (
            <p className="px-4 py-3.5 text-center text-[0.8125rem] text-ink-soft">Searching products…</p>
          ) : error ? (
            <p className="px-4 py-3.5 text-center text-[0.8125rem] text-red-600">Unable to search products.</p>
          ) : products.length > 0 ? (
            <div className="py-1.5">
              {products.map((product) => (
                <Link
                  key={product.product_id}
                  href={getProductDetailHref(product.product_id)}
                  onClick={() => setResultsOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-cobalt-soft/40"
                >
                  <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-white text-[0.85rem] font-semibold text-cobalt-deep">
                    {product.product_logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.product_logo} alt="" className="size-full object-contain p-1" />
                    ) : (
                      product.product_name.charAt(0)
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.875rem] font-medium text-ink">{product.product_name}</span>
                    <span className="block truncate text-[0.75rem] text-ink-soft">
                      {product.primary_category ?? "Software product"}
                    </span>
                  </span>
                </Link>
              ))}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full border-t border-border px-3.5 py-2.5 text-center text-[0.8125rem] font-semibold text-cobalt-deep hover:bg-cobalt-soft/40"
              >
                View all results for &quot;{query}&quot;
              </button>
            </div>
          ) : (
            <p className="px-4 py-3.5 text-center text-[0.8125rem] text-ink-soft">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24">
      {/* backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
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

          <Reveal delay={200}>
            <div className="mt-9">
              <HeroSearch />
            </div>
          </Reveal>

          <Reveal delay={280}>
            <p className="mt-6 flex items-center gap-3 text-[0.8125rem] text-ink-soft">
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
